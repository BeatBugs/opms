var myData, pData, userData, node = 0;
var nameArray = new Array();
var value = 'TITLE';
var store, grid
var msgTip
var unitJsonMap = {}, suiteJsonMap = {}
var columns = [
    new Ext.grid.RowNumberer(),
    {header: "值次", dataIndex: 'dutyIndex', width: 80, sortable: true, align: 'center'},
    {header: "时段", dataIndex: 'stTime', width: 120, sortable: true, align: 'center'}
]
DWREngine.setAsync(false);
var unitIdData

function searchHourSummary(unit, set, date) {
    KpiDataService.searchHourSummary(unit, set, '', '', date, {
        callback: function (str) {
            for (var i = 0; i < str.root.length; i++) {
                str.root[i].stTime = str.root[i].stTime + '-' + str.root[i].edTime
            }
            myData = str.root
        }
    })
    return myData
}

// searchHourSummary(0,0,new Date(2018,10,13,0,0,0))
function getUnit() {

    UnitDao.getAllUnitName({
        callback: function (str) {
            unitIdData = str
            for (var i = 0; i < unitIdData.length; i++) {
                unitJsonMap[str[i][1]] = str[i][0]
                unitJsonMap[str[i][0]] = str[i][1]
                unitJsonMap['全部单元'] = 0
                unitJsonMap[''] = 0
                unitJsonMap[null] = 0
                unitIdData[i][1] = unitIdData[i][0]
            }

        }
    })

}

var gridwidth = 160 * kpiInfoArray.length + 200
var setsIdData

function getSuite(id) {
    SetsDao.getAllSetsName(id, {
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                suiteJsonMap['全部机组'] = 0
                suiteJsonMap[''] = 0
                suiteJsonMap[null] = 0
                setsIdData[i][1] = setsIdData[i][0]
            }

        }
    })
}

for (var i = 0; i < kpiInfoArray.length; i++) {
    var json = {}
    json['sortable'] = true
    json['align'] = 'center'
    json['header'] = kpiInfoArray[i][2]
    json['columns'] = [
        {
            header: '均值',
            dataIndex: 'avg_' + kpiInfoArray[i][0],
            width: 80,
            align: 'center',
            renderer: formatNumber2
        }, {
            header: '分数',
            dataIndex: 'sum_' + kpiInfoArray[i][0],
            width: 80,
            align: 'center',
            renderer: formatNumber2
        }
    ]
    columns.push(json)
}

function formatNumber2(number) {
    if (number == null || number == '') {
        number = 0
        return number.toFixed(2);
    } else if (number != -1) {

        return number.toFixed(2);
    } else {
        return '无'
    }
}



Ext.onReady(function () {

    getUnit()
    getSuite(unitJsonMap[unitIdData[0][0]])
    // getOrderClasses()
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [],
        data: myData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
            }
        },
        sorters: {
            property: 'Sort',
            direction: 'ASC'
        }
    });
    var unitIdComboBox = {
        id: 'unitIdComboBox',
        xtype: 'combo',
        store: unitIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        emptyText: '单元',
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                getSuite(unitJsonMap[this.getValue()])
                Ext.getCmp('setsIdComboBox').getStore().loadData(setsIdData)
                Ext.getCmp('setsIdComboBox').setValue(setsIdData[0][0])
            }
        }
    }

    var setsIdComboBox = {
        id: 'setsIdComboBox',
        xtype: 'combo',
        store: setsIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText: '机组',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize:60
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
    tbar = [
        unitIdComboBox,
        setsIdComboBox,
        {
            xtype: 'datefield',
            id: "stDate",
            labelWidth: 30,
            fieldLabel: '时间',
            format: 'Y-m-d',
            width: 160,
            value: new Date().dateFormat('Y-M-d')
        },
        '->',
        {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '小时累计',
        width: gridwidth,
        stripeRows: true,
        forceFit: false,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],
        autoScroll: true,
        bodyStyle: 'overflow-y:auto;',
        viewConfig: {forceFit: true},
        store: store,
        columns: columns,
        loadMask: true,
        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function handlerQueryAction(){
    var stDate = new Date(Ext.getCmp('stDate').getValue())
    var unit = unitJsonMap[Ext.getCmp('unitIdComboBox').getValue()]
    var sets = suiteJsonMap[Ext.getCmp('setsIdComboBox').getValue()]
    var newData = searchHourSummary(unit, sets, stDate)
    store.loadData(newData)
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