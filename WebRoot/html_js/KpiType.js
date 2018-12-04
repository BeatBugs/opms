document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, roleData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, store_id
DWREngine.setAsync(false);
var sortMax = 0

function getType(keyword) {
    KpiTypeDao.getByTypeName(keyword,{
        callback:function (str) {
            myData ={root:str};
        }
    })

    return myData;
}
function savaType(pro){
    KpiTypeDao.save(pro,{
        callback:function (str) {
            handleRefeshAction();

            showToast('保存记录成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
    sortMax =0;
}
function deleteType(id){
    KpiTypeDao.deleteByID(id,{
        callback:function (str) {
            handleRefeshAction()

            showToast('删除成功');
        },
    });
}


Ext.onReady(function () {
    getType('')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "typeId", mapping: "typeId", type: 'int'},
            {name: "typeName", mapping: "typeName", type: 'string'},
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


    var tbar;
    tbar = [{
        xtype: 'button',
        text: '指标名称',
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
                var newData = getUnit(Ext.getCmp('triggerfield').getValue())
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
        title: '指标类型配置维护',
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
            {header: "类型标识", flex:1,dataIndex: "typeId", sortable: true, align: 'center'},
            {header: "指标类型",flex:1, dataIndex: "typeName", sortable: true, align: 'center', editor: 'textfield'},
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
    Ext.getCmp('triggerfield').setValue("")
    var newData = getType('')
    store.loadData(newData.root);
}

function handlerInsertAction() {
    var record = {
        id: -1,
        typeId:'',
        typeName:'',
        sort:''

    };
    var scrollTop = grid.getView().getEl().getScrollTop()

    store.insert(0, record);
    grid.getView().getEl().setScrollTop(scrollTop);

}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] === -1) {
        recordData['id'] = '';
    }
    if (recordData.typeName === null ||recordData.typeName === '') {
        showToast( '专业名字不能为空！');
        return;
    }
    if (recordData.sort === null||recordData.sort === '' ) {
        showToast( '排序不能为空！');
        return;
    }


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn !== 'yes') {
            return;
        }
        savaType(recordData);
    });
}

function handlerDeleteAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function (btn) {

        if (btn !== 'yes') {
            return;
        }

        if (recordData.id === null ||  recordData.id === '') {
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if (record[0].dirty) {
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteType(recordData.id);

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