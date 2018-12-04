document.write("<script language=javascript src='../html_js/loadPage.js'></script>");
var pageSize = 10;
var myData, pData, UserData, unitIdData, setsIdData;
var nameArray = new Array();
var value = 'TITLE';
var store, grid, leftGrid, allUserStore, rightGrid,valueFlag=0,timeFlag =0
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {}, orderclassJsonMap = {}
DWREngine.setAsync(false);

function getScoreReport(startTime, endTime, teamId, stationId) {

}


function getSuite(id) {
    SetsDao.getAllSetsName(id, {
        callback: function (str) {
            setsIdData = str
            for (var i = 0; i < setsIdData.length; i++) {
                suiteJsonMap[str[i][1]] = str[i][0]
                suiteJsonMap[str[i][0]] = str[i][1]
                setsIdData[i][1] = setsIdData[i][0]
            }

        }
    })
}

Ext.onReady(function () {
    getSuite(0)
    getScoreReport(new Date(2018, 9, 11, 0, 0, 0), new Date(), 0, 0)

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

    var suiteComob = new Ext.form.ComboBox({
        store: setsIdData,
        id: "suiteComob",
        displayField: 'name',
        valueField: 'name',
        width: 100,
        value: setsIdData[0][0],
        triggerAction: 'all',
        mode: 'local',
        forceSelection: true,
        style: 'margin:5px',
        editable: false,
        lazyRender: false,
        listClass: 'x-combo-list-small',

    })

    columnsArray = [
        {header: "指标名称", flex: 1, dataIndex: "userDesc", sortable: true, align: 'center'},
        {header: "指标描述", flex: 1, dataIndex: "teamId", sortable: true, align: 'center'},
        {header: "历史数据", width: 100, dataIndex: "stationId", sortable: true, align: 'center', renderer: formatText},
        {

            header: "历史曲线",
            width: 100,
            sortable: true,
            align: 'center',
            renderer: formatText
        }
    ]
    var tbar;
    tbar = [

        {
            xtype: 'datefield',
            id: "stDate",
            labelWidth: 30,
            fieldLabel: '日期',
            format: 'Y-m-d',
            width: 160,
            value: new Date(2018, 9, 11).dateFormat('Y-M-d')
        },
        suiteComob,
        {
            xtype: 'textfield',
            fieldLabel: '内容',
            labelWidth: 60,
            width: 160,
            name: 'indexdescp',
            id: "indexdescp"
        }, '->',
        {
            text: '查询',
            iconCls: 'remove',
            tooltip: '删除一行',
            handler: handlerQueryAction
        },
        {
            text: '新增',
            iconCls: 'add',
            tooltip: '增加',
            handler: handlerAddAction
        }

    ];


    grid = Ext.create("Ext.grid.Panel", {
        xtype: 'grid',
        title: '班次配置维护',
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
var textAreaEditor = new Ext.form.TextArea({
    allowBlank: true,
    autoScroll: true,
    grow: true,
    growMax: 300,
    width: 200,
    height:200,
    style: {color: 'blue', fontSize: '12px', fontFamily: 'Courier New'}
});
function formatText(value, metadata, record, rowIndex, colIndex) {
    return Ext.String.format('<a href=\"#\" onclick=\"details(\'{0}\')\">查看</a>', rowIndex);
}

function details(row) {
    var record = grid.getStore().getAt(row).data
    var startDate = new Date(formatDate(Ext.getCmp('stDate').getValue()) + ' ' + formatTime(Ext.getCmp('stTime').getValue()))
    var endDate = new Date(formatDate(Ext.getCmp('edDate').getValue()) + ' ' + formatTime(Ext.getCmp('edTime').getValue()))
    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        loadPage('./html/PersonScoreTimeDetail.jsp?userName=' + record.userName + '&st=' + startDate.getTime() + '&et=' + endDate.getTime(), '个人得分明细(时段)')
    }

}

function handlerQueryAction() {
    var startDate = new Date(formatDate(Ext.getCmp('stDate').getValue()) + ' ' + formatTime(Ext.getCmp('stTime').getValue()))
    var endDate = new Date(formatDate(Ext.getCmp('edDate').getValue()) + ' ' + formatTime(Ext.getCmp('edTime').getValue()))
    if (startDate > endDate) {
        showToast('时间段不存在');
    } else if (endDate - startDate > 60 * 24 * 60 * 60 * 1000) {
        showToast('时间长度不要超过一个月');
    } else {
        var station = positonJsonMap[Ext.getCmp('stationId').getValue()]
        var team = orderclassJsonMap[Ext.getCmp('teamId').getValue()]
        var newData = getScoreReport(startDate, endDate, team, station)
        store.loadData(newData.root);
    }

}

function handlerAddAction() {
    leftGrid = new Ext.FormPanel({
        header: false,
        region: 'west',

        border: 'false',
        bodyStyle: 'padding:15px 15px 10px 15px',
        defaultType: 'textfield',
        width: 260,
        layout: 'column',
        frame: true,
        defaults: {width: 220},
        items: [
            {
                labelWidth: 60,
                id: 'adjustContext',
                name: 'dajustContext',
                fieldLabel: '调整内容',
                style: {margin: '2px auto'},
            },
            {
                labelWidth: 60,
                xtype     : 'textareafield',
                id: 'adjustQuestion',
                name: 'dajustQuestion',
                fieldLabel: '调整原因',
                editor:textAreaEditor,
                style: {margin: '2px auto'},
            },
            {
                labelWidth: 60,
                id: 'adjustSystem',
                name: 'commonStationId',
                fieldLabel: '调整系统',
                style: {margin: '2px auto'},
            },
            {
                labelWidth: 60,
                xtype:'combo',
                id: 'adjustSets',
                name: 'handStationId',
                fieldLabel: '调整机组',
                style: {margin: '2px auto'},
            },
            {
                xtype: 'fieldset',
                flex: 1,
                id:'setByValue',
                title: '按值调整',
                checkboxToggle: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: false
                },
                items: [
                    {
                        labelWidth:60,
                        xtype: 'datefield',
                        fieldLabel: '调整时间',
                        format: 'Y-m-d',
                        width: 260,
                        value: new Date(2018,9,11).dateFormat('Y-M-d')
                    },
                    {
                        labelWidth: 60,
                        xtype:'combo',
                        fieldLabel: '调整值别',
                        style: {margin: '2px auto'},
                    },



                ],
                listeners:[
                    {
                        'collapse': function (e,r) {
                            if(timeFlag ==1&&valueFlag==0){
                                return
                            }else {
                                valueFlag = 0
                                Ext.getCmp('setByTime').expand()
                            }
                        }
                    },{
                        'expand':function (e,r) {
                            if(timeFlag ==0&&valueFlag==1){
                                return
                            }else {
                                valueFlag = 1
                                Ext.getCmp('setByTime').collapse()
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                flex: 1,
                id:'setByTime',
                title: '按时间调整',
                checkboxToggle: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    hideEmptyLabel: false
                },
                items: [
                    {
                        xtype: 'datefield',
                        labelWidth: 60,
                        fieldLabel: '开始日期',
                        format: 'Y-m-d',
                        width: 160,
                        value: new Date(2018,9,11).dateFormat('Y-M-d')
                    }, {
                        xtype: 'timefield',
                        labelWidth: 60,
                        value:'00:00:00',
                        fieldLabel: '开始时间',
                        format: 'G:i:s',
                        increment: 10
                    },

                    {
                        xtype: 'datefield',
                        labelWidth: 60,
                        fieldLabel: '结束日期',
                        format: 'Y-m-d',
                        width: 160,
                        value: new Date().dateFormat('Y-M-d')
                    }, {

                        xtype: 'timefield',
                        format: 'G:i:s',
                        labelWidth: 60,
                        value:'00:00:00',
                        fieldLabel: '结束时间',
                        width: 110,
                        increment: 10
                    },
                ],
                listeners:[
                    {
                        'collapse': function (e,r) {
                           {
                               if (valueFlag ==1&&timeFlag==0) {
                                   return
                               }else {
                                   timeFlag=0
                                   Ext.getCmp('setByValue').expand()
                               }

                           }
                        }
                    },{
                        'expand':function (e,r) {
                            if (valueFlag==0&&timeFlag==1){
                                return
                            } else {
                                timeFlag=1
                                Ext.getCmp('setByValue').collapse()
                            }
                        }
                    }
                ]
            }

        ],
        height: window.innerHeight

    })
    Ext.getCmp('setByTime').collapse()
    valueFlag=1

    var weatGrid = new Ext.grid.Panel({

        region: 'west',
        border:true,
        height: window.innerHeight,
        selType: 'checkboxmodel',
        title: '指标考核人员得分',
        columns: [
            {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
            {header: "指标描述", flex:2, sortable: true, dataIndex: 'descp', align: 'center'},
            {header: "机组", width: 80, sortable: true, dataIndex: 'sets', align: 'center'},
            {header: "单位", width: 80, sortable: true, dataIndex: 'units', align: 'center'}
        ],
        width:350
    })
    var eastGrid = new Ext.grid.Panel({
        region: 'east',
        title: '指标考核实时明细',
        border:true,
        height: window.innerHeight,
        selType: 'checkboxmodel',
        columns: [
            {header: "指标名称", flex:1, sortable: true, dataIndex: 'name', align: 'center'},
            {header: "指标描述", flex:2, sortable: true, dataIndex: 'descp', align: 'center'},
            {header: "单位", width: 80, sortable: true, dataIndex: 'units', align: 'center'}
        ],
        width:350
    })
    var centerForm = new Ext.panel.Panel({
        region: 'center',
        height:window.innerHeight,
        requires: [
            'Ext.layout.container.VBox'
        ],
        header:false,
        border:false,
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        defaults:{
            border:false
        },
        items:[
            {
                flex:1,
                items:[
                    {
                        xtype:'button',
                        text: '增加',
                        height:30,
                        margin:'150 5 0 5',
                        iconCls: 'add',
                        tooltip: '增加',
                        // handler: handlerAddAction
                    }
                ]

            }, {
                flex:1,
                items:[
                    {
                        xtype:'button',
                        text: '删除',
                        height:30,
                        margin:'0 5 100 5',
                        iconCls: 'add',
                        tooltip: '增加',
                        // handler: handlerDelAction
                    }
                ]
            }
        ]
    })

    centerPanel = new Ext.panel.Panel({
        region:'center',
        layout: 'border',
        width: window.innerWidth,
        border:false,
        height: window.innerHeight,
        items: [
            weatGrid,
            centerForm,
            eastGrid
        ]

    })

    var rolesWindow = new Ext.Window({
        title: '新增',
        width: 1050,
        height: 600,
        layout: 'border',
        resizable: true,
        autoHeight: true,
        frame: true,
        border: true,
        modal: true,
        closable: true,
        closeAction: 'destroy',
        maximizable: true,
        constrain: true,
        plain: false,
        items: [
            leftGrid,
            centerPanel,
        ],
        buttonAlign:'center',
        buttons:[{text:'保存'},
            {
                text:'取消'
            }]
    })
    rolesWindow.show()
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