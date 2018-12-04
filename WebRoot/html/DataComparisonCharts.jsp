
    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ page import="java.util.*"%>
        <%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
        <%@ page import="org.springframework.web.context.WebApplicationContext"%>
            <%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String data = request.getParameter("data");//用request得到
    String startTime = request.getParameter("st");
    String endTime = request.getParameter("et");
    %>

        <!DOCTYPE html>
        <html lang="en">
        <head>

        <title>Title</title>
        <link rel="stylesheet" href="../html_css/css.css">

        <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <script type="text/javascript" src="../html_echarts/echarts.min.js"></script>
        <script type="text/javascript" src="../html_ext/ext-all-debug.js"></script>
        <script type="text/javascript" src="../html_js/loadPage.js"></script>
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
        <!-- DWR dependencies -->
        <script type="text/javascript">
        var data = '<%=data%>';
        var startTime = '<%=startTime%>';
        var endTime = '<%=endTime%>';


        </script>

        <script type="text/javascript" src="../dwr/interface/TeamDao.js"></script>
        <script type="text/javascript" src="../dwr/interface/KpiHistoryDetailsDao.js"></script>
        <script type="text/javascript" src="../html_js/Common.js"></script>
        <script type="text/javascript" src="../html_js/DataComparisonCharts.js"></script>
        <style>
        *{
        margin: 0;
        padding: 0;
        }
        html,body{
        height: 100%;
        }
        section{
        width: 100%;
        height: 100%;
        background: skyblue;
        border: 1px solid #eee;
        }
        </style>


        </head>
        <body>

        <div id="main" style="width: 95%;height:100%;"></div>

        </body>
        </html>
