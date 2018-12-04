document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, headData,configData;
var fieldArray = [];
var headerArray =[];
var value = 'TITLE';
var store, grid, profeStore
DWREngine.setAsync(false);
function getReportNameById() {
    ReportConfigDao.getReportNameById(reportId,{
        callback:function (str) {
            ReportConfigDao.getReportConfigByReportName(str,{
                callback:function (data) {
                    configData = data
                }
            })
        }
    })
}

function getScoreReport(id,start,end) {
    ProfessionReportDao.getScoreReport(id,start,end,{
        callback:function (str) {
            for (var i=0;i<str.length;i++){
                if (i>str.length-3) {
                    for (var j = 0; j < headData.length; j++) {
                        str[i][headData[j].dataIndex] = str[i]['column_' + headData[j].dataIndex]
                        str[i].avg='无'
                        str[i].sum='无'
                        if (i==str.length-2){
                            str[i].descp='列求和'
                        }else if(i==str.length-1){
                            str[i].descp='列平均'
                        }
                    }
                }
            }
            if (configData.row_avg!=1){
                str.splice(str.length-2,1)
            } if(configData.row_sum!=1){
                str.splice(str.length-1,1)
            }
            myData = str
        }
    })
    return myData
}
function getHeadInfo() {
    ProfessionReportDao.getProfessionReportHeadInfo({
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
            var json2 = {name: "descp", mapping: "descp", type: 'string'};
            fieldArray.unshift(json2)
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
getReportNameById()
getHeadInfo()
getScoreReport(reportId,new Date(new Date().getFullYear(),new Date().getMonth(),1),new Date())

for (var i=0;i<headerArray.length;i++){
    headerArray[i].flex = 1
    headerArray[i].sortable = true
    headerArray[i].align = 'center'
    headerArray[i].renderer = formatNumber
}
var json1 = {header: "指标名称", dataIndex: "descp", flex: 1,sortable: true, align: 'center'};
var json2 = {header: "行平均值", dataIndex: "avg", flex: 1,sortable: true, align: 'center',renderer:formatNumber};
var json3 = {header: "行累计值", dataIndex: "sum", flex: 1,sortable: true, align: 'center',renderer:formatNumber};

headerArray.unshift(json1)
if (configData.column_avg==1) {
    headerArray.push(json2)
}if (configData.column_sum==1) {
    headerArray.push(json3)
}
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
        {
            xtype: 'datefield',
            id: "stDate",
            labelWidth: 30,
            fieldLabel: '开始',
            format: 'Y-m-d',
            width: 160,
            value: new Date(new Date().getFullYear(),new Date().getMonth(),1).dateFormat('Y-M-d')
        },

        {
            xtype: 'datefield',
            id: "edDate",
            labelWidth: 30,
            fieldLabel: '结束',
            format: 'Y-m-d',
            width: 160,
            value: new Date().dateFormat('Y-M-d')
        },  '->',{
            text: '查询',
            iconCls: 'refresh',
            tooltip: '查询',
            handler:handlerSearchAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '专业报表',
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
            items: [ {
                ui: 'default-toolbar',
                xtype: 'splitbutton',
                text: '导出',
                menu: {
                    defaults: {},
                    items: [{
                        text: 'Excel xlsx',
                        handler: function () {
                            exportReport()
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

function exportReport() {
    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};
        params = Ext.applyIf(params, {
            begin:formatDate(Ext.getCmp('stDate').getValue())+' 00:00:00',
            end: formatDate(Ext.getCmp('edDate').getValue())+' 00:00:00',
            reportConfigId:reportId
        });
        params.start = 0;
        params.limit = -1;

        var href = downloadURI + '?' + Ext.urlEncode(params);

        window.location = href;

        //window.open(href,'','width=780,height=550,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');


    });
}
function handlerSearchAction() {
    var startDate,endDate
    startDate = Ext.getCmp('stDate').getValue().getTime()
    endDate = Ext.getCmp('edDate').getValue().getTime()

    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 30 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        var newData = getScoreReport(reportId,startDate, endDate)
        store.loadData(newData);
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