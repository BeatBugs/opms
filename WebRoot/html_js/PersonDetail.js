document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid,title='当班人员明细-'
var stationJsonMap = {}
DWREngine.setAsync(false);


function getAll(id) {
    HangRecordDao.getAll(id, {
        callback: function (str) {

            for (var i = 0; i < str.length; i++) {
                if(i === 0){
                    title = title+formatDateTime(str[i].wtBegin)+'至'
                }
                if (i === (str.length-1)){
                    if (str[i].wtEnd ===''||str[i].wtEnd===null){
                        title = title+formatDateTime(new Date())
                    } else {
                        title = title + formatDateTime(str[i].wtEnd)
                    }
                }
                str[i].newStationId = stationJsonMap[str[i].newStationId]
            }
            myData = {root:str}
        }
    })
    return myData
}

var stationData
function getStation(){
    Post1Dao.getAllStationName({
        callback:function (str) {
            stationData = str
            for (var i = 0; i < stationData.length; i++) {
                stationJsonMap[str[i][1]] = str[i][0]
                stationJsonMap[str[i][0]] = str[i][1]
                stationData[i][1] = stationData[i][0]
            }
        }
    })
}
getStation()
getAll(id)

Ext.onReady(function () {
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "newStationId", mapping: "newStationId", type: 'string'},
            {name: "userDesc", mapping: "userDesc", type: 'string'},
            {name: "userName", mapping: "userName", type: 'string'},
            {name: "wtBegin", mapping: "wtBegin", type: 'string'},
            {name: "wtEnd", mapping: "wtEnd", type: 'string'}
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

            {header: "id", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
            {header: "用户名", flex: 1, dataIndex: "userName", sortable: true, align: 'center'},
            {header: "姓名", flex: 1, dataIndex: "userDesc", sortable: true, align: 'center'},
            {
                header: "开始时间",
                flex: 1,
                dataIndex: "wtBegin",
                sortable: true,
                align: 'center',
                renderer: formatRealTime
            },
            {
                header: "结束时间",
                flex: 1,
                dataIndex: "wtEnd",
                sortable: true,
                align: 'center',
                renderer: formatRealTime
            },
            {
                header: "所在岗位",
                flex: 1,
                dataIndex: "newStationId",
                sortable: true,
                align: 'center'
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
function formatText(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"details(\'{0}\')\">查看</a>',rowIndex);
}
function details(row) {
    var record = grid.getStore().getAt(row).data
    loadPage('./html/PersonDetail.jsp?id='+record.id,'当班人员详情')
}
function handleRefeshAction() {

    var newData = getHistory(0,0,0,'','')

    store.loadData(newData.root)
}

function handleSearchAction() {
    var unit = unitJsonMap[Ext.getCmp('unitId').getValue()]
    var set = suiteJsonMap[Ext.getCmp('setsId').getValue()]
    var team = orderclassJsonMap[Ext.getCmp('teamId').getValue()]
    var startDate = new Date(formatDate(Ext.getCmp('stDate').getValue())+' '+formatTime(Ext.getCmp('stTime').getValue()))
    var endDate = new Date(formatDate(Ext.getCmp('edDate').getValue())+' '+formatTime(Ext.getCmp('edTime').getValue()))
    var newData =getHistory(unit,set,team,startDate,endDate)
    store.loadData(newData.root)
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