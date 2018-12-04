<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
            <%
	//String path = request.getContextPath();
	//String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String admin = request.getParameter("admin");
	if(admin == null){
		if(request.isUserInRole("ROLE_ADMIN")){
			admin = "true";
		}else{
			admin = "true";
		}
	}else if(admin.trim().equalsIgnoreCase("false")){
		admin = "false";
	}else if(admin.trim().equalsIgnoreCase("true")){
		admin = "true";
	}else{
		admin = "false";
	}

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
    var admin = <%=admin%>;
    </script>

    <script type="text/javascript" src="../dwr/engine.js"></script>
    <script type="text/javascript" src="../dwr/util.js"></script>
    <!-- DWR dependencies -->
    <script type="text/javascript" src="../dwr/interface/DutyTimeDao.js"></script>
    <script type="text/javascript" src="../html_js/DutyTime.js"></script>
</head>
<body>

</body>
</html>