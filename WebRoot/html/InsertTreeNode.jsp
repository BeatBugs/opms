    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ page import="java.util.*"%>
        <%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
        <%@ page import="org.springframework.web.context.WebApplicationContext"%>
        <%@ page import="com.gdtianren.navtree.NavTreeNodeDao"%>
        <%@ page import="com.gdtianren.navtree.NavTreeNode"%>
        <%@ page import="com.gdtianren.auth.RoleDao"%>
        <%@ page import="com.gdtianren.auth.Role"%>
            <%
	//String contextPath = request.getContextPath();
	//String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + contextPath + "/";
	//String uri = request.getRequestURI().substring(request.getContextPath().length());

	String context = request.getParameter("context");

	String nodeName = request.getParameter("nodeName");

	String where = request.getParameter("where");

	String treeID = request.getParameter("treeID");

	ServletContext servletContext = request.getSession().getServletContext();
	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);

	NavTreeNodeDao navTreeNodeDao = (NavTreeNodeDao)ctx.getBean("navTreeNodeDao");
	NavTreeNode node = navTreeNodeDao.getNavTreeNodeByContextAndName(context,nodeName);

	RoleDao roleDao = (RoleDao)ctx.getBean("roleDao");
	List<Role> allRoles = roleDao.getAllRoles();

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
    <!-- DWR dependencies -->
    <script type="text/javascript" src="../dwr/interface/NavTreeNodeDao.js"></script>
        <script type="text/javascript">

        var treeID 			= '<%=treeID%>';

        var treeNode 		= {};
        treeNode.id 		= '<%=node.getId()%>';
        treeNode.name 		= '<%=node.getName()%>';
        treeNode.title 		= '<%=node.getTitle()%>';
        treeNode.descp 		= '<%=node.getDescp()%>';
        treeNode.context 	= '<%=node.getContext()%>';
        treeNode.path 		= '<%=node.getPath()%>';
        treeNode.target 	= '<%=node.getTarget()%>';
        treeNode.roles 		= '<%=node.getRoles()%>';

            <%

	int size = allRoles.size();

	StringBuffer allRolesArray = new StringBuffer("[");
	for(int i=0; i< size;i++){

		Role role = allRoles.get(i);

		allRolesArray.append("'" + role.getRoleName() + "'");

		if(i != (size -1)){
			allRolesArray.append(",");
		}

	}
	allRolesArray.append("]");


	String[] rolesArray = new String[0];

	String roles = node.getRoles();
	if(roles != null && !roles.trim().equals("")){
		rolesArray = roles.split(",");
	}

	StringBuffer roleItems = new StringBuffer();
	if(size != 1){
		roleItems.append("[");
	}

	for(int i=0; i< size; i++){

		Role role = allRoles.get(i);

		boolean flag = false;
		for(int j=0;j<rolesArray.length;j++){
			if(rolesArray[j].trim().equalsIgnoreCase(role.getRoleName().trim())){
				flag = true;
				break;
			}
		}

		if(flag){
			roleItems.append("{boxLabel:'").append(role.getRoleDesc()).append("', inputValue:'").append(role.getRoleName()).append("', name:'").append("roles").append("', checked: true}");
		}else{
			roleItems.append("{boxLabel:'").append(role.getRoleDesc()).append("', inputValue:'").append(role.getRoleName()).append("', name:'").append("roles").append("'}");
		}

		if(i != (size -1) && size != 1){
			roleItems.append(",");
		}

	}

	if(size != 1){
		roleItems.append("]");
	}


	StringBuffer targetItems = new StringBuffer();

	String target = node.getTarget();

	if( target != null && target.trim().equalsIgnoreCase("_blank")){

		targetItems.append("[{boxLabel: '在本窗口中打开', name: 'target', inputValue: ''},");
		targetItems.append("{boxLabel: '在顶窗口中打开', name: 'target', inputValue: '_top'},");
		targetItems.append("{boxLabel: '在空窗口中打开', name: 'target', inputValue: '_blank', checked: true},");
		targetItems.append("{boxLabel: '在新窗口中打开', name: 'target', inputValue: '_new'}]");


	} else if( target != null && target.trim().equalsIgnoreCase("_new")){

		targetItems.append("[{boxLabel: '在本窗口中打开', name: 'target', inputValue: ''},");
		targetItems.append("{boxLabel: '在顶窗口中打开', name: 'target', inputValue: '_top'},");
		targetItems.append("{boxLabel: '在空窗口中打开', name: 'target', inputValue: '_blank'},");
		targetItems.append("{boxLabel: '在新窗口中打开', name: 'target', inputValue: '_new', checked: true}]");


	} else if( target != null && target.trim().equalsIgnoreCase("_top")){

		targetItems.append("[{boxLabel: '在本窗口中打开', name: 'target', inputValue: ''},");
		targetItems.append("{boxLabel: '在顶窗口中打开', name: 'target', inputValue: '_top', checked: true},");
		targetItems.append("{boxLabel: '在空窗口中打开', name: 'target', inputValue: '_blank'},");
		targetItems.append("{boxLabel: '在新窗口中打开', name: 'target', inputValue: '_new'}]");


	} else {

		targetItems.append("[{boxLabel: '在本窗口中打开', name: 'target', inputValue: '', checked: true},");
		targetItems.append("{boxLabel: '在顶窗口中打开', name: 'target', inputValue: '_top'},");
		targetItems.append("{boxLabel: '在空窗口中打开', name: 'target', inputValue: '_blank'},");
		targetItems.append("{boxLabel: '在新窗口中打开', name: 'target', inputValue: '_new'}]");

	}

	%>
        var targetItems = <%= targetItems.toString() %>;
        var roleItems = <%= roleItems.toString() %>;
        var allRoles = <%= allRolesArray.toString() %>;
        var where = '<%= where %>';

        </script>
    <script type="text/javascript" src="../html_js/Common.js"></script>
    <script type="text/javascript" src="../html_js/InsertTreeNode.js"></script>
</head>
<body>

</body>
</html>