document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, unitIdData, setsIdData, yearData = [], monthData = [];
var nameArray = new Array();
var admin = true
var store, grid
var unitJsonMap = {}, suiteJsonMap = {}, proJsonMap = {}, typeJsonMap = {}, AggJsonMap = {}, TimeJsonMap = {}
DWREngine.setAsync(false);

for (var i = 0; i <= new Date().getFullYear() - 2015; i++) {
    var array = []
    array.push((2016 + i) + '')
    array.push((2016 + i) + '')
    yearData.push(array)
}
for (var i = 0; i < 12; i++) {
    var array = []
    array.push((i + 1) + '')
    array.push((1 + i) + '')
    monthData.push(array)
}

function searchTagInfos(year, month, keyword) {
    KpiTargetDao.search(year, month, keyword, '', '', 0, 80,
        {
            callback: function (str) {

                myData = str.root
            }

        });
    return myData
}

function saveKpiInfo(list) {
    KpiTargetDao.saveList(list,{
        callback:function(str) {
            showToast('保存成功')
            handlerRefreshAction()

        },
        timeout:300000,
        errorHandler:function(message) {
            grid.el.unmask();
            showToast( '操作失败，错误信息：' + message);
        }
    });
}
function deleteKpi(list) {
    KpiTargetDao.deleteList(list,{
        callback:function() {
            showToast('删除成功')
            handlerRefreshAction()
        },
        timeout:300000,
        errorHandler:function(message) {

            showToast( '操作失败，错误信息：' + message);
        }
    });

}




Ext.onReady(function () {
    searchTagInfos(new Date().getFullYear(), new Date().getMonth() + 1, '')

    var yearCombox = {
        store: yearData,
        id: "yearCombox",
        fieldLabel: '年份',
        xtype: 'combo',
        displayField: 'name',
        valueField: 'name',
        width: 120,
        labelWidth: 30,
        value: new Date().getFullYear(),
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px',
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    };
    var monthCombox = {
        store: monthData,
        xtype: 'combo',
        id: "monthCombox",
        fieldLabel: '月份',
        displayField: 'name',
        valueField: 'name',
        width: 120,
        labelWidth: 30,
        value: new Date().getMonth() + 1,
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px',
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    };


    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id",			mapping:"id", 		 		type : 'int',		allowBlank: true},
            {name: "evalYear", 		mapping:"evalYear",   		type : 'int',		allowBlank: false},
            {name: "evalMonth", 	mapping:"evalMonth",   		type : 'int',		allowBlank: false},
            {name: "name", 			mapping:"name",				type : 'string',	allowBlank: false},
            {name: 'descp', 		mapping:'descp',   			type : 'string',	allowBlank: true},
            {name: 'units', 		mapping:'units',   			type : 'string',	allowBlank: true},
            {name: "param1", 		mapping:"param1",   		type : 'string',	allowBlank: true},
            {name: "param2",		mapping:"param2",   		type : 'string',	allowBlank: true},
            {name: "targetScript", 	mapping:"targetScript",   	type : 'string',	allowBlank: false},
            {name: "targetList", 	mapping:"targetList",   	type : 'string',	allowBlank: true},
            {name: "targetDesc", 	mapping:"targetDesc",   	type : 'string',	allowBlank: true}
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



    var textAreaEditor = new Ext.form.TextArea({
        allowBlank: true,
        readOnly: (admin ? false : true),
        autoScroll: true,
        grow: true,
        growMax: 300,
        width: 1200,
        style: {color: 'blue', fontSize: '12px', fontFamily: 'Courier New'}
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

    var proComboBox = null

    var targetStore = new Ext.data.SimpleStore({
        fields: ['name', 'value'],
        data: [['本窗口', ''], ['顶窗口', '_top'], ['空窗口', '_blank'], ['新窗口', '_new']]
    });

    // top tool bar
    var tbar = [
        yearCombox,
        monthCombox,
        {
            xtype: 'textfield',
            fieldLabel: '关键字',
            labelWidth: 60,
            width: 160,
            name: 'keyword',
            id: "keyword"
        },
        '->', {
            text: '查询', iconCls: 'refresh', tooltip: '查询表格', handler: handlerSearchAction
        }, {
            text: '刷新', iconCls: 'refresh', tooltip: '刷新表格', handler: handlerRefreshAction
        },
        {
            text: '增加', iconCls: 'add', tooltip: '新增一行', handler: handlerInsertAction
        },
        {
            text: '删除', iconCls: 'remove', tooltip: '删除选中行', handler:handlerDeleteAction
        },
        {
            text: '保存', iconCls: 'save', tooltip: '保存所有修改', handler: handlerSaveAction
        }
        //{ text: '清空', iconCls : 'remove', 	tooltip:'清空表格', 		handler : function(){onRemoveAll();}}
    ];
    // It can be extended to provide custom or reusable ColumnModels
    var colModel = [
        new Ext.grid.RowNumberer(),
        {header: "ID", 		  	dataIndex: 'id', 			width: 60, 	sortable: true,  align: 'center',	hidden:false},
        {header: "年份", 		dataIndex: 'evalYear', 		width: 60, 	sortable: true,  align: 'center', 	editor: yearCombox},
        {header: "月份", 		dataIndex: 'evalMonth', 	width: 60, 	sortable: true,  align: 'center', 	editor: monthCombox},
        {header: "指标点名", 	dataIndex: 'name', 			flex:2, 	sortable: true,  align: 'center', 	editor: kpiNameEditor},
        {header: '指标描述',		dataIndex: 'descp', 		flex:1, 	sortable: true,  align: 'center'},
        {header: '指标单位',		dataIndex: 'units', 		flex:1,  sortable: true,  align: 'center'},
        {header: "第一参数点名", dataIndex: 'param1', 		flex:1, 	sortable: true,  align: 'center', 	editor: 'textfield'},
        {header: "第二参数点名", dataIndex: 'param2', 		flex:1, 	sortable: true,  align: 'center', 	editor: 'textfield'},
        {header: "基准值脚本", 	dataIndex: 'targetScript', 	flex:3, sortable: true,  align: 'center', 	editor: textAreaEditor},
        {header: "基准值列表", 	dataIndex: 'targetList',	flex:1.5, 	sortable: true,  align: 'center', 	editor: textAreaEditor},
        {header: "基准值描述", 	dataIndex: 'targetDesc', 	flex:1, 	sortable: true,  align: 'center', 	editor: textAreaEditor}
    ];
    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '考核基准管理',
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

        columns: colModel,
        loadMask: true,

        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function handlerSearchAction() {
    DWREngine.setAsync(false);
    var newData = searchTagInfos(Ext.getCmp('yearCombox').getValue(), Ext.getCmp('monthCombox').getValue(), Ext.getCmp('keyword').getValue())
    store.loadData(newData)
}

function handlerRefreshAction() {
    DWREngine.setAsync(false);
    Ext.getCmp('yearCombox').setValue(new Date().getFullYear())
    Ext.getCmp('monthCombox').setValue(new Date().getMonth() + 1)
    Ext.getCmp('keyword').setValue('')
    var newData = searchTagInfos(new Date().getFullYear(), new Date().getMonth() + 1, '')
    store.loadData(newData)
}

function handlerInsertAction() {
    var record = {
        id: -1,
        evalYear: (new Date()).getFullYear(),
        evalMonth: (new Date()).getMonth() + 1,
        name: '',
        descp: '',
        units: '',
        param1: '',
        param2: '',
        targetScript: '',
        targetList: '',
        targetDesc: '',
    };

    var scrollTop = grid.getView().getEl().getScrollTop()

    store.insert(0, record);
    grid.getView().getEl().setScrollTop(scrollTop);
}


function formatTime1(str) {
    var number = str / 60
    if (number >= 60) {
        number = number / 60
        number = number + '小时'
    } else {
        number = number + '分钟'
    }
    return number
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
    if (recordData.name == null ||recordData.name == '') {
        showToast( '指标名字不能为空！');
        return;
    }
    if (recordData.targetScript == null || recordData.targetScript == '') {
        showToast( '基准值脚本不能为空！');
        return;
    }
    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        var array = []
        array.push(recordData)
        saveKpiInfo(array)
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

        if (recordData.id == null || typeof recordData.id == 'string' && recordData.id == '') {
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if (record[0].dirty) {
            //record.modified
            showToast('操作失败，记录已经被修改，不允许删除。');
            return;
        }
        var array=[]
        array.push(recordData)
        deleteKpi(array)

    });

}

function handlerCleanAction() {
// Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除查询结果中的所有记录?<br/>强烈建议您点击【导出】按钮将查询结果导出备份后再进行删除操作！', function (btn) {

        if (btn != 'yes') {
            return;
        }
        deleteTagInfosByColumn(column, "")

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