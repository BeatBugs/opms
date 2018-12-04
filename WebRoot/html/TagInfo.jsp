        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
                <%@ page import="java.util.*"%>
                <%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
                <%@ page import="org.springframework.web.context.WebApplicationContext"%>
                <%@ page import="com.gdtianren.auth.RoleDao"%>
                <%@ page import="com.gdtianren.auth.Role"%>
                        <%


	String admin = request.getParameter("admin");
	if(admin == null || admin.trim().equalsIgnoreCase("false")){
		admin = "false";
	}else{
		admin = "true";
	}

	if(request.isUserInRole("ROLE_ADMIN")){
		admin = "true";
	}

	//String path = request.getContextPath();
	//String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	////////////////////roleItems///////////////
	ServletContext servletContext = request.getSession().getServletContext();
	WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);

	RoleDao roleDao = (RoleDao)ctx.getBean("roleDao");
	List<Role> allRoles = roleDao.getAllRoles();

	StringBuffer roleItems = new StringBuffer();

	int size = allRoles.size();

	if(size != 1){
		roleItems.append("[");
	}

	for(int i=0; i< size; i++){
		Role role = allRoles.get(i);
		roleItems.append("{boxLabel:'").append(role.getRoleDesc()).append("', inputValue:'").append(role.getRoleName()).append("', name:'").append("roles").append("'}");
		if(i != (size -1) && size != 1){
			roleItems.append(",");
		}
	}

	if(size != 1){
		roleItems.append("]");
	}


%>
    <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Title</title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" >
            <link rel="stylesheet" href="../html_css/css.css">

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
                var uploadURI = '<%=request.getContextPath()%>/tag/TagInfoUpload.htm';
                var downloadURI = '<%=request.getContextPath()%>/tag/TagInfoDownload.htm';
                var column = '<%=request.getParameter("column") == null ? "" : request.getParameter("column")%>';
                var keyword = '<%=request.getParameter("keyword") == null ? "" : request.getParameter("keyword")%>';
                var currentServerTime = <%=(new java.util.Date()).getTime()%>;
                var moreDataQueryURI = '<%=request.getContextPath()%>/tag/TagDataQuery.jsp?tagname=';

                var calc = <%=request.getParameter("calc") == null ? "false" : "true"%>;

                var roleItems = <%= roleItems.toString() %>;
                var context = 'opms';

                var admin = <%=admin%>;
            </script>
        <script type="text/javascript" src="../dwr/engine.js"></script>
        <script type="text/javascript" src="../dwr/util.js"></script>
        <!-- DWR dependencies -->
                <script type="text/javascript" src="../dwr/interface/TagInfoDao.js"></script>
                <script type="text/javascript" src="../dwr/interface/TagInfoService.js"></script>
                <script type="text/javascript" src="../dwr/interface/RoleDao.js"></script>
                <script type="text/javascript" src="../dwr/interface/RTDBDao.js"></script>
                <script type="text/javascript" src="../dwr/interface/CalcEngine.js"></script>
        <script type="text/javascript" src="../html_js/Common.js"></script>

        <script type="text/javascript" src="../html_js/TagDataSearch.js"></script>
        <script type="text/javascript" src="../html_js/TagInfo.js"></script>
        </head>
        <body>

        </body>
        </html>