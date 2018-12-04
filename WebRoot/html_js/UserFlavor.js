Ext.require(['Ext.ux.SearchField'])
var pageSize = 10;
var myData,roleNameData,userNameData;
var nameArray = new Array();
var value;
DWREngine.setAsync(false);
var userName = 'admin'
var grid
var store
function getAllUserFlavors() {
    UserFlavorDao.getAllUserFlavors(
        {
            callback: function (str) {

                myData = {root: str}
            }
        });
    return myData
}
function saveUserFlavor(data){
    UserFlavorDao.saveUserFlavor(data,{
        callback:function(newUserFlavor) {

            handleRefeshAction()
            showToast('保存记录成功');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( '操作失败，错误信息：' + message); }
    });
}

function deleteUserFlavorByID(id){
    UserFlavorDao.deleteUserFlavorByID(id,{
        callback:function() {

           handleRefeshAction()

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    });

}
Ext.onReady(function () {

    getAllUserFlavors
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id",			mapping:"id", 				type : 'int'},
            {name: "userID",		mapping:"userID", 			type : 'int'},
            {name: "attribute1", 	mapping:"attribute1",    	type : 'string'},
            {name: "attribute2", 	mapping:"attribute2",    	type : 'string'},
            {name: "attribute3", 	mapping:"attribute3",    	type : 'string'},
            {name: "attribute4", 	mapping:"attribute4",    	type : 'string'},
            {name: "attribute5", 	mapping:"attribute5",    	type : 'string'},
            {name: "attribute6", 	mapping:"attribute6",    	type : 'string'}
        ],
        autoLoad: {strat:0,limit: pageSize},
        // data:myData,
        proxy: {
            data:myData,
            reader:{
                type:'json',
                rootProperty:'root',
                // totalProperty:'total',
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
                rootProperty:'root',
                // totalProperty:'total',
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
                rootProperty:'root',
                // totalProperty:'total',
            }
        },
        sortInfo : {
            field : 'roleName',
            direction : 'ASC'
        }

    });

    grid = Ext.create("Ext.grid.Panel", {
        xtype:'grid',
        title: '系统用户定制管理',
        width: window.innerWidth,
        store: store,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel'
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
            clean:{
                iconCls: 'array-grid-add-col',
                text: ' 清空',
                // border:false,
                disabled: false,
                handler:handlerCleanAction
            },
            delete: {
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
            },
        },

        columns: [
            {header: "ID", 		width: 60, sortable: true, dataIndex: 'id', align: 'center',hidden:true},
            {header: "用户ID", 	width: 80, sortable: true, dataIndex: 'userID', align: 'center',hidden:false},
            {header: "定制信息一", 	flex:1, sortable: true, dataIndex: 'attribute1', align: 'left',hidden:false,editor: "textfield"},
            {header: "定制信息二", 	flex:1, sortable: true, dataIndex: 'attribute2', align: 'left',hidden:false,editor: "textfield"},
            {header: "定制信息三", 	flex:1, sortable: true, dataIndex: 'attribute3', align: 'left',hidden:false,editor: "textfield"},
            {header: "定制信息四", 	flex:1, sortable: true, dataIndex: 'attribute4', align: 'left',hidden:false,editor: "textfield"},
            {header: "定制信息五", 	flex:1, sortable: true, dataIndex: 'attribute5', align: 'left',hidden:false,editor: "textfield"},
            {header: "定制信息六", 	flex:1, sortable: true, dataIndex: 'attribute6', align: 'left',hidden:false,editor: "textfield"}
        ],
        loadMask: true,

        bbar: pagingBar,
        tbar: [

            '->',
            '@refesh',
            '@save',
            '@delete',
            '@clean'

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
        slideInDuration:400,
    })
}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0]==null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if(recordData.userID == null || typeof recordData.userID == 'string') {
        showToast('用户ID不正确！');
        return;
    }

    if(!record[0].dirty){
        //record.modified
        showToast('没有信息被修改，不需要保存。');
        return;
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function(btn){

        if (btn != 'yes'){
            return;
        }
        saveUserFlavor(recordData)

    });
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



        if(recordData.id == null){
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if(typeof recordData.id == 'string' && recordData.id.trim() == ''){
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            showToast('操作失败，记录已经被修改，不允许删除。');
            return;
        }

        deleteUserFlavorByID(recordData.id)

    });

}
function handlerCleanAction() {
    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除所有记录?', function(btn){

        if (btn != 'yes'){
            return;
        }

        if(userName == null || userName.trim() == ''){

            UserFlavorDao.deleteAllUserFlavors({
                callback:function() {
                    handleRefeshAction()
                    showToast('删除记录成功！');
                },
                timeout:5000,
                errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
            });

        }
    });

}

function handleRefeshAction() {
    var newData = getAllUserFlavors()

    store.loadData(newData.root)
}


