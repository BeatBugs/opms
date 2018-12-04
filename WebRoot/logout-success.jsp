<%@ page pageEncoding="GBK" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<%
response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
String newLocn = "/cas/logout";
response.setHeader("Location",newLocn);
%>
