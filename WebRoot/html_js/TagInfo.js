document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, roleData;
var nameArray = new Array();
var admin = true
var store, typeStore, rolesStore, grid
DWREngine.setAsync(false);

if (column == null || column == '') {
    column = 'NAME';
}

column = column.toUpperCase();

if (keyword == null) {
    keyword = '';
}

if (calc == null) {
    calc = false;
}
var gridTitle = '';
var allowSearch = false;

function searchTagInfos(column, keyWords) {
    TagInfoService.searchTagInfos(column, keyWords, 0, 80,
        {
            callback: function (str) {
                for (var i =0;i<str.root.length;i++){
                    str.root[i].ifExamine = Boolean(str.root[i].ifExamine)
                }
                myData = str
            }

        });
    return myData
}

function saveTagInfo(tagInfo){
    TagInfoDao.saveTagInfo(tagInfo,{
        callback: function (str) {

            handleRefeshAction()

            showToast('保存记录成功');

        },
        timeout: 5000,
        errorHandler:function(message) {showToast('操作失败，错误信息：' + message); }

    })
}

function deleteTagInfoByID(id){
    TagInfoDao.deleteTagInfoByID(id,{
        callback:function() {

            handleRefeshAction()
            showToast( '删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast(  '操作失败，错误信息：' + message); }
    });

}

function deleteTagInfosByColumn(column,keyword){
    TagInfoDao.deleteTagInfosByColumn(column,keyword,{
        callback:function() {

            handleRefeshAction()

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) {  showToast('操作失败，错误信息：' + message); }
    });
}
// qurey()
Ext.onReady(function () {
    searchTagInfos(column, "")


    if (column == null || column == '') {
        gridTitle = '全部测点管理';
        allowSearch = true;
    } else if (keyword == null || keyword == '') {
        gridTitle = '全部测点管理';
        allowSearch = true;

    } else {
        gridTitle = '[' + column + ']包含[' + keyword + ']的测点管理';
    }

    if (column == 'TYPE' && keyword == 'C') {
        gridTitle = '计算点管理';
    }

    if (column == 'TYPE' && keyword == 'B') {
        gridTitle = '逻辑点管理';
    }

    if (!admin) {
        gridTitle = '测点信息查询';
    }

    typeStore = new Ext.data.SimpleStore({
        fields: ['name', 'value'],
        data: [['模拟点', 'A'], ['数字点', 'D'], ['逻辑点', 'B'], ['计算点', 'C']]
    });
    rolesStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "name", mapping: "name", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "unit", mapping: "unit", type: 'string'},
            {name: "ifExamine", mapping: "ifExamine", type: 'boolean'},
            {name: "weight", mapping: "weight", type: 'int'},
            {name: "type", mapping: "type", type: 'string'},
            {name: "location", mapping: "location", type: 'string'},
            {name: "min", mapping: "min", type: 'float'},
            {name: "lowlow", mapping: "lowlow", type: 'float'},
            {name: "low", mapping: "low", type: 'float'},
            {name: "typical", mapping: "typical", type: 'float'},
            {name: "high", mapping: "high", type: 'float'},
            {name: "highhigh", mapping: "highhigh", type: 'float'},
            {name: "max", mapping: "max", type: 'float'},
            {name: "func", mapping: "func", type: 'string'},
            {name: "test", mapping: "test", type: 'string'},
            {name: "roles", mapping: "roles", type: 'string'}
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

    var rolesComboBoxEditor = null;

    var textAreaEditor = new Ext.form.TextArea({
        allowBlank: true,
        readOnly: (admin ? false : true),
        autoScroll: true,
        grow: true,
        growMax: 300,
        width: 1200,
        style: {color: 'blue', fontSize: '12px', fontFamily: 'Courier New'}
    });
    var textFieldEditor = new Ext.form.TextField({allowBlank: false});
    var numberFieldEditor = new Ext.form.NumberField({allowBlank: false, decimalPrecision: 2});
    var typeComboBoxEditor = new Ext.form.ComboBox({
        store: typeStore,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        editable: true,
        lazyRender: false,
        emptyText: '选择类型...',
        selectOnFocus: true,
        listClass: 'x-combo-list-small'
    });

    // Search Input
    var searchInput = new Ext.ux.SearchField({
        id: 'SearchInput',
        value: "",
        width: 230,
        onSearchClick: function () {
            onSearch();
        },
        onSearchCleanClick: function () {
            onSearch();
        }
    });

    function focusSearchInput(item, checked) {
        searchInput.focus(100);
        if (checked == true) {
            column = item.config.value;
        }
    }


    var searchMenu = new Ext.menu.Menu();
    searchMenu.add({
        text: '测点名字',
        value: 'NAME',
        checked: column == 'NAME' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '测点描述',
        value: 'DESCP',
        checked: column == 'DESCP' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '测点类型',
        value: 'TYPE',
        checked: column == 'TYPE' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '测点单位',
        value: 'UNIT',
        checked: column == 'UNIT' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '测点位置',
        value: 'LOCATION',
        checked: column == 'LOCATION' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '计算公式',
        value: 'FUNC',
        checked: column == 'FUNC' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    searchMenu.add({
        text: '测试条件',
        value: 'TEST',
        checked: column == 'TEST' ? true : false,
        group: 'searchKey',
        checkHandler: focusSearchInput
    });
    if (admin) {

        searchMenu.add({
            text: '允许角色',
            value: 'ROLES',
            checked: column == 'ROLES' ? true : false,
            group: 'searchKey',
            checkHandler: focusSearchInput
        });

    }

    var columnArray = [
        new Ext.grid.RowNumberer(),
        {header: "ID", width: 80, sortable: true, dataIndex: 'id', align: 'center', hidden: true},
        {
            header: "测点名字",
            flex: 1,
            sortable: true,
            dataIndex: 'name',
            align: 'center',
            editor: (admin ? textFieldEditor : null)
        },
        {
            header: "测点描述",
            flex: 1,
            sortable: true,
            dataIndex: 'descp',
            align: 'center',
            editor: (admin ? textAreaEditor : null)
        },
        {
            header: "工程单位",
            width: 80,
            sortable: true,
            dataIndex: 'unit',
            align: 'center',
            editor: (admin ? textFieldEditor : null)
        },
        {
            header: "测点类型",
            width: 80,
            sortable: true,
            dataIndex: 'type',
            align: 'center',
            editor: (admin ? typeComboBoxEditor : null)
        },
        {header: "是否考核", width:80, dataIndex: "ifExamine", sortable: true, align: 'center', xtype: 'checkcolumn'},
        {
            header: "指标权重",
            flex: 1,
            sortable: true,
            dataIndex: 'weight',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber
        },
        {
            header: "关联测点",
            width: 80,
            sortable: true,
            dataIndex: 'location',
            align: 'center',
            editor: (admin ? textAreaEditor : null),
            hidden: true
        },
        {
            header: "最小值",
            width: 80,
            sortable: true,
            dataIndex: 'min',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "低低报",
            width: 80,
            sortable: true,
            dataIndex: 'lowlow',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "低报值",
            width: 80,
            sortable: true,
            dataIndex: 'low',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "典型值",
            width: 80,
            sortable: true,
            dataIndex: 'typical',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "高报值",
            width: 80,
            sortable: true,
            dataIndex: 'high',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "高高报",
            width: 80,
            sortable: true,
            dataIndex: 'highhigh',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "最大值",
            width: 80,
            sortable: true,
            dataIndex: 'max',
            align: 'center',
            editor: (admin ? numberFieldEditor : null),
            renderer: formatNumber,
            hidden: true
        },
        {
            header: "计算逻辑",
            flex: 3,
            sortable: true,
            dataIndex: 'func',
            align: 'center',
            editor: textAreaEditor,
            hidden: (calc == true ? false : true)
        },
        {
            header: "测试条件",
            width: 80,
            sortable: true,
            dataIndex: 'test',
            align: 'center',
            editor: (admin ? textAreaEditor : null),
            hidden: true
        }
    ];

    if (admin) {
        columnArray.push({
            header: "允许角色",
            width: 60,
            sortable: true,
            locked: false,
            dataIndex: 'roles',
            align: 'center',
            editor: (admin ? rolesComboBoxEditor : null),
            hidden: true
        });
    }

    // var colModel = new Ext.grid.ColumnModel(columnArray);
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

    // top tool bar
    var tbar;
    tbar = ['->', {
        text: '刷新',
        iconCls: 'refresh',
        tooltip: '刷新表格',
        handler: handleRefeshAction
    }, {
        text: '数据',
        iconCls: 'arrow_inout',
        tooltip: '查询测点实时历史数据',
        handler: tagDataSearchHandler
    }
    ];
    if (admin) {
        tbar.push({
            text: '增加',
            iconCls: 'add',
            tooltip: '增加一行<br/>需要点击[保存]按钮保存',
            handler : handlerInsertAction
        }, {
            text: '保存',
            iconCls: 'accept',
            tooltip: '保存修改',
            handler: handlerSaveAction
        }, {
            text: '删除',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler : handlerDeleteAction
        }, {
            text: '清空',
            iconCls: 'application_lightning',
            tooltip: '删除查询结果',
            handler : handlerCleanAction
        })
    }
    if (allowSearch) {
        tbar.unshift({
            text: '查询: ',
            iconCls: 'query',
            tooltip: '设置查询字段',
            menu: searchMenu
        }, {
            xtype: 'triggerfield',
            id: 'triggerfield',
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
            onTrigger1Click: function (btn) {
                Ext.getCmp('triggerfield').setValue("")

            },
            onTrigger2Click: function (btn) {
                DWREngine.setAsync(false);
                var newData = searchTagInfos(column, Ext.getCmp('triggerfield').getValue())
                store.loadData(newData.root)
            }
        })
    }

    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '指标测点管理',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],
        // colModel:colModel,
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
                    importTag()
                }
            },{}, {
                ui: 'default-toolbar',
                xtype: 'splitbutton',
                text: '导出',
                menu: {
                    defaults: {},
                    items: [{
                        text: 'Excel xlsx',
                        handler: function () {

                            exportTag()
                        }
                    }
                    ]
                }
            }]
        },
        columns: columnArray,
        loadMask: true,

        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});


function exportTag() {

    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};

        params = Ext.applyIf(params, {
            column: column,
            keyword: '',
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

function importTag() {

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


function handleRefeshAction() {
    DWREngine.setAsync(false);
    var newData = searchTagInfos(column, '')
    store.loadData(newData.root)
}

function handlerInsertAction() {
    var record = {
        id		  	: -1,
        name 		: !allowSearch && column == 'NAME'? keyword : '',
        descp 		: '',
        unit 		: '',
        type 		: !allowSearch && column == 'TYPE'? keyword : (calc == true ?  'C' : 'A'),
        location 	: '',
        min 		: 0,
        lowlow 		: null,
        low 		: null,
        typical 	: null,
        high 		: null,
        highhigh 	: null,
        max 		: 10000,
        func 		: '',
        test 		: ''
    };

    store.insert(0, record);
}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data

    if (recordData.ifExamine == true){
        recordData.ifExamine = 1
    }else {
        recordData.ifExamine = 0
    }
    if (recordData['id'] == -1) {
        recordData['id'] = ''
    }
    if (recordData.name == null || recordData.name == '') {
        showToast('测点名字不能为空！');
        return;
    }
    if (recordData.descp == null || recordData.descp == '') {
        showToast('测点描述不能为空！');
        return;
    }
    if (recordData.unit == null || recordData.unit == '') {
        showToast('工程单位不能为空！');
        return;
    }
    if (recordData.type == null || recordData.type == '') {
        showToast('测点类型不能为空！');
        return;
    }
    if (recordData.min == null) {
        showToast('最小值不能为空！');
        return;
    }
    if (recordData.max == null) {
        showToast('最大值不能为空！');
        return;
    }
    if (recordData.max == recordData.min) {
        showToast('最大值与最小值不能相等！');
        return;
    }

    if (!record[0].dirty) {
        //record.modified
        showToast('没有信息被修改，不需要保存。');
        return;
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        saveTagInfo(recordData)


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
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function(btn){

        if (btn != 'yes'){
            return;
        }

        if(recordData.id == null || typeof recordData.id == 'string' && recordData.id == ''){
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            showToast( '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteTagInfoByID(recordData.id)

    });

}

function handlerCleanAction() {
// Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除查询结果中的所有记录?<br/>强烈建议您点击【导出】按钮将查询结果导出备份后再进行删除操作！', function(btn){

        if (btn != 'yes'){
            return;
        }
        deleteTagInfosByColumn(column,"")

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