document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, unitIdData, setsIdData,yearData=[],monthData=[];
var nameArray = new Array();
var admin = true
var store, typeStore, grid
var unitJsonMap = {}, suiteJsonMap = {},proJsonMap={},typeJsonMap={},AggJsonMap={},TimeJsonMap={}
DWREngine.setAsync(false);
var scoreFuncArray = [
    ['求平均',		'AVG'],
    ['求累计',		'SUM']
];
var dataAcquisitionDataTypeArray = [
    ['实时值',		'RTV'],
    ['平均值',		'AVG'],
    ['最大值',		'MAX'],
    ['最小值',		'MIN'],
    ['增量值',		'DET']
];
var evalPeriodArray = [
    ['一分钟'  , 	60,					],
    ['两分钟'  , 	120, 				],
    ['三分钟'  , 	180, 				],
    ['四分钟'  , 	240, 				],
    ['五分钟'  , 	300, 				],
    ['十分钟'  , 	600, 				],
    ['十五分钟',		900, 				],
    ['二十分钟',		1200, 				],
    ['三十分钟',		1800, 				],
    ['一小时'  , 	3600, 				],
    ['两个小时',		7200, 				],
    ['三个小时',		10800, 				]
];
for (var i=0;i<=new Date().getFullYear()-2015;i++){
    var array =[]
    array.push((2016+i)+'')
    array.push((2016+i)+'')
    yearData.push(array)
}
for (var i=0;i<12 ;i++){
    var array =[]
    array.push((i+1)+'')
    array.push((1+i)+'')
    monthData.push(array)
}
function searchTagInfos(year,month,keyword) {
    KpiInfoDao.search(year,month, keyword, '', '', 0, 80,
        {
            callback: function (str) {
                console.log(str)
                for (var i = 0; i < str.root.length; i++) {
                    str.root[i].ifExamine = Boolean(str.root[i].ifExamine)
                    str.root[i].sets = suiteJsonMap[str.root[i].sets]
                    str.root[i].unit = unitJsonMap[str.root[i].unit]
                    str.root[i].dataType = typeJsonMap[str.root[i].dataType]
                    str.root[i].aggFunc = AggJsonMap[str.root[i].aggFunc]
                    str.root[i].period = TimeJsonMap[str.root[i].period]
                    var pro = str.root[i].proId.split(',')
                    var array =[]
                    for (var j=0;j<pro.length;j++){
                        array.push(proJsonMap[pro[j]])
                    }
                    str.root[i].proId = array.join(',')
                }
                myData = str
            }

        });
    return myData
}
function saveKpiInfo(list) {
    KpiInfoDao.save(list,{
        callback:function (str) {
            handlerRefreshAction()

            showToast('保存记录成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
function getUnit() {
    UnitDao.getAllUnitName({
        callback: function (str) {
            unitIdData = str
            for (var i = 0; i < unitIdData.length; i++) {
                unitJsonMap[str[i][1]] = str[i][0]
                unitJsonMap[str[i][0]] = str[i][1]
                unitIdData[i][1] = unitIdData[i][0]
            }

        }
    })

}
function deleteByID(id) {
    KpiInfoDao.deleteByID(id,{
        callback:function (str) {
            handlerRefreshAction()

            showToast('删除成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
function deleteAll() {
    KpiInfoDao.deleteAll({
        callback:function (str) {
            handlerRefreshAction()

            showToast('删除全部成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
function getSuite(id) {
    SetsDao.getAllSetsName(id, {
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                setsIdData[i][1] = setsIdData[i][0]
            }

        }
    })
    return setsIdData
}

function getProfession() {
    ProfessionDao.getAllProName({
        callback: function (str) {
            proData = str
            for (var i = 0; i < proData.length; i++) {
                proJsonMap[str[i][1]] = str[i][0]
                proJsonMap[str[i][0]] = str[i][1]
                proData[i][1] = proData[i][0]
            }
        }
    })
}

function getAgg(){
    for (var i = 0; i < scoreFuncArray.length; i++) {
        AggJsonMap[scoreFuncArray[i][1]] = scoreFuncArray[i][0]
        AggJsonMap[scoreFuncArray[i][0]] = scoreFuncArray[i][1]
        scoreFuncArray[i][1] = scoreFuncArray[i][0]
    }
}
function getDataType(){
    for (var i = 0; i < dataAcquisitionDataTypeArray.length; i++) {
        typeJsonMap[dataAcquisitionDataTypeArray[i][1]] = dataAcquisitionDataTypeArray[i][0]
        typeJsonMap[dataAcquisitionDataTypeArray[i][0]] = dataAcquisitionDataTypeArray[i][1]
        dataAcquisitionDataTypeArray[i][1] = dataAcquisitionDataTypeArray[i][0]
    }
}
function getTime(){
    for (var i = 0; i < evalPeriodArray.length; i++) {
        TimeJsonMap[evalPeriodArray[i][1]] = evalPeriodArray[i][0]
        TimeJsonMap[evalPeriodArray[i][0]] = evalPeriodArray[i][1]
        evalPeriodArray[i][1] = evalPeriodArray[i][0]
    }
}

getUnit()
getSuite(unitJsonMap[unitIdData[0][0]])
getProfession()
getAgg()
getDataType()
getTime()


Ext.onReady(function () {
    searchTagInfos(new Date().getFullYear(), new Date().getMonth()+1,'')
    var dataTypeCombo ={
        xtype: 'combo',
        store: dataAcquisitionDataTypeArray,
        displayField: 'descp',
        valueField: 'name',
        triggerAction: 'all',
        allowBlank: false,
        forceSelection: false,
        editable: true,
        lazyRender: true,
        selectOnFocus: true
    };
    var evalDataCombo ={
        xtype: 'combo',
        store: evalPeriodArray,
        displayField: 'descp',
        valueField: 'name',
        triggerAction: 'all',
        allowBlank: false,
        forceSelection: false,
        editable: true,
        lazyRender: true,
        selectOnFocus: true
    };
    var scoreCombo ={
        xtype: 'combo',
        store: scoreFuncArray,
        displayField: 'descp',
        valueField: 'name',
        triggerAction: 'all',
        allowBlank: false,
        forceSelection: false,
        editable: true,
        lazyRender: true,
        selectOnFocus: true
    };
    var yearCombox = new Ext.form.ComboBox({
        store: yearData,
        id: "yearCombox",
        fieldLabel: '年份',
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
    });
    var monthCombox = new Ext.form.ComboBox({
        store: monthData,
        id: "monthCombox",
        fieldLabel: '月份',
        displayField: 'name',
        valueField: 'name',
        width: 120,
        labelWidth: 30,
        value: new Date().getMonth()+1,
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px',
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    });

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: 'id', mapping: 'id', type: 'int', allowBlank: true},
            {name: 'evalYear', mapping: 'evalYear', type: 'int', allowBlank: false},
            {name: 'evalMonth', mapping: 'evalMonth', type: 'int', allowBlank: false},
            {name: 'unit', mapping: 'unit', type: 'string', allowBlank: false},
            {name: 'sets', mapping: 'sets', type: 'string', allowBlank: false},
            {name: 'name', mapping: 'name', type: 'string', allowBlank: false},
            {name: 'descp', mapping: 'descp', type: 'string', allowBlank: true},
            {name: 'units', mapping: 'units', type: 'string', allowBlank: true},
            {name: 'category', mapping: 'category', type: 'string', allowBlank: true},
            {name: 'type', mapping: 'type', type: 'string', allowBlank: false},
            {name: 'weights', mapping: 'weights', type: 'float', allowBlank: false},
            {name: 'period', mapping: 'period', type: 'string', allowBlank: false},
            {name: 'dataType', mapping: 'dataType', type: 'string', allowBlank: false},
            {name: 'aggFunc', mapping: 'aggFunc', type: 'string', allowBlank: false},
            {name: 'orderNum', mapping: 'orderNum', type: 'int', allowBlank: false},
            {name: 'bonus', mapping: 'bonus', type: 'float', allowBlank: false},
            {name: 'proId', mapping: 'proId', type: 'string'}
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
    var unitIdComboBox = {
        id:'unitIdComboBox',
        xtype: 'combo',
        store: unitIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        emptyText:'单元',
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                var newData = getSuite(unitJsonMap[this.getValue()])
                Ext.getCmp('setsIdComboBox').getStore().loadData(newData)
                Ext.getCmp('setsIdComboBox').setValue(newData[0][0])
            }
        }
    }
    var setsIdComboBox = {
        id:'setsIdComboBox',
        xtype: 'combo',
        store: setsIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }

    var AggTypeComboBox = {
        id:'AggTypeComboBox',
        xtype: 'combo',
        store: scoreFuncArray,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        emptyText:'单元',
        listClass: 'x-combo-list-small'
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
    var proComboBox = null

    var targetStore = new Ext.data.SimpleStore({
        fields: ['name', 'value'],
        data: [['本窗口', ''], ['顶窗口', '_top'], ['空窗口', '_blank'], ['新窗口', '_new']]
    });

    // top tool bar
    var tbar = [
        yearCombox,
        monthCombox,
        {   xtype: 'textfield',
            fieldLabel: '关键字',
            labelWidth:60,
            width:160,
            name: 'keyword',
            id:"keyword"
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
            text: '删除', iconCls: 'remove', tooltip: '删除选中行', handler: handlerDeleteAction
        },
        {
            text: '保存', iconCls: 'save', tooltip: '保存所有修改', handler:handlerSaveAction
        },
        { text: '清空', iconCls : 'remove', 	tooltip:'清空表格', 		handler : handlerDeleteAllAction}
    ];
    // It can be extended to provide custom or reusable ColumnModels
    var colModel = [
        new Ext.grid.RowNumberer(),
        {header: 'ID', dataIndex: 'id', width: 60, sortable: true, align: 'center', hidden: true},
        {header: '年份', dataIndex: 'evalYear', width: 60, sortable: true, align: 'center', hidden: true,},
        {header: '月份', dataIndex: 'evalMonth', width: 60, sortable: true, align: 'center', hidden: true},
        {header: '单元', dataIndex: 'unit', width: 80, sortable: true, align: 'center',editor:unitIdComboBox},
        {header: '机组', dataIndex: 'sets', width: 80, sortable: true, align: 'center',editor: setsIdComboBox},
        {header: '点名', dataIndex: 'name',flex:2, sortable: true, align: 'center',editor:kpiNameEditor3},
        {header: '描述', dataIndex: 'descp',flex:2, sortable: true, align: 'center'},
        {header: '单位', dataIndex: 'units', width: 60, sortable: true, align: 'center'},
        //{header: '奖金类别',	dataIndex: 'category',	width: 90, 	sortable: true,  align: 'center', 	editor: kpiCategoryEditor,hidden:true},
        {header: '指标类别', dataIndex: 'type', width: 90, sortable: true, align: 'center'},
        {header: '考核周期', dataIndex: 'period', width: 90, sortable: true, align: 'center',editor:evalDataCombo},
        {header: '数据类型', dataIndex: 'dataType', width: 90, sortable: true, align: 'center',editor:dataTypeCombo},
        {header: '基准奖金', dataIndex: 'weights', width: 90, sortable: true, align: 'center', hidden:true,renderer:formatNumber4},
        {header: '统计算法', dataIndex: 'aggFunc', width: 90, sortable: true, align: 'center',editor:AggTypeComboBox},
        {header: '月度奖金', dataIndex: 'bonus', width: 90, sortable: true, align: 'center', hidden: true,renderer:formatNumber},
        {header: '显示顺序', dataIndex: 'orderNum', width: 75, sortable: true, align: 'center'},
        {header: '所属专业', dataIndex: 'proId',flex:2, sortable: true, align: 'center',editor:proComboBox}
    ];
    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '指标信息管理',
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
        viewConfig: {forceFit: true},
        store: store,

        columns: colModel,
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

function handlerSearchAction() {
    DWREngine.setAsync(false);
    var newData = searchTagInfos(Ext.getCmp('yearCombox').getValue(),Ext.getCmp('monthCombox').getValue(),Ext.getCmp('keyword').getValue())
    store.loadData(newData.root)
}
function handlerRefreshAction() {
    DWREngine.setAsync(false);
    Ext.getCmp('yearCombox').setValue(new Date().getFullYear())
    Ext.getCmp('monthCombox').setValue(new Date().getMonth()+1)
    Ext.getCmp('keyword').setValue('')
    var newData = searchTagInfos(new Date().getFullYear(),new Date().getMonth()+1,'')

    store.loadData(newData.root)
}

function handlerInsertAction() {
    var record = {
        id: -1,
        evalYear	: (new Date()).getFullYear(),
        evalMonth	: (new Date()).getMonth() + 1,
        category	: '',
        type		: '',
        weights		: 1.0,
        period		: '1分钟',
        dataType	: '平均值',
        aggFunc		: '求平均',
        orderNum	: 0,
        bonus		: 0.0,
        proId:''
    };

    store.insert(0, record);
}

function onCelldblclick(grid,rowIndex, columnIndex, e) {
    var record = grid.getSelection();  // Get the Record
    var recordData = record[0].data
    var fieldName = grid.getHeaderCt().getGridColumns()[columnIndex].dataIndex;
    // Get field name
    if (fieldName != 'proId') {
        return ;
    }
    var data = recordData.proId;
    store_id = recordData.id+"";
    var item=[]
    if(store_id==''){
        showToast('当前存在未保存信息，将自动还原')
        handleRefeshAction()
    }
    else {

        if (Ext.isEmpty(data)) {
            data = [];
        } else {
            data = data.split(',');
        }
        for (var i = 0; i < proData.length; i++) {
            var json = {}
            json['boxLabel']=proData[i][0]
            json['inputValue']=proJsonMap[proData[i][0]]
            json['name'] = 'proId'
            json['checked'] =false
            for (var j=0;j<data.length;j++) {

                if (data[j] == proData[i][0]) {
                    json.checked = true
                    break
                }
            }
            item.push(json)
        }
        var rolesWindow = new Ext.Window({
            title: '权限设置',
            width: 300,
            resizable: true,
            autoHeight: true,
            frame: true,
            border: true,
            modal: true,
            closable 	: true,
            closeAction : 'destroy',
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
                            items: item
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
                        if (newValues.indexOf('proId=') != -1) {
                            newValues = newValues.replace('proId=', '')
                        } else {
                            break;
                        }
                    }

                    var row = store.data.indices[store_id];
                    newValues = newValues.split(',')
                    for (var i=0;i<newValues.length;i++){
                        newValues[i] = proJsonMap[parseInt(newValues[i])]
                    }
                    newValues = newValues.join(',')
                    store.getAt(row).data['proId'] = newValues;
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
function handlerDeleteAllAction() {
    Ext.Msg.confirm('提示', '是否要保存清空指标信息,建议先导出再清空?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        deleteAll()

    });
}
function exportPerson() {

    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};

        params = Ext.applyIf(params, {
            year:Ext.getCmp('yearCombox').getValue(),
            month:Ext.getCmp('monthCombox').getValue(),
            keyword:Ext.getCmp('keyword').getValue()
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
                    Ext.Msg.confirm('提示', '如果当前月存在数据请先清空再导入,一次仅支持一个月份导入', function (btn) {

                        if (btn != 'yes') {
                            return;
                        }

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

                    });

                }
            }]
    })
    rolesWindow.show()

}


function formatTime1(str) {
    var number = str/60
    if (number >=60) {
        number = number/60
        number = number+'小时'
    }else {
        number = number+'分钟'
    }
    return number
}

function handlerDeleteAction() {
    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        deleteByID(recordData.id)
    });
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

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        var pro = recordData.proId.split(',')
        for (var i= 0;i<pro.length;i++){
            pro[i] = proJsonMap[pro[i]]
        }
        recordData.sets =suiteJsonMap[recordData.sets]
        recordData.unit = unitJsonMap[recordData.unit]
        recordData.proId = pro.join(',')
        recordData.dataType=typeJsonMap[recordData.dataType]
        recordData.aggFunc= AggJsonMap[recordData.aggFunc]
        recordData.period = TimeJsonMap[recordData.period]
        saveKpiInfo(recordData)


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
        deleteTagInfoByID(recordData.id)

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