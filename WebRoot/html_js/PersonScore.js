DWREngine.setAsync(false);
var myData,detailData,unitIdData, setsIdData, stationIdData, teamIdData
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}

function getAll(unit, set) {
    PersonScopeDao.getAll(unit,set,{
        callback:function (str) {
            for (var i=0;i<str.length;i++){
                str[i].duration = str[i].duration/60000
                str[i].teamId = positonJsonMap[str[i].teamId]
            }
            myData = str
        }
    })
    return myData
}

function getScoreDetails(unitId,setsId,userName,handId,teamId) {
    PersonScopeDao.getScoreDetails(unitId,setsId,userName,handId,teamId,{
        callback:function (str) {
            detailData = str
        }
    })
    return detailData
    
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

getAll(unitJsonMap[unitIdData[0][0]], suiteJsonMap[setsIdData[0][0]])

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
            var top = getAll(unit, set)
            store.loadData(top)
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
            var top = getAll(unit, set)
            store.loadData(top)
        }
    }
})

var store = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "userName", mapping: "userName", type: 'string'},
        {name: "userDesc", mapping: "userDesc", type: 'string'},
        {name: "teamId", mapping: "teamId", type: 'string'},
        {name: "handId", mapping: "handId", type: 'string'},
        {name: "score", mapping: "score", type: 'float'},
        {name: "duration", mapping: "duration", type: 'float'}
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
var downStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "tagName", mapping: "tagName", type: 'string'},
        {name: "score", mapping: "score", type: 'float'}
    ],
    autoLoad: true,
    data: detailData,
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
var userForm2 = new Ext.FormPanel({
    frame: true,
    layout: 'column',
    region: 'center',
    header: false,
    defaultType: 'textfield',
    bodyStyle:'height:30px',
    width:130,
    labelWidth:50,
    height:60,
    items: [

        {
            width:120,
            height:10,
            id: 'upUserName',
            fieldLabel: '用户名',
            style: 'margin:5px',
            labelWidth:50,
            editable: false,
            fieldStyle: {background: '#F0F0F0'}
        },
        {
            width:120,
            height:10,
            labelWidth:50,
            id: 'upPassWord',
            name: 'takePassWord',
            fieldLabel: '密码',
            inputType: 'password', style: 'margin:5px'
        }

    ]

});

var textShow = {
    xtype:'textfield',
    width:120,
    id: 'score',
    fieldLabel: '小时平均分',
    style: 'margin:5px',
    labelWidth:70,
    editable: false,
    fieldStyle: {background: '#F0F0F0'}
}
var northGrid = new Ext.grid.Panel({

    region: 'west',
    store: store,
    border:true,
    height: window.innerHeight,
    title: '指标考核人员得分',
    columns: [
        {header: "用户名", width: 120, sortable: true, dataIndex: 'userName', align: 'center',hidden:true},
        {header: "姓名", width: 120, sortable: true, dataIndex: 'userDesc', align: 'center'},
        {header: "班次", width: 120, sortable: true, dataIndex: 'teamId', align: 'center',hidden:true},
        {header: "交班ID", width: 80, sortable: true, dataIndex: 'handId', align: 'center',hidden:true},
        {header: "累计得分",  flex: 1, sortable: true, dataIndex: 'score', align: 'center',renderer: formatNumber},
        {header: "当班时长", flex:1, sortable: true, dataIndex: 'duration', align: 'center',renderer: formatNumber},
        {header: "操作", width: 60, sortable: true, dataIndex: 'path', align: 'center', renderer: detailRenderTopic}
    ],
    tbar:['->',unitComob,suiteComob]
})
var centerGrid = new Ext.grid.Panel({
    region: 'center',
    title: '指标考核实时明细',
    // collapsible: true,
    store: downStore,
    border:true,
    height: window.innerHeight,
    columns: [
        {header: "指标名称", flex:1, sortable: true, dataIndex: 'tagName', align: 'center'},
        {header: "得分", flex:1, sortable: true, dataIndex: 'score', align: 'center',renderer: formatNumber}
    ]

})


var panel = new Ext.panel.Panel({
    layout: 'border',
    width: window.innerWidth,
    height: window.innerHeight,
    items: [
        northGrid,
        centerGrid
    ]

})



function detailRenderTopic(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"getDetail(\'{0}\')\">详情</a>', rowIndex);

}
function getDetail(row) {
    var record = northGrid.getStore().getAt(row).data
    delete record.id
    var newData = getScoreDetails(unitJsonMap[unitIdData[0][0]], suiteJsonMap[setsIdData[0][0]],record.userName,record.handId,positonJsonMap[record.teamId])
    downStore.loadData(newData)
    centerGrid.setTitle(record.userDesc+'-指标考核实时明细')
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
    var width = document.documentElement.clientWidth
    northGrid.setWidth(width/2)
    window.onresize=function(){
        changeDivHeight();
    }
    function changeDivHeight() {
        var width = document.documentElement.clientWidth
        northGrid.setWidth(width/2)
    }


});
