(function(){
    function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}

function export_excel_ie(tableStr, fileName) {//整个表格拷贝到EXCEL中
    if (getExplorer() == 'ie') {
        var oXL = new ActiveXObject("Excel.Application");
        /*
         * 设置边框, 1表示最细边框,2表示细边框,4表示粗线。
         */
        //oXL.Selection.Borders.Weight = 4;
        /*
         * 设置边框线 1 实线, -4115 虚线, 4 点划相间线, 5 划线后跟两个点, -4118 点式线, -4119 双线。
         */
        //oXL.Selection.Borders.LineStyle = 1;
        var el4table = document.createElement("div");
        el4table.innerHTML = tableStr;
        //创建AX对象excel
        var oWB = oXL.Workbooks.Add();
        //获取workbook对象
        var xlsheet = oWB.Worksheets(1);
        //激活当前sheet
        var sel = document.body.createTextRange();
        sel.moveToElementText(el4table);
        //把表格中的内容移到TextRange中
        sel.select;
        //全选TextRange中内容
        sel.execCommand("Copy");
        //复制TextRange中内容
        xlsheet.Paste();
        //粘贴到活动的EXCEL中
        oXL.Visible = true;
        //设置excel可见属性

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);

            oWB.Close(savechanges = false);
            //xls.visible = false;
            oXL.Quit();
            oXL = null;
            //结束excel进程，退出完成
            //window.setInterval("Cleanup();",1);
            idTmr = window.setInterval("Cleanup();", 1);

        }

    }
    else {
        tableToExcel(tableStr, fileName);
    }
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}

var Base64 = (function () {
    // private property
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // private method for UTF-8 encoding
    function utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    // public method for encoding
    return {
        //encode : (typeof btoa == 'function') ? function(input) { return btoa(input); } : function (input) {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = utf8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }
    };
})();
var format = function (s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
    })
};
var tableToExcel = function (table, fileName) {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , fileName = fileName || 'excelexport'
        ,
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name="renderer" content="webkit"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

    var ctx = {worksheet: 'Worksheet', table: table};
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.hreflang = 'zh';
    a.charset = 'utf8';
    a.type = "application/vnd.ms-excel";
    a.href = uri + Base64.encode(format(template, ctx));
    a.target = '_blank';
    a.download = fileName + '.xls';
    a.tableBorder = 1;
    a.click();

};
window.grid2Excel = function (grid, fileName) {
     console.log(grid);
    var columns = grid.initialConfig.columns || [],
        store = grid.getStore(),
        headLevel1 = [], headLevel2 = [], headLevel3 = [], headLevel = 1, isGroup = false, isGroup3 = false,
        dataIndex = [],
        tableStr = '<table border="1" bordercolor="#000"><thead>{thead}</thead><tbody>{tbody}</tbody></table>';

    var blankColumn = 0;
    var blankColumn3 = 0;
    var ifWithCheckOrNumFirst;
    columns.forEach(function (column) {

        //说明第一列是checkbox或者是序号列,是有headerId的，如果不是headerId
        //console.log(!column.headerId);
        if (column.headerId) {
//                  console.log("序号列");
            ifWithCheckOrNumFirst = true;
        } else {
            //带合并单元格的时候，那一大列是没有dataindex的，所以会false
            if (!column.dataIndex) {

                blankColumn += 1;
                isGroup = true;

                var items = column.columns || [];
                items.forEach(function (column3) {
                    if (!column3.dataIndex) {
                        blankColumn3 += 1;  //分为了三级表头的数目
                        isGroup3 = true;    //三级表头
                        return false;
                    }
                });
                return false;
            }
        }
    });
    if (isGroup) {
        headLevel = 2;  //只支持二级表头
        if (isGroup3) {
            headLevel = 3;
        }
    }
//        console.log("------------表头: " + headLevel);
//        console.log("三级表头： " + blankColumn3);

    var indexen = 0;
    //   console.log("长度1:" + headLevel1.length);
    columns.forEach(function (column) {
        //    console.log(column.dataIndex);

        //说明不需要横向合并单元格的时候，
        if (column.dataIndex) {
            //    console.log(column);
            column.colspan = 1;

            //有横向合并单元格的话，这个纵向合并就会变多。是2层表头的话，这个rowspan就是2.其实不管他有没有横向合并这个数取过来就对
            if (headLevel == 3) {
                column.rowspan = headLevel;
            } else if (headLevel == 2) {
                column.rowspan = headLevel;
            } else {
                column.rowspan = 1;
            }

            headLevel1.push(column);
            dataIndex.push(column);

        } else {
            //    console.log("长度x333:" + headLevel);
            //不是横向合并的单元格，还有可能是第一列是checkbox或者是序号所以需要判断一下，如果是checkbox或者序号，则不push到数组里
            if (ifWithCheckOrNumFirst) {

            } else {
                var items = column.columns || [];
                headLevel1.push(column);
                items.forEach(function (item2) {
                    //  console.log("二级 dataindex: " + item2.dataIndex);
                    if (item2.dataIndex) {//二级表头
                        column.colspan = items.length;
                        column.rowspan = 1;
                        item2.colspan = 1;
                        if (headLevel == 3) {//三级表头下  如果二级表头下面没有再分，二级表头占两行
                            item2.rowspan = 2;
                        } else {
                            item2.rowspan = 1;
                        }

                        headLevel2.push(item2);
                        dataIndex.push(item2);
                    } else {
                        var items3 = item2.columns || [];
                        headLevel2.push(item2);
                        items3.forEach(function (item33) {
                            if (item33.dataIndex) {
                                item2.colspan = items3.length;//二级表头的长度
                                column.colspan = items3.length + items.length + blankColumn3; //一级表头的长度
                                item2.rowspan = 1;
                                item33.colspan = 1;
                                item33.rowspan = 1;
                                headLevel3.push(item33);
                                dataIndex.push(item33);
                            }

                        });
                    }

                });
            }
        }
    });

    var headLevel1Str = '<tr>';
    headLevel1.forEach(function (head) {
        //   console.log(head.header);
        if (head.dataIndex != 'operate') {
            headLevel1Str += '<th colspan = "' + head.colspan +
                '" rowspan="' + head.rowspan + '">' + head.header + '</th>';
        }

    });
    headLevel1Str += '</tr>';

    var headLevel2Str = '';
    if (headLevel2.length > 0) {
        headLevel2Str += '<tr>';
        headLevel2.forEach(function (head) {
            if (head.dataIndex != 'operate') {
                headLevel2Str += '<th colspan = "' + head.colspan +
                    '" rowspan="' + head.rowspan + '">' + head.header + '</th>';
            }
        });
        headLevel2Str += '</tr>'
    }

    var headLevel3Str = '';
    if (headLevel3.length > 0) {
        headLevel3Str += '<tr>';
        headLevel3.forEach(function (head) {
            if (head.dataIndex != 'operate') {
                headLevel3Str += '<th colspan = "' + head.colspan +
                    '" rowspan="' + head.rowspan + '">' + head.header + '</th>';
            }
        });
        headLevel3Str += '</tr>'
    }

    var theadStr = headLevel1Str + headLevel2Str + headLevel3Str,
        tbodyStr = '', defRenderer = function (value) {
            return value;
        };

    store.each(function (r) {
        tbodyStr += '<tr>';
        dataIndex.forEach(function (c) {
            if (c.dataIndex != 'operate') {
                var renderere = c.renderer || defRenderer;
                if (renderere.call(r, r.get(c.dataIndex))) {
                    tbodyStr += '<td>' + renderere.call(r, r.get(c.dataIndex)) + "" + '</td>';
                } else {
                    tbodyStr += '<td>' + " " + "" + '</td>';
                }
                tbodyStr += '<td>' + renderere.call(r, r.get(c.dataIndex)) + "" + '</td>';
                //  console.log("test: " + renderere.call(r,r.get(c.dataIndex)));
            }

        });
        tbodyStr += '</tr>'
    });
    tableStr = format(tableStr, {
        thead: theadStr,
        tbody: tbodyStr
    });

    //   console.log(tableStr);
    export_excel_ie(tableStr, fileName);

}
})()