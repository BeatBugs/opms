document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData, UserData, unitIdData, setsIdData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, leftGrid, allUserStore, rightGrid
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);

function getByUnitSetsDesc(unit, sets, desc) {
    KpiHistoryDao.getByUnitSetsDesc(unit, sets, desc, {
        callback: function (str) {
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
    getByUnitSetsDesc(0, 0, '')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "tagName", mapping: "tagName", type: 'string'},
            {name: "tagDesc", mapping: "tagDesc", type: 'string'}
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

    var suiteComob = new Ext.form.ComboBox({
        store: setsIdData,
        id: "suiteComob",
        displayField: 'name',
        valueField: 'name',
        width: 80,
        value: setsIdData[0][0],
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px',
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
        width: 80,
        value: unitIdData[0][0],
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px',
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

    columnsArray = [
        {header: "指标名称", flex: 1, dataIndex: "tagName", sortable: true, align: 'center'},
        {header: "指标描述", flex: 1, dataIndex: "tagDesc", sortable: true, align: 'center'},
        {header: "历史数据", width: 100, sortable: true, align: 'center', renderer: formatText},
        {

            header: "历史曲线",
            width: 100,
            sortable: true,
            align: 'center',
            renderer: formatText2
        }
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
            value: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1).dateFormat('Y-M-d')
        }, {
            xtype: 'timefield',
            id: "stTime",
            width: 110,
            value: '00:00:00',
            format: 'G:i:s',
            increment: 10
        },

        {
            xtype: 'datefield',
            id: "edDate",
            labelWidth: 30,
            fieldLabel: '结束',
            format: 'Y-m-d',
            width: 160,
            value: new Date().dateFormat('Y-M-d')
        }, {
            xtype: 'timefield',
            id: "edTime",
            format: 'G:i:s',
            value: '00:00:00',
            width: 110,
            increment: 10
        },
        unitComob,
        suiteComob,
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
            text: '刷新',
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

function formatText(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"details(\'{0}\')\">查看</a>', rowIndex);
}
function formatText2(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"charts(\'{0}\')\">查看</a>', rowIndex);
}
function charts(row) {
    var record = grid.getStore().getAt(row).data
    var startDate,endDate
    if (Ext.getCmp('stTime').getValue()==null){
        startDate = Ext.getCmp('stDate').getValue().getTime()

    } else {
        startDate = Ext.getCmp('stDate').getValue().getTime()  + Ext.getCmp('stTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()

    }if (Ext.getCmp('edTime').getValue()==null) {
        endDate = Ext.getCmp('edDate').getValue().getTime()
    }else {
        endDate = Ext.getCmp('edDate').getValue().getTime()  + Ext.getCmp('edTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()
    }
    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        loadPage('./html/KpiHistoryCharts.jsp?tagName=' + record.tagName + '&st=' + startDate + '&et=' + endDate, '指标历史曲线')
    }
}

function details(row) {
    var record = grid.getStore().getAt(row).data
    var startDate,endDate
    if (Ext.getCmp('stTime').getValue()==null){
        startDate = Ext.getCmp('stDate').getValue().getTime()

    } else {
        startDate = Ext.getCmp('stDate').getValue().getTime()  + Ext.getCmp('stTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()

    }if (Ext.getCmp('edTime').getValue()==null) {
        endDate = Ext.getCmp('edDate').getValue().getTime()
    }else {
        endDate = Ext.getCmp('edDate').getValue().getTime()  + Ext.getCmp('edTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()
    }

    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        loadPage('./html/KpiHistoryDetail.jsp?tagName=' + record.tagName + '&st=' + startDate + '&et=' + endDate, '指标历史明细')
    }

}
function handlerRefreshAction() {
    Ext.getCmp('indexdescp').setValue('')
    Ext.getCmp('unitComob').setValue(unitIdData[0][0])
    Ext.getCmp('suiteComob').setValue(setsIdData[0][0])
    var newData = getByUnitSetsDesc(0,0,'')
    store.loadData(newData);
}

function handlerQueryAction() {
    var unit = unitJsonMap[Ext.getCmp('unitComob').getValue()]
    var sets = suiteJsonMap[Ext.getCmp('suiteComob').getValue()]
    var desc = Ext.getCmp('indexdescp').getValue()
    var newData = getByUnitSetsDesc(unit,sets,desc)
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