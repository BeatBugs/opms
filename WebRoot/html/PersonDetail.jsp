<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="org.springframework.web.context.WebApplicationContext"%>
        <%
        String path = request.getContextPath();
        String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
        String id = request.getParameter("id");//用request得到
%>

    <!DOCTYPE html>
    <html lang="en">
    <head>

        <title>Title</title>
    <link rel="stylesheet" href="../html_css/css.css">

    <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <script type="text/javascript" src="../html_ext/ext-all-debug.js"></script>
        <script type="text/javascript" src="../html_ext/PagingMemoryProxy.js"></script>
        <script type="text/javascript" src="../ext-3.3/ux/DwrProxy.js"></script>
        <script type="text/javascript" src="../ext-3.3/ux/SearchField.js"></script>
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
            var id = '<%=id%>';
        </script>

    <script type="text/javascript" src="../dwr/interface/HangRecordDao.js"></script>
    <script type="text/javascript" src="../dwr/interface/Post1Dao.js"></script>
    <script type="text/javascript" src="../html_js/Common.js"></script>
    <script type="text/javascript" src="../html_js/PersonDetail.js"></script>
    </head>
    <body>

    </body>
    </html>