document.write("<script language=javascript src='../html_js/loadPage.js'></script>");

var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, profeStore
DWREngine.setAsync(false);
var Data = {
    id: 'id', total: 5, root: [
        {
            indexFlag:196657,
            indexName:"M1_BLSV",
            indexDescp:"#1机补水率",
            indexWeight:1.000
        },
        {
            indexFlag:196658,
            indexName:"M1_BLSV",
            indexDescp:"#2机补水率",
            indexWeight:1.000
        },
        {
            indexFlag:196659,
            indexName:"M1_BLSV",
            indexDescp:"#3机补水率",
            indexWeight:1.000
        },
        {
            indexFlag:196654,
            indexName:"M1_BLSV",
            indexDescp:"#4机补水率",
            indexWeight:1.0001
        },
        {
            indexFlag:196660,
            indexName:"M1_BLSV",
            indexDescp:"#5机补水率",
            indexWeight:1.0001
        }
    ]
}
var unitData = [
    ['全部', '全部'],
    ['一单元', '一单元']
]
var suiteData = [
    ['全部', '全部'],
    ['#1', '#1'],
    ['#2', '#2']
]

function getOrderClasses() {
    myData = Data
}


Ext.onReady(function () {
    getOrderClasses()
    profeStore = Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        data: pData,
    });
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "indexFlag", mapping: "indexFlag", type: 'int'},
            {name: "indexName", mapping: "indexName", type: 'string'},
            {name: "indexDescp", mapping: "indexDescp", type: 'string'},
            {name: "indexWeight", mapping: "indexWeight", type: 'float'}

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
            property: 'indexFlag',
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
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    })
    var suiteComboBox = new Ext.form.ComboBox({
        store: suiteData,
        width: 80,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,

        listClass: 'x-combo-list-small'
    })
    var tbar;
    tbar = [{
        xtype: 'button',
        text: '指标描述',
        destroyMenu: true
    },
        {
            width: 140,
            xtype: 'triggerfield',
            id: 'triggerfield',
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
            onTrigger1Click: function (btn) {
               Ext.getCmp('triggerfield').setValue("")

            },
            onTrigger2Click: function (btn) {
                DWREngine.setAsync(false);
                var newData = getTreeNode(value, Ext.getCmp('triggerfield').getValue())
                store.loadData(newData.root)
            }
        }, {
            xtype: 'button',
            text: '单元',
            destroyMenu: true,
        }, unitComboBox, {
            xtype: 'button',
            text: '机组',
            destroyMenu: true,
        },suiteComboBox, '->', {
            text: '刷新',
            iconCls: 'refresh',
            tooltip: '刷新表格',
            handler: handleRefeshAction
        }, {
            text: '保存',
            iconCls: 'accept',
            tooltip: '保存修改',
            handler: handlerSaveAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '班次配置维护',
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

            {header: "指标标识", flex: 1, dataIndex: "indexFlag", sortable: true, align: 'center', hidden: true},
            {header: "指标名称", flex: 1, dataIndex: "indexName", sortable: true, align: 'center'},
            {header: "指标描述", flex: 1, dataIndex: "indexDescp", sortable: true, align: 'center'},
            {header: "指标权重", flex: 1, dataIndex: "indexWeight", sortable: true, align: 'center',editor: 'textfield',renderer: formatNumber}
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
    if (treeName == null || treeName.trim() == '') {
        var newData = getTreeNode('NAME', '')
    } else if (treeName.trim() == 'T999') {
        var newData = getTreeNode('NAME', 'T999')
    }

    store.loadData(newData.root)
}

function handlerInsertAction() {
    var record = {
        primaryID: '',
        OrderNum: '',
        OrderName: '',
        SystemID: '',
        Sort: ''

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
    if (recordData.OrderName == null|| recordData.OrderName == '') {
        showToast('班次名字不能为空！');
        return;
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        saveNavTreeNode(recordData)
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

        if (recordData.primaryID == null || recordData.primaryID == '' ) {
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if (record[0].dirty) {
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteNavTreeNodeByID(recordData.primaryID)

    });
}
function formatNumber(number) {
    if (number == null) {
        return '';
    }
    if(typeof number == 'number'){
        return number.toFixed(3);
    } else{
        return number;
    }
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