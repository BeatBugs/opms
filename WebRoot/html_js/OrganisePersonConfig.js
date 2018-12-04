
DWREngine.setAsync(false);
var myData,treeData,node=0,orgData,UserData
var orgJsonMap={}

function getTree() {
    OrganiseDao.getTree(true,{
        callback:function (str) {

            treeData =str
        }
    })
    return treeData
}

function getUser(id){
    UserDao.getUserByOrgid(id,{
        callback:function (str) {

            if(str == null ||str==''||str == undefined)
            {
                myData = []
            }else {
                for (var i=0;i<str.length;i++){
                    str[i].orgId = orgJsonMap[str[i].orgId]
                }
                myData = str
            }
        }
    })
    return myData
}

function saveUserById(id,orgId) {
    UserDao.updateOrgIdById(id,orgId,{
        callback:function (str) {
            handleRefeshAction()

            showToast('保存记录成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}

function getAllUser() {
    UserDao.getUserByOrgid(-1,{
        callback:function (str) {

            if(str == null ||str==''||str == undefined)
            {
                UserData = []
            }else {
                UserData = str
            }
        }
    })
    return UserData
}

function getOrgData() {
    OrganiseDao.getAllOrganiseName({
        callback: function (str) {
            orgData = str
            for (var i = 0; i < orgData.length; i++) {
                orgJsonMap[str[i][1]] = str[i][0]
                orgJsonMap[str[i][0]] = str[i][1]
                orgData[i][1] = orgData[i][0]
            }
            orgJsonMap[-1] = '无部门'

        }
    })
}

function sava(pro){
    OrganiseDao.save(pro,{
        callback:function (str) {
            handleRefeshAction();

            showToast('保存成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
getOrgData()
getTree()
getUser(0)

var orgComob = new Ext.form.ComboBox({
    store: orgData,
    id: "orgComob",
    displayField: 'name',
    valueField: 'name',
    width:150,
    labelWidth:50,
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: 'margin:5px',
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
})
var treeStore = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true,
        children: []
    },
    data: treeData,
    autoLoad:true

});
var rightStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "id", mapping: "id", type: 'string'},
        {name: "userName", mapping: "userName", type: 'string'},
        {name: "userDesc", mapping: "userDesc", type: 'string'},
        {name: "enabled", mapping: "enabled", type: 'boolean'},
        {name: "orgId", mapping: "orgId", type: 'string'}

    ],
    autoLoad:true,
    data:myData,
    proxy: {
        reader: {
            type: 'json',
            rootProperty: 'root',
            totalProperty: 'total'
        }
    },
    sorters: {
        property: 'sort',
        direction: 'ASC'
    },

});
var grid = new Ext.grid.Panel({
    header:false,
    region: 'center',
    border: 'solid',
    store: rightStore,
    layout: 'fit',
    selModel: {
        type: 'checkboxmodel',
        mode: 'SINGLE'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 2
    },

    tbar:[
        {
            text: '新增',
            iconCls: 'refresh',
            tooltip: '增加',
            handler: handlerInsertAction

        }, {
            text: '保存',
            iconCls: 'refresh',
            tooltip: '保存表格',
            handler: handlerSaveAction
        },{
            text: '删除',
            iconCls: 'refresh',
            tooltip: '删除表格',
            handler: handleDeleteAction
        }
    ],
    columnLines: true,
    columns: [
        {header: "ID", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
        {header: "用户名", flex: 1, dataIndex: "userName", sortable: true, align: 'center'},
        {header: "中文名", flex: 1, dataIndex: "userDesc", sortable: true, align: 'center'},
        {header: "所属部门", flex: 1, dataIndex: "orgId", sortable: true, align: 'center',editor: orgComob},
        {header: "是否启用", flex: 1, dataIndex: "enabled", sortable: true, align: 'center',renderer:formatBoolean}
    ],
    height: window.innerHeight

})


var treePanel = Ext.create('Ext.tree.Panel', {
    height: window.innerHeight,
    title: '组织机构',
    border: 'solid',
    width: 200,
    region: 'west',
    titleCollapse: true,
    bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
    store: treeStore,
    rootVisible: false,
    listeners: {
        itemclick: function (e, r) {
            node = r.data.id
            var newData=getUser(node)
            rightStore.loadData(newData)
        }
    }
})


var panel = new Ext.panel.Panel({
    layout: 'border',
    title:'组织机构人员维护',
    width: window.innerWidth,
    height: window.innerHeight,
    items: [
        treePanel,
        grid
    ],

})
function formatBoolean(flag) {

    if (flag==true) {
        return '启用'
    } else {
        return '不启用'
    }
}
function handleDeleteAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    Ext.Msg.confirm('提示', '是否要将'+recordData.userDesc+'移出该部门?', function (btn) {

        if (btn !== 'yes') {
            return 0;
        }

        saveUserById(recordData.id,-1);
    });
}
function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] === -1) {
        recordData['id'] = '';
    }


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要对'+recordData.userDesc+'的部门进行修改?', function (btn) {

        if (btn !== 'yes') {
            return;
        }
        saveUserById(recordData.id,orgJsonMap[recordData.orgId]);
    });
}

function handlerInsertAction() {
    getAllUser()
    allUserStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: 'id', mapping: 'id', type: 'int'},
            {name: 'userName', mapping: 'userName', type: 'string'},
            {name: 'userDesc', mapping: 'userDesc', type: 'string'}
        ],
        data: UserData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        },
        sorters: {
            property: 'sort',
            direction: 'ASC'
        },

    });
    centerGrid = new Ext.grid.Panel({
        title: '待选人员列表',
        region: 'center',
        border: 'solid',
        store: allUserStore,
        layout: 'fit',
        selModel: {
            type: 'checkboxmodel',
            mode: 'SINGLE'
        },

        columnLines: true,
        columns: [
            {header: "用户ID", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "用户名", flex: 1, dataIndex: "userName", sortable: true, align: 'center'},
            {header: "姓名", flex: 1, dataIndex: "userDesc", sortable: true, align: 'center'}
        ],
        height: window.innerHeight,

        tbar: ['->', {
            text: '添加',
            iconCls: 'add',
            tooltip: '添加',
            handler: handlePersonAddAction
        }]
    })
    rolesWindow = new Ext.Window({
        title: '新增',
        width: 400,
        height: 600,
        layout: 'border',
        resizable: true,
        autoHeight: true,
        frame: true,
        border: true,
        modal: true,
        closable: true,
        closeAction: 'destroy',
        maximizable: true,
        constrain: true,
        plain: false,
        items: [

            centerGrid

        ]
    })
    rolesWindow.show()

}
function handlePersonAddAction() {
    var record = centerGrid.getSelection()
    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }

    if(node ==0){
        node=-1
    }


    var org = orgJsonMap[node]

    var recordData = record[0].data
    recordData.orgId = node
    Ext.Msg.confirm('提示', '是否要将'+recordData.userDesc+'添加到该部门?', function (btn) {

        if (btn !== 'yes') {
            return 0;
        }

        saveUserById(recordData.id,recordData.orgId);
    });
    rolesWindow.destroy()
}
function handleRefeshAction() {

    var newData = getUser(node)
    rightStore.loadData(newData);
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
