document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData;
var nameArray = new Array();
var value='TITLE';
var store
DWREngine.setAsync(false);
NavTreeNodeService.getTopNavTreeNamesByContext("opms",
    {
        callback: function (str) {
            nameArray = [].concat(str);

        }

    })
function getTreeNode(column,keyWords) {
    NavTreeNodeService.searchNavTreeNodes("opms", column, keyWords, 0, 80,localStorage['config'],
        {
            callback: function (str) {
                myData = str;

            }

        });
    return myData;
}
Ext.onReady(function () {

    getTreeNode('name','')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", align: 'center', type: 'int'},
            {name: "name", mapping: "name", align: 'center', type: 'string'},
            {name: "title", mapping: "title", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "context", mapping: "context", type: 'string'},
            {name: "path", mapping: "path", type: 'string'},
            {name: "target", mapping: "target", type: 'string'},
            {name: "roles", mapping: "roles", type: 'string'}
        ],
        autoLoad: {strat:0,limit: pageSize},
        data:myData,
        proxy: {
            reader: {
                type:'json',
                rootProperty: 'root',
                totalProperty: 'total',

            }
        },
        pageSize: pageSize,
        sorters: {
            property: 'name',
            direction: 'ASC'
        }

    });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
    });
    function　getSearchColumn() {
        var field = '';
        searchMenu.items.each(function(item) {
            if (item.checked) {
                field = item.value;
            }
        });
        return field;
    }
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

    function focusSearchInput(item, checked){
        searchInput.focus(100);
        if(checked === true){
            value = item.config.value;
        }
    }


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


    var grid = Ext.create("Ext.grid.Panel", {
        xtype: 'gridpanel',
        title: '导航节点查询',
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
            'Ext.Action',
            'Ext.ux.SearchField'
        ],
        actions: {
            refresh: {
                iconCls: 'array-grid-buy-col',
                text: '刷新',
                // border:false,
                disabled: false,
                handler: handleRefeshAction  // see Controller
            }
        },
        columns: [
            {header: "ID", width: 80, sortable: true, dataIndex: 'id', hidden: true},
            {header: "节点名字", flex: 1, sortable: true, dataIndex: 'name'},
            {header: "节点标题", flex: 1, sortable: true, dataIndex: 'title'},
            {header: "节点描述", width: 150, sortable: true, dataIndex: 'descp', align: 'left', hidden: true},
            {header: "模块名字", width: 140, sortable: true, dataIndex: 'context', align: 'left', hidden: true},
            {header: "页面路径", flex: 1, sortable: true, dataIndex: 'path', align: 'left'},
            {
                header: "打开方式",
                width: 80,
                sortable: true,
                dataIndex: 'target',
                align: 'left',
                renderer: formatTarget,
                hidden: true
            },
            {header: "打开", width: 60, sortable: true, dataIndex: 'roles', align: 'center', renderer:renderTopic }
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
                xtype: 'triggerfield',
                id:'triggerfield',
                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                onTrigger1Click:function (btn) {
                   Ext.getCmp('triggerfield').setValue("")

                },
                onTrigger2Click:function (btn) {
                    DWREngine.setAsync(false);
                    var newData = getTreeNode(value,Ext.getCmp('triggerfield').getValue());
                    store.loadData(newData.root);
                }
            },
            '->',
            '@refresh'

        ]

    });
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});
function handleRefeshAction() {
    var newData= getTreeNode(value,'');
    store.loadData(newData.root);
}
function renderTopic(value, metadata, record, rowIndex, colIndex) {

    var path = record.data.path;

    if (path === null || path === '') {
        return '';
    }
    var url;
    if(path==='/navtree/UserFavorite.jsp'){
        url = './html/UserFavorite.html';
    }else if(path==='/navtree/TreeNodeSearch.jsp'){
        url = './html/TreeNodeSearch.html';
    }else if(path==='/auth/UserPass.jsp'){
        url = './html/UserPass.html';
    }else if(path==='/auth/User.jsp'){
        url = './html/User.html';
    }else if(path==='/auth/UserRole.jsp') {
        url = './html/UserRole.html';
    }else if(path==='/duty/DutyTable.jsp?admin=false'){
        url = './html/DutyTable.jsp?admin=false';
    }else if(path==='/duty/DutyTime.jsp?admin=false'){
        url = './html/DutyTime.jsp?admin=false';
    }else if(path==='/auth/Role.jsp'){
        url = './html/Role.html';
    }else if(path==="/auth/UserFlavor.jsp?manage=true"){
        url = './html/UserFlavor.html';
    }else if(path==='/duty/DutyTable.jsp?admin=true'){
        url = './html/DutyTable.jsp?admin=true';
    }else if(path==='/duty/DutyTime.jsp?admin=true'){
        url = './html/DutyTime.jsp?admin=true'
    }else if(path==='/manual/ManualTagData.jsp'){
        url = './html/ManualTagData.html';
    }else if(path==='/tag/TagInfo.jsp'){
        url = './html/TagInfo.jsp';
    }else if(path==='/tag/TagInfo.jsp?column=TYPE&keyword=C'){
        url = './html/TagInfo.jsp?column=TYPE&keyword=C';
    }else if(path==='/tag/TagInfo.jsp?column=NAME&keyword=MANUAL.'){
        url = './html/TagInfo.jsp?column=NAME&keyword=MANUAL.';
    }else if(path==='/tag/TagInfo.jsp?column=NAME&keyword=KPI.&calc=true'){
        url = './html/TagInfo.jsp?column=NAME&keyword=KPI.&calc=true';
    }
    else{
        url = "../opms"+path;
    }
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
