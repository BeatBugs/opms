

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
        value: treeNode.id,
        readOnly :	true,
        style: {margin: '10px auto'},
        fieldStyle: {background: '#F0F0F0'}

    },{
        fieldLabel: '节点名字',
        name: 'name',
        value: treeNode.name,
        readOnly :	true,
        style: {margin: '10px auto'},
        fieldStyle: {background: '#F0F0F0'}
    },{
        fieldLabel: '节点标题',
        name: 'title',
        value: treeNode.title,
        style: {margin: '10px auto'},
        allowBlank: false
    },{
        fieldLabel: '节点描述',
        name: 'descp',
        style: {margin: '10px auto'},
        value: treeNode.descp
    },{
        fieldLabel: '模块名字',
        name: 'context',
        value: treeNode.context,
        style: {margin: '10px auto'},
        readOnly :	true,
        fieldStyle: {background: '#F0F0F0'}
    }, {
        fieldLabel: '页面路径',
        name: 'path',
        style: {margin: '10px auto'},
        value: treeNode.path
    }, {
        id:'targetGroup',
        //name: 'target', //name is no need , will use the first item's name
        xtype: 'radiogroup',
        fieldLabel: '打开方式',
        style: {margin: '10px auto'},
        items: targetItems
    }, {
        id:'rolesGroup',
        //name: 'roles', //name is no used , will use items's names
        xtype: 'checkboxgroup',
        style: {margin: '10px auto'},
        fieldLabel: '访问权限',
        columns: (roleItems.length < 4 ? roleItems.length :4),
        //A single item, or an array of child Components to be added to this container. Each item can be any type of object based on Ext.Component.
        //Component config objects may also be specified in order to avoid the overhead of constructing a real Component object if lazy rendering might mean that the added Component will not be rendered immediately.
        //To take advantage of this "lazy instantiation", set the Ext.Component.xtype config property to the registered type of the Component wanted.
        //If a single item is being passed, it should be passed directly as an object reference (e.g., items: {...}).
        //Multiple items should be passed as an array of objects (e.g., items: [{...}, {...}]).
        //items: roleItems
        items:roleItems
    }
    ],
    buttonAlign: 'center',
    buttons: [{
        text: '保存',
        handler: function(){

            if(!treeNodeForm.getForm().isValid()){
                return;
            }

            // Returns the fields in this form as an object with key/value pairs as they would be submitted using a standard form submit.
            // If multiple fields exist with the same name they are returned as an array.
            // Parameters: asString : Boolean (optional) false to return the values as an object (defaults to returning as a string)
            var oFormData = treeNodeForm.getForm().getValues(false);

            //alert(DWRUtil.toDescriptiveString(oFormData,4));

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
            NavTreeNodeDao.saveNavTreeNode(node,{
                callback:function() {

                    if(node.name.indexOf("_") == -1){
                        top.Ext.getCmp(node.context + node.name).setTitle(node.title);
                    }

                    top.refreshTree(treeID);

                    showToast('保存修改成功');

                },
                timeout:120000,
                errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
            });

        }

    },{
        text: '刷新',
        handler: function(){

            var oFormData = treeNodeForm.getForm().getValues(false);

            var context = oFormData['context'];
            var name = oFormData['name'];

            NavTreeNodeDao.getNavTreeNodeByContextAndName(context,name,{
                callback:function(newNode) {

                    var node 		= {};
                    node = newNode

                    if(node.target == null){
                        node.target = '';
                    }

                    Ext.getCmp('targetGroup').setValue(node.target);

                    // if(node.roles == null || node.roles.trim() == ''){
                    //     Ext.getCmp('rolesGroup').setValue([]);
                    // }else{
                    //     Ext.getCmp('rolesGroup').setValue(node.roles.trim().split(','));
                    // }
                    node.roles =node.roles.trim().split(',')
                    treeNodeForm.getForm().setValues(node);
                    showToast("刷新成功")

                },
                timeout:120000,
                errorHandler:function(message) { showToast( '操作失败，错误信息：' + message); }
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