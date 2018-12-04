
DWREngine.setAsync(false);
var upData,downData,unitIdData,setsIdData,stationIdData,teamIdData
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {},orderclassJsonMap = {}
function getTop(unit,set) {
    HangRecordDao.getByUnitSets(unit,set,{
        callback:function (str) {
            for (var i = 0; i < str.length; i++) {
                str[i].unitId = unitJsonMap[str[i].unitId]
                str[i].setsId = suiteJsonMap[str[i].setsId]
                str[i].stationId = positonJsonMap[str[i].stationId]
                str[i].teamId = orderclassJsonMap[str[i].teamId]
                str[i].newStationId = positonJsonMap[str[i].newStationId]
            }
            downData ={root:str}
        }
    })
    return downData
}
function getBottom(unit,set) {
    HangRecordDao.getBottomByUnitSets(unit,set,{
        callback:function (str) {
            if (str==null||str ==''){
                str = []
            }else {
                for (var i = 0; i < str.length; i++) {
                    str[i].unitId = unitJsonMap[str[i].unitId]
                    str[i].setsId = suiteJsonMap[str[i].setsId]
                    str[i].teamId = orderclassJsonMap[str[i].teamId]
                    str[i].stationId = positonJsonMap[str[i].stationId]
                    // str[i].newStationId = positonJsonMap[str[i].newStationId]
                }
            }
            upData ={root:str}
        }
    })
    return upData
}

function handAndTake(json) {
    HangRecordDao.handAndTake(json,{
        callback:function (str) {
            showToast(str)
            if (str=='交接盘成功') {
                var downData = getTop(unitJsonMap[unitIdData[0][0]],suiteJsonMap[setsIdData[0][0]])
                var topData = getBottom(unitJsonMap[unitIdData[0][0]],suiteJsonMap[setsIdData[0][0]])
                downStore.loadData(downData.root)
                upStore.loadData(topData.root)
                Ext.getCmp('downUserName').setValue('')
                Ext.getCmp('post1').setValue('')
                Ext.getCmp('downPost').setValue('')
                Ext.getCmp('downPassWord').setValue('')
                Ext.getCmp('upPassWord').setValue('')
                Ext.getCmp('upPost').setValue('')
                Ext.getCmp('unitId').setValue('')
                Ext.getCmp('setsId').setValue('')
                Ext.getCmp('upUserName').setValue('')
                Ext.getCmp('post2').setValue('')
            }
        }
    })
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

getTop(unitJsonMap[unitIdData[0][0]],suiteJsonMap[setsIdData[0][0]])
getBottom(unitJsonMap[unitIdData[0][0]],suiteJsonMap[setsIdData[0][0]])

var suiteComob = new Ext.form.ComboBox({
    store: setsIdData,
    id: "suiteComob",
    fieldLabel: '机组号',
    displayField: 'name',
    valueField: 'name',
    width:150,
    labelWidth:50,
    value:setsIdData[0][0],
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners:{
        select: function(combo, record, index) {
            var set = suiteJsonMap[this.getValue()]
            var unit = unitJsonMap[Ext.getCmp('unitComob').getValue()]
            var top = getTop(unit,set)
            var bottom = getBottom(unit,set)
            downStore.loadData(top.root)
            upStore.loadData(bottom.root)
        }
    }
})
var unitComob = new Ext.form.ComboBox({
    store: unitIdData,
    id: "unitComob",
    fieldLabel: '单元号',
    displayField: 'name',
    valueField: 'name',
    width:150,
    labelWidth:50,
    value:unitIdData[0][0],
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small',
    listeners:{
        select: function(combo, record, index) {
            getSuite(unitJsonMap[this.getValue()])
            Ext.getCmp('suiteComob').getStore().loadData(setsIdData)
            Ext.getCmp('suiteComob').setValue(setsIdData[0][0])
            var set = suiteJsonMap[Ext.getCmp('suiteComob').getValue()]
            var unit = unitJsonMap[this.getValue()]
            var top = getTop(unit,set)
            var bottom = getBottom(unit,set)
            downStore.loadData(top.root)
            upStore.loadData(bottom.root)
        }
    }
})

var upStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "id", mapping: "id", type: 'string'},
        {name: "usercode", mapping: "usercode", type: 'string'},
        {name: "username", mapping: "username", type: 'string'},
        {name: "unitId", mapping: "unitId", type: 'string'},
        {name: "setsId", mapping: "setsId", type: 'string'},
        {name: "teamId", mapping: "teamId", type: 'string'},
        {name: "stationId", mapping: "stationId", type: 'string'},
        {name: "newStationId", mapping: "newStationId", type: 'string'}
    ],
    autoLoad:true,
    data: upData,
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
var downStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "id", mapping: "id", type: 'string'},
        {name: "handId", mapping: "handId", type: 'string'},
        {name: "userName", mapping: "userName", type: 'string'},
        {name: "userDesc", mapping: "userDesc", type: 'string'},
        {name: "unitId", mapping: "unitId", type: 'string'},
        {name: "setsId", mapping: "setsId", type: 'string'},
        {name: "teamId", mapping: "teamId", type: 'string'},
        {name: "stationId", mapping: "stationId", type: 'string'},
        {name: "newStationId", mapping: "newStationId", type: 'string'}
    ],
    autoLoad:true,
    data: downData,
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
var northGrid = new Ext.grid.Panel({
    region: 'north',
    store:downStore,
    witdh: window.innerWidth ,
    title:'下盘人员',
    columns:[
        {header: "用户id", width: 80, sortable: true, dataIndex: 'id', align: 'center', hidden: true},
        {header: "交班id", width: 80, sortable: true, dataIndex: 'handId', align: 'center', hidden: true},
        {header: "用户名", flex: 1, sortable: true, dataIndex: 'userName', align: 'center'},
        {header: "姓名", flex: 1, sortable: true, dataIndex: 'userDesc', align: 'center'},
        {header: "单元", width: 120, sortable: true, dataIndex: 'unitId', align: 'center'},
        {header: "机组", width: 120, sortable: true, dataIndex: 'setsId', align: 'center'},
        {header: "班次",  width: 120, sortable: true, dataIndex: 'teamId', align: 'center'},
        {header: "岗位",  width: 80,  sortable: true, dataIndex: 'stationId', align: 'center'},
        {header: "新岗位",  width: 80,  sortable: true, dataIndex: 'newStationId', align: 'center', hidden: true},
        {header: "操作", flex: 1, sortable: true, dataIndex: 'path', align: 'center',renderer:downRenderTopic}
    ],
    tbar:['->',unitComob,suiteComob],
    height: 300
})
var centerGrid = new Ext.grid.Panel({
    region: 'center',
    title:'上盘人员',
    store:upStore,
    witdh: window.innerWidth ,
    columns:[
        {header: "用户id", width: 80, sortable: true, dataIndex: 'id', align: 'center', hidden: true},
        // {header: "交班id", width: 80, sortable: true, dataIndex: 'handId', align: 'center', hidden: true},
        {header: "用户名", flex: 1, sortable: true, dataIndex: 'usercode', align: 'center'},
        {header: "姓名", flex: 1, sortable: true, dataIndex: 'username', align: 'center'},
        {header: "单元", width: 120, sortable: true, dataIndex: 'unitId', align: 'center'},
        {header: "机组", width: 120, sortable: true, dataIndex: 'setsId', align: 'center'},
        {header: "班次",  width: 120, sortable: true, dataIndex: 'teamId', align: 'center'},
        {header: "岗位",  width: 80,  sortable: true, dataIndex: 'stationId', align: 'center'},
        // {header: "新岗位id",  width: 80,  sortable: true, dataIndex: 'newStationId', align: 'center', hidden: true},
        {header: "操作", flex: 1, sortable: true, dataIndex: 'path', align: 'center',renderer:upRenderTopic}
    ],
})

var grid = new Ext.panel.Panel({
    region: 'center',
    layout:'border',
    header:false,
    height: window.innerHeight,
    items:[
        northGrid,
        centerGrid
    ],

})
var userForm = new Ext.FormPanel({
    labelWidth: 80,
    frame: true,
    layout: 'column',
    region: 'north',
    title: '下盘人员',
    bodyStyle: 'padding:15px 15px 10px 15px',
    height:300,
    defaultType: 'textfield',

    items: [
        {id:'downUserName',name:'handUserName',fieldLabel: '用户名',style: 'margin:5px',editable:false,fieldStyle: {background: '#F0F0F0'}},
        {   id:'downPassWord',
            name:'handPassWord',
            fieldLabel: '密码',
            inputType: 'password',
            style: 'margin:5px'
        },
        {   id:'post1',
            name:'commonStationId',
            editable:false,
            fieldLabel: '当前岗位',
            fieldStyle: {background: '#F0F0F0'},
            style: 'margin:5px'},
        {
            id:'downPost',
            name:'handStationId',
            editable:false,
            fieldLabel: '下盘岗位',
            fieldStyle: {background: '#F0F0F0'},
            style: 'margin:5px'
        },
        {
            id: 'unitId',
            editable: false,
            name: 'unitId',
            fieldLabel: '单元',
            hidden:true,
            style: 'margin:5px'
        },
        {
            id: 'setsId',
            editable: false,
            name: 'setsId',
            fieldLabel: '机组',
            hidden:true,
            style: 'margin:5px'
        }


    ]

});


var userForm2 = new Ext.FormPanel({
        labelWidth: 80,
        frame: true,
        layout: 'column',
        region: 'center',

        title: '上盘人员',
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',

        items: [

            {id:'upUserName',name:'takeUserName',fieldLabel: '用户名',style: 'margin:5px',editable:false,fieldStyle: {background: '#F0F0F0'}},
            {
                id:'upPassWord',
                name:'takePassWord',
                fieldLabel: '密码',
                inputType: 'password',style: 'margin:5px'
            },
            {id:'post2',name:'takeStationId',fieldLabel: '当前岗位',style: 'margin:5px',editable:false,fieldStyle: {background: '#F0F0F0'}},
            {
                id:'upPost',
                editable:false,
                name:'commonStationId',
                fieldLabel: '上盘岗位',
                style: 'margin:5px',
                fieldStyle: {background: '#F0F0F0'}
            },
        ]

    });
var formMain = new Ext.FormPanel({
    layout: 'border',
    region: 'east',
    width: 320,
    height: window.innerHeight,
    items: [
        userForm,
        userForm2
    ],
    buttonAlign: 'center',
    buttons: [{
        text: '提交',

        handler: function () {
            var json = {}
            json = userForm.getValues()
            var value = userForm2.getValues()
            json['takeUserName'] = value.takeUserName
            json['takePassWord'] = value.takePassWord
            json['takeStationId'] = positonJsonMap[value.takeStationId]
            json.setsId = suiteJsonMap[json.setsId]
            json.unitId = unitJsonMap[json.unitId]
            json.handStationId = positonJsonMap[json.handStationId]
            json.commonStationId = positonJsonMap[json.commonStationId]
            if (json.takeUserName==''||json.takeUserName==null||json.handUserName==''||json.handUserName==null){
                showToast('用户不能为空')
                return
            }else {
                handAndTake(json)
            }
        }
    },]
})

var panel = new Ext.panel.Panel({
    layout: 'border',
    width: window.innerWidth,
    height: window.innerHeight,
    items: [
        grid,
        formMain
    ],

})

function upRenderTopic(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"upDish(\'{0}\')\">上盘</a>',rowIndex);

}
function downRenderTopic(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"downDish(\'{0}\')\">下盘</a>',rowIndex);

}
function upDish(row) {
    var record = centerGrid.getStore().getAt(row).data
    Ext.getCmp('upUserName').setValue(record.usercode)
    Ext.getCmp('post2').setValue(record.stationId)


}
function downDish(row) {

    var record = northGrid.getStore().getAt(row).data
    Ext.getCmp('downUserName').setValue(record.userName)
    Ext.getCmp('post1').setValue(record.stationId)
    Ext.getCmp('downPost').setValue(record.newStationId)
    Ext.getCmp('upPost').setValue(record.stationId)
    Ext.getCmp('unitId').setValue(record.unitId)
    Ext.getCmp('setsId').setValue(record.setsId)
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

});
