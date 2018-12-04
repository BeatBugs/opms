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
	
	/* 首页URL */
	String homePageURL = request.getContextPath() + "/rt/index.jsp";
	
	/* 首页标题 */
	String homePageLable = "首页";
	
	//String username = request.getRemoteUser();
	
	/* 用户定制首页 */
	UserFlavorDao userFlavorDao = (UserFlavorDao)ctx.getBean("userFlavorDao");
	UserFlavor userFlavor = userFlavorDao.getUserFlavorByUsername(username);
	if(userFlavor != null && userFlavor.getAttribute1() != null && !userFlavor.getAttribute1().trim().isEmpty()){
		homePageURL = userFlavor.getAttribute1();
	}
	
	NavTreeNodeDao navTreeNodeDao = (NavTreeNodeDao)ctx.getBean("navTreeNodeDao");
	List<NavTreeNode> nodes = navTreeNodeDao.getAllTopNavTreeNodes();
	//nodes = new ArrayList<NavTreeNode>();
	//Used in TreeNode too
	//名字以T999开头的导航树节点是供内部使用的，不应该用于命名导航树
	NavTreeNodeUtils.AuthTreeName = "T999";
	nodes = NavTreeNodeUtils.filterNodeListByRole(nodes,request);
	
%>
<html>
<head>

	<title>VeStore-OPMS 火电厂实时运行绩效管理系统</title>

	<base href="<%=basePath%>" />

	<!-- Metadata information -->
	<meta http-equiv="Content-Type" 	content="text/html; charset=UTF-8" />
	<meta http-equiv="pragma" 			content="no-cache" />
	<meta http-equiv="cache-control" 	content="no-cache"/>
	<meta http-equiv="expires" 			content="0" />

	<!-- Shortcut Icon -->
	<link rel="Shortcut Icon" 	href="<%=request.getContextPath()%>/images/favicon.ico" />
	<link rel="Bookmark" 		href="<%=request.getContextPath()%>/images/favicon.ico" />
	
	<!-- Stylesheet -->
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/ext-3.3/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/banner.css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/icons.css" />

 	<!-- Ext LIBS -->
 	<script type="text/javascript" src="<%=request.getContextPath()%>/ext-3.3/adapter/ext/ext-base.js"></script>
 	<script type="text/javascript" src="<%=request.getContextPath()%>/ext-3.3/ext-all.js"></script>

	<!-- Ext patch -->
	<script type="text/javascript" src="<%=request.getContextPath()%>/ext-3.3/ext-lang-zh_CN.js"></script>
	

	<!-- Ext extension -->
	<script type="text/javascript" src="<%=request.getContextPath()%>/ext-3.3/ux/TabCloseMenu.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/ext-3.3/ux/DWRTreeLoader.js"></script>
	
	<!-- DWR dependencies -->
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/NavTreeNodeDao.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/NavTreeNodeService.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/UserFlavorDao.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/UserFavoriteDao.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/UserFlavorService.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/engine.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/util.js"></script>
	
	<script type="text/javascript">
		Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/ext-3.3/resources/images/default/s.gif';
	</script>
	
	<!-- Common javascript -->
	<script type="text/javascript">
		var unitArray = <%=unitArray%>;
		var setsArray = <%=setsArray%>;
		var evalPeriodArray = <%=evalPeriodArray%>;
		var evalYearArray = <%=evalYearArray%>;
	</script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/Common.js"></script>

	<!-- Custom javascript -->
	<script type="text/javascript">
		var admin = <%= admin %>;
		var username = '<%= username %>';
		
		var copyRightYear = '<%= copyRightYear %>';
		var version = '<%= version %>';
		
		var favoriteURL = '<%=request.getContextPath()%>/navtree/UserFavorite.jsp?username=<%= username %>';
		var editActionURL = '<%=request.getContextPath()%>/navtree/EditTreeNode.jsp';
		var insertActionURL = '<%=request.getContextPath()%>/navtree/InsertTreeNode.jsp';
		var treeNodeSearchURL = '<%=request.getContextPath()%>/navtree/TreeNodeSearch.jsp';
		var resetUserPassURL = '<%=request.getContextPath()%>/auth/UserPass.jsp';
		var tagDataQueryURL = '<%=request.getContextPath()%>/tag/TagDataQuery.jsp';
		var logoutURL = '<%=request.getContextPath()%>/j_spring_security_logout';

	</script>
	
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/LoadPage.js"></script>

	<script type="text/javascript" src="<%=request.getContextPath()%>/js/TreeAction.js"></script>
	
	<script type="text/javascript">
<%
	StringBuffer contextArray = new StringBuffer("var contextArray = [");
	StringBuffer titleArray = new StringBuffer("var titleArray = [");
	StringBuffer nameArray = new StringBuffer("var nameArray = [");

    for(int j = 0; j < nodes.size(); j++){

		contextArray.append("'").append(nodes.get(j).getContext()).append("'");
		titleArray.append("'").append(nodes.get(j).getTitle()).append("'");
		nameArray.append("'").append(nodes.get(j).getName()).append("'");

		if(j != nodes.size() - 1){
			contextArray.append(",");
			titleArray.append(",");
			nameArray.append(",");
		}

	}

	contextArray.append("];");
	titleArray.append("];");
	nameArray.append("];");

%>

		<%=contextArray%>
		<%=titleArray%>
		<%=nameArray%>

	</script>
	
	<script type="text/javascript">
		var homePageURL = '<%= homePageURL %>';
		var homePageLable = '<%= homePageLable %>';
		var eastPageURL = '<%=request.getContextPath()%>/east/east.jsp';
		var eastPageLable = '常用页面';
	</script>
	
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/Index.js"></script>
	
</head>
<body>
</body>
</html>
