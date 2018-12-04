var ctxNode;
var treeMenu;
var treeNodeInterceptor;
var favoriteURL = './html/UserFavorite.html'
var editActionURL = './html/EditTreeNode.jsp'
var insertActionURL = './html/InsertTreeNode.jsp'
var treeNodeSearchURL = './navtree/TreeNodeSearch.jsp'
var resetUserPassURL = './auth/Userpass.jsp'
var tagDataQueryURL = './tag/TagDataQuery.jsp'
var jsonMap = {}

function refreshTree(id) {

    DWREngine.setAsync(false);
    if (Ext.isEmpty(id) || Ext.getCmp(id) == null) {
        return;
    }
    var tree = Ext.getCmp(id);
    getJsonMap()
    var newData = getData(tree.title)
    tree.store.loadData(newData)

}

var editAction = new Ext.Action({
    text: "修改本节点",
    iconCls: 'application_edit',
    handler: function () {
        var url = editActionURL + '?context=' + ctxNode.data.context + '&nodeName=' + ctxNode.data.name + '&treeID=' + ctxNode.getOwnerTree().id;
        var title = '修改节点[' + ctxNode.data.text + ']';
        loadPage(url, title);
    }
});

var insertChildAction = new Ext.Action({
    text: "插入子节点",
    iconCls: 'add',
    handler: function () {
        var url = insertActionURL + '?context=' + ctxNode.data.context + '&nodeName=' + ctxNode.data.name + '&where=child&treeID=' + ctxNode.getOwnerTree().id;
        var title = '在节点[' + ctxNode.data.text + ']下插入节点';
        loadPage(url, title);
    }
});

var insertBeforeAction = new Ext.Action({
    text: "在前插入节点",
    iconCls: 'insert',
    handler: function () {
        var url = insertActionURL + '?context=' + ctxNode.data.context + '&nodeName=' + ctxNode.data.name + '&where=before&treeID=' + ctxNode.getOwnerTree().id;
        var title = '在节点[' + ctxNode.data.text + ']前插入节点';
        loadPage(url, title);
    }
});

var insertAfterAction = new Ext.Action({
    text: "在后插入节点",
    iconCls: 'insert',
    handler: function () {
        var url = insertActionURL + '?context=' + ctxNode.data.context + '&nodeName=' + ctxNode.data.name + '&where=after&treeID=' + ctxNode.getOwnerTree().id;
        var title = '在节点[' + ctxNode.data.text + ']后插入节点';
        loadPage(url, title);
    }
});

var moveUpAction = new Ext.Action({
    text: "向上移动节点",
    iconCls: 'go-up',
    handler: function () {

        var node = ctxNode;

        var context = node.data.context;
        var name = node.data.name;

        NavTreeNodeDao.moveNavTreeNodeByContextAndName(context, name, 'up', {
            callback: function () {
                refreshTree(node.getOwnerTree().id);
            },
            timeout: 120000,
            errorHandler: function (message) {
                Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
            }
        });

    }
});

var moveDownAction = new Ext.Action({
    text: "向下移动节点",
    iconCls: 'go-down',
    handler: function () {

        var node = ctxNode;

        var context = node.data.context;
        var name = node.data.name;

        NavTreeNodeDao.moveNavTreeNodeByContextAndName(context, name, 'down', {
            callback: function () {
                refreshTree(node.getOwnerTree().id);
            },
            timeout: 120000,
            errorHandler: function (message) {
                Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
            }
        });

    }
});


var deleteAction = new Ext.Action({
    text: "删除本节点",
    iconCls: 'delete',
    handler: function () {

        var node = ctxNode;

        Ext.Msg.confirm('提示', '是否要删除节点:[' + node.data.text + ']及其所有子节点?', function (btn) {

            if (btn != 'yes') {
                return;
            }

            var context = node.data.context;
            var name = node.data.name;
            NavTreeNodeDao.deleteAllNavTreeNodesByContextAndName(context, name, {
                callback: function () {
                    refreshTree(node.getOwnerTree().id);
                },
                timeout: 120000,
                errorHandler: function (message) {
                    Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
                }
            });

        });

    }
});


var insertBeforeTreeAction = new Ext.Action({
    text: "在前插入导航树",
    iconCls: 'insert',
    handler: function () {
        var url = insertActionURL + '?context=' + ctxNode.getOwnerTree().data.context + '&nodeName=' + ctxNode.getOwnerTree().data.name + '&where=before&treeID=' + ctxNode.getOwnerTree().id;
        var title = '在导航树[' + ctxNode.getOwnerTree().data.text + ']前插入导航树';
        loadPage(url, title);
    }
});

var insertAfterTreeAction = new Ext.Action({
    text: "在后插入导航树",
    iconCls: 'insert',
    handler: function () {
        var url = insertActionURL + '?context=' + ctxNode.getOwnerTree().data.context + '&nodeName=' + ctxNode.getOwnerTree().data.name + '&where=after&treeID=' + ctxNode.getOwnerTree().id;
        var title = '在导航树[' + ctxNode.getOwnerTree().data.text + ']后插入导航树';
        loadPage(url, title);
    }
});

var editTreeAction = new Ext.Action({
    text: "修改本导航树",
    iconCls: 'application_edit',
    handler: function () {
        var node = ctxNode;
        var url = editActionURL + '?context=' + ctxNode.data.context + '&nodeName=' + ctxNode.getOwnerTree().data.name + '&treeID=' + ctxNode.getOwnerTree().id;
        var title = '修改导航树[' + ctxNode.getOwnerTree().data.text + ']';
        loadPage(url, title);
    }
});

var deleteTreeHandler = function (context, name, title) {
    Ext.Msg.confirm('提示', '是否要删除导航树:[' + title + ']及其所有子节点?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        NavTreeNodeDao.deleteAllNavTreeNodesByContextAndName(context, name, {
            callback: function () {
                Ext.getCmp('westPanel').remove(Ext.getCmp(context + name));
            },
            timeout: 120000,
            errorHandler: function (message) {
                Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
            }
        });

    });
};

var deleteTreeAction = new Ext.Action({
    text: "删除本导航树",
    iconCls: 'delete',
    handler: function () {
        var context = ctxNode.getOwnerTree().root.data.context;
        var name = ctxNode.getOwnerTree().root.data.name;
        var title = ctxNode.getOwnerTree().root.data.text;
        deleteTreeHandler(context, name, title);
    }
});

/**
 var deleteTreeAction = new Ext.Action({
	text : "删除本导航树",
	iconCls : 'delete',
	handler : function() {

		var context = ctxNode.getOwnerTree().root.data.context;
		var name = ctxNode.getOwnerTree().root.data.name;
		var title = ctxNode.getOwnerTree().root.data.text;

		Ext.Msg.confirm('提示', '是否要导航树:[' + node.getOwnerTree().root.data.text + ']及其所有子节点?', function(btn) {

				if (btn != 'yes') {
					return;
				}

				var context = node.getOwnerTree().root.data.context;
				var name = node.getOwnerTree().root.data.name;

				NavTreeNodeDao.deleteAllNavTreeNodesByContextAndName(context, name, {
					callback : function() {
						Ext.getCmp('westPanel').remove(Ext.getCmp(context + name));
					},
					timeout : 120000,
					errorHandler : function(message) {
						Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
					}
				});

		});

	}
});
 **/
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

var setDefaultAction = new Ext.Action({
    text: "设置为首页",
    iconCls: 'house',
    handler: function () {

        var href = ctxNode.data.path;

        UserFlavorService.saveUserHomePage(username, href, {
            callback: function () {
                Ext.Msg.alert('提示', '操作成功！');
            },
            timeout: 120000,
            errorHandler: function (message) {
                Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
            }
        });
    }
});


var addToFavoriteAction = new Ext.Action({
    text: "添加到收藏夹",
    iconCls: 'award_star_add',
    handler: function () {

        UserFavoriteDao.insertUserFavoriteByUsernameAndNodeID(username, ctxNode.data.id, {
            callback: function () {
                showToast("添加到收藏夹成功")
            },
            timeout: 120000,
            errorHandler: function (message) {
                showToast("添加到收藏夹失败")
            }
        });

    }
});

var removeFromFavoriteAction = new Ext.Action({
    text: "从收藏夹删除",
    iconCls: 'award_star_delete',
    handler: function () {

        UserFavoriteDao.deleteUserFavoriteByUsernameAndNodeID(username, ctxNode.data.id, {
            callback: function () {
                showToast("从收藏夹删除节点成功")
            },
            timeout: 120000,
            errorHandler: function (message) {
                showToast("从收藏夹删除节点失败")
            }
        });
    }
});


var openFavoriteAction = new Ext.Action({
    text: "打开收藏夹",
    iconCls: 'award_star_gold_3',
    handler: function () {
        loadPage(favoriteURL, '我的收藏夹');
    }
});

function addListener(e, r) {
    ctxNode = r
    if (username=='admin') {
        treeMenu = new Ext.menu.Menu({
            // id: 'TreeMenu',
            width: 200,
            items: [editAction, insertChildAction, deleteAction,
                '-', insertBeforeAction, insertAfterAction, moveUpAction, moveDownAction,
                '-', editTreeAction, insertBeforeTreeAction, insertAfterTreeAction,
                '-', setDefaultAction,
                '-', addToFavoriteAction, removeFromFavoriteAction, openFavoriteAction]
        }).showAt(e.getXY());

    } else {

        treeMenu = new Ext.menu.Menu({
            id: 'TreeMenu',
            width: 200,
            items: [setDefaultAction, '-', addToFavoriteAction, removeFromFavoriteAction, openFavoriteAction]
        }).showAt(e.getXY());;

    }

}

function getData(title) {
    DWREngine.setAsync(false);
    var data
    NavTreeNodeService.getDirectChildNodesByContextAndName(context[0] + "", jsonMap[title] + "", 1,
        {
            callback: function (str) {
                data = str;


                // 替换获取到的数组中的json对象中名为title的key，将其转换为text可以直接展示到界面
                changeJsonKey(data, "title");

                //通过递归循环添加子节点（获取完整节点接口存在问题只能循环获取）
                data = addChild(data);
            }
        });

    return data;

}

function getJsonMap() {
    DWREngine.setAsync(false);
    var titleArray = new Array();
    var nameArray = new Array();
    DWREngine.setAsync(false);
    NavTreeNodeService.getAllContexts(
        {
            callback: function (str) {
                context = [].concat(str);

            }

        });
    NavTreeNodeService.getTopNavTreeNamesByContext(context[0] + "",
        {
            callback: function (str) {
                nameArray = [].concat(str);
            }

        });
    NavTreeNodeService.getTopNavTreeTitlesByContext(context[0] + "",
        {
            callback: function (str) {
                titleArray = [].concat(str);
                // [titleArray[0], titleArray[1]] = [titleArray[1], titleArray[0]];
                // [titleArray[2], titleArray[3]] = [titleArray[3], titleArray[2]];
            }
        });
    for (var inn = 0; inn < titleArray.length; inn++) {
        jsonMap[titleArray[inn]] = nameArray[inn] + ""
    }
}