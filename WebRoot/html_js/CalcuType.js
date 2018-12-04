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
            id: 31,
            systemId: 1,
            typeName: '公共',
            typeDescp: '60s计算设备',
            calcuMethod: '实时',
            calcuRate: '60',
            resetPoly: '上周',
            Sort: 10
        },
        {
            id: 341,
            systemId: 1,
            typeName: '公共',
            typeDescp: '60s计算设备',
            calcuMethod: '实时',
            calcuRate: '60',
            resetPoly: '上周',
            Sort: 10
        },
        {
            id: 321,
            systemId: 1,
            typeName: '公共',
            typeDescp: '60s计算设备',
            calcuMethod: '实时',
            calcuRate: '60',
            resetPoly: '上周',
            Sort: 10
        },
        {
            id: 1,
            systemId: 1,
            typeName: '公共',
            typeDescp: '60s计算设备',
            calcuMethod: '实时',
            calcuRate: '60',
            resetPoly: '上周',
            Sort: 10
        },
        {
            id: 312,
            systemId: 1,
            typeName: '公共',
            typeDescp: '60s计算设备',
            calcuMethod: '实时',
            calcuRate: '60',
            resetPoly: '上周',
            Sort: 10
        }
    ]
}
var CalcuMethod =
    [
        ['实时', '实时'],
        ['触发', '触发'],
        ['临时计算', '临时计算']
    ]
var CalcuPoly =
    [
        ['本周','本周'],['上周','上周']
    ]

function getOrderClasses() {
    myData = Data
}



Ext.onReady(function () {
    getOrderClasses()
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "", type: 'int'},
            {name: "systemId", mapping: "systemId", type: 'int'},
            {name: "typeName", mapping: "typeName", type: 'string'},
            {name: "typeDescp", mapping: "typeDescp", type: 'string'},
            {name: "calcuMethod", mapping: "calcuMethod", type: 'string'},
            {name: "calcuRate", mapping: "calcuRate", type: 'string'},
            {name: "resetPoly", mapping: "resetPoly", type: 'string'},
            {name: "Sort", mapping: "Sort", type: 'int'}
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
            property: 'Sort',
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
        text: '计算类型',
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
                var newData = getTreeNode(value, Ext.getCmp('triggerfield').getValue())
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

            {header: "id", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "业务系统ID", flex: 1, dataIndex: "systemId", sortable: true, align: 'center', hidden: true},
            {header: "类型名称", flex: 1, dataIndex: "typeName", sortable: true, align: 'center', editor: 'textfield'},
            {
                header: "类型描述",
                flex: 1,
                dataIndex: "typeDescp",
                sortable: true,
                align: 'center',
                editor: "textfield"
            },
            {
                header: "计算方式",
                flex: 1,
                dataIndex: "calcuMethod",
                sortable: true,
                align: 'center',
                editor: new Ext.form.ComboBox({
                    store: CalcuMethod,
                    displayField: 'name',
                    valueField: 'name',
                    triggerAction: 'all',
                    mode: 'local',
                    forceSelection: true,
                    editable: false,
                    lazyRender: false,
                    listClass: 'x-combo-list-small'
                })
            },
            {header: "计算频率", flex: 1, dataIndex: "calcuRate", sortable: true, align: 'center', editor: 'textfield',renderer:formatTime},
            {header: "重置策略", flex: 1, dataIndex: "resetPoly", sortable: true, align: 'center', editor: new Ext.form.ComboBox({
                    store: CalcuPoly,
                    displayField: 'name',
                    valueField: 'name',
                    triggerAction: 'all',
                    mode: 'local',
                    forceSelection: true,
                    editable: false,
                    lazyRender: false,
                    listClass: 'x-combo-list-small'
                })},
            {header: "排序", flex: 1, dataIndex: "Sort", sortable: true, align: 'center', editor: 'textfield'}
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
function formatTime(time) {
    return time+"秒"
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
    if (recordData.OrderName == null ) {
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