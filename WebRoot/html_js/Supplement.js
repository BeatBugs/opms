document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData, UserData, unitIdData, setsIdData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, leftGrid, allUserStore, rightGrid
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);

function getByAdjustDescp(stTime, edTime, desc) {
    SupplementDao.getByCreatTimeAndAdjustDescp(stTime, edTime,desc, {
        callback: function (str) {
            for (var i = 0; i < str.length; i++) {
                str[i].unitId = unitJsonMap[str[i].unitId]
                str[i].setsId = suiteJsonMap[str[i].setsId]
            }
            myData = str
        }
    })
    return myData
}


function getUnit() {
    UnitDao.getAllUnitName({
        callback: function (str) {
            unitIdData = str
            for (var i = 0; i < unitIdData.length; i++) {
                unitJsonMap[str[i][1]] = str[i][0]
                unitJsonMap[str[i][0]] = str[i][1]
                unitIdData[i][1] = unitIdData[i][0]
            }

        }
    })

}

function getSuite(id) {
    SetsDao.getAllSetsName(id, {
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                setsIdData[i][1] = setsIdData[i][0]
            }

        }
    })
}

Ext.onReady(function () {
    getUnit()
    getSuite(unitJsonMap[unitIdData[0][0]])
    getByAdjustDescp(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0), new Date(), '')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [],
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
        },

    });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
    });

    function getSearchColumn() {
        var field = '';
        searchMenu.items.each(function (item) {
            if (item.checked) {
                field = item.value;
            }
        });
        return field;
    }

    columnsArray = [
        {header: "补算id", width: 60, dataIndex: "id", sortable: true, align: 'center', hidden: true},
        {header: "补算描述", flex: 1, dataIndex: "adjustDescp", sortable: true, align: 'center'},
        {header: "补算单元", width: 90, dataIndex: "unitId", sortable: true, align: 'center'},
        {header: "补算机组", width: 90, dataIndex: "setsId", sortable: true, align: 'center'},
        {header: "开始时间", flex: 1, sortable: true, dataIndex: 'beginTime', align: 'center', renderer: formatDateTime},
        {header: "结束时间", flex: 1, sortable: true, dataIndex: 'endTime', align: 'center', renderer: formatDateTime},
        {header: "录入人", width: 90, sortable: true, dataIndex: 'userId', align: 'center'},
        {header: "录入时间", flex: 1, sortable: true, dataIndex: 'createTime', align: 'center', renderer: formatDateTime},
        {header: "任务状态", flex: 1, sortable: true, dataIndex: 'status', align: 'center', renderer: formatStatus2}
    ]
    var tbar;
    tbar = [

        {
            xtype: 'datefield',
            id: "stDate",
            labelWidth: 30,
            fieldLabel: '开始',
            format: 'Y-m-d',
            width: 160,
            value: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1).dateFormat('Y-M-d')
        },
        {
            xtype: 'datefield',
            id: "edDate",
            labelWidth: 30,
            fieldLabel: '结束',
            format: 'Y-m-d',
            width: 160,
            value: new Date().dateFormat('Y-M-d')
        },
        {
            xtype: 'textfield',
            fieldLabel: '指标描述',
            labelWidth: 60,
            width: 160,
            name: 'indexdescp',
            id: "indexdescp"
        }, '->',
        {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        },
        {
            text: '新增',
            iconCls: 'refresh',
            tooltip: '删除一行',
            handler: handlerAddAction
        },
        {
            text: '修改',
            iconCls: 'refresh',
            tooltip: '删除一行',
            handler: handlerRefreshAction
        },
        {
            text: '提交',
            iconCls: 'refresh',
            tooltip: '删除一行',
            handler: handlerRefreshAction
        }, {
            text: '删除',
            iconCls: 'refresh',
            tooltip: '删除一行',
            handler: handlerRefreshAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '指标历史记录',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],

        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: []
        },

        columns: columnsArray,
        loadMask: true,
        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function formatStatus2(bool) {
    if (bool == 0) {
        return '未提交'
    } else {
        return '已提交'
    }
}

function charts(row) {
    var record = grid.getStore().getAt(row).data
    var startDate, endDate
    if (Ext.getCmp('stTime').getValue() == null) {
        startDate = Ext.getCmp('stDate').getValue().getTime()

    } else {
        startDate = Ext.getCmp('stDate').getValue().getTime() + Ext.getCmp('stTime').getValue().getTime() - new Date(2008, 0, 1, 0, 0, 0).getTime()

    }
    if (Ext.getCmp('edTime').getValue() == null) {
        endDate = Ext.getCmp('edDate').getValue().getTime()
    } else {
        endDate = Ext.getCmp('edDate').getValue().getTime() + Ext.getCmp('edTime').getValue().getTime() - new Date(2008, 0, 1, 0, 0, 0).getTime()
    }
    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        loadPage('./html/KpiHistoryCharts.jsp?tagName=' + record.tagName + '&st=' + startDate + '&et=' + endDate, '指标历史曲线')
    }
}

function handlerAddAction() {
    var suiteComob = new Ext.form.ComboBox({
        store: setsIdData,
        id: "suiteComob",
        displayField: 'name',
        fieldLabel:'补算机组',
        valueField: 'name',
        labelWidth:60,
        name:'setsId',
        width: 280,
        value: setsIdData[0][0],
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px 35px 5px 35px',
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                var set = suiteJsonMap[this.getValue()]
                var unit = unitJsonMap[Ext.getCmp('unitComob').getValue()]
                var top = getAll(unit, set)
                store.loadData(top)
            }
        }
    })
    var unitComob = new Ext.form.ComboBox({
        store: unitIdData,
        id: "unitComob",
        displayField: 'name',
        valueField: 'name',
        width: 280,
        labelWidth:60,
        fieldLabel:'补算单元',
        value: unitIdData[0][0],
        triggerAction: 'all',
        name:'unitId',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px 35px 5px 35px',
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                getSuite(unitJsonMap[this.getValue()])
                Ext.getCmp('suiteComob').getStore().loadData(setsIdData)
                Ext.getCmp('suiteComob').setValue(setsIdData[0][0])
                var set = suiteJsonMap[Ext.getCmp('suiteComob').getValue()]
                var unit = unitJsonMap[this.getValue()]
                var top = getAll(unit, set)
                store.loadData(top)
            }
        }
    })
    var textAreaEditor = new Ext.form.TextArea({
        allowBlank: true,
        autoScroll: true,
        grow: true,
        growMax: 300,
        width: 200,
        height:200,
        style: {color: 'blue', fontSize: '12px', fontFamily: 'Courier New'}
    });
    var check = new Ext.FormPanel({
        width: window.innerWidth,
        height: window.innerHeight,
        header:false,
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',
        items: [
            {
                width:280,
                labelWidth:60,
                id: 'adjustDescp',
                fieldLabel: '补算描述',
                style: {margin: '5px 35px'},
                name: 'adjustDescp'
            },
            unitComob,
            suiteComob,
            {
                xtype: 'datefield',
                id: "createStDate",
                name :'stDate',
                fieldLabel: '开始日期',
                labelWidth:60,
                width:280,
                format: 'Y-m-d',
                value: new Date().dateFormat('Y-M-d'),
                style: {margin: '5px 35px'}
            }, {
                xtype: 'timefield',
                id: "stTime",
                name:'stTime',
                fieldLabel: '开始时间',
                format: 'G:i:s',
                value:'00:00:00',
                labelWidth:60,
                width:280,
                increment: 10,
                style:{margin: '5px 35px'}
            },{
                xtype: 'datefield',
                id: "createEdDate1",
                name :'edDate',
                fieldLabel: '结束日期',
                labelWidth:60,
                width:280,
                format: 'Y-m-d',
                value: new Date().dateFormat('Y-M-d'),
                style: {margin: '5px 35px'}
            }, {
                xtype: 'timefield',
                id: "edTime",
                name:'edTime',
                fieldLabel: '结束时间',
                format: 'G:i:s',
                value:'00:00:00',
                labelWidth:60,
                width:280,
                increment: 10,
                style: {margin: '5px 35px'}
            },
            {
                width:280,
                labelWidth: 60,
                xtype: 'textareafield',
                id: 'reason',
                name: 'reason',
                fieldLabel: '调整原因',
                editor:textAreaEditor,
                style: {margin: '5px 35px'}
            }

        ]

    })
    var windows = new Ext.window.Window({
        title: '新增补算任务',
        width: 400,
        height: 500,
        scope: this,
        layout: 'border',
        resizable: true,
        autoHeight: true,
        frame: true,
        border: true,
        modal: true,
        closable: true,
        closeAction: 'destroy',
        // maximizable: true,
        constrain: true,
        plain: false,
        items: [
            check
        ],
        buttonAlign: 'center',
        buttons: [{
            text: '取消',
            handler: function () {
                windows.close()
            }
        }, {
            text: '保存',
            handler: function () {
                var form = check.getForm().getValues()
                console.log(form)
            }
        }]
    })
    windows.show()

}

function handlerRefreshAction() {
    Ext.getCmp('stDate').setValue(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0).dateFormat('Y-M-d'))
    Ext.getCmp('edDate').setValue(new Date().dateFormat('Y-M-d'))
    Ext.getCmp('indexdescp').setValue('')
    var newData = getByAdjustDescp(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0), new Date(), '')
    store.loadData(newData);
}

function handlerQueryAction() {
    var stTime = new Date(Ext.getCmp('stDate').getValue())
    var edTime = new Date(Ext.getCmp('edDate').getValue())
    var desc = Ext.getCmp('indexdescp').getValue()
    var newData = getByAdjustDescp(stTime,edTime, desc)
    store.loadData(newData);

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