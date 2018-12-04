document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
DWREngine.setAsync(false);
var myData,kpiData,unitIdData, setsIdData, stationIdData, teamIdData,reportData
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {},reportJsonMap ={}
var width = document.documentElement.clientWidth
var height = document.documentElement.clientHeight
var tableWidth = (width-80)/2
var marginTop = height/2-60
function getSuite() {
    SetsDao.getAllSetsName(0,{
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
            var all=[]
            all.push("全部机组")
            all.push("全部机组")
            setsIdData.unshift(all)

        }
    })
}
function getAllKpi() {
    KpiInfoDao.getByYearMonth(new Date().getFullYear(),new Date().getMonth()+1,{
        callback:function (str) {

            kpiData = {root:str}
        }
    })
    return kpiData
}

function getReportConfig(){
    ReportConfigDao.getAllReportConfig({
        callback:function (str) {
            reportData = str
            for (var i = 0; i < reportData.length; i++) {
                reportJsonMap[str[i][1]] = str[i][0]
                reportJsonMap[str[i][0]] = str[i][1]
                reportData[i][1] = reportData[i][0]
            }
        }
    })
}

getAllKpi()
getSuite()
getReportConfig()
systemData=[['运行绩效','运行绩效'],['运行优化','运行优化'],['性能分析','性能分析']]
var systemComboBox = new Ext.form.ComboBox({
    id:'systemComboBox',
    store: systemData,
    width: 100,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    emptyText:'系统',
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
typeData=[['全部','全部']]
var typeComboBox = new Ext.form.ComboBox({
    id:'typeComboBox',
    store: typeData,
    width: 100,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    emptyText:'分类',
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var setsIdComboBox1 = new Ext.form.ComboBox({
    id:'setsIdComboBox1',
    store: setsIdData,
    width: 100,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    emptyText:'机组',
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var setsIdComboBox2 = new Ext.form.ComboBox({
    id:'setsIdComboBox2',
    store: setsIdData,
    width: 100,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    emptyText:'机组',
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var reportComboBox = new Ext.form.ComboBox({
    id:'reportComboBox1',
    store: reportData,
    width: 100,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    emptyText:reportData[0][0],
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners:{
        select: function(combo, record, index) {
            var report = reportJsonMap[this.getValue()]
            var newData = getKpiMapInfoListByReportId(report)
            rightStore.loadData(newData.root)
        }
    }
})
Ext.getCmp('reportComboBox1').setValue(reportData[0][0],reportData[0][0])

var leftTbar =[
    setsIdComboBox1,
    {
        xtype: 'textfield',
        fieldLabel: '名称',
        labelWidth:30,
        width:100,
        name: 'indexname',
        id:"indexname"
    },{
        xtype: 'textfield',
        fieldLabel: '描述',
        labelWidth:30,
        width:100,
        name: 'indexdescp',
        id:"indexdescp"
    },'->',
    {
        text: '查询',
        iconCls: 'refresh',
        tooltip: '查询',
        // handler:handlerSearchAction
    }
    ]
var rightTbar =[
    '->',
    {
        text: '重设',
        iconCls: 'save',
        tooltip: '保存',
        handler:handlerResetAction
    }
]
var leftStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "name", mapping: "name", type: 'string'},
        {name: "descp", mapping: "descp", type: 'string'},
        {name: "sets", mapping: "sets", type: 'string'},
        {name: "units", mapping: "units", type: 'string'}
    ],
    autoLoad: true,
    data: kpiData,
    proxy: {
        reader: {
            type: 'json',
            rootProperty: 'root',
            totalProperty: 'total'
        }
    },
    sorters: {
        property: 'name',
        direction: 'ASC'
    },

});

var rightStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "name", mapping: "name", type: 'string'},
        {name: "descp", mapping: "descp", type: 'string'},
        {name: "units", mapping: "units", type: 'string'}
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
var leftPagingBar = new Ext.PagingToolbar({
    store: leftStore,
    displayInfo: true,
    displayMsg: 'Displaying topics {0} - {1} of {2}'
});

var rightPagingBar = new Ext.PagingToolbar({
    store: rightStore,
    displayInfo: true,
    displayMsg: 'Displaying topics {0} - {1} of {2}'
});

var weatGrid = new Ext.grid.Panel({

    region: 'west',
    store: leftStore,
    // bbar:leftPagingBar,
    border:true,
    tbar:leftTbar,
    height: window.innerHeight,
    selType: 'checkboxmodel',
    title: '全部指标',
    columns: [
        {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
        {header: "指标描述", flex:2, sortable: true, dataIndex: 'descp', align: 'center'},
        {header: "机组", width: 80, sortable: true, dataIndex: 'sets', align: 'center'},
        {header: "单位", width: 80, sortable: true, dataIndex: 'units', align: 'center'}
    ],
    width:tableWidth
})
var eastGrid = new Ext.grid.Panel({
    region: 'east',
    tbar:rightTbar,
    // bbar:rightPagingBar,
    title: '对比指标',
    // collapsible: true,
    store: rightStore,
    border:true,
    height: window.innerHeight,
    selType: 'checkboxmodel',
    columns: [
        {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
        {header: "指标描述", flex:2, sortable: true, dataIndex: 'descp', align: 'center'},
        {header: "单位", width: 80, sortable: true, dataIndex: 'units', align: 'center'}
    ],
    width:tableWidth
})
var centerForm = new Ext.panel.Panel({
    region: 'center',
    height:window.innerHeight,
    requires: [
        'Ext.layout.container.VBox'
    ],
    header:false,
    border:false,
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    defaults:{
        border:false
    },
    items:[
        {
            flex:1,
            items:[
                {
                    xtype:'button',
                    text: '增加',
                    height:40,
                    margin:marginTop+' 5 0 5',
                    iconCls: 'add',
                    tooltip: '增加',
                    handler: handlerAddAction
                }
            ]

        }, {
            flex:1,
            items:[
                {
                    xtype:'button',
                    text: '删除',
                    height:40,
                    margin:'5 5 0 5',
                    iconCls: 'add',
                    tooltip: '增加',
                    handler: handlerDelAction
                }
            ]
        }
    ]
})


var panel = new Ext.panel.Panel({
    layout: 'border',
    width: window.innerWidth,
    border:false,
    height: window.innerHeight,
    tbar:[
        {
            xtype: 'datefield',
            labelWidth: 60,
            id:'stDate',
            fieldLabel: '开始日期',
            format: 'Y-m-d',
            width: 190,
            value: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1).dateFormat('Y-M-d')
        }, {
            xtype: 'timefield',
            value:'00:00:00',
            id:'stTime',
            width: 120,
            format: 'G:i:s',
            increment: 10
        },

        {
            xtype: 'datefield',
            fieldLabel: '结束日期',
            format: 'Y-m-d',
            id:'edDate',
            labelWidth: 60,
            width: 190,
            value: new Date().dateFormat('Y-M-d')
        }, {

            xtype: 'timefield',
            format: 'G:i:s',
            id:'edTime',
            value:'00:00:00',
            width: 120,
            increment: 10
        },
        '->',
        {
            text: '数据对比分析',
            iconCls: 'refresh',
            tooltip: '查询',
            handler:handlerSaveAction
        }

    ],
    items: [
        weatGrid,
        centerForm,
        eastGrid
    ]

})

function handlerAddAction() {
    var newRecord = rightStore.getData().items

    var record = weatGrid.getSelection()
    var newData = []
    if (newRecord.length>0) {
        for (var i=0;i<newRecord.length;i++) {
            var json = {}
            json['name'] = newRecord[i].data.name
            json['descp'] = newRecord[i].data.descp
            json['units'] = newRecord[i].data.units
            newData.push(json)
        }
    }

    for (var i = 0;i<record.length;i++){
        var flag = 0
        var json = {}
        json['name'] = record[i].data.name
        json['descp'] = record[i].data.descp
        json['units'] = record[i].data.units
        if (newData.length>0){
            for (var j=0;j<newData.length;j++){
                if(json.name ==newData[j].name){
                    flag=1
                    break
                }
            }
        }
        if (flag ==1){
            continue
        }
        else {
            newData.push(json)
        }
    }
    rightStore.loadData(newData)
    weatGrid.getSelectionModel().deselect(record);
}
function handlerDelAction() {
    var record = eastGrid.getSelection()
    Ext.Array.each(record, function(item) {
        rightStore.remove(item);
    });
}
function handlerResetAction(){
    rightStore.removeAll();
}
function handlerSaveAction() {

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
        var record = rightStore.getData().items
        var savaData = []
        for (var i=0;i<record.length;i++){
            savaData.push(record[i].data.name)
        }
        loadPage('./html/DataComparisonCharts.jsp?data=' +savaData + '&st=' + startDate + '&et=' + endDate, '数据对比趋势')
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

function showResult(btn, text) {
    if (btn == 'yes') {
        showToast(Ext.String.format("保存成功"))
    } else {
        showToast(Ext.String.format("放弃修改"))
    }
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
    window.onresize=function(){
        changeDivHeight();
    }
    function changeDivHeight() {
        var width = document.documentElement.clientWidth
        var tableWidth = (width-82)/2
        eastGrid.setWidth(tableWidth)
        weatGrid.setWidth(tableWidth)
    }

});
