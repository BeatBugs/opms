<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="org.springframework.web.context.WebApplicationContext"%>
<%@ page import="com.gdtianren.navtree.NavTreeNodeDao"%>
<%@ page import="com.gdtianren.navtree.NavTreeNode"%>
<%@ page import="com.gdtianren.auth.RoleDao"%>
<%@ page import="com.gdtianren.auth.Role"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String nodeName = request.getParameter("nodeName");//用request得到
String treeId = request.getParameter("treeId");

	ServletContext servletContext = request.getSession().getServletContext();
	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);

	NavTreeNodeDao navTreeNodeDao = (NavTreeNodeDao)ctx.getBean("navTreeNodeDao");
	NavTreeNode node = navTreeNodeDao.getNavTreeNodeByContextAndName("opms",nodeName);

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

    <script>
        var downloadURI = '<%=request.getContextPath()%>/report/TeamCompetitionDownload.htm';
        var nodeName = '<%=nodeName%>'
        var treeId = '<%=treeId%>'
        var treeRoot = '<%=node%>'

        var treeNode 		= {};
        treeNode.id 		= '<%=node.getId()%>';
        treeNode.name 		= '<%=node.getName()%>';
        treeNode.title 		= '<%=node.getTitle()%>';
        treeNode.descp 		= '<%=node.getDescp()%>';
        treeNode.context 	= '<%=node.getContext()%>';
        treeNode.path 		= '<%=node.getPath()%>';
        treeNode.target 	= '<%=node.getTarget()%>';
        treeNode.roles 		= '<%=node.getRoles()%>';

    </script>
    <script type="text/javascript" src="../dwr/engine.js"></script>
    <script type="text/javascript" src="../dwr/util.js"></script>
    <!-- DWR dependencies -->
    <script type="text/javascript" src="../dwr/interface/NavTreeNodeDao.js"></script>

    <script type="text/javascript" src="../dwr/interface/ReportConfigDao.js"></script>
    <script type="text/javascript" src="../html_js/ReportConfig.js"></script>
</head>
<body>

</body>
</html>