document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, headData;
var fieldArray = [];
var headerArray =[];
var value = 'TITLE';
var store, grid, profeStore
DWREngine.setAsync(false);
function getPositionWeight(name,desc) {
    StationWeightDao.getData(name,desc,{
        callback:function (str) {
            myData = str
        }
    })
    return myData
}
function getHeadInfo() {
    StationWeightDao.getHeadInfo({
        callback:function (str) {
            headData= str
            headerArray = headData
            for (var i=0;i<headData.length;i++){
                var json = {}
                json.name = headData[i].dataIndex
                json.mapping = headData[i].dataIndex
                json.type = 'float'
                fieldArray.push(json)
            }
            var json1 = {name: "name", mapping: "name", type: 'string'};
            var json2 = {name: "descp", mapping: "descp", type: 'string'};
            fieldArray.unshift(json2)
            fieldArray.unshift(json1)
        }
    })
}
function listSave(json){
    var array =[]
    array.push(json)
    StationWeightDao.listSave(array,{
        callback:function (str) {
            showToast('保存成功')
            handleRefeshAction()
        }
    })
}
getPositionWeight('','')
getHeadInfo()
for (var i=0;i<headerArray.length;i++){
    headerArray[i].flex = 1
    headerArray[i].sortable = true
    headerArray[i].align = 'center'
    headerArray[i].editor = 'textfield'
}
var json1 = {header: "指标描述", dataIndex: "descp", flex: 1,sortable: true, align: 'center'};
var json2 = {header: "指标名称", dataIndex: "name", flex: 1,sortable: true, align: 'center'};
headerArray.unshift(json1)
headerArray.unshift(json2)
headerArray.unshift(new Ext.grid.RowNumberer())

Ext.onReady(function () {
    // getOrderClasses()
    store = Ext.create('Ext.data.ArrayStore', {
        fields: fieldArray,
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
            property: 'Sort',
            direction: 'ASC'
        },

    });
    var pagingBar = new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        pageSize: pageSize
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


    var tbar;
    tbar = [
        {   xtype: 'textfield',
            fieldLabel: '指标名称',
            labelWidth:60,
            width:160,
            name: 'indexname',
            id:"indexname"
        },{   xtype: 'textfield',
            fieldLabel: '指标描述',
            labelWidth:60,
            width:160,
            name: 'indexdescp',
            id:"indexdescp"
        }, '->',{
            text: '查询',
            iconCls: 'refresh',
            tooltip: '查询',
            handler:handlerSearchAction
        }, {
            text: '刷新',
            iconCls: 'refresh',
            tooltip: '刷新表格',
            handler: handleRefeshAction
        }, {
            text: '保存',
            iconCls: 'accept',
            tooltip: '保存修改',
            handler: handlerSaveAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '岗位权重配置维护',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],
        selModel: 'rowmodel',
        plugins: {
            ptype: 'rowediting',
            clicksToEdit: 1,
            autoCancel: false
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
                    importPost()
                }
            }, {},{
                ui: 'default-toolbar',
                xtype: 'splitbutton',
                text: '导出',
                menu: {
                    defaults: {},
                    items: [{
                        text: 'Excel xlsx',
                        handler: function () {

                            exportPost()
                        }
                    }
                    ]
                }
            }]
        },
        columns: headerArray,
        loadMask: true,
        bbar: pagingBar,
        tbar: tbar

    });

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});


function exportPost() {

    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};
        params = Ext.applyIf(params, {
            name :Ext.getCmp('indexname').getValue(),
            descp : Ext.getCmp('indexdescp').getValue()
        });
        params.start = 0;
        params.limit = -1;

        var href = downloadURI + '?' + Ext.urlEncode(params);

        window.location = href;

        //window.open(href,'','width=780,height=550,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');


    });

}

function importPost() {

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
    Ext.getCmp('indexname').setValue('')
    Ext.getCmp('indexdescp').setValue('')
    var newData = getPositionWeight('','')
    store.loadData(newData)
}

function formatTime(time) {
    return time+"秒"
}
function handlerSaveAction() {
    var record = grid.getSelection();
    if (record[0] == null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    delete recordData.id
    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn != 'yes') {
            return;
        }
        listSave(recordData)
    });
}
function handlerSearchAction() {
    var name = Ext.getCmp('indexname').getValue()
    var descp = Ext.getCmp('indexdescp').getValue()
    var newData = getPositionWeight(name,descp)
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
    })
}