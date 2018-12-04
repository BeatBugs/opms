    <%@ include file="/common/include.jsp" %>
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ page import="java.util.*"%>
        <%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
        <%@ page import="org.springframework.web.context.WebApplicationContext"%>
        <%@ page import="com.gdtianren.navtree.NavTreeNodeDao"%>
        <%@ page import="com.gdtianren.navtree.NavTreeNode"%>
        <%@ page import="com.gdtianren.navtree.NavTreeNodeUtils"%>
        <%@ page import="com.gdtianren.favorite.UserFlavorDao"%>
        <%@ page import="com.gdtianren.favorite.UserFlavor"%>
            <%

%>
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" >
    <title>VeStore-OPMS火电厂实时运行绩效管理系统</title>
    <link rel="stylesheet" href="./html_css/css.css">

    <script type="text/javascript" src="./html_ext/ext-all-debug.js"/>
    <%--<link rel="stylesheet" href="./html_css/triton/theme-triton-all-debug.css">--%>
    <script type="text/javascript" src="./ext-3.3/ux/DwrProxy.js"></script>
    <script type="text/javascript" src="./html_js/config.js"></script>
    <script>

        var theme = localStorage['theme']
        if(theme==null){
            theme = CONFIG_THEME
        }else{
            CONFIG_THEME = theme
        }
        <%--console.log(CONFIG_PERSON)--%>
        <%--localStorage['config'] = CONFIG_PERSON--%>
        <%--console.log('<script type="text/javascript" src="./html_ext/theme-'+theme+'-debug.js\"><\/script>')--%>
        document.write('<link rel="stylesheet" href="./html_css/'+theme+'/theme-'+theme+'-all-debug.css">')
        document.write('<script type="text/javascript" src="./html_ext/theme-'+theme+'-debug.js\"><\/script>')
    </script>
    <script type="text/javascript" src="./dwr/engine.js"></script>
	<script type="text/javascript" src="./dwr/util.js"></script>
        <script>
        var username = '<%= username %>';
        </script>
    <script type="text/javascript" src="./dwr/interface/NavTreeNodeDao.js"></script>
    <script type="text/javascript" src="./dwr/interface/NavTreeNodeService.js"></script>
    <script type="text/javascript" src="./dwr/interface/UserFlavorDao.js"></script>
    <script type="text/javascript" src="./dwr/interface/UserFavoriteDao.js"></script>
    <script type="text/javascript" src="./dwr/interface/ReportConfigDao.js"></script>
    <script type="text/javascript" src="./dwr/interface/IsNotExaminePersonDao.js"></script>
    <script type="text/javascript" src="./ext-3.3/ux/DwrProxy.js"></script>
    <script type="text/javascript" src="./dwr/interface/UserFlavorService.js"></script>
    <script type="text/javascript" src="./html_js/index.js"></script>
    <script type="text/javascript" src="./html_js/treeAction.js"></script>
    <script type="text/javascript" src="./html_ext/TabCloseMenu.js"></script>
  
</head>
<body>

</body>
</html>
