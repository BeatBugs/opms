// alert(DWRUtil.toDescriptiveString(values,2));

// user.id
// user.userName
// user.userDesc
// user.password
// user.enabled
var user = {};
var userName = 'admin'
var yearData = [], monthData = [], dataJsonMap = {};
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
var data = [['全部信息', 'ALL'], ['指标信息', 'KPI_INFO'], ['考核条件', 'KPI_COND'], ['指标基准', 'KPI_TARGET'], ['得奖区间', 'KPI_SCORE_ZONE'], ['岗位信息', 'POST'], ['运行人员', 'OPERATOR']]
for (var i = 0; i < data.length; i++) {
    dataJsonMap[data[i][1]] = data[i][0]
    dataJsonMap[data[i][0]] = data[i][1]
    data[i][1] = data[i][0]
}

var yearCombox = new Ext.form.ComboBox({
    store: yearData,
    id: "yearCombox",
    fieldLabel: '来源年份',
    displayField: 'name',
    valueField: 'name',
    width: 590,
    name: 'fromYear',
    labelWidth: 100,
    value: new Date().getFullYear(),
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: {margin: '10px auto'},
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
});
var monthCombox = new Ext.form.ComboBox({
    store: monthData,
    id: "monthCombox",
    fieldLabel: '来源月份',
    displayField: 'name',
    valueField: 'name',
    name: 'fromMonth',
    width: 590,
    labelWidth: 100,
    value: new Date().getMonth() + 1,
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: {margin: '10px auto'},
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
});
var yearCombox1 = new Ext.form.ComboBox({
    store: yearData,
    id: "yearCombox1",
    fieldLabel: '目标年份',
    displayField: 'name',
    valueField: 'name',
    width: 590,
    labelWidth: 100,
    value: new Date().getFullYear(),
    triggerAction: 'all',
    mode: 'local',
    name: 'toYear',
    forceSelection: true,
    style: {margin: '10px auto'},
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
});
var monthCombox1 = new Ext.form.ComboBox({
    store: monthData,
    id: "monthCombox1",
    fieldLabel: '目标月份',
    displayField: 'name',
    valueField: 'name',
    width: 590,
    labelWidth: 100,
    name: 'toMonth',
    value: new Date().getMonth() + 2,
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: {margin: '10px auto'},
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
});
var dataCombox = new Ext.form.ComboBox({
    store: data,
    id: "dataCombox",
    fieldLabel: '基础数据',
    displayField: 'name',
    valueField: 'name',
    width: 590,
    labelWidth: 100,
    value: data[0][0],
    name: 'which',
    triggerAction: 'all',
    mode: 'local',
    forceSelection: true,
    style: {margin: '10px auto'},
    editable: false,
    lazyRender: false,
    listClass: 'x-combo-list-small'
});
var userForm = new Ext.FormPanel({
    labelWidth: 80,
    frame: true,
    title: '基础数据复制',
    bodyStyle: 'padding:15px 15px 10px 15px',
    width: window.innerWidth,
    defaults: {width: 590},
    defaultType: 'textfield',

    items: [
        dataCombox
        , yearCombox
        , monthCombox
        , yearCombox1
        , monthCombox1
    ],
    buttonAlign: 'center',
    buttons: [
        {
            text: '复制数据',
            handler: function () {

                if (!userForm.getForm().isValid()) {
                    return;
                }

                // Returns the fields in this form as an object with key/value pairs as they would be submitted using a standard form submit.
                // If multiple fields exist with the same name they are returned as an array.
                // Parameters: asString : Boolean (optional) false to return the values as an object (defaults to returning as a string)
                var oFormData = userForm.getForm().getValues(false);

                oFormData.which = dataJsonMap[oFormData.which]
                //alert(DWRUtil.toDescriptiveString(oFormData,4));

                if(oFormData['fromYear'] == oFormData['toYear'] && oFormData['fromMonth'] == oFormData['toMonth']){
                    Ext.Msg.alert('提示', '来源和目的的年份和月份参数相同。');
                    return;
                }

                Ext.Msg.confirm('提示', '是否要将' + oFormData['fromYear'] + '年' + oFormData['fromMonth'] + '月' + '的配置信息复制到' + oFormData['toYear'] + '年' + oFormData['toMonth'] + '月' + '？<br/>说明：将会首先删除' + oFormData['toYear'] + '年' + oFormData['toMonth'] + '月' + '的配置信息', function(btn){

                    if (btn != 'yes'){
                        return;
                    }

                    OpmsConfigCopyService.copy(oFormData['which'],oFormData['fromYear'],oFormData['fromMonth'],oFormData['toYear'],oFormData['toMonth'],true,{
                        callback:function(success) {

                            if(success == true){
                                showToast('复制成功！');
                            }else{
                                showToast('复制失败！' + success);
                            }

                        },
                        timeout:300000,
                        errorHandler:function(message) { Ext.Msg.alert('提示', '操作失败，错误信息：' + message); }
                    });

                });

            }
        }]
});

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

function showResult(btn, text) {
    if (btn == 'yes') {
        showToast(Ext.String.format("保存成功"))
    } else {
        showToast(Ext.String.format("放弃修改"))
    }
}

// Fires when the document is ready (before onload and before images are loaded).
// Shorthand of Ext.EventManager.onDocumentReady.
Ext.onReady(function () {
    /*
        new Ext.ToolTip({
            target: 'password',
            html: 'A very simple tooltip'
        });

        // Provides attractive and customizable tooltips for any element.
        // The QuickTips singleton is used to configure and manage tooltips
        // globally for multiple elements in a generic manner.
        // Init the singleton. Any tag-based quick tips will start working.
        Ext.QuickTips.init();

        // NOTE: This is an example showing simple state management. During development,
        // it is generally best to disable state management as dynamically-generated ids
        // can change across page loads, leading to unpredictable results.  The developer
        // should ensure that stable state ids are set for stateful components in real apps.
        // Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

        userForm.render('content-panel');
        */


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: userForm
    });

});