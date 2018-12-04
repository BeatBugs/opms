
var pageSize = 366;
var myData,nameData;
var nameArray = new Array();
var value;
DWREngine.setAsync(false);
var userName = 'admin'
var store, grid,manualTagNamesStore

function getManualTagDatasByDateRange(startTime, endTime) {
    ManualTagDataService.getManualTagDatasByDateRange(startTime, endTime, {
        callback: function (str) {
            myData = {root:str}
        }
    })
}
function getAllManualTagNames() {
    ManualTagDataService.getAllManualTagNames({
        callback:function (str) {
            nameData = str
            nameData = {root:str}
        }
    })
}
function saveManualTagData(manualTagData) {
    ManualTagDataService.saveManualTagData(manualTagData,{
        callback:function(newManualTagData) {
            handleRefeshAction()
            showToast( '保存记录成功');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( '操作失败，错误信息：' + message); }
    });
}
function deleteManualTagDataByID(id) {
    ManualTagDataDao.deleteManualTagDataByID(id,{
        callback:function() {

            grid.getSelectionModel().selectNext(false);

            grid.store.remove(record);
            //store.reload();

            showToast( '删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( '操作失败，错误信息：' + message); }
    });
}
var d = new Date()
var startTime = new Date();
var endTime = new Date(d.setTime(d.getTime()+1*24*60*60*1000));
getManualTagDatasByDateRange(startTime, endTime)

Ext.onReady(function () {

    var manualTagNamesComboBoxEditor = new Ext.form.ComboBox({
        store: manualTagNamesStore,
        displayField: 'manualTagName',
        triggerAction: 'all',
        editable: false,
        lazyRender: true,
        allowBlank: false,
        listClass: 'x-combo-list-small'
    });

    manualTagNamesStore = Ext.create('Ext.data.ArrayStore', {

        data: nameData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                // totalProperty:'total',
            }
        },
        sortInfo : {
            field : 'manualTagName',
            direction : 'ASC'
        }


    });
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "name", mapping: "name", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "unit", mapping: "unit", type: 'string'},
            {name: "time", mapping: "time", type: 'date'},
            {name: "value", mapping: "value", type: 'float'},
            {name: "status", mapping: "status", type: 'int'},
            {name: "valueDesc", mapping: "valueDesc", type: 'string'}
        ],
        autoLoad: {strat: 0, limit: pageSize},
        data: myData,
        proxy: {

            reader: {
                type: 'json',
                rootProperty: 'root',
                // totalProperty:'total',
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

    var dateEditor = new Ext.form.DateField({
        format: 'Y-m-d',
        value: startTime,
        width: 92,
        readOnly: false,
        allowBlank: false
    });
    var tbar = [{
        xtype: 'datefield',
        id: "startDate",
        labelWidth: 65,
        fieldLabel: '开始时间',
        format: 'Y-m-d',
        width: 200,
        value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY,+0), "Y-m-d")
    },{
        xtype: 'timefield',
        id: "time1",
        format:'G:i:s',
        emptyText:'选择时间',
        width: 110,
        increment:10
    },, {
        xtype: 'datefield',
        id: "endDate",
        labelWidth: 65,
        fieldLabel: '结束时间',
        format: 'Y-m-d',
        width: 200,
        value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY,+1), "Y-m-d")
    },{
        xtype: 'timefield',
        id: "time2",
        format:'G:i:s',
        emptyText:'选择时间',
        width: 110,
        increment:10
    } ,'->', {
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
        xtype: 'gridpanel',
        title: '录入数据管理',
        width: window.innerWidth,
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
        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: [{
                xtype: 'splitbutton',
                ui: 'default-toolbar',
                text: '导入',
            }]
        },

        columns: [
            {header: "ID", width: 80, sortable: true, dataIndex: 'id', align: 'center', hidden: false},
            {
                header: "点名",
                flex:2,
                sortable: true,
                dataIndex: 'name',
                align: 'left',
                editor: manualTagNamesComboBoxEditor
            },
            {header: "描述", flex:2,sortable: true, dataIndex: 'descp', align: 'left', editor: null},
            {header: "单位", flex:1, sortable: true,  dataIndex: 'unit', align: 'center', editor: null},
            {
                header: "时间",
                flex:2,
                sortable: true,
                dataIndex: 'time',
                align: 'center',
                editor: dateEditor,
                renderer: formatDateTime
            },
            {
                header: "数值",
                flex:1,
                sortable: true,
                dataIndex: 'value',
                align: 'center',
                editor: new Ext.form.TextField({allowBlank: false}),
                renderer: formatNumber
            },
            {
                header: "状态",
                width: 80,
                sortable: true,
                dataIndex: 'status',
                align: 'center',
                editor: new Ext.form.TextField({allowBlank: false}),
                renderer: formatNumberNoDecimal,
                hidden: true
            },
            {
                header: "备注",
                flex:2,
                sortable: true,
                dataIndex: 'valueDesc',
                align: 'left',
                editor: new Ext.form.TextField({allowBlank: true})
            }
        ],
        loadMask: true,

        bbar: pagingBar,
        tbar: tbar

    });
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function handleRefeshAction() {
    DWREngine.setAsync(false);
    var start = new Date(Ext.getCmp('startDate').getValue())
    var end = new Date(Ext.getCmp('endDate').getValue())
    if (start > end) {
        showToast('时间段不存在')
    } else if (end - start > 365 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一年')
    } else {
        var newData = getManualTagDatasByDateRange(start, end)
        if (newData!=null) {
            store.loadData(newData.root)
        }else {
            store.loadData(newData)
        }
    }
}

function handlerInsertAction() {
    var record = {
        id: -1,
        name 		: null,
        descp 		: null,
        unit 		: null,
        time 		: null,
        value 		: null,
        status 		: 1,
        valueDesc 	: ''
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
    if (recordData['id'] == -1) {
        recordData['id'] = ''
    }
    if(recordData.id == 0){
        recordData.id = null;
    }

    if(recordData.name == null || recordData.name == ''){
        showToast('点名不能为空！');
        return;
    }
    if(recordData.time == null || recordData.time == ''){
        showToast('时间不能为空！');
        return;
    }
    if(recordData.value == null || recordData.value == ''){
        showToast('数值不能为空！');
        return;
    }
    if(recordData.status == null || recordData.status == ''){
        showToast('状态不能为空！');
        return;
    }

    if (!record[0].dirty) {
        //record.modified
        Ext.Msg.alert('提示', '没有信息被修改，不需要保存。');
        return;
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        saveManualTagData(recordData)

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

        if (btn != 'yes'){
            return;
        }

        if(recordData.id == null || recordData.id == ''){
            grid.getSelectionModel().selectNext(false);
            grid.store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            showToast( '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteManualTagDataByID(recordData.id)

    });
}

function formatNumberNoDecimal(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
        return number.toFixed(0);
    } else{
        return number;
    }
}

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