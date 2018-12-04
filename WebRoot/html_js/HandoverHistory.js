document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, profeStore
var unitJsonMap = {}, suiteJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);


function getHistory(unitId,setsId,teamId,stDate,edDate) {
    HandRecordDao.query(unitId,setsId,teamId,stDate,edDate, {
        callback: function (str) {
            for (var i = 0; i < str.length; i++) {
                str[i].unitId = unitJsonMap[str[i].unitId]
                str[i].setsId = suiteJsonMap[str[i].setsId]
                str[i].teamId = orderclassJsonMap[str[i].teamId]
            }
            myData = {root:str}
        }
    })
    return myData
}

var unitIdData

function getUnit() {
    UnitDao.getAllUnitName({
        callback: function (str) {
            unitIdData = str
            for (var i = 0; i < unitIdData.length; i++) {
                unitJsonMap[str[i][1]] = str[i][0]
                unitJsonMap[str[i][0]] = str[i][1]
                unitJsonMap['全部单元'] = 0
                unitJsonMap[''] = 0
                unitJsonMap[null] = 0
                unitIdData[i][1] = unitIdData[i][0]
            }

        }
    })

}

var setsIdData

function getSuite(id) {
    SetsDao.getAllSetsName(id,{
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

        }
    })
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

        }
    })
}

getTeam()
getUnit()
getSuite(unitJsonMap[unitIdData[0][0]])
getHistory(0,0,0,'','')



Ext.onReady(function () {
    store = Ext.create('Ext.data.ArrayStore', {
        fields: [
            {name: "id", mapping: "id", type: 'int'},
            {name: "unitId", mapping: "unitId", type: 'string'},
            {name: "setsId", mapping: "setsId", type: 'string'},
            {name: "teamId", mapping: "teamId", type: 'string'},
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
    var unitComboBox = new Ext.form.ComboBox({
        store: unitIdData,
        width: 80,
        displayField: 'name',
        id:'unitId',
        valueField: 'value',
        triggerAction: 'all',
        emptyText: '单元',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small',
        listeners: {
            select: function (combo, record, index) {
                getSuite(unitJsonMap[this.getValue()])
                Ext.getCmp('setsId').getStore().loadData(setsIdData)
                Ext.getCmp('setsId').setValue(setsIdData[0][0])
            }
        }
    })
    var suiteComboBox = new Ext.form.ComboBox({
        store: setsIdData,
        width: 80,
        displayField: 'name',
        id:'setsId',
        valueField: 'value',
        triggerAction: 'all',
        emptyText: '机组',
        forceSelection: true,
        editable: false,
        lazyRender: false,

        listClass: 'x-combo-list-small'
    })
    var orderClassComboBox = new Ext.form.ComboBox({
        store: teamIdData,
        width: 80,
        id:'teamId',
        displayField: 'name',
        valueField: 'value',
        emptyText: '班次',
        triggerAction: 'all',
        forceSelection: true,
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small'
    })

    var tbar;
    tbar = [
        unitComboBox,
        suiteComboBox,
        orderClassComboBox, {
            xtype: 'datefield',
            id: "stDate",
            labelWidth: 40,
            fieldLabel: '开始',
            format: 'Y-m-d',
            width: 170,
            value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, -30), "Y-m-d")
        }, {
            xtype: 'timefield',
            id: "stTime",
            value:'00:00:00',
            width: 110,
            format: 'G:i:s',
            increment: 10
        }, {
            xtype: 'datefield',
            id: "edDate",
            labelWidth: 40,
            fieldLabel: '结束',
            format: 'Y-m-d',
            width: 170,
            value: Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.DAY, +0), "Y-m-d")
        }, {
            xtype: 'timefield',
            id: "edTime",
            format: 'G:i:s',
            value:'00:00:00',
            width: 110,
            increment: 10
        }, '->', {
            text: '查询',
            iconCls: 'refresh',
            tooltip: '查询',
            handler: handleSearchAction

        }, {
            text: '刷新',
            iconCls: 'refresh',
            tooltip: '刷新表格',
            handler: handleRefeshAction
        }
    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '交接班历史记录',
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
            {header: "单元", flex: 1, dataIndex: "unitId", sortable: true, align: 'center'},
            {header: "机组", flex: 1, dataIndex: "setsId", sortable: true, align: 'center'},
            {
                header: "班次",
                flex: 1,
                dataIndex: "teamId",
                sortable: true,
                align: 'center'
            },
            {
                header: "班次开始时间",
                flex: 1,
                dataIndex: "wtBegin",
                sortable: true,
                align: 'center',
                renderer: formatRealTime
            },
            {
                header: "班次结束时间",
                flex: 1,
                dataIndex: "wtEnd",
                sortable: true,
                align: 'center',
                editor: 'textfield',
                renderer: formatRealTime
            },
            {header: "人员明细", flex: 1, dataIndex: "personDetail", sortable: true, align: 'center',renderer:formatText}
        ],
        loadMask: true,

        bbar: pagingBar,
        tbar: tbar

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