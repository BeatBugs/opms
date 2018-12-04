document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData =[], headData;
var fieldArray = [];
var headerArray = [];
var value = 'TITLE';
var store, grid, profeStore
var suiteJsonMap = {}
DWREngine.setAsync(false);

function getValueAndScore(stTime, enTime, sets) {
    TeamCompetitionDao.getValueAndScore(stTime, enTime, sets, reportId, {
        callback: function (str) {

            for (var i=0;i<str.length;i++){
                if (i==str.length-2) {
                    str[i]['tagDescp']='列求和'
                    str[i]['rowAvgValue'] =-1
                    str[i]['rowAvgScore'] =-1
                    str[i]['rowSumValue'] =-1
                    str[i]['rowSumScore'] =-1
                }else if(i==str.length-1){
                    str[i]['tagDescp']='列平均'
                    str[i]['rowAvgValue'] =-1
                    str[i]['rowAvgScore'] =-1
                    str[i]['rowSumValue'] =-1
                    str[i]['rowSumScore'] =-1
                }
            }
            myData = str
        }
    })
    return myData
}

function getReportHead() {
    TeamCompetitionDao.getReportHead({
        callback: function (str) {
            headData = str
            headerArray = headData
            for (var i = 0; i < headData.length; i++) {
                var json = {}
                json.name = headData[i].dataIndex
                json.mapping = headData[i].dataIndex
                json.type = 'float'
                fieldArray.push(json)
            }
            var json1 = {name: "units", mapping: "units", type: 'string'};
            var json2 = {name: "tagDescp", mapping: "tagDescp", type: 'string'};
            fieldArray.unshift(json2)
            fieldArray.unshift(json1)
        }
    })
}

var setsIdData

function getSuite() {
    SetsDao.getAllSetsName(0, {
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                suiteJsonMap['全部机组'] = 0
                suiteJsonMap[''] = 0
                suiteJsonMap[null] = 0
                setsIdData[i][1] = setsIdData[i][0]
            }
            var all = []
            all.push("全部机组")
            all.push("全部机组")
            setsIdData.unshift(all)

        }
    })
}

function listSave(json) {
    var array = []
    array.push(json)
    StationWeightDao.listSave(array, {
        callback: function (str) {

            showToast('保存成功')
            handleRefeshAction()
        }
    })
}

getValueAndScore(new Date(2018, 9, 10, 10, 10, 10), new Date(), '')
getReportHead()
getSuite()
for (var i = 0; i < headerArray.length; i++) {

    headerArray[i].flex = 2
    headerArray[i].sortable = true
    headerArray[i].align = 'center'
    headerArray[i].columns = [
        {
            header: '数值',
            dataIndex: 'value_' + headerArray[i].dataIndex,
            flex: 1,
            align: 'center',
            renderer: formatNumber2
        }, {
            header: '分数',
            dataIndex: 'score_' + headerArray[i].dataIndex,
            flex: 1,
            align: 'center',
            renderer: formatNumber2
        }
    ]
    delete headerArray[i].dataIndex
}
var json1 = {header: "单位", dataIndex: "units", flex: 1, sortable: true, align: 'center',hidden:true};
var json2 = {header: "指标名称", dataIndex: "tagDescp", flex: 2, sortable: true, align: 'center'};
headerArray.unshift(json1)
headerArray.unshift(json2)
var json3 = {
    header: "行平均", flex: 2, sortable: true, align: 'center', columns: [
        {
            header: '数值(平均)',
            dataIndex: 'rowAvgValue',
            flex: 1,
            align: 'center',
            renderer: formatNumber2
        }, {
            header: '分数(平均)',
            dataIndex: 'rowAvgScore',
            flex: 1,
            align: 'center',
            renderer: formatNumber2
        }
    ]
}
var json4 = {
    header: "行累计", flex: 2, sortable: true, align: 'center', columns: [
        {
            header: '数值(累计)',
            dataIndex: 'rowSumValue',
            flex: 1,
            align: 'center',
            renderer: formatNumber2
        }, {
            header: '分数(累计)',
            dataIndex: 'rowSumScore',
            flex: 1,
            align: 'center',
            renderer: formatNumber2
        }
    ]
}
headerArray.push(json3)
headerArray.push(json4)
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
    var setsIdComboBox = {
        id: 'setsIdComboBox',
        xtype: 'combo',
        store: setsIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText: '机组',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
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
            value: new Date(new Date().getFullYear(), new Date().getMonth(), 1).dateFormat('Y-M-d')
        },
        {
            xtype: 'datefield',
            id: "edDate",
            labelWidth: 30,
            fieldLabel: '结束',
            format: 'Y-m-d',
            width: 160,
            value: new Date().dateFormat('Y-M-d')
        }, setsIdComboBox,
        '->',
        {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '班值竞赛',
        width: window.innerWidth,
        stripeRows: true,
        requires: [
            'Ext.Action',
            'Ext.selection.CellModel',
            'Ext.ux.SearchField'
        ],
        header: {
            itemPosition: 1, // after title before collapse tool
            items: [{
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
        viewConfig: {forceFit: true},
        store: store,
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
function formatNumber2(number){
    if (number != -1){

        return number.toFixed(2);
    }else {
        return '无'
    }
}
function handlerQueryAction() {
    var startDate,endDate
    startDate = Ext.getCmp('stDate').getValue().getTime()
    endDate = Ext.getCmp('edDate').getValue().getTime()

    var sets = suiteJsonMap[Ext.getCmp('setsIdComboBox').getValue()]

    var newData = getValueAndScore(startDate,endDate,sets)
    store.loadData(newData)
}


function formatTime(time) {
    return time + "秒"
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

function exportReport() {
    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};

        params = Ext.applyIf(params, {
            begin: formatDate(Ext.getCmp('stDate').getValue()) + ' 00:00:00',
            end: formatDate(Ext.getCmp('edDate').getValue()) + ' 00:00:00',
            setsId: 0,
            reportConfigId: reportId
        });
        params.start = 0;
        params.limit = -1;

        var href = downloadURI + '?' + Ext.urlEncode(params);

        window.location = href;

        //window.open(href,'','width=780,height=550,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');


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
    })
}