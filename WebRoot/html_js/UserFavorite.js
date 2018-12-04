
Ext.require(['Ext.ux.SearchField']);
var pageSize = 10;
var myData;
var nameArray = new Array();
var value= 'TITLE';
DWREngine.setAsync(false);
var userName = 'admin';

var store,grid;
//dwr 获取数据
/*
    @param:(查询条件)->TITELE,NAME,PATH
    @param:(查询关键字)->KeyWord
    @param:(用户名)->UserName
 */
function getFavorite(column,keyWord) {
    UserFavoriteDao.getUserFavoritesByColumnAndUsername(column,keyWord, userName,
        {
            callback: function (str) {
                var tempData = [];
                for (var i = 0; i < str.length; i++) {
                    str[i].navTreeNode['userID']=str[i].userID
                    tempData.push(str[i].navTreeNode);
                }
                myData = {root: tempData};
            }
        });
    return myData;
}
//dwr 获取数据
/*
    @param:(用户ID)->userID
    @param:(节点ID)->id
 */
function removeFavorite(userID,nodeID){
    UserFavoriteDao.deleteUserFavoriteByUserIDAndNodeID(userID,nodeID,{
        callback:function() {

            handleRefeshAction();

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( message); }
    });
}

function removeAll(){
    UserFavoriteDao.deleteUserFavoritesByUsername(userName,{
        callback:function() {

            store.removeAll();

            Ext.Msg.alert('提示','删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { Ext.Msg.alert('提示', '操作失败，错误信息：' + message); }
    });
}
//Ext界面初始化
Ext.onReady(function () {

    getFavorite("TITLE",'')
    //建立store以便加载到view容器中
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "userID",	mapping:"userID", 				type : 'int'},
            {name: "id",	mapping:"nodeID", 		type : 'int'},
            {name: "name", 		mapping:"name",    	type : 'string'},
            {name: "title", 	mapping:"title",    type : 'string'},
            {name: "descp", 	mapping:"descp",    type : 'string'},
            {name: "context", 	mapping:"context",  type : 'string'},
            {name: "path", 		mapping:"path",  	type : 'string'},
            {name: "target", 	mapping:"target",   type : 'string'},
            {name: "roles", 	mapping:"roles",  	type : 'string'}
        ],
        autoLoad: {strat:0,limit: pageSize},
        // proxy不再支持dwr方法代理，所以采用原始data加载数据方法
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
        }

    });
    //底部bbar（bottombar）的设置
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
    });

    var onSearch = function(){
        var searchParams = {
            context		: context,
            column 		: getSearchColumn(),
            keyword	    : Ext.getCmp('SearchInput').getRawValue(),
            start		: 0,
            limit		: pageSize

        };
        Ext.getCmp('Grid').store.load({params:searchParams});
    }

    // Search Input
    var searchInput = new Ext.ux.SearchField({
        id	　:'SearchInput',
        value : "",
        width : 230,
        onSearchClick : function() {
            onSearch();
        },
        onSearchCleanClick : function() {
            onSearch();
        }
    });

    //查询menu的创建
    var searchMenu = new Ext.menu.Menu();
    searchMenu.add({
        text: '节点名字',
        value: 'NAME',
        checked: false,
        group: 'searchKey', // set group property to use radiobox group, while use checkbox group ,do not set this property
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '节点标题',
        value: 'TITLE',
        checked: true,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '页面路径',
        value: 'PATH',
        checked: false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    //主要节目，grid
    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'gridpanel',
        title: '我的收藏' +
            '',
        width: window.innerWidth,
        stripeRows: true,
        clicksToEdit: 2,
        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: []
        },
        requires: [
            'Ext.Action'
        ],
        actions: {
            refesh: {
                iconCls: 'array-grid-buy-col',
                text: '刷新',
                disabled: false,
                handler: handleRefeshAction
            },
            del: {
                iconCls: 'array-grid-sell-col',
                text: '删除',
                disabled: false,
                handler:handlerDeleteAction
            },
            clear: {
                iconCls: 'array-grid-sell-col',
                text: '清空',
                disabled: false,
                handler:handlerRemoveAll
            }
        },

        columns: [
            {header: "用户ID", 		width: 60, sortable: true, dataIndex: 'userID', align: 'center',hidden:true},
            {header: "节点ID", 		width: 60, sortable: true, dataIndex: 'id', align: 'center',hidden:true},
            {header: "节点名字", 	flex:1 , sortable: true, dataIndex: 'name', align: 'left',hidden:false},
            {header: "节点标题", 	flex:1, sortable: true, dataIndex: 'title', align: 'left',hidden:false},
            {header: "节点描述", 	flex:1, sortable: true, dataIndex: 'descp', align: 'left',hidden:true},
            {header: "模块名字", 	flex:1, sortable: true, dataIndex: 'context', align: 'center',hidden:true},
            {header: "页面路径", 	flex:1.5, sortable: true, dataIndex: 'path', align: 'left',hidden:false},
            {header: "打开方式", 	width: 60, sortable: true, dataIndex: 'target', align: 'center',hidden:true},
            {header: "打开", 	    width: 60, sortable: true, dataIndex: 'roles', align: 'center',hidden:false,renderer: renderTopic}
        ],
        loadMask: true,

        bbar: pagingBar,
        tbar: [
            {
                xtype:'splitbutton',
                text: '查询',
                destroyMenu: true,
                menu: searchMenu,
                iconCls		: 'query',
            },
            {
                xtype: 'textfield',
                id:'triggerfield',
                triggers: {
                    clearField: {
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        scope: this,
                        handler: function (field, button, e) {
                            Ext.getCmp('triggerfield').setValue("");
                        }
                    },
                    searchField:{
                        cls: Ext.baseCSSPrefix + 'form-search-trigger',
                        scope: this,
                        handler: function (field, button, e) {
                            DWREngine.setAsync(false);
                            var newData = getFavorite(value,Ext.getCmp('triggerfield').getValue());
                            store.loadData(newData.root);
                        }
                    }

                }
            },
            '->',
            '@refesh',
            '@del',
            '@clear'

        ]

    });
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});
function focusSearchInput(item, checked){
    searchInput.focus(100);
    if(checked === true){
        value = item.config.value;
    }
}

//查询选择条件的判断和获取
function　getSearchColumn() {
    var field = '';
    searchMenu.items.each(function(item) {
        if (item.checked) {
            field = item.value;
        }
    });
    return field;
}

//controller 所有按钮的点击方法
function handleRefeshAction() {

    var newData = getFavorite(value,'')

    store.loadData(newData.root);
}

function handlerDeleteAction() {
    var record = grid.getSelection()
    if(record[0]===null){
        showToast("请先选择要删除的数据")
        return 0;
    }
    var recordData = record[0].data
    var userID = recordData['userID'];
    var nodeID = recordData['id'];
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function(btn){

        if (btn !== 'yes'){
            return;
        }
        removeFavorite(userID,nodeID);
    });
}

function handlerRemoveAll() {
    Ext.Msg.confirm('提示', '是否要删除所有记录?', function(btn){

        if (btn !== 'yes'){
            return;
        }
        removeAll();

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
    });
}

//打开模块手动添加
function renderTopic(value, metadata, record, rowIndex, colIndex) {

    var path = record.data.path;

    if (path === null || path === '') {
        return '';
    }
    // var url = '../' + record.data.context + path;
    // if (path.toLowerCase().indexOf("javascript:") != -1) {
    //     url = path;
    // } else if (path.toLowerCase().substr(0, 1) != '/') {
    //     url = '../' + record.data.context + '/' + path;
    // } else if (path.toLowerCase().substr(0, 7) == 'http://' || path.toLowerCase().substr(0, 8) == 'https://') {
    //     url = path;
    // };
    var url;

    url = "../opms"+path;

    return Ext.String.format('<a href=\"#\" onclick=\"top.loadPageWithTarget(\'{0}\',\'{1}\',\'{2}\',\'{3}\')\">打开</a>', url, record.data.title, record.data.target,record.data.name);
}


function formatTarget(target) {

    if (target === null) {
        return '';
    }

    if (target === '') {
        return '';
    } else if (target === '_top') {
        return '顶窗口';
    } else if (target === '_blank') {
        return '空窗口';
    } else if (target === '_new') {
        return '新窗口';
    } else {
        return target;
    }

}
