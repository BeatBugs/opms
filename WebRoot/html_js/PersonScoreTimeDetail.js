document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid,title='个人得分明细(时段)-'+formatDateTime(new Date(parseInt(startTime)))+'至'+formatDateTime(new Date(parseInt(endTime)))
var stationJsonMap = {}
DWREngine.setAsync(false);
function getScoreByTimeQuantum(stTime,enTime,username,reportId) {
    PersonScoreReportDao.getScoreByTimeQuantum(stTime,enTime,username, reportId,{
        callback: function (str) {


            myData = {root:str}
        }
    })
    return myData
}

getScoreByTimeQuantum(new Date(parseInt(startTime)),new Date(parseInt(endTime)),userName,reportId)


Ext.onReady(function () {
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "hangId", mapping: "hangId", type: 'int'},
            {name: "score", mapping: "score", type: 'float'},
            {name: "begin", mapping: "wtBegin", type: 'string'},
            {name: "end", mapping: "wtEnd", type: 'string'}
        ],
        data: myData,
        proxy: {
            reader: {
                type: 'json',
                rootProperty: 'root'
            }
        },
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



    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: title,
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
            items: []
        },

        columns: [
            new Ext.grid.RowNumberer(),

            {
                header: "开始时间",
                flex: 1,
                dataIndex: "begin",
                sortable: true,
                align: 'center',
                renderer: formatRealTime
            },
            {
                header: "结束时间",
                flex: 1,
                dataIndex: "end",
                sortable: true,
                align: 'center',
                renderer: formatRealTime
            },
            {
                header: "得分",
                flex: 1,
                dataIndex: "score",
                sortable: true,
                align: 'center',
                renderer: formatNumber
            },{

                header: "得分明细(指标)",
                flex: 1,
                sortable: true,
                align: 'center',
                renderer:formatText
            }
        ],
        loadMask: true,

        bbar: pagingBar,

    });


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});
function formatText(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"details(\'{0}\')\">明细</a>',rowIndex);
}
function details(row) {
    var record = grid.getStore().getAt(row).data

    loadPage('./html/PersonScoreKpiDetail.jsp?hangId='+record.hangId+"&st="+new Date(record.begin).getTime()+"&et="+new Date(record.end).getTime()+'&reportId='+reportId,'个人得分明细(指标)')
}


function formatRealTime(date) {

    if (date == null||date =='') {
        return Ext.String.format('当班中...');
    }else {
        return new Date(date).dateFormat('Y-M-d h:m:s');
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