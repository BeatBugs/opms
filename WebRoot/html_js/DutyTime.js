var pageSize = 20;
var myData;
var nameArray = new Array();
var value;
DWREngine.setAsync(false);
var userName = 'admin'
var store,grid

function getDutyTime() {
    DutyTimeDao.getAllDutyTimes({
        callback: function (str) {
            myData = {root: str}
        }
    })
    return myData
}
function saveDutyTime(dutyTime){
    DutyTimeDao.saveDutyTime(dutyTime,{
        callback:function(newDutyTime) {
            handleRefeshAction()

            showToast( '保存记录成功');

        },
        timeout:5000,
        errorHandler:function(message) { showToast(  '操作失败，错误信息：' + message); }
    });

}
function deleteDutyTimeByID(id){
    DutyTimeDao.deleteDutyTimeByID(id,{
        callback:function() {

            handleRefeshAction()

            showToast('删除记录成功！');

        },
        timeout:5000,
        errorHandler:function(message) { showToast( '操作失败，错误信息：' + message); }
    });
}

Ext.onReady(function () {

    getDutyTime()
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "dutyName", mapping: "dutyName", type: 'string'},
            {name: "startTime", mapping: "startTime", type: 'string'},
            {name: "endTime", mapping: "endTime", type: 'string'}
        ],
        autoLoad: {strat: 0, limit: pageSize},
        proxy: {
            data: myData,
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
    var tbar = []
    if (admin) {

        tbar = [{
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
            xtype: 'button',
            text: '删除',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerDeleteAction
        }
        ];
    }
    tbar.unshift('->', {
            text: '刷新',
            iconCls: 'refresh',
            tooltip: '刷新表格',
            handler: handleRefeshAction
        }
    );


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'gridpanel',
        title: '值班时间查询',
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
            items: []
        },
        actions: {
            refesh: {
                iconCls: 'array-grid-buy-col',
                text: '刷新',
                // border:false,
                disabled: false,
                handler: handleRefeshAction  // see Controller
            }
        },

        columns: [
            {header: "ID", width: 60, sortable: true, dataIndex: 'id', align: 'center', hidden: true},
            {
                header: "班名",
                flex: 1,
                sortable: true,
                dataIndex: 'dutyName',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({allowBlank: false}) : null)
            },
            {
                header: "开始时间",
                flex: 1,
                sortable: true,
                dataIndex: 'startTime',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({
                    allowBlank: false,
                    regex: new RegExp('^([0-1][0-9]|2[0-3]):[0-5][0-9]$')
                }) : null)
            },
            {
                header: "结束时间",
                flex: 1,
                sortable: true,
                dataIndex: 'endTime',
                align: 'center',
                editor: (admin ? new Ext.form.TextField({
                    allowBlank: false,
                    regex: new RegExp('^([0-1][0-9]|2[0-3]):[0-5][0-9]$')
                }) : null)
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

    DWREngine.setAsync(true);

});

function handleRefeshAction() {
    DWREngine.setAsync(false);

    var newData = getDutyTime()
    store.loadData(newData.root)

}

function handlerInsertAction() {
    var record={
        id		  	: -1,
        dutyName	: '',
        startTime	: '',
        endTime		: ''
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

    if (recordData.dutyName == null || recordData.dutyName == '') {
        Ext.Msg.alert('提示', '班名不能为空！');
        return;
    }
    if (recordData.startTime == null || recordData.startTime == '') {
        Ext.Msg.alert('提示', '开始时间不能为空！');
        return;
    }
    if (recordData.endTime == null || recordData.endTime == '') {
        Ext.Msg.alert('提示', '结束时间不能为空！');
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
        saveDutyTime(recordData)

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

        if(recordData.id == null || recordData.id.trim() == ''){
            grid.getSelectionModel().selectNext(false);
            store.remove(record);
            return;
        }

        if(record[0].dirty){
            //record.modified
            Ext.Msg.alert('提示', '操作失败，记录已经被修改，不允许删除。');
            return;
        }
        deleteDutyTimeByID(recordData.id)


    });

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