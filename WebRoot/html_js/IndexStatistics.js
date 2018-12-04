DWREngine.setAsync(false);
var myData, unitIdData, setsIdData, stationIdData, teamIdData,yearData=[],monthData =[]
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}

for (var i=0;i<=new Date().getFullYear()-2015;i++){
    var array =[]
    array.push((2016+i)+'')
    array.push((2016+i)+'')
    yearData.push(array)
}
for (var i=0;i<new Date().getMonth()+1 ;i++){
    var array =[]
    array.push((i+1)+'')
    array.push((1+i)+'')
    monthData.push(array)
}

typeData=[
    ['经济指标',		'经济指标'],
    ['环保指标',		'环保指标'],
    ['安全指标',		'安全指标']
];
function assign(o,n){
    for (var p in n){
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
            o[p]=n[p];
    }
    return o
};
function searchKpiAggDataByDuty(unit, set, year, month, type, begin, end, dutyIndex) {
    KpiAggDataService.searchKpiAggDataByDuty(unit, set, year, month, '', type, begin, end, 0, dutyIndex, {
        callback: function (str) {
            for (var i = 0; i < str.root.length; i++) {
                str.root[i].kpiInfo.sets = suiteJsonMap[str.root[i].kpiInfo.sets]
                str.root[i].kpiInfo.unit = unitJsonMap[str.root[i].kpiInfo.unit]
                var json = assign(str.root[i].aggData, str.root[i].kpiInfo);
                str.root[i] = json
            }
            myData = str
        }
    })
    return myData
}

function init(summary) {

    Ext.getCmp('totalEvalCount').setValue(summary.totalEvalCount);
    Ext.getCmp('totalExcelCount').setValue(summary.totalExcelCount);
    Ext.getCmp('totalAlarmCount').setValue(summary.totalAlarmCount);

    Ext.getCmp('totalWeights').setValue(formatNumber(summary.totalWeights));
    Ext.getCmp('totalAvgScore').setValue(formatNumber(summary.totalAvgScore));

    Ext.getCmp('totalScore').setValue(formatNumber(summary.totalScore));
    Ext.getCmp('totalBonus').setValue(formatNumber(summary.totalBonus));

    Ext.getCmp('totalScoreRate').setValue(formatPercent(summary.totalScoreRate));
    Ext.getCmp('totalExcelRate').setValue(formatPercent(summary.totalExcelRate));
    Ext.getCmp('totalAlarmRate').setValue(formatPercent(summary.totalAlarmRate));

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
    SetsDao.getAllSetsName(id,{
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

function getTeam() {
    TeamDao.getTeamField({
        callback: function (str) {
            teamIdData = str
            for (var i = 0; i < teamIdData.length; i++) {
                orderclassJsonMap[str[i][1]] = str[i][0]
                orderclassJsonMap[str[i][0]] = str[i][1]
                teamIdData[i][1] = teamIdData[i][0]
            }

        }
    })
}

function getPosition() {
    Post1Dao.getAllStationName({
        callback: function (str) {
            stationIdData = str
            for (var i = 0; i < stationIdData.length; i++) {
                positonJsonMap[str[i][1]] = str[i][0]
                positonJsonMap[str[i][0]] = str[i][1]
                stationIdData[i][1] = stationIdData[i][0]
            }
        }
    })
}

getUnit()
getSuite(unitJsonMap[unitIdData[0][0]])
getTeam()
getPosition()
var year = new Date().getFullYear()
var month = new Date().getMonth()
var data = searchKpiAggDataByDuty(unitJsonMap[unitIdData[0][0]], suiteJsonMap[setsIdData[0][0]], year, month, '', new Date(year, month, 1), new Date(year, month + 1, 1), 0)


var suiteComob = new Ext.form.ComboBox({
    store: setsIdData,
    id: "suiteComob",
    fieldLabel: '机组号',
    displayField: 'name',
    valueField: 'name',
    width: 150,
    labelWidth: 50,

    value: setsIdData[0][0],
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'

})
var orderComob = new Ext.form.ComboBox({
    store: teamIdData,
    id: "orderComob",
    fieldLabel: '班次',
    displayField: 'name',
    valueField: 'name',
    width: 140,
    labelWidth: 30,
    value: teamIdData[0][0],
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'

})
var unitComob = new Ext.form.ComboBox({
    store: unitIdData,
    id: "unitComob",
    fieldLabel: '单元号',
    displayField: 'name',
    valueField: 'name',
    width: 150,
    labelWidth: 50,
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
        }
    }

})

var yearCombox = new Ext.form.ComboBox({
    store: yearData,
    id: "yearCombox",
    fieldLabel: '年份',
    displayField: 'name',
    valueField: 'name',
    width: 120,
    labelWidth: 30,
    value: new Date().getFullYear(),
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners: {
        select: function (combo, record, index) {
            var month = Ext.getCmp('monthCombox').getValue()
            Ext.getCmp('stDate').setValue(new Date(this.getValue(),month-1,1,0,0,0))
            Ext.getCmp('edDate').setValue(new Date(new Date(this.getValue(),month-1,1,0,0,0).getTime()+30*24*60*60*1000))
        }
    }
});
var monthCombox = new Ext.form.ComboBox({
    store: monthData,
    id: "monthCombox",
    fieldLabel: '月份',
    displayField: 'name',
    valueField: 'name',
    width: 120,
    labelWidth: 30,
    value: new Date().getMonth()+1,
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners: {
        select: function (combo, record, index) {
            var year = Ext.getCmp('yearCombox').getValue()
            Ext.getCmp('stDate').setValue(new Date(year,this.getValue()-1,1,0,0,0))
            Ext.getCmp('edDate').setValue(new Date(new Date(year,this.getValue()-1,1,0,0,0).getTime()+30*24*60*60*1000))
        }
    }
});
var typeCombox = new Ext.form.ComboBox({
    store: typeData,
    id: "typeCombox",
    fieldLabel: '类型',
    displayField: 'name',
    valueField: 'name',
    width: 140,
    labelWidth: 30,
    value:typeData[0][0],
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
});


var store = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: 'name', mapping: 'name', type: 'string'},
        {name: 'descp', mapping: 'descp', type: 'string'},
        {name: 'units', mapping: 'units', type: 'string'},
        {name: 'category', mapping: 'category', type: 'string'},
        {name: 'type', mapping: 'type', type: 'string'},
        {name: 'weights', mapping: 'weights', type: 'float'},
        {name: 'bonus', mapping: 'bonus', type: 'float'},
        {name: 'period', mapping: 'period', type: 'int'},

        {name: 'totalCount', mapping: 'totalCount', type: 'int'},
        {name: 'excelCount', mapping: 'excelCount', type: 'int'},
        {name: 'alarmCount', mapping: 'alarmCount', type: 'int'},
        {name: 'sumValue', mapping: 'sumValue', type: 'float'},
        {name: 'maxValue', mapping: 'maxValue', type: 'float'},
        {name: 'minValue', mapping: 'minValue', type: 'float'},
        {name: 'avgValue', mapping: 'avgValue', type: 'float'},
        {name: 'sumScore', mapping: 'sumScore', type: 'float'},
        {name: 'maxScore', mapping: 'maxScore', type: 'float'},
        {name: 'minScore', mapping: 'minScore', type: 'float'},
        {name: 'avgScore', mapping: 'avgScore', type: 'float'},
        {name: 'score', mapping: 'score', type: 'float'},
        {name: 'scoreRate', mapping: 'scoreRate', type: 'float'},
        {name: 'excelRate', mapping: 'excelRate', type: 'float'},
        {name: 'alarmRate', mapping: 'alarmRate', type: 'float'},

        {name: 'duration', mapping: 'duration', type: 'int'}
    ],
    autoLoad: true,
    data: myData,
    proxy: {
        reader: {
            type: 'json',
            rootProperty: 'root',
            totalProperty: 'total'
        }
    },
    sorters: {
        property: 'id',
        direction: 'ASC'
    }

});
var tbar = [
    {
        xtype: 'buttongroup',
        title: '年月',
        columns: 1,
        defaults: {
            scale: 'small'
        },
        items: [
            yearCombox,
            monthCombox
        ]

    },
    {
        xtype: 'buttongroup',
        title: '机组',
        columns: 1,
        defaults: {
            scale: 'small'
        },
        items: [
            unitComob,
            suiteComob
        ]

    },
    {
        xtype: 'buttongroup',
        title: '时段',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {
                xtype: 'datefield',
                id: "stDate",
                labelWidth: 30,
                fieldLabel: '开始',
                format: 'Y-m-d',
                width: 160,
                value: new Date(new Date().getFullYear(),new Date().getMonth(),1).dateFormat('Y-M-d')
            }, {
                xtype: 'timefield',
                id: "stTime",
                width: 110,
                value:'00:00:00',
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
                value: new Date(new Date().getFullYear(),new Date().getMonth()+1,1).dateFormat('Y-M-d')
            }, {
                xtype: 'timefield',
                id: "edTime",
                format: 'G:i:s',
                value:'00:00:00',
                width: 110,
                increment: 10
            }
        ]

    },
    {
        xtype: 'buttongroup',
        title: '值次类别',
        columns: 1,
        defaults: {
            scale: 'small'
        },
        items: [
            orderComob,
            typeCombox
        ]

    },
    {
        text: '查询',
        scale: 'small',
        handler:handlerSearchAction
    }
];
var bbar = [
    {
        xtype: 'buttongroup',
        title: ' ',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {xtype: 'tbtext', text: '总平均奖:',width: 60}, {
                id: 'totalAvgScore',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            },
            {xtype: 'tbtext', text: '总基准奖:', width: 60}, {
                id: 'totalWeights',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            }
        ]
    },
    {
        xtype: 'buttongroup',
        title: ' ',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {xtype: 'tbtext', text: ' 得奖总额:', width: 60}, {
                id: 'totalScore',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            },
            {xtype: 'tbtext', text: ' 月度总额:', width: 60}, {
                id: 'totalBonus',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            }
        ]
    },
    {
        xtype: 'buttongroup',
        title: ' ',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {xtype: 'tbtext', text: '总数据量:', width: 60}, {
                id: 'totalEvalCount',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            },
            {xtype: 'tbtext', text: '总得奖率:', width: 60}, {
                id: 'totalScoreRate',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            }
        ]

    },
    {
        xtype: 'buttongroup',
        title: ' ',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {xtype: 'tbtext', text: '总最优数:', width: 60}, {
                id: 'totalExcelCount',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            },
            {xtype: 'tbtext', text: '总最优率:', width: 60}, {
                id: 'totalExcelRate',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            }
        ]
    },
    {
        xtype: 'buttongroup',
        title: ' ',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {xtype: 'tbtext', text: '总预警数:', width: 60}, {
                id: 'totalAlarmCount',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            },
            {xtype: 'tbtext', text: '总预警率:', width: 60}, {
                id: 'totalAlarmRate',
                xtype: 'textfield',
                readOnly: true,
                width: 75,
                style: {background: '#DEECFD'}
            }
        ]
    }
];

var panel = new Ext.grid.Panel({
    height: window.innerHeight,
    witdh: window.innerWidth,
    store: store,
    title: '指标统计',
    columns: [
        new Ext.grid.RowNumberer(),
        {header: '指标', dataIndex: 'descp', flex: 2, sortable: true, align: 'center'},
        {header: '点名', dataIndex: 'name', flex: 2, sortable: true, align: 'center', hidden: true},
        {header: '单位', dataIndex: 'units', flex: 1, sortable: true, align: 'center'},
        //{header: '奖金类别',	dataIndex: 'category',	flex:1, 	sortable: true,  align: 'center',	hidden:true},
        {header: '指标类别', dataIndex: 'type', flex: 1, sortable: true, align: 'center'},
        {
            header: '考核周期',
            dataIndex: 'period',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatEvalPeriod,
            hidden: true
        },
        {header: '基准奖金', dataIndex: 'weights', flex: 1, sortable: true, align: 'center', renderer: formatNumber},
        {header: '月度奖金', dataIndex: 'bonus', flex: 1, sortable: true, align: 'center', renderer: formatNumber},

        {
            header: "考核次数",
            dataIndex: 'totalCount',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatIntDarkBlue,
            hidden: true
        },
        {
            header: "最优次数",
            dataIndex: 'excelCount',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatIntDarkBlue,
            hidden: true
        },
        {
            header: '预警次数',
            dataIndex: 'alarmCount',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatIntDarkBlue,
            hidden: true
        },

        {
            header: '累计值',
            dataIndex: 'sumValue',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatNumber3Blue,
            hidden: true
        },
        {
            header: '最大值',
            dataIndex: 'maxValue',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatNumber3Blue,
            hidden: true
        },
        {
            header: '最小值',
            dataIndex: 'minValue',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatNumber3Blue,
            hidden: true
        },
        {header: '平均值', dataIndex: 'avgValue', flex: 1, sortable: true, align: 'center', renderer: formatNumber3Blue},

        {
            header: '累计奖',
            dataIndex: 'sumScore',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatNumber2Green,
            hidden: true
        },
        {
            header: '最高奖',
            dataIndex: 'maxScore',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatNumber2Green,
            hidden: true
        },
        {
            header: '最低奖',
            dataIndex: 'minScore',
            flex: 1,
            sortable: true,
            align: 'center',
            renderer: formatNumber2Green,
            hidden: true
        },
        {header: '平均奖', dataIndex: 'avgScore', flex: 1, sortable: true, align: 'center', renderer: formatNumber2Green},

        {header: '得奖', dataIndex: 'score', flex: 1, sortable: true, align: 'center', renderer: formatNumber2Green},
        {header: '得奖率', dataIndex: 'scoreRate', flex: 1, sortable: true, align: 'center', renderer: formatPercentRed},
        {header: '最优率', dataIndex: 'excelRate', flex: 1, sortable: true, align: 'center', renderer: formatPercentRed},
        {header: '预警率', dataIndex: 'alarmRate', flex: 1, sortable: true, align: 'center', renderer: formatPercentRed},

        {header: '考核时长', dataIndex: 'duration', flex: 2, sortable: true, align: 'center', renderer: formatDuration}

    ],
    tbar: tbar,
    bbar: bbar

})

var mSummary = myData.summary
init(mSummary)
function handlerSearchAction() {
    var year= Ext.getCmp('yearCombox').getValue()
    var month = Ext.getCmp('monthCombox').getValue()
    var unit = unitJsonMap[Ext.getCmp('unitComob').getValue()]
    var sets = suiteJsonMap[Ext.getCmp('suiteComob').getValue()]
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
    var order = orderclassJsonMap[Ext.getCmp('orderComob').getValue()]
    if (endDate -startDate>1000*60*60*24*30) {
        showToast('最大时间跨度不能超过一个月')
        Ext.getCmp('edDate').setValue(new Date(startDate+1000*60*60*24*30).dateFormat('Y-M-d'))
        endDate = Ext.getCmp('edDate').getValue().getTime()
    }

    var type = Ext.getCmp('typeCombox').getValue()
    if(type=='全部'){
        type=''
    }
    var newData = searchKpiAggDataByDuty(unit,sets,year,month,'',startDate,endDate,0)
    store.loadData(newData.root)
    init(newData.summary)
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

// Fires when the document is ready (before onload and before images are loaded).
// Shorthand of Ext.EventManager.onDocumentReady.
Ext.onReady(function () {

    // Provides attractive and customizable tooltips for any element.
    // The QuickTips singleton is used to configure and manage tooltips
    // globally for multiple elements in a generic manner.
    // Init the singleton. Any tag-based quick tips will start working.
    Ext.QuickTips.init();

    // NOTE: This is an example showing simple state management. During development,
    // it is generally best to disable state management as dynamically-generated ids
    // can change across page loads, leading to unpredictable results.  The developer
    // should ensure that stable state ids are set for stateful components in real apps.
    // Ext.state.Manager.setProvider(new Ext.state.CookieProvider());


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: panel
    });

});
