DWREngine.setAsync(false);
var myData,kpiData,proIdData,reportData
var proJsonMap = {},reportJsonMap ={},suiteJsonMap = {}
var width = document.documentElement.clientWidth
var height = document.documentElement.clientHeight
var tableWidth = (width-80)/2
var marginTop = height/2-60
function getPro() {
    ProfessionDao.getAllProName({
        callback: function (str) {

            for (var i = 0; i < str.length; i++) {
                proJsonMap[str[i][1]] = str[i][0]
                proJsonMap[str[i][0]] = str[i][1]
                proJsonMap['全部'] = 0
                proJsonMap['']= 0
                proJsonMap[null] = 0
                str[i][1] = str[i][0]
            }
            proIdData = str
            var all=[]
            all.push("全部")
            all.push("全部")
            proIdData.unshift(all)
        }
    })

}
var setsIdData

function getSuite(id) {
    SetsDao.getAllSetsName(id,{
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                suiteJsonMap['全部'] = 0
                suiteJsonMap[''] = 0
                suiteJsonMap[null] = 0
                setsIdData[i][1] = setsIdData[i][0]
            }
            var all=[]
            all.push("全部")
            all.push("全部")
            setsIdData.unshift(all)


        }
    })
}

function getAllKpi(proId,sets,name) {
    KpiInfoDao.getByProIdSetsIdName(proId,sets,name,{
        callback:function (str) {
            for (var i=0;i<str.length;i++) {
                str[i].sets = suiteJsonMap[str[i].sets]
            }
            kpiData = {root:str}
        }
    })
    return kpiData
}
function getKpiMapInfoListByReportId(id) {
    ReportKpiDao.getKpiMapInfoListByReportId(id,{
        callback:function (str) {
            myData = {root:str}
        }
    })
    return myData
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
function listSave(id,list){

    ReportKpiDao.listSave(id,list,{
        callback:function() {

            // handleRefeshAction()
            var newData = getKpiMapInfoListByReportId(id)
            rightStore.loadData(newData.root)

            showToast('保存成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( message); }
    })
}
getSuite(0)
getPro()
getReportConfig()
systemData=[['运行绩效','运行绩效'],['运行优化','运行优化'],['性能分析','性能分析']]
var proComboxBox= new Ext.form.ComboBox({
    id:'proComboxBox',
    store: proIdData,
    width: 80,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    emptyText:'专业',
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
    width: 80,
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
    width: 80,
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
    width: 140,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    forceSelection: true,
    editable: false,
    value:reportData[0][0],
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
getKpiMapInfoListByReportId(reportJsonMap[Ext.getCmp('reportComboBox1').getValue()])
var leftTbar =[
    proComboxBox,
    setsIdComboBox1,
    {
        xtype: 'textfield',
        fieldLabel: '名称',
        labelWidth:30,
        width:100,
        name: 'name',
        id:"name"
    },'->',
    {
        text: '查询',
        iconCls: 'refresh',
        tooltip: '查询',
        handler:handlerSearchAction
    }
    ]
var rightTbar =[
    // typeComboBox,
    reportComboBox,
    // setsIdComboBox2,
    '->',
    {
        text: '保存',
        iconCls: 'save',
        tooltip: '保存',
        handler:handlerSaveAction
    }
]
getAllKpi(0,0,'')
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
        {header: "单位", width: 80, sortable: true, dataIndex: 'units', align: 'center',hidden:true}
    ],
    width:tableWidth
})

var eastGrid = new Ext.grid.Panel({
    region: 'east',
    tbar:rightTbar,
    // bbar:rightPagingBar,
    title: '报表指标',
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
    items: [
        weatGrid,
        centerForm,
        eastGrid
    ]

})
function handlerSearchAction(){
    var newData = getAllKpi(proJsonMap[Ext.getCmp('proComboxBox').getValue()],suiteJsonMap[Ext.getCmp('setsIdComboBox1').getValue()],Ext.getCmp('name').getValue())
    leftStore.loadData(newData.root)

}
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

function handlerSaveAction() {
    var record = rightStore.getData().items
    var savaData = []
    for (var i=0;i<record.length;i++){
        savaData.push(record[i].data.name)
    }
    listSave(reportJsonMap[Ext.getCmp('reportComboBox1').getValue()],savaData)

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
