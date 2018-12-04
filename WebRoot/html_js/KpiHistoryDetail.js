document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var orderclassJsonMap = {}
var value = 'TITLE';
var store, grid,title='指标历史明细-'+formatDateTime(new Date(parseInt(startTime)))+'至'+formatDateTime(new Date(parseInt(endTime)))
var stationJsonMap = {}
DWREngine.setAsync(false);
function getKpiScore(name,stTime,enTime) {
    KpiHistoryDetailsDao.getByTagNameAndTime(name,stTime,enTime, {
        callback: function (str) {
            for (var i=0;i<str.length;i++){
                str[i].teamId = orderclassJsonMap[str[i].teamId]
            }
            myData = str
        }
    })
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
                teamIdData[i][1] = teamIdData[i][0]
            }
        }
    })
}

getTeam()
getKpiScore(tagName,new Date(parseInt(startTime)),new Date(parseInt(endTime)))


Ext.onReady(function () {
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "teamId", mapping: "teamId", type: 'string'},
            {name: "time", mapping: "time", type: 'string'},
            {name: "value", mapping: "value", type: 'float'}
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
        }

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
                header: "值别",
                flex: 1,
                dataIndex: "teamId",
                sortable: true,
                align: 'center'
            },
            {
                header: "时间",
                flex: 1,
                dataIndex: "time",
                sortable: true,
                align: 'center',
                renderer: formatDateTime1
            },

            {
                header: "实际值",
                flex: 1,
                dataIndex: "value",
                sortable: true,
                align: 'center',
                renderer: formatNumber
            }
        ],
        loadMask: true,

        bbar: pagingBar

    });


    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: grid
    });


});

function formatDateTime1(date) {
    var dateTime = new Date(date)
    if (dateTime == null) {
        return '';
    }
    if(!(dateTime instanceof Date)){
        return dateTime;
    }
    return dateTime.dateFormat('Y-M-d h:m:s');
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