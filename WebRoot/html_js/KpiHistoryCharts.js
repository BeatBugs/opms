var myData,timeArray=[],dataArray=[],max=0,min=0
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

function getKpiScore(name,stTime,enTime) {
    KpiHistoryDetailsDao.getByTagNameAndTime(name,stTime,enTime, {
        callback: function (str) {
            for (var i=0;i<str.length;i++){
                str[i].time = formatDateTime(new Date(str[i].time))
                str[i].value = formatNumber(str[i].value)
                timeArray.push(str[i].time)
                dataArray.push(str[i].value)

            }
            min = Math.min.apply(null,dataArray)
            max = Math.max.apply(null,dataArray);
            var numArr = (max+'').split('.')
            var numArrN = numArr[0].split('')
            var a= parseInt(numArrN[0])+1;
            max = a*Math.pow(10,numArrN.length-1)
            var numArr1 = (min+'').split('.');
            var numArr1N = (min+'').split('');
            var b= parseInt(numArr1N[0])-1;
            min = b*Math.pow(10,numArr1N.length-1)
            myData = str
        }
    })
    return myData
}
getKpiScore(tagName,new Date(parseInt(startTime)),new Date(parseInt(endTime)))


Ext.onReady(function () {
    // document.getElementById('main').setAttribute()
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    option = {
        title: {
            text: '指标历史趋势'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type:'category',
            data: timeArray
        },
        yAxis: {
            min: min,
            max: max,
            type: 'value',
            axisLine: {onZero: true}
        },
        toolbox: {
            left: 'center',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [  {
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
        color:['#1372ef'],
        series: {
            name: '实际值',
            type: 'line',
            data: dataArray

        }
    }
    myChart.setOption(option);
});
