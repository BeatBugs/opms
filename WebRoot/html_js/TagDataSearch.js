// alert(DWRUtil.toDescriptiveString(values,2));

//currentServerTime
//moreDataQueryURI
var RawData

function getRawDataByTagName(tagName, stTime, edTime) {
    RTDBDao.getRawDataByTagName(tagName, stTime, edTime, {
        callback: function (str) {
            RawData = {root: str}
        }
    })
}

function close() {
    win.close();
    win = null;
}

function tagDataSearchHandler() {

    var win;

    var record = grid.getSelection();

    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }


    var data = record[0].data;
    var tagName = data['name'];

    if (tagName == null || tagName.trim() == '') {
        Ext.Msg.alert("提示", "测点点名不能为空!");
        return;
    }

    var formData = {};
    formData.id = data['id'];
    formData.name = data['name'];
    formData.descp = data['descp'];
    formData.location = data['location'];
    formData.typical = data['typical'];
    formData.unit = data['unit'];
    formData.type = data['type'];
    formData.max = data['max'];
    formData.min = data['min'];

    formData.lowlow = data['lowlow'];
    formData.low = data['low'];
    formData.high = data['high'];
    formData.highhigh = data['highhigh'];

    formData.func = data['func'];
    formData.test = data['test'];


    formData.value = null;
    formData.status = null;
    formData.time = null;

    formData.delta = null;

    var stDate = new Date(currentServerTime);
    stDate.setMinutes(stDate.getMinutes() - 15);
    stDate.setMilliseconds(0);
    var edDate = new Date(currentServerTime);
    edDate.setMilliseconds(0);

    if (win != null) {
        //show( [String/Element animateTarget], [Function callback], [Object scope] ) : void
        //Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
        win.show();
        return;
    }


    var RTDataPanel = new Ext.FormPanel({
        title: '',
        frame: true,
        border: 'none',
        labelWidth: 65,
        autoScroll: true,
        bodyStyle: 'overflow-x:visible; overflow-y:scroll;padding:5px 5px 0px 5px',
        labelAlign: 'left',
        viewConfig: {forceFit: true},
        defaults: {anchor: '100%'},
        defaultType: 'textfield',
        items: [/*{
	                fieldLabel: '测点ID',
	                name: 'id',
	                value: formData.id,
	                readOnly :	true
	            },*/{
            fieldLabel: '测点名字',
            name: 'name',
            value: formData.name,
            readOnly: true
        }, {
            fieldLabel: '测点描述',
            name: 'descp',
            value: formData.descp,
            readOnly: true
        }, {
            fieldLabel: '测点位置',
            name: 'location',
            value: formData.location,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '测点类型',
            name: 'type',
            value: formData.type,
            /*renderer: formatTagType,*/
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '工程单位',
            name: 'unit',
            value: formData.unit,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '最大值',
            name: 'max',
            value: formData.max,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '高高报',
            name: 'highhigh',
            value: formData.highhigh == null ? 0 : formData.highhigh,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '高报值',
            name: 'high',
            value: formData.high == null ? 0 : formData.high,
            readOnly: true
        }, {
            fieldLabel: '典型值',
            name: 'typical',
            value: formData.typical == null ? 0 : formData.typical,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '低报值',
            name: 'low',
            value: formData.low == null ? 0 : formData.low,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '低低报',
            name: 'lowlow',
            value: formData.lowlow == null ? 0 : formData.lowlow,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '最小值',
            name: 'min',
            value: formData.min,
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '实时数值',
            name: 'value',
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '实时增量',
            name: 'delta',
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '实时状态',
            name: 'status',
            readOnly: true
        }, {
            xtype: 'textfield',
            fieldLabel: '实时时间',
            name: 'time',
            readOnly: true
        }
        ],

        buttonAlign: 'center',
        buttons: [{
            text: '查询',
            disabled: (formData.type == 'B' ? true : false),
            handler: function () {

                var oFormData = RTDataPanel.getForm().getValues(false);

                formData.name = oFormData['name'];

                if (formData.name == null || formData.name.trim() == '') {
                    Ext.Msg.alert("提示", "请先选择一个测点!");
                    return;
                }

                RTDBDao.getRTDataByTagName(formData.name, {
                    callback: function (tagData) {
                        if (tagData == null) {
                            Ext.Msg.alert('结果', '查询测点[' + formData.name + ']实时数据失败！');
                            return;
                        }

                        formData.time = formatDateTime(tagData.time);
                        formData.value = formatNumber(tagData.value);
                        formData.status = tagData.status;

                        var old = parseFloat(oFormData['value']);

                        if (tagData.value != null && !isNaN(old)) {
                            formData.delta = formatNumber(tagData.value - old);
                        } else {
                            formData.delta = null;
                        }
                        if (formData.high == null) {
                            formData.high = 0
                        }
                        if (formData.highhigh == null) {
                            formData.highhigh = 0
                        }
                        if (formData.low == null) {
                            formData.low = 0
                        }
                        if (formData.lowlow == null) {
                            formData.lowlow = 0
                        }
                        if (formData.typical == null) {
                            formData.typical = 0
                        }
                        RTDataPanel.getForm().setValues(formData);

                    },
                    timeout: 5000,
                    errorHandler: function (message) {
                        showToast('操作失败，错误信息：' + message);
                    }
                });

            }
        }, {
            text: '关闭',
            handler: function () {
                win.close();
                win = null;
            }
        }]
    });


    var TagDescPanel = new Ext.FormPanel({
        title: '',
        frame: true,

        viewConfig: {forceFit: true},
        bodyStyle: 'padding:5px 5px 0px 5px',
        defaults: {style: 'color:blue;background:#ffffff;'},
        defaultType: 'textarea',
        items: [{
            xtype: 'textarea',
            fieldLabel: '测点描述',
            hideLabel: true,
            anchor: '100% 97%',
            name: 'descp',
            value: formData.descp,
            readOnly: false
        }],
        buttonAlign: 'center',
        buttons: [{
            text: '保存',
            handler: function () {

                var oFormData = RTDataPanel.getForm().getValues(false);

                formData.name = oFormData['name'];

                if (formData.name == null || formData.name.trim() == '') {
                    Ext.Msg.alert("提示", "请先选择一个测点!");
                    return;
                }

                var record = grid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.alert("提示", "请先选择一条记录!");
                    return;
                }

                if (formData.name != record.data['name']) {
                    Ext.Msg.alert("提示", "请选择同一条记录进行编辑!");
                    return;
                }

                var oFormData2 = TagDescPanel.getForm().getValues(false);

                record.set('descp', oFormData2['descp']);

                saveHandler();

            }
        }, {
            text: '关闭',
            handler: function () {
                win.close();
                win = null;
            }
        }]

    });

    var TagCalcPanel = new Ext.FormPanel({
        title: '',
        frame: true,
        viewConfig: {forceFit: true},
        bodyStyle: 'padding:5px 5px 0px 5px',
        defaults: {style: 'color:#00f;background:#fff;font-size:12px;font-family:"Courier New";font-weight: normal'},
        defaultType: 'textarea',
        items: [{
            xtype: 'textarea',
            fieldLabel: '计算逻辑',
            hideLabel: true,
            anchor: '100% 97%',
            name: 'func',
            value: formData.func,
            readOnly: false
        }],
        buttonAlign: 'center',
        buttons: [{
            text: '保存',
            handler: function () {

                var oFormData = RTDataPanel.getForm().getValues(false);

                formData.name = oFormData['name'];

                if (formData.name == null || formData.name.trim() == '') {
                    Ext.Msg.alert("提示", "请先选择一个测点!");
                    return;
                }

                var record = grid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.alert("提示", "请先选择一条记录!");
                    return;
                }

                if (formData.name != record.data['name']) {
                    Ext.Msg.alert("提示", "请选择同一条记录进行编辑!");
                    return;
                }

                var oFormData2 = TagCalcPanel.getForm().getValues(false);

                record.set('func', oFormData2['func']);

                saveHandler();

            }
        }, {
            text: '关闭',
            handler: function () {
                win.close();
                win = null;
            }
        }]

    });


    var CalcTestPanel = new Ext.FormPanel({
        title: '',
        frame: true,
        labelAlign: 'top',
        viewConfig: {forceFit: true},
        bodyStyle: 'padding:5px 5px 0px 5px',
        defaults: {style: 'color:blue;background:#ffffff;'},
        defaultType: 'textarea',
        items: [{
            xtype: 'textarea',
            fieldLabel: '测试条件',
            hideLabel: false,
            anchor: '100% 30%',
            name: 'test',
            value: formData.test,
            readOnly: false
        }, {
            xtype: 'textarea',
            fieldLabel: '测试结果',
            hideLabel: false,
            anchor: '100% 55%',
            name: 'result',
            value: '',
            readOnly: true
        }],
        buttonAlign: 'center',
        buttons: [{
            id: 'CalcTestButton',
            text: '测试',
            handler: function () {

                var func = formData.func;

                var oFormData2 = null;
                try {
                    oFormData2 = TagCalcPanel.getForm().getValues(false);
                } catch (e) {
                    oFormData2 = null;
                }

                if (oFormData2 != null) {
                    func = oFormData2['func'];
                }

                if (func == null) {
                    func = '';
                }

                var oFormData3 = CalcTestPanel.getForm().getValues(false);

                var test = oFormData3['test'];

                if (test == null) {
                    test = '';
                }

                if (test.trim() == '' && func.trim() == '') {
                    Ext.Msg.alert('提示', '测试条件和计算逻辑不能同时为空！');
                    return;
                }

                var script = test + ';\n' + func;

                Ext.getCmp('CalcTestButton').setDisabled(true);

                CalcEngine.execute(script, false, {
                    callback: function (result) {

                        var formData = {};

                        formData['test'] = test;
                        formData['result'] = DWRUtil.toDescriptiveString(result, 4);

                        var formRecord = {data: formData};

                        CalcTestPanel.getForm().loadRecord(formRecord);

                        Ext.getCmp('CalcTestButton').setDisabled(false);

                    },
                    timeout: 5000,
                    errorHandler: function (message) {
                        Ext.Msg.alert('提示', '操作失败，错误信息：' + message);
                        Ext.getCmp('CalcTestButton').setDisabled(false);
                    }
                });


            }
        }, {
            text: '保存',
            handler: function () {

                var oFormData = RTDataPanel.getForm().getValues(false);

                formData.name = oFormData['name'];

                if (formData.name == null || formData.name.trim() == '') {
                    Ext.Msg.alert("提示", "请先选择一个测点!");
                    return;
                }

                var record = grid.getSelectionModel().getSelected();
                if (!record) {
                    Ext.Msg.alert("提示", "请先选择一条记录!");
                    return;
                }

                if (formData.name != record.data['name']) {
                    Ext.Msg.alert("提示", "请选择同一条记录进行编辑!");
                    return;
                }

                var oFormData3 = CalcTestPanel.getForm().getValues(false);

                record.set('test', oFormData3['test']);

                saveHandler();

            }
        }, {
            text: '关闭',
            handler: close,
        }]

    });


    getRawDataByTagName(tagName, stDate, edDate)
    var TagDataStore = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "time", mapping: "time", type: 'date'},
            {name: "value", mapping: "value", type: 'float'},
            {name: "status", mapping: "status", type: 'int'}
        ],
        autoLoad: true,
        proxy: {
            data: RawData,
            reader: {
                type: 'json',
                rootProperty: 'root',
            }
        },
        sortInfo: {
            field: 'time',
            direction: 'DESC'
        }

    });


    function checkTagDataSearchParams() {

        var oFormData = RTDataPanel.getForm().getValues(false);
        var tagName = oFormData['name'];
        if (tagName == null || tagName.trim() == '') {
            Ext.Msg.alert("提示", "请先选择一个测点!");
            return false;
        }

        var oStTime = Ext.getCmp("stTime");
        if (!oStTime.isValid(false)) {
            return false;
        }

        var oEdTime = Ext.getCmp("edTime");
        if (!oEdTime.isValid(false)) {
            return false;
        }

        var stTime = oStTime.getValue();
        var edTime = oEdTime.getValue();

        if (edTime.getTime() < stTime.getTime()) {
            var temp = edTime;
            edTime = stTime;
            stTime = temp;
        }

        var range = Math.abs((edTime.getTime() - stTime.getTime())) / 1000;

        //时间跨度最长15分钟
        if (range > 15 * 60) {
            Ext.Msg.alert("提示", "时间跨度太大，最长15分钟.");
            return false;
        }

        if (TagDataStore.baseParams == null) {
            TagDataStore.baseParams = {};
        }

        TagDataStore.baseParams.tagName = tagName;
        TagDataStore.baseParams.stTime = stTime;
        TagDataStore.baseParams.edTime = edTime;

        var searchParams = {
            tagName: tagName,
            stTime: stTime,
            edTime: edTime
        };

        TagDataStore.load({params: searchParams});

        return true;

    }

    // top tool bar
    var TagDataTollbar = [{
        xtype: 'tbtext',
        text: '开始时间:'
    }, {
        id: 'stTime',
        xtype: 'datefield',
        /*anchor:'-18',*/
        readOnly: false,
        timeFormat: 'H:i:s',
        timeConfig: {
            altFormats: 'H:i:s',
            allowBlank: false
        },
        dateFormat: 'Y-m-d',
        dateConfig: {
            altFormats: 'Y-m-d',
            allowBlank: false
        },
        value: stDate
    }, '-', {
        xtype: 'tbtext',
        text: '结束时间:'
    }, {
        id: 'edTime',
        xtype: 'datefield',
        /*anchor:'-18',*/
        readOnly: false,
        timeFormat: 'H:i:s',
        timeConfig: {
            altFormats: 'H:i:s',
            allowBlank: false
        },
        dateFormat: 'Y-m-d',
        dateConfig: {
            altFormats: 'Y-m-d',
            allowBlank: false
        },
        value: edDate
    }, '-', {
        text: '查询',
        iconCls: 'application_form_magnify',
        tooltip: '查询测点历史数据',
        handler: function () {
            // Delay 150 ms for Ext.ux.form.DateTime to change value correctly
            (function () {
//		        		if(checkTagDataSearchParams()){
//		        			TagDataStore.reload();
//		        		}
                checkTagDataSearchParams();
            }).defer(150);
        }
    }, '-', {
        text: '更多',
        iconCls: 'book_next',
        tooltip: '更多测点数据查询',
        handler: function () {
            var oFormData = RTDataPanel.getForm().getValues(false);
            var tagName = oFormData['name'];
            if (tagName == null || tagName.trim() == '') {
                Ext.Msg.alert("提示", "请先选择一个测点!");
                return false;
            }
            top.loadPageWithTarget(moreDataQueryURI + tagName, '测点[' + tagName + ']数据查询', '');
        }
    }
    ];

    var TagDataColModel = [
        new Ext.grid.RowNumberer(),
        {header: "时间", flex: 1, sortable: true, dataIndex: 'time', align: 'center', renderer: formatDateTime},
        {header: "数值", flex: 1, sortable: true, dataIndex: 'value', align: 'center', renderer: formatNumber},
        {header: "状态", flex: 1, sortable: true, dataIndex: 'status', align: 'center', renderer: formatStatus}
    ];


    // create the Grid
    var TagDataGrid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        store: TagDataStore,
        header:false,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel'
        ],
        // colModel:colModel,
        selModel: 'cellmodel',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 2
        },
        title: '',
        width: 520,
        height: 300,
        border: true,
        frame: true,
        iconCls: 'table',
        viewConfig: {forceFit: true},
        columns: TagDataColModel,
        loadMask: {
            msg: '数据读取中...'
        },
        style: {"padding": "0px"},

        enableColumnResize: true,
        enableColumnMove: true,
        enableColumnHide: true,
        enableHdMenu: false,
        columnLines: true,
        //plugins: [new Ext.ux.grid.GridViewMenuPlugin()],
        tbar: TagDataTollbar,
        bbar: new Ext.PagingToolbar({
            displayInfo: true,
            autoHeight: true,
            store: TagDataStore,
            pageSize: 10000
        })
    });


    var tabs = new Ext.TabPanel({
        anchor: '100% 100%',
        activeTab: 0,
        border: false,
        bodyStyle: 'padding:1px 1px 1px 1px',
        layoutOnTabChange: true,
        defaults: {
            autoScroll: false,
            layout: 'fit' // must set fit layout for formpanel to span
        },
        items: [{
            title: '实时数据查询',
            items: RTDataPanel
        }, {
            title: '历史数据查询',
            items: TagDataGrid,
            disabled: (formData.type == 'B' ? true : false)
        }, {
            title: '计算逻辑描述',
            items: TagDescPanel,
            disabled: (formData.type == 'B' || formData.type == 'C' ? false : true)
        }, {
            title: '计算逻辑内容',
            items: TagCalcPanel,
            disabled: (formData.type == 'B' || formData.type == 'C' ? false : true)
        }, {
            title: '计算逻辑测试',
            items: CalcTestPanel,
            disabled: (formData.type == 'B' ? false : true)
        }]
    });

    var win = new Ext.Window({
        layout: 'fit',
        title: '测点数据查询与计算逻辑管理',
        closable: true,
        closeAction: 'destroy',
        resizable: true,
        maximizable: true,
        constrain: true,
        plain: false,
        width: 700,//630
        height: 490,//390
        items: tabs
    });

    win.show();

}
