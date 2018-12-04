document.write("<script language=javascript src='../html_js/loadPage.js'></script>");

var pageSize = 10;
var myData, roleData;
var nameArray = new Array();
var value = 'TITLE';
var store, rolesStore, grid, store_id
DWREngine.setAsync(false);

function getTreeNode(column, keyWords) {
    NavTreeNodeService.searchNavTreeNodes("opms", column, keyWords, 0, 200,localStorage['config'],
        {
            callback: function (str) {
                myData = str
            }
        });
    return myData
}


function saveNavTreeNode(node) {
    NavTreeNodeDao.saveNavTreeNode(node, {
        callback: function (str) {
            handleRefeshAction()
            showToast('保存记录成功');

        },
        timeout: 5000,
        errorHandler: function (message) {
            showToast('操作失败，错误信息：' + message);
        }
    });

}

function deleteNavTreeNodeByID(id) {
    NavTreeNodeDao.deleteNavTreeNodeByID(id, {
        callback: function () {
            handleRefeshAction()
            showToast('删除记录成功！');

        },
        timeout: 5000,
        errorHandler: function (message) {
            showToast('操作失败，错误信息：' + message);
        }
    });
}

function deleteNavTreeNodesByColumn(context, column, keyword) {
    NavTreeNodeDao.deleteNavTreeNodesByColumn(context, column, keyword, {
        callback: function () {

            handleRefeshAction()

            Ext.Msg.alert('提示', '删除记录成功！');

        },
        timeout: 5000,
        errorHandler: function (message) {
            Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
        }
    });
}

Ext.onReady(function () {
    var gridTitle = '';
    if (context == null) {
        gridTitle = '全部模块';
    } else {
        gridTitle = '[' + context + ']模块';
    }
    if (treeName == null || treeName == '') {
        gridTitle = gridTitle + '全部导航节点管理';
        getTreeNode('NAME', '')
    } else if (treeName == 'T999') {
        gridTitle = gridTitle + '内部URL授权管理';
        getTreeNode('NAME', 'T999')
    } else {
        gridTitle = gridTitle + '[' + treeName + ']导航节点管理';
    }

    rolesStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "roleName", mapping: "roleName", type: 'string'},
            {name: "roleDesc", mapping: "roleDesc", type: 'string'}
        ],
        autoLoad: true,
        data: roleData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        },
        sortInfo: {
            field: 'roleDesc',
            direction: 'ASC'
        }

    })

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
        autoLoad: {strat: 0, limit: pageSize},
        data: myData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
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

    function getSearchColumn() {
        var field = '';
        searchMenu.items.each(function (item) {
            if (item.checked) {
                field = item.value;
            }
        });
        return field;
    }


    // Search Input

    function focusSearchInput(item, checked) {
        searchInput.focus(100);
        if (checked == true) {
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
    var targetStore = new Ext.data.SimpleStore({
        fields: ['name', 'value'],
        data: [['本窗口', ''], ['顶窗口', '_top'], ['空窗口', '_blank'], ['新窗口', '_new']]
    });

    var targetComboBoxEditor = new Ext.form.ComboBox({
        store: targetStore,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        emptyText: '选择类型...',
        listClass: 'x-combo-list-small'
    });
    var rolesComboBoxEditor = null;
    // top tool bar
    var tbar;
    tbar = ['->', {
        text: '刷新',
        iconCls: 'refresh',
        tooltip: '刷新表格',
        handler: handleRefeshAction
    }, {
        text: '增加',
        iconCls: 'add',
        tooltip: '增加一行<br/>需要点击[保存]按钮保存',
        handler: handlerInsertAction
    }, {
        text: '保存',
        iconCls: 'accept',
        tooltip: '保存修改',
        handler: handlerSaveAction
    }, {
        text: '删除',
        iconCls: 'remove',
        tooltip: '删除一行',
        handler: handlerDeleteAction
    }, {
        text: '清空',
        iconCls: 'application_lightning',
        tooltip: '删除查询结果',
        handler: handlerCleanAction
    }
    ];

    if (treeName != null && treeName != '') {

    } else {
        tbar.unshift({
                xtype: 'splitbutton',
                text: '查询',
                destroyMenu: true,
                menu: searchMenu,
                iconCls: 'query',
            },
            {
                xtype: 'triggerfield',
                id: 'triggerfield',
                trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
                onTrigger1Click: function (btn) {
                   Ext.getCmp('triggerfield').setValue("")

                },
                onTrigger2Click: function (btn) {
                    DWREngine.setAsync(false);
                    var newData = getTreeNode(value, Ext.getCmp('triggerfield').getValue())
                    store.loadData(newData.root)
                }
            })

    }

    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: gridTitle,
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField',
            'Ext.exporter.text.CSV',
            'Ext.exporter.text.TSV',
            'Ext.exporter.text.Html',
            'Ext.exporter.excel.Xml',
            'Ext.exporter.excel.Xlsx'
        ],
        selModel: 'cellmodel',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: [{
                xtype: 'button',
                ui: 'default-toolbar',
                text: '导入',
                handler: function () {
                    importNavTreeNode()
                }
            }, {},{
                ui: 'default-toolbar',
                xtype: 'splitbutton',
                text: '导出',
                menu: {
                    defaults: {},
                    items: [{
                        text: 'Excel xlsx',
                        handler: function () {

                            exportNavTreeNode()
                        }
                    }
                    ]
                }
            }]
        },

        columns: [
            {header: "ID", width: 80, sortable: true, dataIndex: 'id', align: 'center', hidden: true},
            {header: "节点名字", flex: 1, sortable: true, dataIndex: 'name', align: 'left', editor: 'textfield'},
            {header: "节点标题", flex: 1, sortable: true, dataIndex: 'title', align: 'left', editor: 'textfield'},
            {
                header: "节点描述",
                width: 150,
                sortable: true,
                dataIndex: 'descp',
                align: 'left',
                editor: 'textfield',
                hidden: true
            },
            {header: "模块名字", width: 140, sortable: true, dataIndex: 'context', align: 'left', editor: 'textfield'},
            {header: "页面路径", flex: 1.5, sortable: true, dataIndex: 'path', align: 'left', editor: 'textfield'},
            {
                header: "打开方式",
                width: 80,
                sortable: true,
                dataIndex: 'target',
                align: 'left',
                editor: targetComboBoxEditor,
                renderer: formatTarget
            },
            {header: "访问权限", flex: 2, sortable: true, dataIndex: 'roles', align: 'left', editor: rolesComboBoxEditor}
        ],
        loadMask: true,
        listeners: {
            'celldblclick': onCelldblclick
        },

        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function onCelldblclick(grid, rowIndex, columnIndex, e) {
    var record = grid.getSelection();  // Get the Record
    var recordData = record[0].data
    var fieldName = grid.getHeaderCt().getGridColumns()[columnIndex].dataIndex;
    // Get field name
    if (fieldName != 'roles') {
        return;
    }
    var data = recordData.roles;
    store_id = recordData.id + "";
    if (store_id == '') {
        showToast('当前存在未保存信息，将自动还原')
        handleRefeshAction()
    }
    else {


        if (Ext.isEmpty(data)) {
            data = [];
        } else {
            data = data.split(',');
        }
        for (var i = 0; i < roleItems.length; i++) {
            roleItems[i]['checked'] = false
            for (var j = 0; j < data.length; j++) {
                if (roleItems[i].inputValue == data[j]) {
                    roleItems[i]['checked'] = true
                    break;
                }
            }

        }
        var rolesWindow = new Ext.Window({
            title: '权限设置',
            width: 300,
            resizable: true,
            autoHeight: true,
            frame: true,
            border: true,
            modal: true,
            closable: true,
            closeAction: 'destroy',
            items: [
                Ext.create('Ext.form.Panel', {
                    bodyPadding: 10,
                    width: 300,
                    id: 'checkform',
                    style: 'align:center;height:265;',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            defaultType: 'checkboxfield',
                            items: roleItems
                        }
                    ]
                })
            ],
            buttonAlign: 'center',
            buttons: [{
                text: '设置',
                handler: function () {
                    var form = Ext.getCmp('checkform').getForm();
                    var newValues = form.getValues(true).replace(/&/g, ',')
                    while (1) {
                        if (newValues.indexOf('roles=') != -1) {
                            newValues = newValues.replace('roles=', '')
                        } else {
                            break;
                        }
                    }
                    var row = store.data.indices[store_id];
                    store.getAt(row).data['roles'] = newValues;
                    store.reload()

                    rolesWindow.destroy();
                }
            }, {
                text: '取消',
                handler: function () {
                    rolesWindow.destroy();
                }
            }]


        });

        rolesWindow.show();
    }


}

function handleRefeshAction() {
    if (treeName == null || treeName == '') {
        var newData = getTreeNode('NAME', '')
    } else if (treeName == 'T999') {
        var newData = getTreeNode('NAME', 'T999')
    }

    store.loadData(newData.root)
}

function exportNavTreeNode() {

    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};
        params = Ext.applyIf(params, {
            column: value,
            context: "",
            keyword: Ext.getCmp('triggerfield').getValue(),
            limit: 80,
            start: 0
        });
        params.start = 0;
        params.limit = -1;

        var href = downloadURI + '?' + Ext.urlEncode(params);

        window.location = href;

        //window.open(href,'','width=780,height=550,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');


    });

}

function importNavTreeNode() {

    var form = new Ext.form.Panel({
        id: "fileForm",
        labelAlign: 'right',
        header: false,
        frame: true,
        url: uploadURI,//fileUploadServlet
        fileUpload: true,
        method: 'POST',
        // post_var_name:'file',
        width: window.innerWidth,
        height: window.innerHeight,
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'filefield',
        items: [
            {
                labelWidth:60,
                width:300,
                xtype: 'filefield',
                fieldLabel: '文件名',
                name: 'file',
                style: {margin: '15px 0 0 35px'}
            }
        ]

    });
    var rolesWindow = new Ext.Window({
        title: '文件上传',
        width: 400,
        height: 200,
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
            form
        ],
        buttonAlign: 'center',
        buttons: [{
            text: '取消',
            handler: function () {
                rolesWindow.close()
            }
        }
        ,{
            text: '上传',
            handler: function () {
                // The getForm() method returns the Ext.form.Basic instance:
                var baseform = form.getForm();
                if (baseform.isValid()) {
                    // Submit the Ajax request and handle the response
                    baseform.submit({
                        waitMsg : '正在提交数据,请稍后... ...',
                        success: function (form, action) {
                            store.reload()
                            showToast('Success');
                            rolesWindow.close()
                        },
                        failure: function (form, action) {
                            store.reload()
                            showToast('Failed');
                        }
                    });
                }
            }
        }]
    })
    rolesWindow.show()

}


function handlerInsertAction() {
    var record = {
        id: -1,
        name: '',
        title: '',
        descp: '',
        context: context,
        path: '',
        target: '',
        roles: ''
    };
    var scrollTop = grid.getView().getEl().getScrollTop()

    store.insert(0, record);
    grid.getView().getEl().setScrollTop(scrollTop);

}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] == -1) {
        recordData['id'] = ''
    }
    if (recordData.name == null || recordData.name == '') {
        showToast('节点名字不能为空！');
        return;
    }
    if (recordData.title == null || recordData.title == '') {
        showToast('节点标题不能为空！');
        return;
    }
    if (recordData.context == null || recordData.context == '') {
        showToast('模块名字不能为空！');
        return;
    }

    if (recordData.roles == null) {
        roles = '';
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        saveNavTreeNode(recordData)
    });
}

function handlerDeleteAction() {
    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }

    var recordData = record[0].data

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        if (recordData.id == null || recordData.id == '') {
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if (record[0].dirty) {
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteNavTreeNodeByID(recordData.id)

    });
}

function handlerCleanAction() {
    Ext.Msg.confirm('提示', '是否要删除查询结果中的所有记录?<br/>强烈建议您点击【导出】按钮将查询结果导出备份后再进行删除操作！', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var context = 'opms';
        var column = value;
        var keyword = Ext.getCmp('triggerfield').getValue();
        deleteNavTreeNodesByColumn(context, column, keyword)


    });
}

function formatTarget(target) {

    if (target == null) {
        return '';
    }

    if (target == '') {
        return '';
    } else if (target == '_top') {
        return '顶窗口';
    } else if (target == '_blank') {
        return '空窗口';
    } else if (target == '_new') {
        return '新窗口';
    } else {
        return target;
    }

}

function showToast(s, title) {
    Ext.toast({
        html: s,
        closable: false,
        width: 400,
        style: {'text-align': 'center'},
        align: 't',
        slideInDuration: 400
    })
}