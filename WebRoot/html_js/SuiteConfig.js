document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, unitData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, store_id
DWREngine.setAsync(false);
var sortMax = 0
jsonMap1 ={}
jsonMap2 ={}
function getAllUnitName() {
    UnitDao.getAllUnitName({
        callback:function (str) {

            for (var i =0;i<str.length;i++){
                jsonMap1[str[i][1]]=str[i][0]
                jsonMap2[str[i][0]]=str[i][1]
                str[i][1]=str[i][0]
            }
            unitData = str
        }
    })
    return unitData
}
function getSets(keyword) {
    SetsDao.getBySetsName(keyword,{
        callback:function (str) {
            getAllUnitName()
            for(var i =0;i<str.length;i++){

                str[i].unitId = jsonMap1[str[i].unitId]
            }

            myData ={root:str}
        }
    })
    // for (var i=0;i<myData.root.length;i++) {
    //     if(sortMax<myData.root[i].sort) {
    //         sortMax = myData.root[i].sort
    //     }
    // }
    return myData
}
function savaSets(pro){
    SetsDao.save(pro,{
        callback:function (str) {
            handleRefeshAction()

            showToast('保存记录成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
    sortMax =0;
}
function deleteSets(id){
    SetsDao.deleteByID(id,{
        callback:function (str) {
            handleRefeshAction()

            showToast('删除成功');
        },
    })
}


Ext.onReady(function () {
    // getAllUnitName()
    getSets('')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "setsId", mapping: "setsId", type: 'int'},
            {name: "setsName", mapping: "setsName", type: 'string'},
            {name: 'unitId',mapping:'unitId',type:'string'},
            {name: "sort", mapping: "sort", type: 'int'}
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
            property: 'sort',
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
    var unitComboBox = new Ext.form.ComboBox({
        store: unitData,
        width: 80,
        displayField: 'name',
        valueField: 'name',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    })

    var tbar;
    tbar = [{
        xtype: 'button',
        text: '机组名称',
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
                var newData = getSets(Ext.getCmp('triggerfield').getValue())
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
        title: '机组配置维护',
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
            {header: "主键",flex:1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "机组标识", flex:1,dataIndex: "setsId", sortable: true, align: 'center'},
            {header: "机组名称",flex:1, dataIndex: "setsName", sortable: true, align: 'center', editor: 'textfield'},
            {header: '所属单元',flex:1, dataIndex: "unitId", sortable: true, align: 'center', editor: unitComboBox},
            {header: "排序",flex:1, dataIndex: "sort", sortable: true, align: 'center', editor: 'textfield'}
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
    var newData = getSets('')
    store.loadData(newData.root)
}

function handlerInsertAction() {
    var record = {
        id: -1,
        setsId:'',
        setsName:'',
        unitId:'',
        sort:1,

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
    if (recordData.setsName == null ||recordData.setsName == '') {
        showToast( '专业名字不能为空！');
        return;
    }
    if (recordData.sort == null || recordData.sort == '') {
        showToast( '排序不能为空！');
        return;
    }


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        recordData.unitId = jsonMap2[recordData.unitId]

        savaSets(recordData)
    });
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
        deleteSets(recordData.id)

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