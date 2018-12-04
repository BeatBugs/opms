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
    <script type="text/javascript" src="../dwr/engine.js"></script>
    <script type="text/javascript" src="../dwr/util.js"></script>
        <script>
        var username = '<%= username %>';
        </script>
    <!-- DWR dependencies -->
    <script type="text/javascript" src="../dwr/interface/UnitDao.js"></script>
    <script type="text/javascript" src="../dwr/interface/SetsDao.js"></script>
    <script type="text/javascript" src="../dwr/interface/SupplementDao.js"></script>
    <script type="text/javascript" src="../html_js/Supplement.js"></script>
    <script type="text/javascript" src="../html_js/Common.js"></script>

</head>
<body>

</body>
</html>