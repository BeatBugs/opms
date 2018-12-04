document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData, UserData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, leftGrid, allUserStore,rightGrid
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);
function getScoreReport(startTime,endTime,teamId, stationId) {
    PersonScoreReportDao.getScoreReport(startTime,endTime,teamId, stationId,reportId,
        {
            callback: function (str) {

                for (var i = 0; i < str.length; i++) {
                    str[i].teamId = orderclassJsonMap[str[i].teamId]
                    str[i].stationId = positonJsonMap[str[i].stationId]
                }
                myData = {root: str}
            }
        });
    return myData
}


var teamIdData

function getTeam() {
    TeamDao.getTeamField({
        callback: function (str) {
            teamIdData = str
            for (var i = 0; i < teamIdData.length; i++) {
                orderclassJsonMap[str[i][1]] = str[i][0]
                orderclassJsonMap[str[i][0]] = str[i][1]
                orderclassJsonMap['全部班次'] = 0
                orderclassJsonMap[''] = 0
                orderclassJsonMap[null] = 0
                teamIdData[i][1] = teamIdData[i][0]
            }
            var all = []
            all.push("全部班次")
            all.push("全部班次")
            teamIdData.unshift(all)

        }
    })
}

var stationIdData

function getPosition() {
    Post1Dao.getAllStationName({
        callback: function (str) {
            stationIdData = str
            for (var i = 0; i < stationIdData.length; i++) {
                positonJsonMap[str[i][1]] = str[i][0]
                positonJsonMap[str[i][0]] = str[i][1]
                positonJsonMap['全部岗位'] = 0
                positonJsonMap[''] = 0
                positonJsonMap[null] = 0
                stationIdData[i][1] = stationIdData[i][0]
            }
            var all = []
            all.push("全部岗位")
            all.push("全部岗位")
            stationIdData.unshift(all)
        }
    })
}


Ext.onReady(function () {
    getPosition()
    getTeam()
    getScoreReport(new Date(new Date().getFullYear(),new Date().getMonth(),1,0,0,0),new Date(),0,0)

    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "userDesc", mapping: "userDesc", type: 'string'},
            {name: "teamId", mapping: "teamId", type: 'string'},
            {name: "stationId", mapping: "stationId", type: 'string'},
            {name: "score", mapping: "score", type: 'float'}
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

    var teamIdComboBox = {
        id:'teamId',
        xtype: 'combo',
        store: teamIdData,
        width: 100,
        displayField: 'name',
        emptyText:'班次',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }
    var stationIdComboBox = {
        id:'stationId',
        xtype: 'combo',
        store: stationIdData,
        width: 100,
        displayField: 'name',
        valueField: 'value',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        emptyText:'岗位',
        lazyRender: false,
        listClass: 'x-combo-list-small'
    }


    columnsArray = [
        {header: "姓名", flex: 1, dataIndex: "userDesc", sortable: true, align: 'center'},
        {header: "班次", flex: 1, dataIndex: "teamId", sortable: true, align: 'center'},
        {header: "岗位", flex: 1, dataIndex: "stationId", sortable: true, align: 'center'},
        {
            header: "分数",
            flex: 1,
            dataIndex: "score",
            sortable: true,
            align: 'center',
            renderer:formatNumber
        },{

            header: "得分明细(时段)",
            flex: 1,
            sortable: true,
            align: 'center',
            renderer:formatText
        }
    ]
    var tbar;
    tbar = [

        {
            xtype: 'datefield',
            id: "stDate",
            labelWidth: 30,
            fieldLabel: '开始',
            format: 'Y-m-d',
            width: 160,
            value: new Date(new Date().getFullYear(),new Date().getMonth(),1,0,0,0).dateFormat('Y-M-d')
        }, {
            xtype: 'timefield',
            id: "stTime",
            width: 110,
            value:'00:00:00',
            format: 'G:i:s',
            increment: 10
        },

        {
            xtype: 'datefield',
            id: "edDate",
            labelWidth: 30,
            fieldLabel: '结束',
            format: 'Y-m-d',
            width: 160,
            value: new Date().dateFormat('Y-M-d')
        }, {
            xtype: 'timefield',
            id: "edTime",
            format: 'G:i:s',
            value:'00:00:00',
            width: 110,
            increment: 10
        },
        teamIdComboBox,
        stationIdComboBox, '->',
         {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '个人得分报表',
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
function exportReport() {
    Ext.Msg.confirm('提示', '是否要导出查询结果表格到Excel文件[可能需要一定的时间]?', function (btn) {

        if (btn != 'yes') {
            return;
        }

        var params = {};
        params = Ext.applyIf(params, {
            begin:formatDate(Ext.getCmp('stDate').getValue())+' 00:00:00',
            end: formatDate(Ext.getCmp('edDate').getValue())+' 00:00:00',
            teamId:0,
            stationId:0,
            reportConfigId:1
        });
        params.start = 0;
        params.limit = -1;

        var href = downloadURI + '?' + Ext.urlEncode(params);

        window.location = href;

        //window.open(href,'','width=780,height=550,toolbar=no,menubar=no,scrollbars=no,location=no,resizable=yes,status=no');


    });
}

function formatText(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"details(\'{0}\')\">明细</a>',rowIndex);
}

function details(row) {
    var record = grid.getStore().getAt(row).data

    var startDate,endDate
    if (Ext.getCmp('stTime').getValue()==null){
        startDate = Ext.getCmp('stDate').getValue().getTime()

    } else {
        startDate = Ext.getCmp('stDate').getValue().getTime()  + Ext.getCmp('stTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()

    }if (Ext.getCmp('edTime').getValue()==null) {
        endDate = Ext.getCmp('edDate').getValue().getTime()
    }else {
        endDate = Ext.getCmp('edDate').getValue().getTime()  + Ext.getCmp('edTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()
    }
    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        loadPage('./html/PersonScoreTimeDetail.jsp?userName='+record.userName+'&st='+startDate+'&et='+endDate+'&reportId='+reportId,'个人得分明细(时段)')
    }

}

function handlerQueryAction() {
    var startDate,endDate
    if (Ext.getCmp('stTime').getValue()==null){
        startDate = Ext.getCmp('stDate').getValue().getTime()

    } else {
        startDate = Ext.getCmp('stDate').getValue().getTime()  + Ext.getCmp('stTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()

    }if (Ext.getCmp('edTime').getValue()==null) {
        endDate = Ext.getCmp('edDate').getValue().getTime()
    }else {
        endDate = Ext.getCmp('edDate').getValue().getTime()  + Ext.getCmp('edTime').getValue().getTime()-new Date(2008,0,1,0,0,0).getTime()
    }
    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        var station = positonJsonMap[Ext.getCmp('stationId').getValue()]
        var team = orderclassJsonMap[Ext.getCmp('teamId').getValue()]

        var newData = getScoreReport(startDate, endDate,team,station)
        store.loadData(newData.root);
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
    });
}