function debug(o,n){
	alert(DWRUtil.toDescriptiveString(o,(n == null ? 2 : n)));
}
Date.prototype.dateFormat = function(fmt)
{ //author: meizz
    var o = {
    	"Y+": this.getFullYear(),
        "M+" : this.getMonth()+1>=10?this.getMonth()+1:'0'+(this.getMonth()+1),                 //月份
        "d+" : this.getDate()>=10?this.getDate():'0'+this.getDate(),                    //日
        "h+" : this.getHours()>=10?this.getHours():'0'+this.getHours(),                   //小时
        "m+" : this.getMinutes()>=10?this.getMinutes():'0'+this.getMinutes(),                 //分
        "s+" : this.getSeconds()>=10?this.getSeconds():'0'+this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/('y+')/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
function formatDuration(duration) {
    if (duration == null) {
        return '';
    }
	if(typeof duration != 'number'){
		return duration;
	}
	
	if(duration == 0){
		return '';//0秒
	}
	
	var days = parseInt((duration / (24 * 3600)).toFixed(0));
	
	var hours = parseInt(((duration - days * 24 * 3600) / 3600.0).toFixed(0));
	
	var minutes = parseInt(((duration - days * 24 * 3600 - hours * 3600.0)/60).toFixed(0));
	
	var seconds = duration - days * 24 * 3600 - hours * 3600 - minutes * 60;
	
	if(seconds < 0){
		seconds = 60 + seconds;
		minutes = minutes - 1;
	}
	
	if(minutes < 0){
		minutes = 60 + minutes;
		hours = hours - 1;
	}
	
	if(hours < 0){
		hours = 24 + hours;
		days = days - 1;
	}
	
	var result = '';

	if(days != 0){
		result = result + days + '天';
	}
	
	if(hours != 0){
		result = result + hours + '小时';
	}
	
	if(minutes != 0){
		result = result + minutes + '分钟';
	}
	
	if(seconds != 0){
		result = result + seconds + '秒';
	}
	
    return result;
}

function formatDate(date) {
    if (date == null) {
        return '';
    }
	if(!(date instanceof Date)){
		return date;
	}
    return date.dateFormat('Y-M-d');
}

function formatTime(date) {
    if (date == null) {
        return '';
    }
	if(!(date instanceof Date)){
		return date;
	}
    return date.dateFormat('h:m:s');
}

function formatDateTime(date) {
    if (date == null) {
        return '';
    }
	if(!(date instanceof Date)){
		return date;
	}
    return date.dateFormat('Y-M-d h:m:s');
}

function formatIntDarkBlue(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return '<font color="#123a66">' + number.toFixed(0) + '</font>';
    } else{
    	return '<font color="#123a66">' + number + '</font>';
    }
}

function formatPercent(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number * 100;
	
	number = number.toFixed(2);
	
    return number + "%";
}

function formatPercent0(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number * 100;
	
	number = number.toFixed(0);
	
    return number + "%";
}

function formatPercentRed(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number * 100;
	
	number = number.toFixed(2);
	
	return '<font color=red>' + (number + '%') + '</font>';
	
}

function formatValueColor(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	if(number < 0){
		return '<font color=red>' + number + '</font>';
	}else{
		return '<font color=green>' + number + '</font>';
	}
}

function formatValueColor2(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number.toFixed(2);
	
	if(number < 0){
		return '<font color=red>' + number + '</font>';
	}else{
		return '<font color=green>' + number + '</font>';
	}
}

function formatValueColor3(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number.toFixed(3);
	
	if(number < 0){
		return '<font color=red>' + number + '</font>';
	}else{
		return '<font color=green>' + number + '</font>';
	}
}

function formatValueColor4(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number.toFixed(4);
	
	if(number < 0){
		return '<font color=red>' + number + '</font>';
	}else{
		return '<font color=green>' + number + '</font>';
	}
}

function formatScore(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number.toFixed(2);
	
	return number;
}

function formatScoreColor(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number.toFixed(2);
	
	if(number <= 0){
		return '<font color=red>' + number + '</font>';
	}else{
		return '<font color=green>' + number + '</font>';
	}
}

function formatScoreColor2(number) {
    if (number == null) {
        return '';
    }
	if(typeof number != 'number'){
		return number;
	}
	
	number = number.toFixed(2);
	
	if(number < 0){
		return '<font color=red>' + number + '</font>';
	}else{
		return '<font color=green>' + number + '</font>';
	}
}

function formatExcelZone(exp) {
    if (exp == null) {
        return '';
    }
	if(typeof exp != 'string'){
		return exp;
	}
	
	
	return '<div style="color:blue;font-family:\'Courier New\'">' + exp + '</div>';
}

function formatPercentColor(number) {
    if (number == null) {
        return '';
    }

    if(typeof number != 'number'){
		return number;
	}
	
	number = number * 100;
	
	number = number.toFixed(2);
	
	if(number < 0){
		return '<font color=red>' + number + '%</font>';
	}else{
		return '<font color=green>' + number + '%</font>';
	}
}

function formatYesNoGreen(value){
	if (value == null) {
    	return '';
    }
	if(typeof value != 'boolean'){
		return value;
	}
	
	if(value == true){
		return '<font color=green>是</font>';
	}else{
		return '否';
	}
	
}
function formatYesNoBlue(value){
	if (value == null) {
    	return '';
    }
	if(typeof value != 'boolean'){
		return value;
	}
	
	if(value == true){
		return '<font color=blue>是</font>';
	}else{
		return '否';
	}
	
}
function formatYesNoRed(value){
	if (value == null) {
    	return '';
    }
	if(typeof value != 'boolean'){
		return value;
	}
	
	if(value == true){
		return '<font color=red>是</font>';
	}else{
		return '否';
	}
	
}

function formatPassword(password) {
    if (password == null) {
        return '';
    }

    if(typeof password == 'string'){
    	return String.leftPad('', password.length, '●');
    } else{
    	return password;
    }
}

function formatNumber(number) {
    if (number == null) {
        return '';
    }
    // console.log(number)
    if(typeof number == 'number'){
    	return number.toFixed(2);
    } else{
    	return number;
    }
}

function formatNumber3(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return number.toFixed(3);
    } else{
    	return number;
    }
}

function formatNumber4(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return number.toFixed(4);
    } else{
    	return number;
    }
}

function formatNumber3Blue(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return '<font color=blue>' + number.toFixed(3) + '</font>';
    } else{
    	return '<font color=blue>' + number + '</font>';
    }
}
function formatNumber2Green(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return '<font color=green>' + number.toFixed(2) + '</font>';
    } else{
    	return '<font color=green>' + number + '</font>';
    }
}

function formatNumber3Green(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return '<font color=green>' + number.toFixed(3) + '</font>';
    } else{
    	return '<font color=green>' + number + '</font>';
    }
}

function formatNumber3Red(number) {
    if (number == null) {
        return '';
    }

    if(typeof number == 'number'){
    	return '<font color=red>' + number.toFixed(3) + '</font>';
    } else{
    	return '<font color=red>' + number + '</font>';
    }
}

function formatRank(rank){
	
	if (rank == null) {
        return '';
    }
    
    if(typeof rank != 'number'){
    	return rank;
    }
    
    switch(rank){
    	case 1: return '<font color=red>第一名</font>';
    	case 2: return '<font color=blue>第二名</font>';
    	case 3: return '<font color=blue>第三名</font>';
    	case 4: return '<font color=green>第四名</font>';
    	case 5: return '<font color=green>第五名</font>';
    	case 6: return '<font color=green>第六名</font>';
    	case 7: return '<font color=green>第七名</font>';
    	case 8: return '<font color=green>第八名</font>';
    	case 9: return '<font color=green>第九名</font>';
    	default:return rank;
    }
	
}

function formatStatus(number){

	if(number == null){
		return '';
	}

	if(typeof number != 'number'){
		return number;
    }

    switch(number){
    	case 0: return '好';
    	case 1: return '坏';
    	case 2: return '修正';
    	case 3: return '测点不存在';
    	case 4: return '写入失败';
    	case 5: return '数据不存在';
    	default:return number;
    }

}



function formatTagType(type){

	if(type == null){
		return '';
	}

	if(typeof type != 'string'){
		return type;
    }

    switch(type){
    	case 'A': return '模拟点';
    	case 'B': return '逻辑点';
    	case 'C': return '计算点';
    	case 'D': return '数字点';
    	default:return type;
    }

}

function formatKpiDataStatus(number){
    
	for(var i = 0; i< kpiDataStatusArray.length;i++){
		if(kpiDataStatusArray[i][1] == number){
			return kpiDataStatusArray[i][0];
		}
	}
	
	return number;

}

function formatDataAcquisitionDataType(dataType){
	
	for(var i = 0; i< dataAcquisitionDataTypeArray.length;i++){
		if(dataAcquisitionDataTypeArray[i][1] == dataType){
			return dataAcquisitionDataTypeArray[i][0];
		}
	}
	
	return dataType;
	
}

function formatScoreFunc(scoreFunc){
	
	for(var i = 0; i< scoreFuncArray.length;i++){
		if(scoreFuncArray[i][1] == scoreFunc){
			return scoreFuncArray[i][0];
		}
	}
	
	return scoreFunc;
}




function createKpiDataStatusComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'], data : kpiDataStatusArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}


function formatEvalPeriod(number){
	console.log(number)
	if(number == null){
		return '';
	}

	for(var i = 0; i< evalPeriodArray.length;i++){
		if(evalPeriodArray[i][1] == number){
			console.log(evalPeriodArray[i][0])
			return evalPeriodArray[i][0];
		}
	}
	return '';

}

function formatEvalPeriod2(number){
    if(number == null){
        return '';
    }
    if (number>=60){
    	number = number/60
		if (number>=60){
			number = number/60
			return number+'小时'
		}
		return number+'分钟'
	}
	return number+'秒'
}

function createEvalPeriodComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'], data : evalPeriodArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createYearComboBox(id,width){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : evalYearArray}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 250: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true
			});		
}

function createMonthComboBox(id,width){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : [['1',1],['2',2],['3',3],['4',4],['5',5],['6',6],['7',7],['8',8],['9',9],['10',10],['11',11],['12',12]]}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 250: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true
			});	
}

function createUnitComboBox(id,width,fieldLabel,name,columnWidth){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : unitArray}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 50: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true,
			    name			: name,
			    fieldLabel		: fieldLabel,
			    columnWidth		: Ext.isEmpty(columnWidth)? 0.5 : columnWidth
			});
}

function createUnitComboBox2(id,width,fieldLabel,name,columnWidth){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : unitArray2}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 50: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true,
			    name			: name,
			    fieldLabel		: fieldLabel,
			    columnWidth		: Ext.isEmpty(columnWidth)? 0.5 : columnWidth
			});
}

function createSetsComboBox(id,width,fieldLabel,name,columnWidth){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : setsArray}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 50: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true,
			    name			: name,
			    fieldLabel		: fieldLabel,
			    columnWidth		: Ext.isEmpty(columnWidth)? 0.5 : columnWidth
			});
}

function createSetsComboBox2(id,width,fieldLabel,name,columnWidth){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : setsArray2}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 50: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true,
			    name			: name,
			    fieldLabel		: fieldLabel,
			    columnWidth		: Ext.isEmpty(columnWidth)? 0.5 : columnWidth
			});
}

function createDutyComboBox(id,width,fieldLabel,name,columnWidth){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name','value'],data : dutyArray}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 50: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true,
			    name			: name,
			    fieldLabel		: fieldLabel,
			    columnWidth		: Ext.isEmpty(columnWidth)? 0.5 : columnWidth
			});
}

function createDutyComboBox2(id,width,fieldLabel,name,columnWidth){
	return new Ext.form.ComboBox({
				id				: id,
				store			: new Ext.data.ArrayStore({fields: ['name','value'],data : dutyArray2}),
				displayField 	: 'name',
				valueField		: 'value',
			    triggerAction	: 'all',
			    mode			: 'local',
			    width			: Ext.isEmpty(width)? 50: width,
			    allowBlank		: false,
			    forceSelection	: false,
			    editable		: false,
			    lazyRender		: false,
			    emptyText		: '',
			    selectOnFocus	: true,
			    name			: name,
			    fieldLabel		: fieldLabel,
			    columnWidth		: Ext.isEmpty(columnWidth)? 0.5 : columnWidth
			});
}


function createDataAcquisitionDataTypeComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : dataAcquisitionDataTypeArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createCondFuncComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : condFuncArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createScoreFuncComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : scoreFuncArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createKpiTypeComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : kpiTypeArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createKpiTypeComboBox2(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'],data : kpiTypeArray2}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 60: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createKpiCategoryComboBox(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'], data : kpiCategoryArray}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 75: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createKpiCategoryComboBox2(id,width){
	return new Ext.form.ComboBox({
		id				: id,
		store			: new Ext.data.ArrayStore({fields: ['name', 'value'], data : kpiCategoryArray2}),
		displayField 	: 'name',
		valueField		: 'value',
	    triggerAction	: 'all',
	    mode			: 'local',
	    width			: Ext.isEmpty(width)? 75: width,
	    allowBlank		: false,
	    forceSelection	: false,
	    editable		: false,
	    lazyRender		: false,
	    emptyText		: '',
	    selectOnFocus	: true
	});
}

function createDateTimeEditor(id,width){

	return new Ext.ux.form.DateTime({
		id: id,
    	readOnly: false,
    	timeFormat:'H:i:s',
    	timeConfig: {
           altFormats:'H:i:s',
           allowBlank:false
        },
        dateFormat:'Y-m-d',
        dateConfig: {
            altFormats:'Y-m-d',
            allowBlank:false
        }
     });
}


function resetYearMonth() {

	var newYear = Ext.getCmp('yearCombox').getValue();
	var newMonth = Ext.getCmp('monthCombox').getValue();

	var newMonthDS = new Date(newYear, newMonth - 1, 1, 0, 0, 0 + dayDutyStartSeconds, 0);
	var newMonthDE = new Date(newYear, newMonth - 0, 1, 0, 0, 0 + dayDutyStartSeconds, 0);

	var stTime = Ext.getCmp('stTime').getValue();
	var edTime = Ext.getCmp('edTime').getValue();

	if (newMonthDS.getTime() > stTime.getTime()) {
		Ext.getCmp('stTime').setValue(newMonthDS);
	}
	if (newMonthDS.getTime() > edTime.getTime()) {
		Ext.getCmp('edTime').setValue(newMonthDE);
	}

	if (newMonthDE.getTime() < stTime.getTime()) {
		Ext.getCmp('stTime').setValue(newMonthDS);
	}else if (newMonthDE.getTime() < edTime.getTime()) {
		Ext.getCmp('edTime').setValue(newMonthDE);
	}

}

function addWindowOnLoad(func) {
	var oldonload = window.onload;
	if (typeof oldonload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			window.onload();
			func();
		}
	}
}
