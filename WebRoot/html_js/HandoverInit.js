// alert(DWRUtil.toDescriptiveString(values,2));

// user.id
// user.userName
// user.userDesc
// user.password
// user.enabled

DWREngine.setAsync(false);
var unitJsonMap = {}, suiteJsonMap = {}, orderclassJsonMap = {}

function handoverInit(unitId,setsId,teamId,date) {
    HandRecordDao.handShiftInit(unitId,setsId,teamId,date,{
        callback:function (str) {
            if(str == 0){
                showToast('初始化成功')
            }else {
                showToast('数据已经初始化，不执行任何操作')
            }
        }
    });

}

var unitIdData

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

var setsIdData

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

var teamIdData

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

getUnit()
getSuite(unitJsonMap[unitIdData[0][0]])
getTeam()


var unitComob = new Ext.form.ComboBox({
    id: "unitComobF",
    store: unitIdData,
    fieldLabel: '单元号',
    displayField: 'name',
    name: 'unitId',
    valueField: 'name',
    labelWidth:80,
    width:280,
    triggerAction: 'all',
    style: {margin: '10px auto'},
    mode: 'local',
    forceSelection: true,
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

var suiteComob = new Ext.form.ComboBox({
    store: setsIdData,
    style: {margin: '10px auto'},
    id: "suiteComob",
    fieldLabel: '机组号',
    displayField: 'name',
    name: 'setsId',
    labelWidth:80,
    width:280,
    valueField: 'name',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',

})

var userForm = new Ext.FormPanel({
    labelWidth: 80,
    frame: true,
    bodyStyle: 'padding:15px 15px 10px 15px',
    width: window.innerWidth,
    defaults: {width: 590},
    title: '交接班初始化',
    height: window.innerHeight * 0.48,
    defaultType: 'textfield',

    items: [

        {
            xtype: 'datefield',
            id: "stDate",
            name :'date',
            fieldLabel: '开始日期',
            labelWidth:80,
            width:280,
            format: 'Y-m-d',
            value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, +0), "Y-m-d"),style: {margin: '10px auto'},
            listeners: {
                select: function (combo, record, index) {
                    getTeamIdByTime(new Date(this.getValue()),Ext.getCmp('time1').getValue())
                }
            }
        }, {
            xtype: 'timefield',
            id: "stTime",
            name:'time',
            fieldLabel: '开始时间',
            format: 'G:i',
            value:'0:00',
            labelWidth:80,
            width:280,
            increment: 10,
            style: {margin: '10px auto'},
            listeners: {
                select: function (combo, record, index) {
                    getTeamIdByTime(new Date(Ext.getCmp('startDate').getValue()),this.getValue())
                }
            }
        },
        unitComob,
        suiteComob,
        {
            xtype: 'textfield',
            fieldLabel: '班次',
            labelWidth: 80,
            width: 280,
            editable:false,
            id: 'teamField',
            name: 'teamField',
            fieldStyle: {background: '#F0F0F0'},
            style: {margin: '10px auto'}
        }


    ],

    buttonAlign: 'center',
    buttons: [{
        text: '保存',

        handler: function () {
            var postJson = {}
            postJson = userForm.getForm().getValues()

            if(postJson.unitId ==''||postJson.unitId==null){
                showToast('单元不能为空')
                return;
            }
            if(postJson.setsId ==''||postJson.setsId==null){
                showToast('机组不能为空')
                return;
            }
            if(postJson.teamField ==''||postJson.teamField==null){
                showToast('班次不能为空')
                return;
            }
            if(postJson.time ==''||postJson.time ==null){
                showToast('时间不能为空')
                return;
            }
            postJson.unitId = unitJsonMap[postJson.unitId]
            postJson.setsId = suiteJsonMap[postJson.setsId]
            postJson.teamField = orderclassJsonMap[postJson.teamField]
            handoverInit(postJson.unitId,postJson.setsId,postJson.teamField,new Date(Ext.getCmp('stDate').getValue().getTime()+Ext.getCmp('stTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()))
        }
    },]

});

getTeamIdByTime(new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()),'00:00')
function getTeamIdByTime(date,time) {
    HandRecordDao.getTeamIdByTime(date,time,{
        callback:function (str) {
            if(str == 0){
                showToast('当前时间不在排班表中')
            }else {
                Ext.getCmp('teamField').setValue(orderclassJsonMap[str])
            }
        }
    })
}

function showToast(s, title) {
    Ext.toast({
        html: s,
        closable: false,
        width: 400,
        style: {'text-align': 'center'},
        align: 't',
        slideInDuration: 400,
    })
}



// Fires when the document is ready (before onload and before images are loaded).
// Shorthand of Ext.EventManager.onDocumentReady.
Ext.onReady(function () {
    /*
        new Ext.ToolTip({
            target: 'password',
            html: 'A very simple tooltip'
        });

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

        userForm.render('content-panel');
        */


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: userForm
    });

});