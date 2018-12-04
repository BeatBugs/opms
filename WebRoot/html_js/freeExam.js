document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData, kpiData,kpiDetail;
var nameArray = new Array();
var rolesWindow
var value = 'TITLE';
var store, grid, leftGrid, allUserStore, rightGrid,valueFlag=0,timeFlag =0
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);

function getByReason(reason) {
    FreeExamineDao.getByReason(reason,{
        callback:function (str) {
            myData = str
        }
    })
    return myData
}
function getAllKpi() {
    KpiInfoDao.getByYearMonth(new Date().getFullYear(),new Date().getMonth()+1,{
        callback:function (str) {

            kpiData = {root:str}
        }
    })
    return kpiData
}
function deleteById(id) {
    FreeExamineDao.deleteByID(id,{
        callback:function (str) {
            handleRefeshAction()
            showToast('删除成功');

        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
function saveExame(json,array) {
    FreeExamineDao.save(json,array,{
        callback:function (str) {
            handleRefeshAction()
            rolesWindow.close()
            showToast('保存记录成功');
            
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
function getKpiMapInfoListByPId(id){
    FreeExamineIndexDao.getKpiMapInfoListByPId(id,{
        callback:function (str) {
            kpiDetail = str
        }
    })
    return kpiDetail
}
Ext.onReady(function () {
    getByReason('')

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name:'id',mapping:'id',type:'int'},
            {name: "reason", mapping: "reason", type: 'string'},
            {name: "startTime", mapping: "startTime", type: 'string'},
            {name: "endTime", mapping: "endTime", type: 'string'}
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
    columnsArray = [
        {header: '主键', width:100, dataIndex: "id", sortable: true, align: 'center'},
        {header: "免考原因", flex: 1, dataIndex: "reason", sortable: true, align: 'center'},
        {header: "开始时间", flex: 1, dataIndex: "startTime", sortable: true, align: 'center',renderer: formatRealTime},
        {header: "结束时间", flex: 1, dataIndex: "endTime", sortable: true, align: 'center',renderer: formatRealTime},
        {

            header: "指标详情",
            width: 100,
            sortable: true,
            align: 'center',
            renderer: formatText
        }
    ]
    var tbar;
    tbar = [
        {
            xtype: 'textfield',
            fieldLabel: '调整原因',
            labelWidth: 60,
            width: 160,
            name: 'indexreason',
            id: "indexreason"
        }, '->',
        {
            text: '刷新',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handleRefeshAction
        },
        {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        },
        {
            text: '新增',
            iconCls: 'add',
            tooltip: '增加',
            handler: handlerAddAction
        },
        {
            text: '修改',
            iconCls: 'add',
            tooltip: '增加',
            handler: handlerEditAction
        },
        {
            text: '删除',
            iconCls: 'add',
            tooltip: '删除',
            handler: handlerDeleteAction
        }

    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '时段免考核',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],

        viewConfig: {forceFit: true},
        store: store,
        header: {
            itemPosition: 1, // after title before collapse tool
            items: []
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

function showKpiDetail(id) {
    getKpiMapInfoListByPId(id)
    allUserStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: 'name', mapping: 'name', type: 'string'},
            {name: 'descp', mapping: 'descp', type: 'string'}
        ],
        data: kpiDetail,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        },
        sorters: {
            property: 'sort',
            direction: 'ASC'
        },

    });
    centerGrid = new Ext.grid.Panel({
        header:false,
        region: 'center',
        border: 'solid',
        store: allUserStore,
        layout: 'fit',


        columnLines: true,
        columns: [
            new Ext.grid.RowNumberer(),
            {header: "指标名称", flex: 1, dataIndex: "name", sortable: true, align: 'center'},
            {header: "指标描述", flex: 1, dataIndex: "descp", sortable: true, align: 'center'},

        ],
        height: window.innerHeight,

    })
    var showWindow = new Ext.Window({
        title: '相关指标',
        width: 400,
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

            centerGrid

        ]
    })
    showWindow.show()

}

var textAreaEditor = new Ext.form.TextArea({
    allowBlank: true,
    autoScroll: true,
    grow: true,
    growMax: 300,
    width: 200,
    height:200,
    style: {color: 'blue', fontSize: '12px', fontFamily: 'Courier New'}
});

function formatRealTime(date) {
    return new Date(date).dateFormat('Y-M-d h:m:s');

}
function formatText(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"details(\'{0}\')\">查看</a>', rowIndex);
}
function details(row) {
    var record = grid.getStore().getAt(row).data
    showKpiDetail(record.id)
}

function handlerEditAction(){
    getAllKpi()
    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    getKpiMapInfoListByPId(recordData.id)
    var leftStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "name", mapping: "name", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "sets", mapping: "sets", type: 'string'},
            {name: "units", mapping: "units", type: 'string'}
        ],
        autoLoad: true,
        data: kpiData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
            }
        },
        sorters: {
            property: 'name',
            direction: 'ASC'
        },

    });

    var rightStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "name", mapping: "name", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "units", mapping: "units", type: 'string'}
        ],
        data:kpiDetail,
        autoLoad: true,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
            }
        },
        sorters: {
            property: 'id',
            direction: 'ASC'
        },

    });
    leftForm = new Ext.FormPanel({
        header: false,
        region: 'west',

        border: 'false',
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',
        width: 260,
        layout: 'column',
        frame: true,
        defaults: {width: 220},
        items: [
            {
                labelWidth: 60,
                xtype     : 'textareafield',
                id: 'reasonEdit',
                name: 'reason',
                fieldLabel: '调整原因',
                value:recordData.reason,
                editor:textAreaEditor,
                style: {margin: '2px auto'}
            },
            {
                xtype: 'fieldset',
                flex: 1,
                id:'setByTimeEdit',
                title: '按时间调整',
                checkboxToggle: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: false
                },
                items: [
                    {
                        xtype: 'datefield',
                        labelWidth: 60,
                        id:'stDateEdit',
                        fieldLabel: '开始日期',
                        format: 'Y-m-d',
                        width: 160,
                        value: new Date(recordData.startTime).dateFormat('Y-M-d')
                    }, {
                        xtype: 'timefield',
                        labelWidth: 60,
                        id:'stTimeEdit',
                        value:new Date(recordData.startTime).dateFormat('h:m:s'),
                        fieldLabel: '开始时间',
                        format: 'G:i:s',
                        increment: 10
                    },

                    {
                        xtype: 'datefield',
                        labelWidth: 60,
                        fieldLabel: '结束日期',
                        id:'edDateEdit',
                        format: 'Y-m-d',
                        width: 160,
                        value: new Date(recordData.endTime).dateFormat('Y-M-d')
                    }, {

                        xtype: 'timefield',
                        format: 'G:i:s',
                        labelWidth: 60,
                        value:new Date(recordData.endTime).dateFormat('h:m:s'),
                        id:'edTimeEdit',
                        fieldLabel: '结束时间',
                        width: 110,
                        increment: 10
                    }
                ]

            }

        ],
        height: window.innerHeight

    })
    Ext.getCmp('setByTimeEdit').expand()
    valueFlag=1

    var weatGrid = new Ext.grid.Panel({
        store:leftStore,
        region: 'west',
        border:true,
        height: window.innerHeight,
        selType: 'checkboxmodel',
        title: '全部指标',
        columns: [
            {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
            {header: "指标描述", flex:1, sortable: true, dataIndex: 'descp', align: 'center'}
        ],
        width:350
    })
    var eastGrid = new Ext.grid.Panel({
        store:rightStore,
        region: 'east',
        title: '已选指标',
        border:true,
        height: window.innerHeight,
        selType: 'checkboxmodel',
        columns: [
            {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
            {header: "指标描述", flex:1, sortable: true, dataIndex: 'descp', align: 'center'}
        ],
        width:350
    })
    var centerForm = new Ext.panel.Panel({
        region: 'center',
        height:window.innerHeight,
        requires: [
            'Ext.layout.container.VBox'
        ],
        header:false,
        border:false,
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        defaults:{
            border:false
        },
        items:[
            {
                flex:1,
                items:[
                    {
                        xtype:'button',
                        text: '增加',
                        height:30,
                        margin:'150 5 0 5',
                        iconCls: 'add',
                        tooltip: '增加',
                        handler: handlerAddKpiAction
                    }
                ]

            }, {
                flex:1,
                items:[
                    {
                        xtype:'button',
                        text: '删除',
                        height:30,
                        margin:'0 5 100 5',
                        iconCls: 'add',
                        tooltip: '增加',
                        handler: handlerDelKpiAction
                    }
                ]
            }
        ]
    })

    centerPanel = new Ext.panel.Panel({
        region:'center',
        layout: 'border',
        width: window.innerWidth,
        border:false,
        height: window.innerHeight,
        items: [
            weatGrid,
            centerForm,
            eastGrid
        ]
    })
    function handlerAddKpiAction() {
        var newRecord = rightStore.getData().items

        var record = weatGrid.getSelection()
        var newData = []
        if (newRecord.length>0) {
            for (var i=0;i<newRecord.length;i++) {
                var json = {}
                json['name'] = newRecord[i].data.name
                json['descp'] = newRecord[i].data.descp
                json['units'] = newRecord[i].data.units
                newData.push(json)
            }
        }

        for (var i = 0;i<record.length;i++){
            var flag = 0
            var json = {}
            json['name'] = record[i].data.name
            json['descp'] = record[i].data.descp
            json['units'] = record[i].data.units
            if (newData.length>0){
                for (var j=0;j<newData.length;j++){
                    if(json.name ==newData[j].name){
                        flag=1
                        break
                    }
                }
            }
            if (flag ==1){
                continue
            }
            else {
                newData.push(json)
            }
        }
        rightStore.loadData(newData)
        weatGrid.getSelectionModel().deselect(record);
    }
    function handlerDelKpiAction() {
        var record = eastGrid.getSelection()
        Ext.Array.each(record, function(item) {
            rightStore.remove(item);
        });
    }
    function handlerSaveAction() {
        var record = rightStore.getData().items
        var savaData = []
        for (var i=0;i<record.length;i++){
            savaData.push(record[i].data.name)
        }
        var json={}
        json['id']=recordData.id
        json['reason']= Ext.getCmp('reasonEdit').getValue()

        if (Ext.getCmp('stTimeEdit').getValue()==null){
            json['startTime'] = Ext.getCmp('stDateEdit').getValue().getTime()

        } else {
            json['startTime'] = Ext.getCmp('stDateEdit').getValue().getTime()  + Ext.getCmp('stTimeEdit').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()

        }if (Ext.getCmp('edTimeEdit').getValue()==null) {
            json['endTime'] = Ext.getCmp('edDateEdit').getValue().getTime()
        }else {
            json['endTime'] = Ext.getCmp('edDateEdit').getValue().getTime()  + Ext.getCmp('edTimeEdit').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()
        }
        saveExame(json,savaData)
    }

    rolesWindow = new Ext.Window({
        title: '修改',
        width: 1050,
        height: 550,
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
            leftForm,
            centerPanel,
        ],
        buttonAlign:'center',
        buttons:[
            {
                text:'保存',
                handler:function () {
                    handlerSaveAction()
                }
            },
            {
                text:'取消',
                handler:function () {
                    rolesWindow.close()
                }
            }]
    })
    rolesWindow.show()
}
function handlerQueryAction() {
    var newData = getByReason(Ext.getCmp('indexreason').getValue())
    store.loadData(newData)

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

        if (record[0].dirty) {
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteById(recordData.id)

    });
}

function handlerAddAction() {
    getAllKpi()
    var leftStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "name", mapping: "name", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "sets", mapping: "sets", type: 'string'},
            {name: "units", mapping: "units", type: 'string'}
        ],
        autoLoad: true,
        data: kpiData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
            }
        },
        sorters: {
            property: 'name',
            direction: 'ASC'
        },

    });

    var rightStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "name", mapping: "name", type: 'string'},
            {name: "descp", mapping: "descp", type: 'string'},
            {name: "units", mapping: "units", type: 'string'}
        ],
        autoLoad: true,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root',
                totalProperty: 'total'
            }
        },
        sorters: {
            property: 'id',
            direction: 'ASC'
        },

    });
    leftForm = new Ext.FormPanel({
        header: false,
        region: 'west',

        border: 'false',
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',
        width: 260,
        layout: 'column',
        frame: true,
        defaults: {width: 220},
        items: [
            {
                labelWidth: 60,
                xtype     : 'textareafield',
                id: 'reason',
                name: 'reason',
                fieldLabel: '调整原因',
                editor:textAreaEditor,
                style: {margin: '2px auto'}
            },
            {
                xtype: 'fieldset',
                flex: 1,
                id:'setByTime',
                title: '按时间调整',
                checkboxToggle: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: false
                },
                items: [
                    {
                        xtype: 'datefield',
                        labelWidth: 60,
                        id:'stDate',
                        fieldLabel: '开始日期',
                        format: 'Y-m-d',
                        width: 160,
                        value: new Date().dateFormat('Y-M-d')
                    }, {
                        xtype: 'timefield',
                        labelWidth: 60,
                        id:'stTime',
                        value:'00:00:00',
                        fieldLabel: '开始时间',
                        format: 'G:i:s',
                        increment: 10
                    },

                    {
                        xtype: 'datefield',
                        labelWidth: 60,
                        fieldLabel: '结束日期',
                        id:'edDate',
                        format: 'Y-m-d',
                        width: 160,
                        value: new Date().dateFormat('Y-M-d')
                    }, {

                        xtype: 'timefield',
                        format: 'G:i:s',
                        labelWidth: 60,
                        value:'00:00:00',
                        id:'edTime',
                        fieldLabel: '结束时间',
                        width: 110,
                        increment: 10
                    }
                ],

            }

        ],
        height: window.innerHeight

    })
    Ext.getCmp('setByTime').expand()
    valueFlag=1

    var weatGrid = new Ext.grid.Panel({
        store:leftStore,
        region: 'west',
        border:true,
        height: window.innerHeight,
        selType: 'checkboxmodel',
        title: '全部指标',
        columns: [
            {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
            {header: "指标描述", flex:1, sortable: true, dataIndex: 'descp', align: 'center'}
        ],
        width:350
    })
    var eastGrid = new Ext.grid.Panel({
        store:rightStore,
        region: 'east',
        title: '已选指标',
        border:true,
        height: window.innerHeight,
        selType: 'checkboxmodel',
        columns: [
            {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
            {header: "指标描述", flex:1, sortable: true, dataIndex: 'descp', align: 'center'}
        ],
        width:350
    })
    var centerForm = new Ext.panel.Panel({
        region: 'center',
        height:window.innerHeight,
        requires: [
            'Ext.layout.container.VBox'
        ],
        header:false,
        border:false,
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        defaults:{
            border:false
        },
        items:[
            {
                flex:1,
                items:[
                    {
                        xtype:'button',
                        text: '增加',
                        height:30,
                        margin:'150 5 0 5',
                        iconCls: 'add',
                        tooltip: '增加',
                        handler: handlerAddKpiAction
                    }
                ]

            }, {
                flex:1,
                items:[
                    {
                        xtype:'button',
                        text: '删除',
                        height:30,
                        margin:'0 5 100 5',
                        iconCls: 'add',
                        tooltip: '增加',
                        handler: handlerDelKpiAction
                    }
                ]
            }
        ]
    })

    centerPanel = new Ext.panel.Panel({
        region:'center',
        layout: 'border',
        width: window.innerWidth,
        border:false,
        height: window.innerHeight,
        items: [
            weatGrid,
            centerForm,
            eastGrid
        ]
    })
    function handlerAddKpiAction() {
        var newRecord = rightStore.getData().items

        var record = weatGrid.getSelection()
        var newData = []
        if (newRecord.length>0) {
            for (var i=0;i<newRecord.length;i++) {
                var json = {}
                json['name'] = newRecord[i].data.name
                json['descp'] = newRecord[i].data.descp
                json['units'] = newRecord[i].data.units
                newData.push(json)
            }
        }

        for (var i = 0;i<record.length;i++){
            var flag = 0
            var json = {}
            json['name'] = record[i].data.name
            json['descp'] = record[i].data.descp
            json['units'] = record[i].data.units
            if (newData.length>0){
                for (var j=0;j<newData.length;j++){
                    if(json.name ==newData[j].name){
                        flag=1
                        break
                    }
                }
            }
            if (flag ==1){
                continue
            }
            else {
                newData.push(json)
            }
        }
        rightStore.loadData(newData)
        weatGrid.getSelectionModel().deselect(record);
    }
    function handlerDelKpiAction() {
        var record = eastGrid.getSelection()
        Ext.Array.each(record, function(item) {
            rightStore.remove(item);
        });
    }
    function handlerSaveAction() {
        var record = rightStore.getData().items
        var savaData = []
        for (var i=0;i<record.length;i++){
            savaData.push(record[i].data.name)
        }
        var json={}
        json['id']=''
        json['reason']= Ext.getCmp('reason').getValue()

        if (Ext.getCmp('stTime').getValue()==null){
            json['startTime'] = Ext.getCmp('stDate').getValue().getTime()

        } else {
            json['startTime'] = Ext.getCmp('stDate').getValue().getTime()  + Ext.getCmp('stTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()

        }if (Ext.getCmp('edTime').getValue()==null) {
            json['endTime'] = Ext.getCmp('edDate').getValue().getTime()
        }else {
            json['endTime'] = Ext.getCmp('edDate').getValue().getTime()  + Ext.getCmp('edTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()
        }
        saveExame(json,savaData)
    }

    rolesWindow = new Ext.Window({
        title: '新增',
        width: 1050,
        height: 550,
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
            leftForm,
            centerPanel,
        ],
        buttonAlign:'center',
        buttons:[
            {
                text:'保存',
                handler:function () {
                    handlerSaveAction()
                }
            },
            {
                text:'取消',
                handler:function () {
                    rolesWindow.close()
                }
            }]
    })
    rolesWindow.show()
}
function handleRefeshAction() {
    Ext.getCmp('indexreason').setValue('')
    var newData = getByReason('')
    store.loadData(newData)
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