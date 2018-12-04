<%@ page pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>错误</title>
<style type="text/css">
<!--
body,td,th {
	color: #000033;
}
body {
	background-color: #154155;
	background-image: url(<%=request.getContextPath()%>/images/login/bg.gif);
	background-repeat: repeat-x;
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
-->
</style>
</head>

<body>
<table width="504" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td><img src="<%=request.getContextPath()%>/images/login/logo.gif" width="504" height="96" /></td>
  </tr>
  <tr>
    <td height="427" valign="top" background="<%=request.getContextPath()%>/images/login/con_bg2.gif">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="120">&nbsp;</td>
      </tr>
      <tr>
        <td><table width="80%" border="0" align="center" cellpadding="0" cellspacing="0">
          <tr>
            <td>您不具有访问此资源的权限，访问被拒绝</td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
    </table>
	</td>
  </tr>
</table>
</body>
</html>
