
var pageSize = 10;
var myData,roleNameData,userNameData;
var nameArray = new Array();
var value;
DWREngine.setAsync(false);
var userName = 'admin'
var grid
var store
function getAllUserRole() {
    UserRoleInfoDao.getAllUserRoleInfos(
        {
            callback: function (str) {

                myData = {root: str}
            }
        });
    return myData
}
function getAllUserName(){
    UserRoleInfoDao.getAllUsernames(
        {
            callback: function (str) {
                userNameData = [].concat(str)
                for (var i =0 ;i<userNameData.length;i++){
                    userNameData[i].push(userNameData[i][0])
                }
            }
        });
}
function getAllroleName(){
    UserRoleInfoDao.getAllRolenames(
    {
        callback: function (str) {

            roleNameData  = [].concat(str)
            for (var i =0 ;i<roleNameData.length;i++){
                roleNameData[i].push(roleNameData[i][0])
            }
        }
    });
}
function saveUserRole(data){
    UserRoleInfoDao.saveUserRoleInfo(data,{
        callback:function (str) {
            showToast('保存记录成功');
            handleRefeshAction()

        },
        timeout:5000,
        errorHandler:function(message) { showToast(message); }
    });
}

function deleteUserRole(userName,roleName){
    UserRoleInfoDao.deleteUserRoleByName(userName,roleName,{
        callback:function() {

            handleRefeshAction()

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast(message); }
    });

}
Ext.onReady(function () {

    getAllUserRole()
    getAllUserName()
    getAllroleName()
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "userID",		mapping:"userID", 		type : 'int'},
            {name: "userName", 		mapping:"userName",   	type : 'string'},
            {name: "userDesc", 		mapping:"userDesc",  	type : 'string'},
            {name: "roleID",		mapping:"roleID", 		type : 'int'},
            {name: "roleName", 		mapping:"roleName",   	type : 'string'},
            {name: "roleDesc", 		mapping:"roleDesc",  	type : 'string'}
        ],
        autoLoad: {strat:0,limit: pageSize},
        proxy: {
            data:myData,
            reader:{
                type:'json',
                rootProperty:'root'
            }
        },
        pageSize: pageSize,
        sorters: {
            property: 'name',
            direction: 'ASC'
        },

    });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
    });
    var userNameStore = new Ext.data.ArrayStore({
        proxy:{
            data:userNameData,
            reader:{
                type:'json',
                rootProperty:'root'

            }
        },
        sortInfo : {
            field : 'userName',
            direction : 'ASC'
        }

    });


    var roleNameStore = new Ext.data.ArrayStore({
        proxy:{
            data:roleNameData,
            reader:{
                type:'json',
                rootProperty:'root'
            }
        },
        sortInfo : {
            field : 'roleName',
            direction : 'ASC'
        }

    });

    grid = Ext.create("Ext.grid.Panel", {
        xtype:'grid',
        title: '系统用户角色管理',
        width: window.innerWidth,
        store: store,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],
        selModel:'cellmodel',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        actions: {
            refesh: {
                iconCls: 'array-grid-buy-col',
                text: '刷新',
                // border:false,
                disabled: false,
                handler: handleRefeshAction  // see Controller
            },
            add:{
                iconCls: 'array-grid-add-col',
                text: '增加',
                // border:false,
                disabled: false,
                handler:handlerInsertAction
            },
            del: {
                iconCls: 'array-grid-sell-col',
                text: '删除',
                disabled: false,
                handler:handlerDeleteAction
            },
            save: {
                iconCls: 'array-grid-sell-col',
                text: '保存',
                disabled: false,
                handler:handlerSaveAction
            }
        },

        columns: [
            {header: "用户ID", 		width: 60, sortable: true,  dataIndex: 'userID', align: 'center',hidden:false},
            {header: "英文用户名", flex:1, sortable: true, dataIndex: 'userName', align: 'center',
                editor:{
                    xtype: 'combo',
                    typeAhead: true,
                    triggerAction: 'all',
                    store:userNameData}
                    },
            {header: "中文用户名", 	flex:1, sortable: true, dataIndex: 'userDesc', align: 'center'},
            {header: "角色ID", 		width: 60, sortable: true,  dataIndex: 'roleID', align: 'center',hidden:true},
            {header: "英文角色名", 	flex:1, sortable: true,  dataIndex: 'roleName', align: 'center',
                editor:{
                    xtype: 'combo',
                    typeAhead: true,
                    triggerAction: 'all',
                    store:roleNameData}
                    },
            {header: "中文角色名", 	flex:1, sortable: true,  dataIndex: 'roleDesc', align: 'center'}
        ],
        loadMask: true,

        bbar: pagingBar,
        tbar: [

            '->',
            '@refesh',
            '@add',
            '@save',
            '@del'

        ]

    });
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});
function showToast(s,title){
    Ext.toast({
        html:s,
        closable:false,
        width:400,
        style:{'text-align':'center'},
        align:'t',
        slideInDuration:400
    })
}
function handlerInsertAction() {
    var record = {
        userID	  	: '',
        userName	: '',
        userDesc	: '',
        roleID	  	: '',
        roleName	: '',
        roleDesc	: ''
    };

    store.insert(0, record);

}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0]==null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData.roleName ==''||recordData.roleName==null){
        showToast('英文角色名不为空')
        return
    }
    if (recordData.userName ==''||recordData.userName==null){
        showToast('英文用户名不为空')
        return
    }
    saveUserRole(recordData)
}
function handlerDeleteAction(){

    var record = grid.getSelection();

    if (record[0]==null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data

    Ext.Msg.confirm('提示', '是否要删除一条记录?', function(btn){

        if (btn != 'yes'){
            return;
        }


        if(recordData.userID == null || recordData.roleID == null){
            store.remove(record);
            return;
        }

        if( recordData.userID == '' ||  recordData.roleID == '' ){
            store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteUserRole(recordData.userName,recordData.roleName)

    });

}

function handleRefeshAction() {
    var newData = getAllUserRole()

    store.loadData(newData.root)
}


