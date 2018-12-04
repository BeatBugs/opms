document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, proIdStore
DWREngine.setAsync(false);
jsonMap1 ={}
jsonMap2 ={}

function getPositon(keyword) {
    Post1Dao.getByStationName(keyword,{
        callback:function (str) {
            for (var i=0;i<str.length;i++){
                str[i].ifHand = Boolean(str[i].ifHand)
                str[i].ifHang = Boolean(str[i].ifHang)
                str[i].ifWatch = Boolean(str[i].ifWatch)
                str[i].proId = jsonMap1[str[i].proId]
            }
            myData = {root:str}
        }
    })
    return myData
}



function getProfe() {
    ProfessionDao.getAllProName({
        callback:function (str) {
            pData = str
            for (var i=0;i<pData.length;i++){
                jsonMap1[str[i][1]]=str[i][0]
                jsonMap2[str[i][0]]=str[i][1]
                pData[i][1] =pData[i][0]
            }

        }
    })
}
function savaPost1(pro){
    Post1Dao.save(pro,{
        callback:function (str) {
            handleRefeshAction()

            showToast('保存记录成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
    sortMax =0;
}
function deletePost1(id){
    Post1Dao.deleteByID(id,{
        callback:function (str) {
            handleRefeshAction()

            showToast('删除成功');
        },
    })
}



Ext.onReady(function () {

    getProfe()
    getPositon('')
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "stationMemo", mapping: "stationMemo", type: 'string'},
            {name: "stationName", mapping: "stationName", type: 'string'},
            {name: "proId", mapping: "proId", type: 'string'},
            {name: "ifHand", mapping: "ifHand", type: 'boolean'},
            {name: "ifHang", mapping: "ifHang", type: 'boolean'},
            {name: "ifWatch", mapping: "ifWatch", type: 'boolean'},
            {name: "sorts", mapping: "sorts", type: 'int'}
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
            property: 'sorts',
            direction: 'ASC'
        },

    });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
    });

    // Search Input
    var searchInput = new Ext.ux.SearchField({
        id: 'SearchInput',
        value: "",
        width: 230,
        onSearchClick: function () {
            onSearch();
        },
        onSearchCleanClick: function () {
            onSearch();
        }
    });


    var tbar;
    tbar = [{
        xtype: 'button',
        text: '岗位名称',
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
                var newData = getPositon( Ext.getCmp('triggerfield').getValue())
                store.loadData(newData.root)
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
        title: '岗位配置维护',
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

        columns: [
            new Ext.grid.RowNumberer(),

            {header: "主键", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "岗位名称", flex: 1, dataIndex: "stationName", sortable: true, align: 'center', editor: 'textfield'},
            {
                header: "岗位描述",
                flex: 1,
                dataIndex: "stationMemo",
                sortable: true,
                align: 'center',
                editor: new Ext.form.TextArea({
                    allowBlank: true,
                    autoScroll: true,
                    grow: true,
                    growMax: 300,
                    width: 1200,
                    style: {color: 'blue', fontSize: '12px', fontFamily: 'Courier New'}
                })
            },
            {
                header: "所属专业",
                flex: 1,
                dataIndex: "proId",
                sortable: true,
                align: 'center',
                editor: new Ext.form.ComboBox({
                    store: pData,
                    displayField: 'name',
                    valueField: 'value',
                    triggerAction: 'all',
                    mode: 'local',
                    forceSelection: true,
                    editable: false,
                    lazyRender: false,
                    listClass: 'x-combo-list-small'
                })
            },
            {header: "是否交接班", flex: 1, dataIndex: "ifHand", sortable: true, align: 'center', xtype: 'checkcolumn'},
            {header: "是否交接盘", flex: 1, dataIndex: "ifHang", sortable: true, align: 'center', xtype: 'checkcolumn'},
            {header: "是否监盘岗", flex: 1, dataIndex: "ifWatch", sortable: true, align: 'center', xtype: 'checkcolumn'},
            {header: "排序", flex: 1, dataIndex: "sorts", sortable: true, align: 'center', editor: 'textfield'}
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

function handleRefeshAction() {

    var newData = getPositon('')
    store.loadData(newData.root)
}

function handlerInsertAction() {
    var record = {
        id: -1,
        stationMemo: '',
        stationName: '',
        proId: '',
        ifHand:false,
        ifHang:false,
        ifWatch:false,
        sorts: ''

    };
    var scrollTop = grid.getView().getEl().getScrollTop()

    store.insert(0, record);
    grid.getView().getEl().setScrollTop(scrollTop);

}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] == -1) {
        recordData['id'] = ''
    }

    if (recordData.stationName == null ||recordData.stationName == '') {
        showToast('岗位名字不能为空！');
        return;
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        // recordData.proId = jsonMap2[recordData.proId]
        recordData.ifHand = parseIntFromBoolean(recordData.ifHand)
        recordData.ifHang = parseIntFromBoolean(recordData.ifHang)
        recordData.ifWatch = parseIntFromBoolean(recordData.ifWatch)
        recordData.proId = jsonMap2[recordData.proId]
        savaPost1(recordData)
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

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }

    var recordData = record[0].data


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        if (recordData.id == null ||  recordData.id == '' ) {
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if (record[0].dirty) {
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deletePost1(recordData.id)

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
    })
}