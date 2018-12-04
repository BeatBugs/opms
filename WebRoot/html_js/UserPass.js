// alert(DWRUtil.toDescriptiveString(values,2));

// user.id
// user.userName
// user.userDesc
// user.password
// user.enabled
var user = {};
var userName = 'admin'
DWREngine.setAsync(false);

function getUserByUsername(name) {
    UserDao.getUserByUsername(name, {
        callback: function (newUser) {

            user = newUser
        }
    })
    return user;
}
getUserByUsername(userName)
var userForm = new Ext.FormPanel({
    labelWidth: 80,
    frame: true,
    title: '修改用户密码(密码保存时会自动加密)',
    bodyStyle: 'padding:15px 15px 10px 15px',
    width: window.innerWidth,
    defaults: {width: 590},
    defaultType: 'textfield',

    items: [
        {
            fieldLabel: '用户ＩＤ',
            name: 'id',
            value: user.id,
            readOnly: true,
            style: {margin: '10px auto'},
            fieldStyle: {background: '#F0F0F0'}
        }, {
            fieldLabel: '登陆名字',
            name: 'userName',
            value: user.userName,
            readOnly: true,
            style: {margin: '10px auto'},
            fieldStyle: {background: '#F0F0F0'}
        }, {
            fieldLabel: '中文名字',
            name: 'userDesc',
            value: user.userDesc,
            style: {margin: '10px auto'},
            readOnly: false,
            allowBlank: true
        }, {
            id: 'password',
            fieldLabel: '登陆密码',
            name: 'password',
            value: user.password,
            style: {margin: '10px auto'},
            readOnly: false,
            allowBlank: false
        }
    ],

    buttons: [
        {
            text: '保存',
            handler: function () {

                if (!userForm.getForm().isValid()) {
                    return;
                }

                // Returns the fields in this form as an object with key/value pairs as they would be submitted using a standard form submit.
                // If multiple fields exist with the same name they are returned as an array.
                // Parameters: asString : Boolean (optional) false to return the values as an object (defaults to returning as a string)
                var oFormData = userForm.getForm().getValues(false);

                //alert(DWRUtil.toDescriptiveString(oFormData,4));

                var user = {};
                user.id = oFormData['id'];
                user.userName = oFormData['userName'];
                user.userDesc = oFormData['userDesc'];
                user.password = oFormData['password'];
                //user.enabled 	= oFormData['enabled'];
                user.enabled = true;

                //alert(DWRUtil.toDescriptiveString(user,2));

                UserDao.saveUser(user, {
                    callback: function (newUser) {

                        if (newUser == null) {
                            newUser = {};
                        }

                        var user = {};
                        user = newUser;
                        user.enabled = true;

                        // var rec = {data: user};

                        userForm.getForm().setValues(user);

                        Ext.MessageBox.show({
                            title: '再次确认',
                            msg: '是否确定保存修改?',
                            width: Ext.theme.name === "Graphite" ? 300 : 250,
                            buttons: Ext.MessageBox.YESNO,
                            buttonText: {
                                yes: "保存",
                                no: "放弃"
                            },
                            buttonTips: {
                                yes: {
                                    text: "保存",
                                    anchor: true,
                                    align: 't-b'
                                },
                                no: {
                                    text: "放弃",
                                    anchor: true,
                                    align: 't-b'
                                }
                            },
                            scope: this,
                            fn: showResult
                        });

                    },
                    errorHandler: function (message) {
                        showToast(Ext.String.format('保存操作失败，错误原因:' + message))
                    }, timeout: 5000,
                });
            }
        }, {
            text: '刷新',
            handler: function () {
                var oFormData = userForm.getForm().getValues(false);
                UserDao.getUserByUsername(userName, {
                    callback: function (newUser) {

                       var user = newUser
                        userForm.getForm().setValues(user);
                        showToast(Ext.String.format('刷新操作成功'))
                    },
                    timeout: 5000,
                    errorHandler: function (message) {

                        showToast(Ext.String.format('刷新操作失败，错误原因:' + message))
                    }
                });

            }

        }]
});

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
    /*
        new Ext.ToolTip({
            target: 'password',
            html: 'A very simple tooltip'
        });

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

        userForm.render('content-panel');
        */


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: userForm
    });

});