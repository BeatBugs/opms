document.write("<script language=javascript src='../html_js/loadPage.js'></script>");

var pageSize = 10;
var myData, roleData,treeData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, store_id
DWREngine.setAsync(false);
var sortMax = 0
reportData=[['/html/PersonScoreReport.jsp?id=','得分报表'],['/html/ProfessionReport.jsp?id=','专业报表'],['/html/TeamCompetition.jsp?id=','竞赛报表'],['/html/TeamCompetitionByMonth.jsp?id=','竞赛报表(按月)']]
function getByReportName(name) {
    ReportConfigDao.getByReportName(name,{
        callback:function (str) {
            for (var i=0;i<str.length;i++){
                str[i].column_avg = Boolean(str[i].column_avg)
                str[i].column_sum = Boolean(str[i].column_sum)
                str[i].row_avg = Boolean(str[i].row_avg)
                str[i].row_sum = Boolean(str[i].row_sum)
            }
            myData = {root:str}
        }
    })
    return myData;
}
function save(report){
    ReportConfigDao.save(report,{
        callback:function() {

            handleRefeshAction()

            showToast('保存记录成功！');

            store.sort('id', 'ASC')
            if (report.id=='') {


                var recordData = grid.getStore().getAt(grid.getStore().getCount()-1).data
                var node = {
                    context: "opms",
                    descp: "",
                    name: "",
                    id:'',
                    roles: "",
                    target: "",
                    title:recordData.reportName,
                    path:recordData.reportHref

                }
                NavTreeNodeDao.insertNavTreeNode(treeNode,node,'child',{
                    callback:function(newNode) {
                        showToast('插入操作成功');
                        top.refreshTree(treeID);
                    },
                    timeout:120000,
                    errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
                });

            }else {
                var recordData = grid.getSelection()[0].data
                var newData = getTreeByPath(recordData.reportHref)
                var node = newData[0]
                node['title']=recordData.reportName
                node['path'] = recordData.reportHref
                NavTreeNodeDao.saveNavTreeNode(node,{
                    callback:function() {

                        // top.refreshTree(treeID);

                        showToast('保存修改成功');

                    },
                    timeout:120000,
                    errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
                });

            }


        },
        timeout:5000,
        errorHandler:function(message) { showToast( message); }
    })
}

function getTreeByPath(path) {
    NavTreeNodeDao.getNavTreeNodesByContextAndPath('opms',path,{
        callback:function (str) {
            treeData = str
        }
    })
    return treeData
}
function deleteReport(id,path){
    ReportConfigDao.deleteByID(id,{
        callback:function() {

            handleRefeshAction()

            showToast('删除记录成功！');
            var newData = getTreeByPath(path)
            var node = newData[0]
            NavTreeNodeDao.deleteAllNavTreeNodesByContextAndName('opms', node.name, {
                callback: function () {
                    showToast('删除记录成功！');
                },
                timeout: 120000,
                errorHandler: function (message) {
                    Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
                }
            });

        },
        timeout:5000,
        errorHandler:function(message) { showToast( message); }
    })
}

var reportComob = new Ext.form.ComboBox({
    store: reportData,
    id: "reportComob",
    displayField: 'name',
    valueField: 'value',
    width:150,
    labelWidth:50,
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
})


Ext.onReady(function () {
    getByReportName('')
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id",         mapping: "id",         type: 'int'},
            {name: "reportHerf", mapping: "reportHref", type: 'string'},
            {name: "reportName", mapping: "reportName", type: 'string'},
            {name: "column_avg", mapping: "column_avg", type: 'boolean'},
            {name: "column_sum", mapping: "column_sum", type: 'boolean'},
            {name: "row_avg",    mapping: "row_avg",    type: 'boolean'},
            {name: "row_sum",    mapping: "row_sum",    type: 'boolean'},
            {name: "sort",       mapping: "sort",       type: 'int'}
        ],
        autoLoad: {strat: 0, limit: pageSize},
        data: myData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
            }
        },
        pageSize: pageSize,
        sorters: {
            property: 'id',
            direction: 'ASC'
        }

    });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
    });



    var tbar;
    tbar = [{
        text: '报表名称',
        destroyMenu: true
    },
        {
            xtype: 'triggerfield',
            id: 'triggerfield',
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
            onTrigger1Click: function (btn) {
               Ext.getCmp('triggerfield').setValue("")

            },
            onTrigger2Click: function (btn) {
                DWREngine.setAsync(false);
                var newData = getProfession(Ext.getCmp('triggerfield').getValue());
                store.loadData(newData.root);
            }
        }, '->', {
            text: '刷新',
            iconCls: 'refresh',
            tooltip: '刷新表格',
            handler: handleRefeshAction
        }, {
            text: '增加',
            iconCls: 'add',
            tooltip: '增加一行<br/>需要点击[保存]按钮保存',
            handler: handlerInsertAction
        }, {
            text: '保存',
            iconCls: 'accept',
            tooltip: '保存修改',
            handler: handlerSaveAction
        }, {
            text: '删除',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerDeleteAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '报表配置维护',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],
        selModel: 'cellmodel',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: []
        },
        selType: 'checkboxmodel',
        columns: [

            {header: "主键",flex:1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "报表类型", flex:1,dataIndex: "reportHref", sortable: true, align: 'center',editor: reportComob},
            {header: "报表名称",flex:1, dataIndex: "reportName", sortable: true, align: 'center', editor: 'textfield'},
            {header: "行平均",width:80, dataIndex: "row_avg", sortable: true, align: 'center', xtype: 'checkcolumn'},
            {header: "行累计",width:80, dataIndex: "row_sum", sortable: true, align: 'center', xtype: 'checkcolumn'},
            {header: "列平均",width:80, dataIndex: "column_avg", sortable: true, align: 'center', xtype: 'checkcolumn'},
            {header: "列累计",width:80, dataIndex: "column_sum", sortable: true, align: 'center',xtype: 'checkcolumn'},
            {header: "排序",width:80, dataIndex: "sort", sortable: true, align: 'center', editor: 'textfield'}
        ],
        loadMask: true,


        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});
function formatBoolean2(flag) {
    if (flag ==0){
        return false
    }else{
        return true
    }
}

function handleRefeshAction() {
    Ext.getCmp('triggerfield').setValue("");
    var newData = getByReportName('');
    store.loadData(newData.root);
}

function handlerInsertAction() {
    var record = {
        id: -1,
        reportHref:'',
        reportName:'',
        sort:0

    };
    var scrollTop = grid.getView().getEl().getScrollTop()

    store.insert(0, record);
    grid.getView().getEl().setScrollTop(scrollTop);

}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return 0;
    }
    var recordData = record[0].data
    if (recordData['id'] === -1) {
        recordData['id'] = '';
    }

    if (recordData.reportName === null || recordData.reportName === '') {
        showToast( '报表名字不能为空！');
        return 0;
    }
    if (recordData.sort === null ||recordData.sort === '') {
        showToast( '排序不能为空！');
        return 0;
    }


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?保存后需要刷新界面才能看到报表', function (btn) {

        if (btn !== 'yes') {
            return 0;
        }
        recordData.column_avg = parseIntFromBoolean(recordData.column_avg)
        recordData.column_sum = parseIntFromBoolean(recordData.column_sum)
        recordData.row_avg = parseIntFromBoolean(recordData.row_avg)
        recordData.row_sum = parseIntFromBoolean(recordData.row_sum)

        save(recordData)

    });
}
function parseIntFromBoolean(bool) {
    if(bool==true)
        return 1
    else
        return 0
}
function handlerDeleteAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return 0;
    }
    var recordData = record[0].data;
    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除一条记录?将同时删除导航树中的报表', function (btn) {

        if (btn !== 'yes') {
            return;
        }

        if (recordData.id === null ||  recordData.id === '' ) {
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if (record[0].dirty) {
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteReport(recordData.id,recordData.reportHref);

    });
}

function showToast(s, title) {
    Ext.toast({
        html: s,
        closable: false,
        width: 400,
        style: {'text-align': 'center'},
        align: 't',
        slideInDuration: 400
    });
}