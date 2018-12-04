// alert(DWRUtil.toDescriptiveString(values,2));

//currentSereverTime
//tagname

Date.prototype.dateFormat = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

var initTime = new Date(new Date().toLocaleDateString())

var stDate = new Date(currentServerTime);
stDate.setMinutes(stDate.getMinutes() - 15);
stDate.setMilliseconds(0);
var edDate = new Date(currentServerTime);
edDate.setMilliseconds(0)

// simple array store
var typeStore = new Ext.data.SimpleStore({
    fields: ['name', 'value'],
    data: [['实时值', 'RTV'], ['历史值', 'HIS'], ['原始值', 'RAW'], ['快照值', 'SNP'], ['最大值', 'MAX'], ['最小值', 'MIN'], ['平均值', 'AVG'], ['批量实时值', 'BATRTV'], ['批量最大值', 'BATMAX'], ['批量最小值', 'BATMIN'], ['批量平均值', 'BATAVG']]
});

var typeComboBox = new Ext.form.ComboBox({
    id: 'type',
    store: typeStore,
    displayField: 'name',
    valueField: 'value',
    triggerAction: 'all',
    width: 120,
    forceSelection: true,
    editable: true,
    emptyText: '选择类型...',
    listClass: 'x-combo-list-small'
});
var timeStore = new Ext.data.SimpleStore({
    fields: ['value'],
    data: [['00:00:00'],['00:15:00'],['00:30:00'],['00:45:00'],['01:00:00'],['01:15:00'],['01:30:00'],['01:45:00'],
        ['02:00:00'],['02:15:00'],['02:30:00'],['02:45:00'],['03:00:00'],['03:15:00'],['03:30:00'],['03:45:00'],
        ['04:00:00'],['04:15:00'],['04:30:00'],['04:45:00'],['05:00:00'],['05:15:00'],['05:30:00'],['05:45:00'],
        ['06:00:00'],['06:15:00'],['06:30:00'],['06:45:00'],['07:00:00'],['07:15:00'],['07:30:00'],['07:45:00'],
        ['08:00:00'],['08:15:00'],['08:30:00'],['08:45:00'],['09:00:00'],['09:15:00'],['09:30:00'],['09:45:00'],
        ['10:00:00'],['10:15:00'],['10:30:00'],['10:45:00'],['11:00:00'],['11:15:00'],['11:30:00'],['11:45:00'],
        ['12:00:00'],['12:15:00'],['12:30:00'],['12:45:00'],['13:00:00'],['13:15:00'],['13:30:00'],['13:45:00'],
        ['14:00:00'],['14:15:00'],['14:30:00'],['14:45:00'],['15:00:00'],['15:15:00'],['15:30:00'],['15:45:00'],
        ['16:00:00'],['16:15:00'],['16:30:00'],['16:45:00'],['17:00:00'],['17:15:00'],['17:30:00'],['17:45:00'],
        ['18:00:00'],['18:15:00'],['18:30:00'],['18:45:00'],['19:00:00'],['19:15:00'],['19:30:00'],['19:45:00'],
        ['20:00:00'],['20:15:00'],['20:30:00'],['20:45:00'],['21:00:00'],['21:15:00'],['21:30:00'],['21:45:00'],
        ['22:00:00'],['22:15:00'],['22:30:00'],['22:45:00'],['23:00:00'],['23:15:00'],['23:30:00'],['23:45:00']]
});
var time1ComboBox = new Ext.form.ComboBox({
    id: 'time1',
    store: timeStore,
    displayField: 'value',
    valueField: 'value',
    triggerAction: 'all',
    width: 110,
    readonly:false,
    forceSelection: true,
    editable: false,
    emptyText:stDate.dateFormat('hh:mm:ss'),
    listClass: 'x-combo-list-small',
});
var time2ComboBox = new Ext.form.ComboBox({
    id: 'time2',
    store: timeStore,
    displayField: 'value',
    valueField: 'value',
    triggerAction: 'all',
    width: 110,
    forceSelection: true,
    editable: false,
    // regex: new RegExp('^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'),
    emptyText: edDate.dateFormat('hh:mm:ss'),
    listClass: 'x-combo-list-small'
});



typeComboBox.setValue('RTV');


var TagDataTollbar = [{
    xtype: 'tbtext',
    text: '点名:'
}, {
    id: 'tagname',
    xtype: 'textfield',
    width: 80,
    value: tagname,
    allowBlank: false
}, {
    id: 'stTime',
    xtype: 'datefield',
    readOnly: false,
    fieldLabel: '开始时间',
    width:200,
    labelWidth: 65,
    format: 'Y-m-d',
    value: stDate
},time1ComboBox, {
    id: 'edTime',
    xtype: 'datefield',
    fieldLabel: '结束时间',
    labelWidth: 65,
    width:200,
    readOnly: false,
    dateFormat: 'Y-m-d',
    value: edDate
}, time2ComboBox,{
    xtype: 'tbtext',
    text: '间隔:'
}, {
    id: 'interval',
    xtype: 'textfield',
    width: 60,
    allowBlank: false
}, {
    xtype: 'tbtext',
    text: '类型:'
}, typeComboBox, {
    text: '查询',
    iconCls: 'application_form_magnify',
    tooltip: '',
    handler: doQuery
}
];

function getQueryTips() {
    var sb = new StringBuffer();
    sb.append('                                    使用说明\n');
    sb.append('\n===============[实时值]查询===============\n');
    sb.append('1.在[点名]文本框中输入点名\n');
    sb.append('2.在[类型]组合框中选择"实时值"\n');
    sb.append('3.点击[查询]按钮查询测点的"实时值"\n');
    sb.append('\n===============[历史值]查询===============\n');
    sb.append('1.在[点名]文本框中输入点名\n');
    sb.append('2.在[类型]组合框中选择"历史值"\n');
    sb.append('3.在[开始]日期与时间文本框中选择或输入历史日期与时间\n');
    sb.append('3.点击[查询]按钮查询测点在该时刻的"历史值"\n');

    sb.append('\n===============[原始值，最大值，最小值，平均值]查询===============\n');
    sb.append('1.在[点名]文本框中输入点名\n');
    sb.append('2.在[类型]组合框中选择原始值、最大值、最小值、平均值之一\n');
    sb.append('3.在[开始]日期与时间文本框中选择或输入开始日期与时间\n');
    sb.append('4.在[结束]日期与时间文本框中选择或输入结束日期与时间\n');
    sb.append('5.点击[查询]按钮查询测点在该时间段内的原始值、最大值、最小值、平均值\n');

    sb.append('\n===============[快照值]查询===============\n');
    sb.append('1.在[点名]文本框中输入点名\n');
    sb.append('2.在[类型]组合框中选择快照值\n');
    sb.append('3.在[开始]日期与时间文本框中选择或输入开始日期与时间\n');
    sb.append('4.在[结束]日期与时间文本框中选择或输入结束日期与时间\n');
    sb.append('5.在[间隔]文本框中输入数据的时间间隔（单位：秒）\n');
    sb.append('6.点击[查询]按钮查询测点在该时间段内的快照值\n');

    sb.append('\n===============[批量实时值]查询===============\n');
    sb.append('1.在[点名]文本框中输入多个点名，点名直接用英文逗号（,）分隔\n');
    sb.append('2.在[类型]组合框中选择批量实时值\n');
    sb.append('3.点击[查询]按钮查询这些测点的实时值\n');

    sb.append('\n===============[批量最大值、批量最小值、批量平均值]查询===============\n');
    sb.append('1.在[点名]文本框中输入点名\n');
    sb.append('2.在[类型]组合框中选择批量最大值、批量最小值、批量平均值之一\n');
    sb.append('3.在[开始]日期与时间文本框中选择或输入开始日期与时间\n');
    sb.append('4.在[结束]日期与时间文本框中选择或输入结束日期与时间\n');
    sb.append('5.在[间隔]文本框中输入数据的时间间隔（单位：秒）\n');
    sb.append('6.点击[查询]按钮查询测点在该时间段内的以指定时间间隔分隔的各个时间段的最大、最小、平均值\n');

    sb.append('\n===============[测点数据状态]===============\n');
    sb.append('0 : 好\n');
    sb.append('1 : 坏\n');
    sb.append('2 : 手工录入\n');
    sb.append('3 : 点名不存在\n');
    sb.append('4 : 写入失败\n');
    sb.append('5 : 数据不存在\n');

    return sb.toString();
}

var queryPanel = new Ext.form.FormPanel({
    title: '测点数据查询',
    width: window.innerWidth,
    height:window.innerHeight,
    layout:'fit',
    tbar: TagDataTollbar,
    items: [{
        id: 'result',
        xtype: 'textarea',
        readOnly: true,
        value: getQueryTips()
    }],
    buttonAlign: 'center',
    buttons: [{
        text: '清空',
        handler: function () {
            Ext.getCmp('result').reset();
        }
    }]
});

function doQuery() {

    var tagname = Ext.getCmp('tagname').getValue();
    if (tagname == null || tagname.trim() == '') {
        Ext.Msg.alert("提示", "请先输入测点点名!");
        return;
    }


    var type = typeComboBox.getValue();
    if (type == null || type.trim() == '') {
        Ext.Msg.alert("提示", "请选择数据类型.");
        return false;
    }

    if (type == 'RTV') {
        RTVQuery(tagname);
        return;
    }

    if (type == 'BATRTV') {
        BATRTVQuery(tagname);
        return;
    }


    var oStTime = Ext.getCmp("stTime");
    if (!oStTime.isValid(false)) {
        Ext.Msg.alert("提示", "开始时间无效!");
        return;
    }

    var stTime = oStTime.getValue();

    if (type == 'HIS') {
        HISQuery(tagname, stTime);
        return;
    }


    var oEdTime = Ext.getCmp("edTime");
    if (!oEdTime.isValid(false)) {
        Ext.Msg.alert("提示", "结束时间无效!");
        return false;
    }


    var edTime = oEdTime.getValue();

    if (edTime.getTime() < stTime.getTime()) {
        var temp = edTime;
        edTime = stTime;
        stTime = temp;
    }


    //time range in secondes
    var range = Math.abs((edTime.getTime() - stTime.getTime())) / 1000;

    //原始数据查询的时间跨度最长60天
    if (range > 60 * 24 * 60 * 60 && type == 'RAW') {
        Ext.Msg.alert("提示", "时间跨度太大，最长60天.");
        return false;
    }

    if (type == 'RAW') {
        RAWQuery(tagname, stTime, edTime);
        return;
    }


    //统计数据查询时间跨度最长60天
    if (range > 60 * 24 * 60 * 60 && (type == 'MAX' || type == 'MIN' || type == 'AVG')) {
        Ext.Msg.alert("提示", "时间跨度太大，最长60天.");
        return false;
    }

    if (type == 'MAX') {
        AGGQuery(tagname, stTime, edTime, DATATYPE_MAX);
        return;
    }

    if (type == 'MIN') {
        AGGQuery(tagname, stTime, edTime, DATATYPE_MIN);
        return;
    }

    if (type == 'AVG') {
        AGGQuery(tagname, stTime, edTime, DATATYPE_AVG);
        return;
    }


    var interval = parseInt(Ext.getCmp("interval").getValue());
    if (isNaN(interval)) {
        Ext.Msg.alert("提示", "数据间隔无效!");
        return false;
    }

    //快照数据查询和统计数据查询间隔，最多500个数据
    if (interval * 500 < range) {
        Ext.Msg.alert("提示", "数据间隔太小!");
        return false;
    }

    if (type == 'SNP') {
        SNPQuery(tagname, stTime, edTime, interval);
        return;
    }

    if (type == 'BATMAX') {
        BATAGGQuery(tagname, stTime, edTime, interval, DATATYPE_MAX);
        return;
    }

    if (type == 'BATMIN') {
        BATAGGQuery(tagname, stTime, edTime, interval, DATATYPE_MIN);
        return;
    }

    if (type == 'BATAVG') {
        BATAGGQuery(tagname, stTime, edTime, interval, DATATYPE_AVG);
        return;
    }

    Ext.Msg.alert("提示", "查询参数未知错误.");

}


function getResultString(result) {
    var sb = new StringBuffer();
    if (Ext.isObject(result) && !Ext.isEmpty(result.time)) {
        sb.append(formatDateTime(result.time)).append('      ');
        sb.append(result.status).append('      ');
        sb.append(result.value).append('\n');
        return sb.toString();
    }

    if (Ext.isArray(result)) {
        for (var i = 0; i < result.length; i++) {
            if (!Ext.isEmpty(result[i]) && !Ext.isEmpty(result[i].time)) {
                sb.append(i + 1).append('    ');
                sb.append(formatDateTime(result[i].time)).append('      ');
                sb.append(result[i].status).append('      ');
                sb.append(result[i].value).append('\n\n');
            } else {
                sb.append(i + 1).append('    ');
                sb.append(DWRUtil.toDescriptiveString(result[i], 4)).append('\n\n');
            }
        }
        return sb.toString();
    }

    sb.append(DWRUtil.toDescriptiveString(result, 4)).append('\n\n');

    return sb.toString();
}

function RTVQuery(tagname) {
    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================单点实时数据查询=============================\n');
    sb.append('查询测点点名：').append(tagname).append('\n');
    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getRTDataByTagName(tagname, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}

function BATRTVQuery(tagnames) {

    var tagArray = tagnames.split(',');

    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================批量实时数据查询=============================\n');
    sb.append('查询测点点名：').append(tagArray).append('\n');
    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getRTDataByBatch(tagArray, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}

//单点历史时刻快照数据查询
function HISQuery(tagname, time) {
    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================单点历史数据查询=============================\n');
    sb.append('查询测点点名：').append(tagname).append('\n');
    sb.append('查询历史时间：').append(formatDateTime(time)).append('\n');
    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getHistoryDataByTime(tagname, time, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}

//单点原始数据查询
function RAWQuery(tagname, stTime, edTime) {
    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================单点原始数据查询=============================\n');
    sb.append('查询测点点名：').append(tagname).append('\n');
    sb.append('查询开始时间：').append(formatDateTime(stTime)).append('\n');
    sb.append('查询结束时间：').append(formatDateTime(edTime)).append('\n');
    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getRawDataByTagName(tagname, stTime, edTime, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}


function SNPQuery(tagname, stTime, edTime, interval) {
    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================单点快照数据查询=============================\n');
    sb.append('查询测点点名：').append(tagname).append('\n');
    sb.append('查询开始时间：').append(formatDateTime(stTime)).append('\n');
    sb.append('查询结束时间：').append(formatDateTime(edTime)).append('\n');
    sb.append('查询数据间隔：').append(interval).append('\n');
    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getSnapshotDataByTagName(tagname, stTime, edTime, interval, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}


function AGGQuery(tagname, stTime, edTime, type) {
    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================单个统计数据查询=============================\n');
    sb.append('查询测点点名：').append(tagname).append('\n');
    sb.append('查询开始时间：').append(formatDateTime(stTime)).append('\n');
    sb.append('查询结束时间：').append(formatDateTime(edTime)).append('\n');

    if (type == DATATYPE_MAX) {
        sb.append('查询数据类型：').append('最大值').append('\n');
    } else if (type == DATATYPE_MIN) {
        sb.append('查询数据类型：').append('最小值').append('\n');
    } else if (type == DATATYPE_AVG) {
        sb.append('查询数据类型：').append('平均值').append('\n');
    } else {
        sb.append('查询数据类型：').append('未知[').append(type).append(']\n');
    }

    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getAggregationDataByTagName(tagname, stTime, edTime, type, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}

function BATAGGQuery(tagname, stTime, edTime, interval, type) {
    var s = new Date();
    var sb = new StringBuffer();
    sb.append('=============================批量统计数据查询=============================\n');
    sb.append('查询测点点名：').append(tagname).append('\n');
    sb.append('查询开始时间：').append(formatDateTime(stTime)).append('\n');
    sb.append('查询结束时间：').append(formatDateTime(edTime)).append('\n');
    sb.append('查询数据间隔：').append(interval).append('\n');
    if (type == DATATYPE_MAX) {
        sb.append('查询数据类型：').append('最大值').append('\n');
    } else if (type == DATATYPE_MIN) {
        sb.append('查询数据类型：').append('最小值').append('\n');
    } else if (type == DATATYPE_AVG) {
        sb.append('查询数据类型：').append('平均值').append('\n');
    } else {
        sb.append('查询数据类型：').append('未知[').append(type).append(']\n');
    }

    sb.append('\n');
    sb.append('查询请求时间：').append(formatDateTime(s)).append('\n');
    ;

    RTDBDao.getAggregationDataByTagNameInBatch(tagname, stTime, edTime, interval, type, {
        callback: function (result) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询返回数据：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(getResultString(result)).append('\n');
            sb.append('=====================================================================\n');
            showResult(sb.toString());

        },
        timeout: 5000,
        errorHandler: function (message) {

            var e = new Date();
            sb.append('查询返回时间：').append(formatDateTime(e)).append('\n');
            sb.append('查询过程耗时：').append(e.getTime() - s.getTime()).append('ms\n');
            sb.append('查询数据失败：\n');
            sb.append('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
            sb.append(DWRUtil.toDescriptiveString(message, 4)).append('\n');
            sb.append('====================\n');
            showResult(sb.toString());

        }
    });
}

function showResult(o) {
    Ext.getCmp('result').setValue(o);
}


// Shorthand of Ext.EventManager.onDocumentReady.
Ext.onReady(function () {

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: queryPanel
    });

});
