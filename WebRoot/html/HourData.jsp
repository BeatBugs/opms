<%@ include file="/common/include.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.gdtianren.opms.kpi.KpiInfoDao"%>
<%@ page import="com.gdtianren.opms.kpi.KpiInfo"%>
<%
String title = "指标考核小时累计";

Date today = new Date();

int year 	= today.getYear() + 1900;
int month 	= today.getMonth() + 1;
int day 	= today.getDate();



String category = defaultCategory;
String type = defaultType;

try {
year = Integer.parseInt(request.getParameter("year"));
} catch (Exception e) {
}

try {
month = Integer.parseInt(request.getParameter("month"));
} catch (Exception e) {
}

try {
day = Integer.parseInt(request.getParameter("day"));
} catch (Exception e) {
}

KpiInfoDao kpiInfoDao = (KpiInfoDao) ctx.getBean("kpiInfoDao");

List<KpiInfo> list = kpiInfoDao.getByYearMonthUnitSets(year, month, 0, 0, "", "");

    StringBuilder sb = new StringBuilder();
    sb.append("\r\n[\r\n");

    for (int i = 0; i < list.size(); i++) {

    KpiInfo kpiInfo = list.get(i);

    sb.append("['").append(kpiInfo.getId()).append("','").append(kpiInfo.getName().replace("'","‘")).append("','").append(kpiInfo.getDescp().replace("'","‘")).append("','").append(kpiInfo.getUnits().replace("'","‘")).append("']");

    if (i != list.size() - 1) {
    sb.append(",\r\n");
    }

    }

    sb.append("\r\n];");

    String kpiInfoArray = sb.toString();

    %>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=8" >
        <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <link rel="stylesheet" href="../html_css/css.css">

        <title>Title</title>
        <script type="text/javascript" src="../html_ext/ext-all-debug.js"></script>
        <script type="text/javascript" src="../html_ext/PagingMemoryProxy.js"></script>
        <script type="text/javascript" src="../ext-3.3/ux/DwrProxy.js"></script>
        <script type="text/javascript" src="../ext-3.3/ux/SearchField.js"></script>
        <script type="text/javascript" src="../html_js/config.js"></script>
        <script>
            var theme = localStorage['theme']

            if(theme==null){
                theme = CONFIG_THEME
            }
            // console.log(theme)
            // console.log('<script type="text/javascript" src="../html_ext/theme-'+theme+'-debug.js\"><\/script>')
            document.write('<link rel="stylesheet" href="../html_css/'+theme+'/theme-'+theme+'-all-debug.css">')
            document.write('<script type="text/javascript" src="../html_ext/theme-'+theme+'-debug.js\"><\/script>')
        </script>
        <script type="text/javascript" src="../dwr/engine.js"></script>
        <script type="text/javascript" src="../dwr/util.js"></script>
        <script type="text/javascript">
            var kpiInfoArray = <%=kpiInfoArray%>;
        </script>

    <!-- DWR dependencies -->
        <!--<script type="text/javascript" src="../dwr/interface/UserDao.js"></script>-->
        <script type="text/javascript" src="../dwr/interface/UnitDao.js"></script>
        <script type="text/javascript" src="../dwr/interface/SetsDao.js"></script>
        <script type="text/javascript" src="../dwr/interface/KpiDataService"></script>
        <script type="text/javascript" src="../html_js/Common.js"></script>
        <script type="text/javascript" src="../html_js/HourData.js"></script>
    </head>
    <body>

    </body>
    </html>
