<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="org.springframework.web.context.WebApplicationContext"%>
<%@ page import="com.gdtianren.auth.RoleDao"%>
<%@ page import="com.gdtianren.auth.Role"%>

<%
//String path = request.getContextPath();
//String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
String context = request.getParameter("context");
if(context == null){
context = "";
}
String treeName = request.getParameter("treeName");
if(treeName == null){
treeName = "";
}


ServletContext servletContext = request.getSession().getServletContext();
WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);


%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
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
    <script type="text/javascript">

        var downloadURI = '<%=request.getContextPath()%>/stationWeight/StationWeightDownload.htm';
        var uploadURI = '<%=request.getContextPath()%>/stationWeight/StationWeightUpload.htm';


    </script>
    <script type="text/javascript" src="../dwr/engine.js"></script>
    <script type="text/javascript" src="../dwr/util.js"></script>
    <!-- DWR dependencies -->
    <script type="text/javascript" src="../dwr/interface/StationWeightDao.js"></script>
    <script type="text/javascript" src="../html_js/PostWeight.js"></script>
</head>
<body>

</body>
</html>