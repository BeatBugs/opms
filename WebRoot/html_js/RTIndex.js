DWREngine.setAsync(false);
var Data, personData, unitIdData, setsIdData,summaryData,myData,stationIdData
var unitJsonMap = {}, suiteJsonMap = {},positonJsonMap = {}
var config = localStorage['config']

function assign(o,n){
    for (var p in n){
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
            o[p]=n[p];
    }
    return o
};
function search(unit, set) {
    EvalRTDataService.search(unit, set,'','',{
        callback:function (str) {
            for (var i=0;i<str.root.length;i++) {
                str.root[i].kpiInfo.sets = suiteJsonMap[str.root[i].kpiInfo.sets]
                str.root[i].kpiInfo.unit = unitJsonMap[str.root[i].kpiInfo.unit]
                var json =assign(str.root[i].kpiInfo,str.root[i].kpiData);
                json.scoreRate = str.root[i].scoreRate
                json.excelZone = str.root[i].excelZone
                str.root[i] = json
            }
            if (str.personScore!=null && str.personScore.root.length!=0) {
                for (var i = 0; i < str.personScore.root.length; i++) {
                    str.personScore.root[i].stationId = positonJsonMap[str.personScore.root[i].stationId]
                }
            }
            myData =str
        }
    })
    return myData
}

function init(summary) {
        Ext.getCmp('dutyIndex').setValue(summary.dutyIndex);
        Ext.getCmp('dutyName').setValue(summary.dutyName);

        //Ext.getCmp('totalBase').setValue(formatNumber(summary.totalBase));
        Ext.getCmp('totalScore').setValue(formatNumber(summary.totalScore));
        //Ext.getCmp('totalScoreRate').setValue(formatPercent(summary.totalScoreRate));

        Ext.getCmp('kpiCount').setValue(summary.kpiCount);

        Ext.getCmp('excelCount').setValue(summary.excelCount);
        Ext.getCmp('alarmCount').setValue(summary.alarmCount);

        Ext.getCmp('excelRate').setValue(formatPercent(summary.excelRate));
        Ext.getCmp('alarmRate').setValue(formatPercent(summary.alarmRate));

        //Ext.getCmp('refreshTime').setValue(formatTime(summary.refreshTime));

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
getPosition()
search(unitJsonMap[unitIdData[0][0]],suiteJsonMap[setsIdData[0][0]])

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
    listClass: 'x-combo-list-small',
    listeners: {
        select: function (combo, record, index) {
            var set = suiteJsonMap[this.getValue()]
            var unit = unitJsonMap[Ext.getCmp('unitComob').getValue()]

            var newData = search(unit,set)

            kpiStore.loadData(newData.root)
            personStore.loadData(newData.personScore.root)
            init(newData.summary)
        }
    }
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
            var set = suiteJsonMap[Ext.getCmp('suiteComob').getValue()]
            var unit = unitJsonMap[this.getValue()]

            var newData = search(unit,set)
            kpiStore.loadData(newData.root)
            personStore.loadData(newData.personScore.root)
            init(newData.summary)
        }
    }
})

var kpiStore = Ext.create('Ext.data.ArrayStore', {
    fields: [

        {name: 'unit', 				mapping:'unit',   			type : 'string'},
        {name: 'sets', 				mapping:'sets',   			type : 'string'},
        {name: 'name',				mapping:'name', 			type : 'string'},
        {name: 'descp', 			mapping:'descp',			type : 'string'},
        {name: 'units', 			mapping:'units',			type : 'string'},
        {name: 'category', 			mapping:'category', 		type : 'string'},
        {name: 'type', 				mapping:'type',   			type : 'string'},
        {name: 'weights',			mapping:'weights',  		type : 'float'},
        {name: 'bonus',				mapping:'bonus',  			type : 'float'},
        {name: 'percent',			mapping:'percent',  		type : 'float'},
        {name: 'period',			mapping:'period',  			type : 'int'},
        {name: 'dataType',			mapping:'dataType', 		type : 'string'},
        {name: 'aggFunc',			mapping:'aggFunc',  		type : 'string'},
        {name: 'orderNum',			mapping:'orderNum', 		type : 'int'},

        {name: 'time',				mapping:'time', 			type : 'date'},
        {name: 'value', 			mapping:'value', 			type : 'float'},
        {name: 'status', 			mapping:'status',			type : 'int'},
        {name: 'value1', 			mapping:'value1',			type : 'float'},
        {name: 'value2', 			mapping:'value2',			type : 'float'},
        {name: 'score', 			mapping:'score', 			type : 'float'},
        {name: 'excel', 			mapping:'excel', 			type : 'boolean'},
        {name: 'alarm', 			mapping:'alarm', 			type : 'boolean'},

        {name: 'scoreRate', 		mapping:'scoreRate', 				type : 'float'},

        {name: 'excelZone', 		mapping:'excelZone', 				type : 'string'}

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
    },
});
var personStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: 'userDesc', 				mapping:'userDesc',   			type : 'string'},
        {name: 'stationId', 			mapping:'stationId',   			type : 'string'},
        {name: 'score', 				mapping:'score',   			    type : 'int'   }
    ],
    autoLoad: true,
    data: myData.personScore.root,
    proxy: {
        reader: {
            type: 'json',
            rootProperty: 'root'
        }
    },
    sorters: {
        property: 'id',
        direction: 'ASC'
    }
});
var bbar = [
    {
        xtype: 'buttongroup',
        title: ' ',
        columns: 2,
        defaults: {
            scale: 'small'
        },
        items: [
            {xtype: 'tbtext', text: '当值:',width:60}, {id : 'dutyIndex', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}},
            {xtype: 'tbtext', text: '当班:',width:60}, {id : 'dutyName', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}}
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
            {xtype: 'tbtext', text: '实时奖金:',width:60}, {id : 'totalScore', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}},
            {xtype: 'tbtext', text: '指标总数:',width:60}, {id : 'kpiCount', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}}
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
            {xtype: 'tbtext', text: '最优数:',width:60}, {id : 'excelCount', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}},
            {xtype: 'tbtext', text: '最优率:',width:60}, {id : 'excelRate', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}}
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
            {xtype: 'tbtext', text: '预警数:',width:60}, {id : 'alarmCount', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}},
            {xtype: 'tbtext', text: '预警率:',width:60}, {id : 'alarmRate', xtype: 'textfield', readOnly: true, width:75, style:{background:'#DEECFD'}}
        ]
    }
];
var northGrid = new Ext.grid.Panel({
    region: 'center',
    store: kpiStore,
    witdh: window.innerWidth,
    title: '指标考核实时明细',

    columns: [
        new Ext.grid.RowNumberer(),
        {
            dataIndex: 'unit',
            header: '单元',
            sortable: true,
            flex:1,
            align: 'center',
            hidden: true
        },
        {
            dataIndex: 'sets',
            header: '机组',
            sortable: true,
            flex:1,
            align: 'center',
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'name',
            header: '点名',
            sortable: true,
            flex:1,
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'descp',
            header: '指标',
            sortable: true,
            flex:1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'units',
            header: '单位',
            sortable: true,
            width: 50
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'type',
            header: '指标类别',
            sortable: true,
            width: 70,
            hidden: true
        },

        {
            xtype: 'gridcolumn',
            dataIndex: 'period',
            renderer: formatEvalPeriod2,
            header: '周期',
            sortable: true,
            flex:1,
            align: 'center'
            // hidden: true
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'dataType',
            header: '数据类型',
            sortable: true,
            flex:1,
            align: 'center',
            hidden: true
        },
        {
            xtype: 'datecolumn',
            dataIndex: 'time',
            header: '考核时间',
            sortable: true,
            flex:1,
            align: 'center',
            format: 'H:i:s'
        },
        {
            xtype: 'numbercolumn',
            dataIndex: 'value',
            header: '数值',
            sortable: true,
            flex:1,
            align: 'center',
            format: '0.000',
            renderer:function(value, cellmeta,record,rowIndex,columnIndex,store){
                var recordData = record.data.alarm
                var RTdata = formatNumber3(record.data.value)
                if (recordData!=false){
                    return Ext.String.format('<font color=red>{0}</font>',RTdata)
                }else {
                    return RTdata
                }
            }
        },
        {
            xtype: 'numbercolumn',
            dataIndex: 'score',
            header: '得分',
            sortable: true,
            flex:1,
            align: 'center',
            format: '0.0000',
            renderer:function(value, cellmeta,record,rowIndex,columnIndex,store){
                var recordData = record.data.alarm
                var RTdata = formatNumber3(record.data.score)
                if (recordData!=false){
                    return Ext.String.format('<font color=red>{0}</font>',RTdata)
                }else {
                    return RTdata
                }
            }
        },

        {
            xtype: 'booleancolumn',
            dataIndex: 'excel',
            header: '是否最优',
            sortable: true,
            flex:1,
            align: 'center',
            trueText: '<font color=blue>是</font>',
            falseText: '否'
        },
        {
            xtype: 'booleancolumn',
            dataIndex: 'alarm',
            header: '是否预警',
            sortable: true,
            flex:1,
            align: 'center',
            trueText: '<font color=red>是</font>',
            falseText: '否'
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'excelZone',
            header: '最优区间',
            sortable: true,
            width: 200,
            align: 'center'
        }
    ],
    tbar: [unitComob, suiteComob,'->',{
        text: '刷新',
        iconCls: 'refresh',
        tooltip: '刷新表格',
        handler: handleRefeshAction
    }],
    bbar: bbar
})
init(myData.summary)

var centerGrid = new Ext.grid.Panel({
    region: 'south',
    title: '指标考核人员得分',
    collapsible: true,
    store: personStore,
    witdh: window.innerWidth,
    columns: [

        {header: "用户名", flex: 1, sortable: true, dataIndex: 'userDesc', align: 'center'},
        {header: "岗位", flex: 1, sortable: true, dataIndex: 'stationId', align: 'center'},
        // {header: "新岗位id",  width: 80,  sortable: true, dataIndex: 'newStationId', align: 'center', hidden: true},
        {header: "实时得分", flex: 1, sortable: true, dataIndex: 'score', align: 'center'}
    ],
    height: 180
})
var panel
if (config ==1) {
     panel = new Ext.panel.Panel({
        layout: 'border',
        width: window.innerWidth,
        height: window.innerHeight,
        items: [
            northGrid,
            centerGrid
        ]
    })
} else{
    panel = new Ext.panel.Panel({
        layout: 'border',
        width: window.innerWidth,
        height: window.innerHeight,
        items: [
            northGrid
        ]
    })
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
function handleRefeshAction(){
    DWREngine.setAsync(false);
    var newData = search(unitJsonMap[unitIdData[0][0]],suiteJsonMap[setsIdData[0][0]])
    kpiStore.loadData(newData.root)
    personStore.loadData(newData.personScore.root)
    init(newData.summary)
    Ext.getCmp('suiteComob').setValue(setsIdData[0][0])
    Ext.getCmp('unitComob').setValue(unitIdData[0][0])
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
    setInterval(handleRefeshAction,60000)
});
