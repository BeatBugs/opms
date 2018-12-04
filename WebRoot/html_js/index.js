document.write("<script language=javascript src='./html_js/loadPage.js'></script>");
document.write("<script language=javascript src='./html_js/treeAction.js'></script>");
document.write("<script language=javascript src='./html_js/config.js'></script>");

Ext.require(['Ext.data.proxy'])
var context = new Array();
var titleArray = new Array();
var nameArray = new Array();
var treeArray = new Array();
var authType = 1;
var result, childrenJson, data, state,homeData;
Ext.require(['Ext.data.TreeModel',
    'Ext.data.TreeStore']);
function getShift() {
    IsNotExaminePersonDao.getShiftMode({
        callback: function (str) {

            localStorage['config'] = str
            if (localStorage['config'] == 1) {
                state = '是'
            } else {
                state = '否'
            }
        }
    })
}
function getHomePage(){
    UserFlavorService.getUserFlavorByUsername(username,{
        callback:function (str) {
            if (str.length!=0) {
                homeData = str[0].attribute1
            }else {
                homeData= './html/RTIndex.html'
            }
        }
    })
}
function addChild(rootArray) {
    childrenJson = new Array();
    for (var i = 0; i < rootArray.length; i++) {
        if (rootArray[i].leaf == false) {
            NavTreeNodeService.getChildNodesTreeByContextAndName(context[0] + "", rootArray[i].name, localStorage['config'], {
                callback: function (str) {
                    childrenJson = [].concat(str);
                    changeJsonKey(childrenJson, "title");
                    rootArray[i].children = childrenJson;
                    addChild(childrenJson);
                }
            });

        }
    }
    return rootArray;

}


function init() {
    //获取导航树节点
    //默认为true，设置为false可以让dwr同步执行
    DWREngine.setAsync(false);
    getHomePage()
    getShift()
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
    for (var k = 0; k < nameArray.length; k++) {
        result = new Array();
        NavTreeNodeService.getDirectChildNodesByContextAndName(context[0] + "", nameArray[k] + "", localStorage['config'],
            {
                callback: function (str) {

                    result = str;

                    // 替换获取到的数组中的json对象中名为title的key，将其转换为text可以直接展示到界面
                    changeJsonKey(result, "title");

                    //通过递归循环添加子节点（获取完整节点接口存在问题只能循环获取）
                    result = addChild(result);
                }
            });

        var treeStore = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: result,
                data: [],
                autoLoad: false,

            }

        });

        var tree1 = Ext.create('Ext.tree.Panel', {
            width: window.innerWidth,
            xtype: 'basic-trees',
            height: window.innerHeight,
            title: titleArray[k] + "",
            titleCollapse: true,
            bodyStyle: 'overflow-x:hidden; overflow-y:hidden',
            store: treeStore,
            rootVisible: false,
            listeners: {
                itemclick: function (e, r) {

                    if (r.data.path != "") {
                        if (r.data.path == "/html/ReportConfig.jsp") {
                            loadPage("./html/ReportConfig.jsp?nodeName=" + r.parentNode.parentNode.data.name + '&treeId=' + r.parentNode.parentNode.getOwnerTree().id, r.data.text)
                        }
                        else {
                            loadPageWithTarget("." + r.data.path, r.data.text, r.data.target, r.data.name)
                        }
                    }

                },
                itemcontextmenu: function (e, r) {

                    addListener(e, r)
                    event.returnValue = false;
                },


            },
            // plugins:
        });

        treeArray.push(tree1);

    }
    DWREngine.setAsync(true);

    drawView();


}

function checkHandler() {
    var change, isState
    if (state == '是') {
        change = '不'
        isState = 0
    } else {
        change = ''
        isState = 1
    }
    var check = new Ext.FormPanel({
        width: window.innerWidth,
        height: window.innerHeight,
        title: '切换至-' + change + '考核到人',
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',
        items: [
            {
                width: 200,
                labelWidth: 60,
                id: 'userName',
                fieldLabel: '用户名',
                style: {margin: '20px 35px'},
                name: 'userName'
            },
            {
                width: 200,
                labelWidth: 60,
                id: 'PassWord',
                fieldLabel: '密码',
                name: 'passWord',
                style: {margin: '20px 35px'},
                inputType: 'password'
            }
        ]

    })
    var windows = new Ext.window.Window({
        title: '切换是否考核到人',
        width: 300,
        height: 300,
        scope: this,
        // fn: showResult,
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
                windows.close()
            }
        }, {
            text: '切换',
            handler: function () {
                var form = check.getForm().getValues()
                IsNotExaminePersonDao.save(form.userName, form.passWord, isState, {
                    callback: function (str) {
                        switch (str) {
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

Ext.onReady(function () {
    init();
    var width = document.documentElement.clientWidth
    if (width<1100){
        Ext.getCmp('westPanel').collapse()
    }else {
        Ext.getCmp('westPanel').expand()
    }
});

function changeJsonKey(jsonArray, key) {
    for (var i = 0; i < jsonArray.length; i++) {
        jsonArray[i]["text"] = jsonArray[i][key];   //'text'是需要的字段
        delete jsonArray[i][key];  //key是要替换为'text'的字段
    }
}


function changeTheme(btn) {
    localStorage['theme'] = btn.cfg.type
    location.reload(false)
}

function drawView() {
    var pageSize = 10;


    var setTheme='主题'

    var viewport = new Ext.Viewport({
        layout: 'border',
        renderTo: Ext.getBody(),
        border: false,
        items: [{
            id: 'westPanel',
            title: '系统信息',
            region: 'west',
            split: false,
            border: true,
            collapsible: true,
            width: 200,
            layout: 'accordion',
            html: ' <iframe scrolling="hidden" frameborder="0" width="100%" height="100%" src=""> </iframe>',
            items: treeArray,
            minSize: 100,
            maxSize: 240
        }, {
            id: 'northPanel',
            xtype: "panel",
            collapsible: false,
            region: 'north',
            height: 50,

            header: false,
            items: [{
                title: "VeStore-OPMS火电厂实时运行绩效管理系统",
                xtype: 'gridpanel',
                header: {
                    itemPosition: 1,
                    items:
                        [{
                            xtype: 'button',
                            id:'isExam',
                            width: 150,
                            text: '是否考核到人:' + state + '(切换)',
                            handler: checkHandler
                        },
                            {
                                ui: 'default-toolbar',
                                xtype: 'splitbutton',
                                text: setTheme,
                                menu: {
                                    defaults: {
                                        handler: changeTheme,
                                    },
                                    items: [{
                                        text: 'Neptune主题',
                                        cfg: {
                                            type: 'neptune',

                                        }
                                    }, {
                                        text: 'Neptune Touch主题',
                                        cfg: {
                                            type: 'neptune-touch',
                                        }
                                    }, {
                                        text: 'Crisp主题',
                                        cfg: {
                                            type: 'crisp',

                                        }
                                    }, {
                                        text: 'Crisp Touch主题',
                                        cfg: {
                                            type: 'crisp-touch'
                                        }
                                    }, {
                                        text: 'Classic主题',
                                        cfg: {
                                            type: 'classic'
                                        }
                                    }, {
                                        text: 'Gray主题',
                                        cfg: {
                                            type: 'gray',
                                        }
                                    }, {
                                        text: 'Triton主题',
                                        cfg: {
                                            type: 'triton'
                                        }
                                    }, {
                                        text: 'Aria主题',
                                        cfg: {
                                            type: 'aria',

                                        }
                                    },

                                    ],

                                },


                            }]
                }
            }]

        },
            {
                // title: 'center',
                id: 'centerPanel',
                xtype:
                    'panel',
                header:
                    false,
                region:
                    'center',
                layout:
                    'fit',
                items:
                    [
                        {
                            header: false,
                            defaults: {
                                autoScroll: true,
                                bodyStyle: 'padding:0px'
                            },
                            // layout:'fit',
                            split: true,
                            border: false,
                            // collapsible: true,
                            resizeTabs: true,
                            activeTab: 0,
                            id: 'centerTabPanel',
                            xtype: 'tabpanel',
                            plugins: new Ext.ux.TabCloseMenu(),

                            listeners: {
                                remove: function (tabPanel, tab) {
                                }
                            }

                        }
                    ]
            }
        ]
    });
    loadPage("./"+homeData,'首页')
    if(username!='admin') {
        Ext.getCmp('isExam').setVisible(false)
    }
    window.onresize=function(){
        changeDivHeight();
    }
    function changeDivHeight() {
        var width = document.documentElement.clientWidth
        if (width<1100){
            Ext.getCmp('westPanel').collapse()
        }else {
            Ext.getCmp('westPanel').expand()
        }
    }

}
