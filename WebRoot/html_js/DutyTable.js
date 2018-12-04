var pageSize = 366;
var myData;
var nameArray = new Array();
var value;
DWREngine.setAsync(false);
var userName = 'admin'
var store, grid
window.console = window.console || (function(){
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
        = c.clear = c.exception = c.trace = c.assert = function(){};
    return c;
})();


function getDayDuty(startTime, endTime) {
    DayDutyDao.getDayDutysByDateRange(startTime, endTime, {
        callback: function (str) {
            myData = {root: str};
        }
    })
    return myData;
}
function saveDayDuty(dayDuty) {
    DayDutyDao.saveDayDuty(dayDuty,{
        callback:function(newDayDuty) {
            handleRefeshAction()

            showToast('保存记录成功');

        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    });
}
function deleteDayDutyByID(id) {
    DayDutyDao.deleteDayDutyByID(id,{
        callback:function() {

            handleRefeshAction()

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( '操作失败，错误信息：' + message); }
    });

}
function deleteDayDutysByDateRange(startDate,stopDate) {
    DayDutyDao.deleteDayDutysByDateRange(startDate,stopDate,{
        callback:function() {

            showToast('删除记录成功！');

            handleRefeshAction();

        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    });
}

var sd = new Date();
var d = new Date();
var month = d.getMonth()+1;
if (month<10){
    month = '0'+month;
}
var startTime =sd.setTime(sd.getTime()-(sd.getDate()-1)*24*60*60*1000-(sd.getHours())*60*60*1000-(sd.getMinutes())*60*1000-sd.getSeconds()*1000);
var endTime = d.setTime(d.getTime()+24*60*60*1000-(d.getHours())*60*60*1000-(d.getMinutes())*60*1000-d.getSeconds()*1000);
getDayDuty(new Date(startTime),new Date(endTime))
var dateEditor = new Ext.form.DateField({
    format: 'Y-m-d',
    value: stDate,
    width: 92,
    readOnly: false,
    allowBlank: false
});
var stDate = new Date();
stDate.setDate(1);
stDate.setHours(0);
stDate.setMinutes(0);
stDate.setSeconds(0);
stDate.setMilliseconds(0);
var edDate = new Date();
edDate.setMilliseconds(0);


function formatDate(date) {
    return Ext.util.Format.date(date, "Y-m-d");
}


Ext.onReady(function () {
    requires: [
        'Ext.panel.Panel',
        'Ext.picker.Date',
        'Ext.picker.Month',

    ],

        store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: "id", mapping: "id", type: 'int'},
                {name: "dutyDate", mapping: "dutyDate", type: 'date'},
                {name: "duty1", mapping: "duty1", type: 'string'},
                {name: "duty2", mapping: "duty2", type: 'string'},
                {name: "duty3", mapping: "duty3", type: 'string'},
                {name: "duty4", mapping: "duty4", type: 'string'},
                {name: "duty5", mapping: "duty5", type: 'string'},
                {name: "duty6", mapping: "duty6", type: 'string'},
                {name: "duty7", mapping: "duty7", type: 'string'},
                {name: "duty8", mapping: "duty8", type: 'string'},
                {name: "duty9", mapping: "duty9", type: 'string'}
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
            }

        });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
    });
    var tbar = [{
        xtype: 'datefield',
        id: "startDate",
        labelWidth: 65,
        fieldLabel: '开始时间',
        format: 'Y-m-d',
        width: 200,
        value: Ext.util.Format.date(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "Y-m-d")
    }, {
        xtype: 'datefield',
        id: "endDate",
        labelWidth: 65,
        fieldLabel: '结束时间',
        format: 'Y-m-d',
        width: 200,
        value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH), "Y-m-d")
    }, '->', {
        text: '查询',
        iconCls: 'refresh',
        tooltip: '刷新表格',
        handler: handleRefeshAction
    }
    ];


    if (admin===true) {

        tbar.push({
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
        });
    }

    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'gridpanel',
        title: '值班表查询',
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
                xtype: 'button',
                ui: 'default-toolbar',
                text: '导入',
                handler: function () {
                    importTable()
                }
            }]
        },

        columns: [
            {header: "ID", width: 80, sortable: true, dataIndex: 'id', align: 'center', hidden: true},
            {
                header: "日期",
                flex: 1,
                sortable: true,
                dataIndex: 'dutyDate',
                align: 'center',
                editor: (admin ? dateEditor : null),
                renderer: formatDate
            },
            {
                header: "一值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty1',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null)
            },
            {
                header: "二值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty2',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null)
            },
            {
                header: "三值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty3',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null)
            },
            {
                header: "四值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty4',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: false}) : null)
            },
            {
                header: "五值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty5',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: false}) : null)
            },
            {
                header: "六值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty6',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null),
                hidden: true
            },
            {
                header: "七值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty7',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null),
                hidden: true
            },
            {
                header: "八值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty8',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null),
                hidden: true
            },
            {
                header: "九值",
                flex: 1,
                sortable: true,
                dataIndex: 'duty9',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: true}) : null),
                hidden: true
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

function importTable() {

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
    var start = new Date(Ext.getCmp('startDate').getValue())
    var end = new Date(Ext.getCmp('endDate').getValue())
    if (start > end) {
        showToast('时间段不存在');
    } else if (end - start > 365 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一年');
    } else {
        var newData = getDayDuty(start, end)
        store.loadData(newData.root);
    }
}

function handlerInsertAction() {
    var record = {
        id		  	: -1,
        dutyDate 	: '',
        duty1 		: '',
        duty2 		: '',
        duty3 		: '',
        duty4 		: '',
        duty5 		: '',
        duty6 		: '',
        duty7 		: '',
        duty8 		: '',
        duty9 		: ''
    };

    store.insert(0, record);
}

function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] == -1) {
        recordData['id'] = '';
    }
    if(recordData.dutyDate === null||recordData.dutyDate === ''){
        Ext.Msg.alert('提示','日期不能为空！');
        return;
    }

    if(!record[0].dirty){
        //record.modified
        Ext.Msg.alert('提示', '没有信息被修改，不需要保存。');
        return;
    }

    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function(btn){

        if (btn !== 'yes'){
            return;
        }
        saveDayDuty(recordData);

    });

}

function handlerDeleteAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除一条记录?', function(btn){

        if (btn !== 'yes'){
            return;
        }

        if(recordData.id === null || recordData.id.trim() === ''){
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            showToast('操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteDayDutyByID(recordData.id);

    });
}

function handlerCleanAction() {
// Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除查询结果中的所有记录? 注意：此删除操作不可恢复。', function(btn){

        if (btn !== 'yes'){
            return;
        }
        var start = new Date(Ext.getCmp('startDate').getValue())
        var end = new Date(Ext.getCmp('endDate').getValue())
        deleteDayDutysByDateRange(start,end)


    });
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