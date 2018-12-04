var tagData = []
function getTagInfoByColumn() {
    TagInfoDao.getTagInfosByColumn('NAME','KPI.',{
        callback:function (str) {
            for (var i=0;i<str.length;i++){
                var array = []
                array.push(str[i].name)
                array.push(str[i].descp)
                tagData.push(array)
            }

        }
    })
}
getTagInfoByColumn()
var kpiNameEditor = {
    xtype: 'combo',
    store: tagData,
    displayField: 'descp',
    valueField: 'name',
    triggerAction: 'all',
    allowBlank: false,
    forceSelection: false,
    editable: true,
    lazyRender: true,
    selectOnFocus: true
};
var kpiNameEditor3 = {
    xtype: 'combo',
    store: tagData,
    displayField: 'descp',
    valueField: 'name',
    triggerAction: 'all',
    allowBlank: false,
    forceSelection: false,
    editable: true,
    lazyRender: true,
    selectOnFocus: true
};

var kpiNameEditor2 = {
    xtype: 'combo',
    store: tagData,
    displayField: 'descp',
    valueField: 'name',
    triggerAction: 'all',
    allowBlank: false,
    forceSelection: false,
    editable: true,
    lazyRender: true,
    selectOnFocus: true
};
