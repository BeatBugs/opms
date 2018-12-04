// alert(DWRUtil.toDescriptiveString(values,2));

// user.id
// user.userName
// user.userDesc
// user.password
// user.enabled

DWREngine.setAsync(false);
var autoShift
var unitJsonMap = {}, suiteJsonMap = {}, orderclassJsonMap = {}

function getShift() {
    ShiftModeSetDao.getShiftMode({
        callback:function (str) {
            autoShift=str
            if (autoShift==1){
                states = '手动'
            } else {
                states = '自动'
            }
        }
    })
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
getShift()
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

function getCurrentTeamInfo(unitId, setsId) {
    var teamId
    HandRecordDao.getCurrentTeamInfo(unitId, setsId, {
        callback: function (str) {
            if (str != null && str != '' && str != '{}') {
                teamId = str.teamId
            }
            else teamId = -1
            orderclassJsonMap['-1'] = '暂无班次'
            orderclassJsonMap['暂无班次'] = -1
        }
    })
    return teamId
}

function handShiftMain(json) {
    HandRecordDao.handShiftMain(json, {
        callback: function (str) {
            switch (str) {
                case 1:
                    showToast('交班人员不在系统用户中')
                    break
                case 2:
                    showToast('交班人员输入的密码不正确')
                    break
                case 3:
                    showToast('接班人员不在系统用户中')
                    break
                case 4:
                    showToast('接班人员输入的密码不正确')
                    break
                case 5:
                    showToast('交班人在人员配置表中未注册')
                    break
                case 6:
                    showToast('交班人员不在交班班次里')
                    break
                case 7:
                    showToast('接班人在人员配置表中未注册')
                    break
                case 8:
                    showToast('接班人员不在接班班次里')
                    break
                case 9:
                    showToast('交班人员没有交接班的权限')
                    break
                case 10:
                    showToast('接班人员没有交接班的权限')
                    break
                case 0:
                    showToast('交班成功')
                    Ext.getCmp('handUserName').setValue('')
                    Ext.getCmp('handPassWord').setValue('')
                    Ext.getCmp('takeUserName').setValue('')
                    Ext.getCmp('takePassWord').setValue('')
                    Ext.getCmp('orderComob').setValue('')
                    init()
                    break
            }
        }
    })
}

var orderComobF = new Ext.form.ComboBox({
    id: "orderComobF",
    disabled: true,
    fieldLabel: '交班班次',
    displayField: 'name',
    valueField: 'name',
    name: 'handTeamId',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var unitComobF = new Ext.form.ComboBox({
    id: "unitComobF",
    disabled: true,
    fieldLabel: '单元号',
    displayField: 'name',
    valueField: 'name',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var suiteComobF = new Ext.form.ComboBox({
    id: 'suiteComobF',
    fieldLabel: '机组号',
    disabled: true,
    displayField: 'name',
    valueField: 'name',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var orderComob = new Ext.form.ComboBox({
    id: "orderComob",
    store: teamIdData,
    name: 'teamId',
    disabled:(autoShift?false:true),
    fieldLabel: '接班班次',
    displayField: 'name',
    valueField: 'name',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'

})
var unitComob = new Ext.form.ComboBox({
    id: "unitComob",
    store: unitIdData,
    disabled:(autoShift?false:true),
    fieldLabel: '单元号',
    name: 'unitId',
    displayField: 'name',
    valueField: 'name',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners: {
        select: function (combo, record, index) {
            Ext.getCmp('unitComobF').setValue(this.getValue())
            getSuite(unitJsonMap[this.getValue()])
            Ext.getCmp('suiteComob').getStore().loadData(setsIdData)
            Ext.getCmp('suiteComob').setValue(setsIdData[0][0])
            Ext.getCmp('orderComobF').setValue(orderclassJsonMap[getCurrentTeamInfo(unitJsonMap[this.getValue()], suiteJsonMap[Ext.getCmp('suiteComob').getValue()])])
        }
    }
})
var suiteComob = new Ext.form.ComboBox({
    store: setsIdData,
    id: "suiteComob",
    disabled:(autoShift?false:true),
    fieldLabel: '机组号',
    displayField: 'name',
    name: 'setsId',
    valueField: 'name',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners: {
        select: function (combo, record, index) {
            Ext.getCmp('suiteComobF').setValue(this.getValue())
            Ext.getCmp('orderComobF').setValue(orderclassJsonMap[getCurrentTeamInfo(unitJsonMap[Ext.getCmp('unitComob').getValue()], suiteJsonMap[this.getValue()])])
        }
    }
})

function init() {
    Ext.getCmp('unitComob').setValue(unitIdData[0][0])
    Ext.getCmp('unitComobF').setValue(unitIdData[0][0])
    Ext.getCmp('suiteComob').setValue(setsIdData[0][0])
    Ext.getCmp('suiteComobF').setValue(setsIdData[0][0])
    Ext.getCmp('orderComobF').setValue(orderclassJsonMap[getCurrentTeamInfo(unitJsonMap[unitIdData[0][0]], suiteJsonMap[setsIdData[0][0]])])
}

init()

var userForm = new Ext.FormPanel({
    labelWidth: 80,
    height: 300,
    layout: 'column',
    region: 'north',
    defaults: {
        layout: 'form',
        xtype: 'container',
        defaultType: 'textfield',
        style: 'width: 50%'
    },
    title: '接班记录',
    bodyStyle: 'padding:15px 15px 10px 15px',
    header: {
        itemPosition: 1, // after title before collapse tool
        items: [
            {
                xtype: 'button',
                width: 150,
                text: '交接班:' + states + '(切换)',
                handler: checkHandler
            }
        ]
    },
    items: [
        {
            items: [
                unitComob,
                suiteComob,
                orderComob
            ]
        }, {
            items: [
                {id: 'takeUserName', fieldLabel: '用户名', name: 'takeUserName',disabled:(autoShift?false:true)},
                {
                    id: 'takePassWord', fieldLabel: '密码',disabled:(autoShift?false:true),
                    inputType: 'password', name: 'takePassWord'
                }

            ]
        }
    ],

});

var userForm2 = new Ext.FormPanel({
    labelWidth: 80,
    layout: 'column',
    region: 'center',
    defaults: {
        layout: 'form',
        xtype: 'container',
        defaultType: 'textfield',
        style: 'width: 50%'
    },
    title: '交班记录',
    bodyStyle: 'padding:15px 15px 10px 15px',

    items: [
        {
            items: [
                unitComobF,
                suiteComobF,
                orderComobF
            ]
        }, {
            items: [
                {id: 'handUserName', fieldLabel: '用户名', name: 'handUserName',disabled:(autoShift?false:true)},
                {
                    id: 'handPassWord', fieldLabel: '密码', name: 'handPassWord',disabled:(autoShift?false:true),
                    inputType: 'password'
                }

            ]
        }
    ]

});

var panel = new Ext.FormPanel({
    layout: 'border',
    width: window.innerWidth,
    height: window.innerHeight,
    items: [
        userForm,
        userForm2
    ],
    buttonAlign: 'center',
    buttons: [{
        text: '保存',

        handler: function () {
            if(autoShift==0){
                showToast('自动交接班无法修改')
                return
            }
            var postJson = {}
            postJson = userForm.getForm().getValues()
            postJson['handUserName'] = userForm2.getForm().getValues().handUserName
            postJson['handPassWord'] = userForm2.getForm().getValues().handPassWord
            postJson['handTeamId'] = orderclassJsonMap[Ext.getCmp('orderComobF').getValue()]
            postJson.unitId = unitJsonMap[postJson.unitId]
            postJson.setsId = suiteJsonMap[postJson.setsId]
            postJson.teamId = orderclassJsonMap[postJson.teamId]
            if (postJson.teamId == -1) {
                showToast('暂无班次，无法交接')
                return;
            }
            if (postJson.handTeamId == -1) {
                showToast('暂无班次，无法交接')
                return;
            }
            if (postJson.handUserName == '' || postJson.handPassWord == '' || postJson.takeUserName == '' || postJson.takePassWord == '') {
                showToast("用户名或密码不允许为空")
                return
            }
            handShiftMain(postJson)
        }
    }]
})

function checkHandler() {
    var change,isState
    if (autoShift ==1){
        change ='手动'
        isState=0
    } else {
        change = '自动'
        isState =1
    }
    var check = new Ext.FormPanel({
        width: window.innerWidth,
        height: window.innerHeight,
        title: '切换至-'+ change+'-身份验证',
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',
        items: [
            {
                width:200,
                labelWidth:60,
                id: 'UserName',
                fieldLabel: '用户名',
                style: {margin: '20px 35px'},
                name: 'userName'
            },
            {
                width:200,
                labelWidth:60,
                id: 'PassWord',
                fieldLabel: '密码',
                name: 'passWord',
                style: {margin: '20px 35px'},
                inputType: 'password'
            }
        ]

    })
    var windows = new Ext.window.Window({
        title: '切换交接班方式',
        width: 300,
        height: 300,
        scope: this,
        fn: showResult,
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
                // Ext.getCmp('result').reset();
                states =='手动'
                windows.close()
            }
        }, {
            text: '切换',
            handler: function () {
                var form = check.getForm().getValues()
                ShiftModeSetDao.save(form.userName,form.passWord,isState,{
                    callback: function (str) {
                        switch(str){
                            case 0:
                                showToast('切换成功')
                                location.reload(false)
                                break
                            case 1:
                                showToast('用户不存在')
                                break
                            case 2:
                                showToast('密码错误')
                        }
                    }
                })
            }
        }]
    })
    windows.show()

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


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: panel
    });

});