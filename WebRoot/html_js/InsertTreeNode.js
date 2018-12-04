// alert(DWRUtil.toDescriptiveString(values,2));

// user.id
// user.userName
// user.userDesc
// user.password
// user.enabled

DWREngine.setAsync(false);


var treeNodeForm  = new Ext.FormPanel({
    labelWidth: 80,
    frame:true,
    title: '增加导航树节点',
    bodyStyle:'padding:15px 15px 10px 15px',
    width:window.innerWidth,
    defaults: {width: 590},
    defaultType: 'textfield',

    items: [{
        fieldLabel: '节点ID',
        name: 'id',
        value: '',
        style: {margin: '10px auto'},
        readOnly: true,
        fieldStyle: {background: '#F0F0F0'}
    }, {
        fieldLabel: '节点名字',
        name: 'name',
        style: {margin: '10px auto'},
        value: '',
        readOnly: true,
        fieldStyle: {background: '#F0F0F0'}
    }, {
        fieldLabel: '节点标题',
        name: 'title',
        value: treeNode.title,
        style: {margin: '10px auto'},
        allowBlank: false
    }, {
        fieldLabel: '节点描述',
        name: 'descp',
        style: {margin: '10px auto'},
        value: ''
    }, {
        fieldLabel: '模块名字',
        name: 'context',
        style: {margin: '10px auto'},
        value: treeNode.context,
        readOnly: true,
        fieldStyle: {background: '#F0F0F0'}
    }, {
        fieldLabel: '页面路径',
        style: {margin: '10px auto'},
        name: 'path',
        value: treeNode.path
    }, {
        id: 'targetGroup',
        //name: 'target', //name is no need , will use the first item's name
        xtype: 'radiogroup',
        fieldLabel: '打开方式',
        style: {margin: '10px auto'},
        items: targetItems
    }, {
        id: 'rolesGroup',
        //name: 'roles', //name is no used , will use items's names
        xtype: 'checkboxgroup',
        fieldLabel: '访问权限',
        style: {margin: '10px auto'},
        columns: (roleItems.length < 4 ? roleItems.length : 4),

        items: roleItems
    }
    ],
    buttonAlign: 'center',
    buttons: [{
        text: '插入',
        handler: function(){

            if(!treeNodeForm.getForm().isValid()){
                return;
            }

            // Returns the fields in this form as an object with key/value pairs as they would be submitted using a standard form submit.
            // If multiple fields exist with the same name they are returned as an array.
            // Parameters: asString : Boolean (optional) false to return the values as an object (defaults to returning as a string)
            var oFormData = treeNodeForm.getForm().getValues(false);

            // alert(DWRUtil.toDescriptiveString(oFormData,4));

            var node = {};
            node = oFormData

            // this is ok too!
            //node.target 	= Ext.getCmp('targetGroup').getValue();

            if(node.target == null){
                node.target = '';
            }

            if (JSON.stringify(Ext.getCmp('rolesGroup').getValue())=="{}") {
                node.roles = ''
            }else if(Ext.getCmp('rolesGroup').getValue().roles.length>1&&Ext.getCmp('rolesGroup').getValue().roles.length<6) {
                node.roles = Ext.getCmp('rolesGroup').getValue().roles.join(',');
            }else {
                node.roles = Ext.getCmp('rolesGroup').getValue().roles
            }
            //alert(DWRUtil.toDescriptiveString(node,2));
            NavTreeNodeDao.insertNavTreeNode(treeNode,node,where,{
                callback:function(newNode) {
                    var node 		= {};
                    node = newNode;

                    if(node.target == null){
                        node.target = '';
                    }
                    Ext.getCmp('targetGroup').setValue(node.target);

                    node.roles = node.roles.trim().split(',')
                    treeNodeForm.getForm().setValues(node);

                    top.refreshTree(treeID);
                    showToast('插入操作成功');

                },
                timeout:120000,
                errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
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
        items: treeNodeForm
    });

});