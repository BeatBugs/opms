
DWREngine.setAsync(false);
var myData,treeData,showData,node=0
var unitJsonMap = {}, suiteJsonMap = {}, positonJsonMap = {},orderclassJsonMap = {}
function getTree() {
    OrganiseDao.getTree(false,{
        callback:function (str) {

            treeData =str
        }
    })
    return treeData
}
function deleteById(id,bool) {
    OrganiseDao.deleteByID(id,bool,{
        callback:function (str) {

            switch (str){
                case 0:
                    showToast('删除成功')
                    break
                case 1:
                    // Ext.Msg.confirm('提示', '是否要删除该部门及子部门?', function (btn) {
                    //
                    //     if (btn !== 'yes') {
                    //         return;
                    //     }
                    //     deleteById(id,true)
                    //     handleRefeshAction();
                    // });
                    showToast('当前部门存在子部门,无法删除')
                    break
                case 2:
                    Ext.Msg.confirm('提示', '是否要删除该部门及人员?', function (btn) {

                        if (btn !== 'yes') {
                            return;
                        }
                        deleteById(id,true)
                        handleRefeshAction();
                    });
                    break
            }
        }
    })
}
function getALLNode(){
    OrganiseDao.getByOrganseName('',{
        callback:function (str) {
            myData =str
        }
    })
    return myData
}
function getChild(id,data){
    showData=[]
    for (var i=0;i<myData.length;i++){
        if(myData[i].pId ==id){
            showData.push(myData[i])
        }
    }

    return showData
}
function sava(pro){
    OrganiseDao.save(pro,{
        callback:function (str) {
            handleRefeshAction();

            showToast('保存成功');
        },
        timeout:5000,
        errorHandler:function(message) { showToast('操作失败，错误信息：' + message); }
    })
}
getTree()
getALLNode()
getChild(0)
var treeStore = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true,
        children: []
    },
    data: treeData,
    autoLoad:true

});
var rightStore = Ext.create('Ext.data.ArrayStore', {
    fields: [
        {name: "id", mapping: "id", type: 'string'},
        {name: "name", mapping: "name", type: 'string'},
        {name: "sort", mapping: "sort", type: 'int'}

    ],
    autoLoad:true,
    data:showData,
    proxy: {
        reader: {
            type: 'json',
            rootProperty: 'root',
            totalProperty: 'total'
        }
    },
    sorters: {
        property: 'sort',
        direction: 'ASC'
    }

});
var grid = new Ext.grid.Panel({
    header:false,
    region: 'center',
    border: 'solid',
    store: rightStore,
    layout: 'fit',
    selModel: {
        type: 'checkboxmodel',
        mode: 'SINGLE'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 2
    },

    tbar:[
        {
            text: '新增',
            iconCls: 'refresh',
            tooltip: '增加',
            handler: handlerInsertAction

        }, {
            text: '保存',
            iconCls: 'refresh',
            tooltip: '保存',
            handler: handlerSaveAction
        },{
            text: '删除',
            iconCls: 'refresh',
            tooltip: '删除',
            handler: handleDeleteAction
        }
    ],
    columnLines: true,
    columns: [
        {header: "ID", flex: 1, dataIndex: "id", sortable: true, align: 'center', hidden: true},
        {header: "名称", flex: 1, dataIndex: "name", sortable: true, align: 'center',editor:'textfield'},
        {header: "排序", flex: 1, dataIndex: "sort", sortable: true, align: 'center',editor:'textfield'}
    ],
    height: window.innerHeight

})


var treePanel = Ext.create('Ext.tree.Panel', {
    height: window.innerHeight,
    title: '组织机构',
    border: 'solid',
    width: 200,
    region: 'west',
    titleCollapse: true,
    bodyStyle : 'overflow-x:hidden; overflow-y:hidden',
    store: treeStore,
    rootVisible: false,
    listeners: {
        itemclick: function (e, r) {
            node = r.data.id
            var newData=getChild(node,myData)
            rightStore.loadData(newData)
        }
    }
})


var panel = new Ext.panel.Panel({
    layout: 'border',
    title:'组织机构维护',
    width: window.innerWidth,
    height: window.innerHeight,
    items: [
        treePanel,
        grid
    ],

})
function handleDeleteAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要删除该组织机构?', function (btn) {

        if (btn !== 'yes') {
            return;
        }
        deleteById(recordData.id,false);
    });
}
function handlerSaveAction() {
    var record = grid.getSelection();

    if (record[0] === null) {
        showToast("请先选择一条记录!");
        return;
    }
    var recordData = record[0].data
    if (recordData['id'] === '-1'||recordData['id']===-1) {
        recordData['id'] = '';
    }

    if (recordData.name === null ||recordData.name === '') {
        showToast( '组织机构名字不能为空！');
        return;
    }
    if (recordData.sort === null||recordData.sort === '' ) {
        showToast( '排序不能为空！');
        return;
    }


    // Prompt for user data and process the result using a callback:
    Ext.Msg.confirm('提示', '是否要保存对记录的修改?', function (btn) {

        if (btn !== 'yes') {
            return;
        }

        recordData['pId']=node
        sava(recordData);
    });
}

function handlerInsertAction() {
    var record = {
        id: -1,
        name:'',
        sort:''

    };
    var scrollTop = grid.getView().getEl().getScrollTop()

    rightStore.insert(0, record);
    grid.getView().getEl().setScrollTop(scrollTop);

}

function handleRefeshAction() {

    var treeData = getTree()
    var data = getALLNode()
    var newData = getChild(node,data)

    treeStore.loadData(treeData,false)
    rightStore.loadData(newData);
    // treePanel.reconfigure(treeStore)
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

function showResult(btn, text) {
    if (btn == 'yes') {
        showToast(Ext.String.format("保存成功"))
    } else {
        showToast(Ext.String.format("放弃修改"))
    }
}

// Fires when the document is ready (before onload and before images are loaded).
// Shorthand of Ext.EventManager.onDocumentReady.
Ext.onReady(function () {

        // Provides attractive and customizable tooltips for any element.
        // The QuickTips singleton is used to configure and manage tooltips
        // globally for multiple elements in a generic manner.
        // Init the singleton. Any tag-based quick tips will start working.
        Ext.QuickTips.init();

        // NOTE: This is an example showing simple state management. During development,
        // it is generally best to disable state management as dynamically-generated ids
        // can change across page loads, leading to unpredictable results.  The developer
        // should ensure that stable state ids are set for stateful components in real apps.
        // Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: panel
    });

});
