
var pageSize = 10;
var myData;
var nameArray = new Array();
var value;
DWREngine.setAsync(false);
var userName = 'admin'

var store,grid
function getAllUser() {
    UserDao.getAllUsers(
        {
            callback: function (str) {

                myData = {root: str}
            }
        });
    return myData
}
function saveUser(user){
    UserDao.saveUser(user,{
        callback:function() {
            showToast('保存记录成功');
            handleRefeshAction()
        },
        timeout:5000,
        errorHandler:function(message) { showToast(message); }
    });
}
function deleteUser(id){
    UserDao.deleteUserByID(id,{
        callback:function() {

            handleRefeshAction()

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( message); }
    });
}
Ext.onReady(function () {

    getAllUser()
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: 'id',		mapping: 'id', 		  type : 'int'},
            {name: 'userName', 	mapping: 'userName',  type : 'string'},
            {name: 'userDesc', 	mapping: 'userDesc',  type : 'string'},
            {name: 'password', 	mapping: 'password' , type : 'string'},
            {name: 'enabled', 	mapping: 'enabled',   type : 'boolean'}
        ],
        autoLoad: {strat:0,limit: pageSize},
        // data:myData,
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


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'gridpanel',
        title: '系统用户管理',
        width: window.innerWidth,
        stripeRows: true,
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
        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: []
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
                handler:handlerInsertHandler
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
            },
        },

        columns: [
            {header: 'ID',     width: 60, sortable: true,   dataIndex: 'id' , align: 'center',hidden:false},
            {header: '英文名字', flex:1, sortable: true,  dataIndex: 'userName', align: 'center', editor: 'textfield'},
            {header: '中文名字',flex:1, sortable: true,   dataIndex: 'userDesc', align: 'center', editor: 'textfield'},
            {header: '用户密码', flex:1, sortable: false, dataIndex: 'password', align: 'center', editor: 'textfield'},
            checkColumn
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

var checkColumn = new Ext.grid.column.Check({
    header		: '是否启用',
    dataIndex	: 'enabled',
    align		: 'center',
    sortable		: true,
    // locked		: true,
    width		: 80
});

function handleRefeshAction() {
    var newData = getAllUser()
    store.loadData(newData.root)
}

function handlerSaveAction() {
    var record = grid.getSelection();
    if (!record[0]) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data;
    if (recordData['id']==-1) {
        recordData['id'] = ''
    }
    if(recordData.userName == null ||recordData.userName == ''){
        showToast('英文名字不能为空！');
        return;
    }
    if(recordData.userDesc == null ||recordData.userDesc == '' ){
        showToast('中文名字不能为空！');
        return;
    }
    if(!record[0].dirty){
        showToast('没有信息被修改，不需要保存。');
        return;
    }
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function(btn){

        if (btn != 'yes'){
            return;
        }
        saveUser(recordData)

    });
}

function handlerInsertHandler(){
    var record = {
        id		  	: -1,
        userName	: '',
        userDesc	: '',
        password	: '',
        enabled		: true
    };
    store.insert(0, record);
}

function handlerDeleteAction() {
    var record = grid.getSelection();
    if (!record[0]) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data;
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function(btn){

        if (btn != 'yes'){
            return;
        }

        if(recordData.id == null ||  recordData.id == ''){
            store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            showToast('操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteUser(recordData.id)

    });
}

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