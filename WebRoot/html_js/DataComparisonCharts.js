var myData,nameData,num=0,timeArray=[]
DWREngine.setAsync(false);
if (!Array.prototype.map) {
    Array.prototype.map = function (fn, context) {
        var arr = [];
        if (typeof fn === "function") {
            for (var k = 0, length = this.length; k < length; k++) {
                arr.push(fn.call(context, this[k], k, this));
            }
        }
        return arr;
    };
}
function getListByTagNameAndTime(list,sTDate,enDate){
    KpiHistoryDetailsDao.getListByTagNameAndTime(list,sTDate,enDate,{
        callback:function(str) {
            for (var i =0;i<str.length;i++){
                for (var j= 0;j<str[i].value.length;j++) {
                    str[i].value[j].time = formatDateTime(new Date(str[i].value[j].time))
                    str[i].value[j].value = formatNumber(str[i].value[j].value)
                    timeArray.push(str[i].value[j].time)
                }
            }
            myData = str
            if (myData == null) {
                myData=[]
            }
        }
    })
    return myData
}
nameData = data.split(',')
getListByTagNameAndTime(nameData,new Date(parseInt(startTime)),new Date(parseInt(endTime)))
var showData = []
for(var i =0;i<myData.length;i++){
    var json ={}
    json['name'] = myData[i].name
    json['type'] = 'line'
    json['stack'] = '实际值'
    json['data'] = myData[i].value.map(function (item) {
        return item.value;
    })
    showData.push(json)
}
function getMaxLength(){
    var len =0
    for (var i = 0;i<myData.length;i++){
        if(len<myData[i].value.length){
            len =myData[i].value.length
            num = i
        }
    }

}
getMaxLength()
Ext.onReady(function () {
    // document.getElementById('main').setAttribute()
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    option = {
        title: {
            text: '数据对比趋势'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: nameData
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeArray
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [ {
            show: true,
            realtime: true,
            start: 65,
            end: 85
        },
            {
                type: 'inside',
                realtime: true,
                start: 65,
                end: 85
            }],
        series:showData
    };
    myChart.setOption(option);
});
