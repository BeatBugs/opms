document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid,title='个人得分明细(指标)-'+formatDateTime(new Date(parseInt(startTime)))+'至'+formatDateTime(new Date(parseInt(endTime)))
var stationJsonMap = {}
DWREngine.setAsync(false);
function getKpiScore(hangid,stTime,enTime,reportId) {
    PersonScoreReportDao.getKpiScore(hangid,stTime,enTime, reportId,{
        callback: function (str) {
            myData = {root:str}
        }
    })
    return myData
}

getKpiScore(hangId,new Date(parseInt(startTime)),new Date(parseInt(endTime)),reportId)


Ext.onReady(function () {
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "tagName", mapping: "tagName", type: 'string'},
            {name: "score", mapping: "score", type: 'float'}
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
                header: "指标名称",
                flex: 1,
                dataIndex: "tagName",
                sortable: true,
                align: 'center'
            },

            {
                header: "得分",
                flex: 1,
                dataIndex: "score",
                sortable: true,
                align: 'center',
                renderer: formatNumber
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