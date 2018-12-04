document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData, userData, node = 0;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, leftGrid, allUserStore, rightGrid, treeData
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);

function getAllUser2(username, unitId, setsId, teamId, stationId) {
    UserConfigDao.queryUserConfigInfo(username, unitId, setsId, teamId, stationId,
        {
            callback: function (str) {
                for (var i = 0; i < str.length; i++) {
                    str[i].unitId = unitJsonMap[str[i].unitId]
                    str[i].setsId = suiteJsonMap[str[i].setsId]
                    str[i].teamId = orderclassJsonMap[str[i].teamId]
                    str[i].stationId = positonJsonMap[str[i].stationId]
                }
                myData = {root: str}
            }
        });
    return myData
}


function getUser(id) {
    UserDao.getUserByOrgid(id, {
        callback: function (str) {

            if (str == null || str == '' || str == undefined) {
                userData = []
            } else {
                userData = str
            }
        }
    })
    return userData
}


var unitIdData

function getUnit() {
    UnitDao.getAllUnitName({
        callback: function (str) {
            unitIdData = str
            for (var i = 0; i < unitIdData.length; i++) {
                unitJsonMap[str[i][1]] = str[i][0]
                unitJsonMap[str[i][0]] = str[i][1]
                unitJsonMap['全部单元'] = 0
                unitJsonMap[''] = 0
                unitJsonMap[null] = 0
                unitIdData[i][1] = unitIdData[i][0]
            }


        }
    })

}

var setsIdData

function getSuite(id) {
    SetsDao.getAllSetsName(id, {
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                suiteJsonMap['全部机组'] = 0
                suiteJsonMap[''] = 0
                suiteJsonMap[null] = 0
                setsIdData[i][1] = setsIdData[i][0]
            }

        }
    })
}

var teamIdData

function getTeam() {
    TeamDao.getTeamField({
        callback: function (str) {
            teamIdData = str
            for (var i = 0; i < teamIdData.length; i++) {
                orderclassJsonMap[str[i][1]] = str[i][0]
                orderclassJsonMap[str[i][0]] = str[i][1]
                orderclassJsonMap['全部班次'] = 0
                orderclassJsonMap[''] = 0
                orderclassJsonMap[null] = 0
                teamIdData[i][1] = teamIdData[i][0]
            }

        }
    })
}

function getPersonTree() {
    OrganiseDao.getTree(true, {
        callback: function (str) {
            treeData = str
        }
    })
}

var stationIdData

function getPosition() {
    Post1Dao.getAllStationName({
        callback: function (str) {
            stationIdData = str
            for (var i = 0; i < stationIdData.length; i++) {
                positonJsonMap[str[i][1]] = str[i][0]
                positonJsonMap[str[i][0]] = str[i][1]
                positonJsonMap['全部岗位'] = 0
                positonJsonMap[''] = 0
                positonJsonMap[null] = 0
                stationIdData[i][1] = stationIdData[i][0]
            }
        }
    })
}

function UserConfigSave(record) {
    UserConfigDao.save(record, {
        callback: function (str) {
            handleRefeshAction()

            showToast('保存记录成功');
        },
        timeout: 5000,
        errorHandler: function (message) {
            showToast('操作失败，错误信息：' + message);
        }
    })
}

function deleteUserConfig(id) {
    UserConfigDao.deleteByID(id, {
        callback: function (str) {
            handleRefeshAction()

            showToast('删除成功');
        },
    })
}

Ext.onReady(function () {
    getUnit()
    getSuite(unitJsonMap[unitIdData[0][0]])
    getPosition()
    getTeam()
    getAllUser2('', '', '', '', '')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "userId", mapping: "userId", type: 'string'},
            {name: "usercode", mapping: "usercode", type: 'string'},
            {name: "username", mapping: "username", type: 'string'},
            {name: "unitId", mapping: "unitId", type: 'string'},
            {name: "setsId", mapping: "setsId", type: 'string'},
            {name: "teamId", mapping: "teamId", type: 'string'},
            {name: "stationId", mapping: "stationId", type: 'string'}
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
            property: 'id',
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


    var unitIdComboBox = {
        id: 'unitIdComboBox',
        xtype: 'combo',
        store: unitIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        emptyText: '单元',
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                getSuite(unitJsonMap[this.getValue()])
                Ext.getCmp('setsIdComboBox').getStore().loadData(setsIdData)
                Ext.getCmp('setsIdComboBox').setValue(setsIdData[0][0])
            }
        }
    }
    var setsIdComboBox = {
        id: 'setsIdComboBox',
        xtype: 'combo',
        store: setsIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText: '机组',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var teamIdComboBox = {
        id: 'teamIdComboBox',
        xtype: 'combo',
        store: teamIdData,
        width: 100,
        displayField: 'name',
        emptyText: '班次',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var stationIdComboBox = {
        id: 'stationIdComboBox',
        xtype: 'combo',
        store: stationIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText: '岗位',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var unitIdComboBox1 = {
        xtype: 'combo',
        store: unitIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        emptyText: '单元',
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                getSuite(unitJsonMap[this.getValue()])
                Ext.getCmp('setsIdComboBox1').getStore().loadData(setsIdData)
                Ext.getCmp('setsIdComboBox1').setValue(setsIdData[0][0])
            }
        }
    }
    var setsIdComboBox1 = {
        xtype: 'combo',
        id: 'setsIdComboBox1',
        store: setsIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText: '机组',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var teamIdComboBox1 = {
        xtype: 'combo',
        store: teamIdData,
        width: 100,
        displayField: 'name',
        emptyText: '班次',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var stationIdComboBox1 = {
        xtype: 'combo',
        store: stationIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText: '岗位',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    columnsArray = [
        {header: "主键", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
        {header: "用户ID", flex: 1, dataIndex: "userId", sortable: true, align: 'center', hidden: true},
        {
            header: "用户名",
            flex: 1,
            dataIndex: "usercode",
            sortable: true,
            align: 'center',
        },
        {
            header: "姓名",
            flex: 1,
            dataIndex: "username",
            sortable: true,
            align: 'center',
        },
        {header: "单元", flex: 1, dataIndex: "unitId", sortable: true, align: 'center', editor: unitIdComboBox1},
        {header: "机组", flex: 1, dataIndex: "setsId", sortable: true, align: 'center', editor: setsIdComboBox1},
        {header: "班次", flex: 1, dataIndex: "teamId", sortable: true, align: 'center', editor: teamIdComboBox1},
        {header: "岗位", flex: 1, dataIndex: "stationId", sortable: true, align: 'center', editor: stationIdComboBox1}
    ]
    var tbar;
    tbar = [
        {
            xtype: 'textfield',
            id: 'textfield',
            fieldLabel: '姓名',
            labelWidth: 30,
            width: 120
        },
        unitIdComboBox,
        setsIdComboBox,
        teamIdComboBox,
        stationIdComboBox, '->',
        {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        }, {
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
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '人员配置维护',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
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
                    importPerson()
                }
            }, {}, {
                ui: 'default-toolbar',
                xtype: 'splitbutton',
                text: '导出',
                menu: {
                    defaults: {},
                    items: [{
                        text: 'Excel xlsx',
                        handler: function () {

                            exportPerson()
                        }
                    }
                    ]
                }
            }]
        },

        columns: columnsArray,
        loadMask: true,
        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function exportPerson() {

    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};

        params = Ext.applyIf(params, {
            username: '',
            teamId: orderclassJsonMap[Ext.getCmp('teamIdComboBox').getValue()],
            unitId: unitJsonMap[Ext.getCmp('unitIdComboBox').getValue()],
            setsId: suiteJsonMap[Ext.getCmp('setsIdComboBox').getValue()],
            stationId: positonJsonMap[Ext.getCmp('stationIdComboBox').getValue()]
        });
        params.start = 0;
        params.limit = -1;

        var href = downloadURI + '?' + Ext.urlEncode(params);

        window.location = href;

        //window.open(href,'','width=780,height=550,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');


    });

}

function importPerson() {

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
                labelWidth: 60,
                width: 300,
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
            , {
                text: '上传',
                handler: function () {
                    // The getForm() method returns the Ext.form.Basic instance:
                    var baseform = form.getForm();
                    if (baseform.isValid()) {
                        // Submit the Ajax request and handle the response
                        baseform.submit({
                            waitMsg: '正在提交数据,请稍后... ...',
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


function handleRefeshAction() {

    var newData = getAllUser2('', '', '', '', '')
    Ext.getCmp('textfield').setValue('')

    store.loadData(newData.root)
}

function handlerQueryAction() {
    var newData = getAllUser2(Ext.getCmp('textfield').getValue(),
        orderclassJsonMap[Ext.getCmp('teamIdComboBox').getValue()],
        unitJsonMap[Ext.getCmp('unitIdComboBox').getValue()],
        suiteJsonMap[Ext.getCmp('setsIdComboBox').getValue()],
        positonJsonMap[Ext.getCmp('stationIdComboBox').getValue()]
    )


    store.loadData(newData.root)
}

function handlerInsertAction() {
    getUser(node)
    getPersonTree()
    allUserStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: 'id', mapping: 'id', type: 'int'},
            {name: 'userName', mapping: 'userName', type: 'string'},
            {name: 'userDesc', mapping: 'userDesc', type: 'string'}
        ],
        autoLoad: {strat: 0, limit: pageSize},
        data: userData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        },
        pageSize: pageSize,
        sorters: {
            property: 'id',
            direction: 'ASC'
        },

    });
    var treeStore = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true,
            children: treeData,
            data: [],
            autoLoad: false,

        }

    });
    leftGrid = Ext.create('Ext.tree.Panel', {
        xtype: 'basic-trees',
        height: window.innerHeight,
        title: '组织机构',
        border: 'solid',
        width: 200,
        region: 'west',
        titleCollapse: true,
        bodyStyle: 'overflow-x:hidden; overflow-y:hidden',
        store: treeStore,
        rootVisible: false,
        listeners: {
            itemclick: function (e, r) {
                node = r.data.id
                var newData = getUser(node)
                allUserStore.loadData(newData)
            }
        }
    })

    centerGrid = new Ext.grid.Panel({
        title: '待选人员列表',
        region: 'center',
        border: 'solid',
        store: allUserStore,
        layout: 'fit',
        selModel: {
            type: 'checkboxmodel',
            mode: 'SINGLE'
        },

        columnLines: true,
        columns: [
            {header: "用户ID", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "用户名", flex: 1, dataIndex: "userName", sortable: true, align: 'center'},
            {header: "姓名", flex: 1, dataIndex: "userDesc", sortable: true, align: 'center'}
        ],
        height: window.innerHeight,

        tbar: ['->', {
            text: '添加',
            iconCls: 'add',
            tooltip: '添加',
            handler: handlePersonAddAction
        }]
    })
    rightGrid = new Ext.grid.Panel({
        title: '已选人员列表',
        width: 600,
        border: 'solid',
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel'
        ],
        selModel: 'cellmodel',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        store: store,
        region: 'east',
        layout: 'fit',
        height: window.innerHeight,
        columns: columnsArray,
        tbar: ['->', {
            text: '刷新',
            iconCls: 'accept',
            tooltip: '添加',
            handler: handleRefeshAction
        }, {
            text: '保存',
            iconCls: 'accept',
            tooltip: '添加',
            handler: handlerPersonSaveAction
        }, {
            text: '删除',
            iconCls: 'delete',
            tooltip: '添加',
            handler: handlePersonDeleteAction
        }]
    })

    var rolesWindow = new Ext.Window({
        title: '新增',
        width: 1050,
        height: 600,
        layout: 'border',
        resizable: true,
        autoHeight: true,
        frame: true,
        border: true,
        modal: true,
        closable: true,
        closeAction: 'destroy',
        maximizable: true,
        constrain: true,
        plain: false,
        items: [
            leftGrid,
            centerGrid,
            rightGrid
        ]
    })
    rolesWindow.show()

}

function handlerSaveAction() {
    var record = grid.getSelection();
    save(record)
}

function handlerPersonSaveAction() {
    var record = rightGrid.getSelection();
    save1(record)

}

function save(record) {
    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] == -1) {
        recordData['id'] = ''
    }

    if (recordData.unitId == null || recordData.unitId == '') {
        showToast('单元名字不能为空！');
        return;
    }
    if (recordData.setsId == null || recordData.setsId == '') {
        showToast('机组名字不能为空！');
        return;
    }
    if (recordData.teamId == null || recordData.teamId == '') {
        showToast('班次名字不能为空！');
        return;
    }
    if (recordData.stationId == null || recordData.stationId == '') {
        showToast('岗位名字不能为空！');
        return;
    }

    recordData.unitId = unitJsonMap[recordData.unitId]
    recordData.setsId = suiteJsonMap[recordData.setsId]
    recordData.stationId = positonJsonMap[recordData.stationId]
    recordData.teamId = orderclassJsonMap[recordData.teamId]
    UserConfigSave(recordData)
}

function handlePersonAddAction() {
    var record = centerGrid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data

    rightAdd(recordData)

}

function rightAdd(recordData) {
    for (var i = 0; i < rightGrid.getStore().data.items.length; i++) {
        if (rightGrid.getStore().data.items[i].data.userId == recordData.id) {
            showToast('当前用户已经添加')
            return;
        }
    }

    var record = {
        id: -1,
        userId: recordData.id,
        usercode: recordData.userName,
        username: recordData.userDesc,
        stationId: '',
        unitId: '',
        setsId: '',
        teamId: ''

    };
    var scrollTop = grid.getView().getEl().getScrollTop()

    store.insert(0, record);
    rightGrid.getView().getEl().setScrollTop(scrollTop);
}

function handlePersonDeleteAction() {
    var record = rightGrid.getSelection();
    deleteAction1(record)
}

function handlerDeleteAction() {
    var record = grid.getSelection();
    deleteAction(record)
}

function deleteAction(record) {
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
        deleteUserConfig(recordData.id)

    });
}

function deleteAction1(record) {
    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }

    var recordData = record[0].data

    deleteUserConfig(recordData.id)

}


function showToast(s, title) {
    Ext.toast({
        html: s,
        closable: false,
        width: 400,
        style: {'text-align': 'center'},
        align: 't',
        slideInDuration: 400
    });
}