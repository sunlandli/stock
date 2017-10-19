<!DOCTYPE html>
<html ng-app="app" lang="zh-CN">
<head>
  <meta charset="UTF-8"/>
  <meta name="renderer" content="webkit"/>
  <meta name="format-detection" content="telephone=no"/>
  {# <meta http-equiv="Access-Control-Allow-Origin" content="*"/> #}
  <title>{% block title %}{% endblock %}</title>
  <meta name="keywords" content="{% block keywords %}{% endblock %}"/>
  <meta name="description" content="{% block description %}{% endblock %}"/>
  <meta property="qc:admins" content="37432620776072166375" />

  {# <base href="/u/admin/home/" /> #}
  <link rel="stylesheet" href="/styles/rest.css"/>
  <link rel="stylesheet" href="/styles/common.css"/>
  {# <link rel="stylesheet" href="/styles/libs/swiper3.07.min.css"/> #}
  <link rel="stylesheet" href="/styles/libs/angucomplete.css"/>
  <link rel="stylesheet" href="/javascripts/libs/webuploader-0.1.5/webuploader.css">
  <link rel="stylesheet" href="/javascripts/libs/jcrop/jquery.Jcrop.min.css">
  {# <link rel="stylesheet" href="/javascripts/libs/ng-dialog/css/ngDialog.min.css"> #}
  <link rel="stylesheet" href="/styles/site.min.css"/>
  {% block style %}{% endblock %}
  <link rel="stylesheet" href="/javascripts/libs/umeditor/themes/default/css/umeditor.css"/>
  <link rel="stylesheet" href="/javascripts/libs/PlyDialog/ply.css"/>
  
  <script src="/javascripts/libs/PlyDialog/Ply.min.js"></script>
  <script src="/javascripts/public.js"></script>

  {# <script src="/javascripts/config/config.js"></script> #}
</head>
<body ng-controller="appController">

<!--[if lt IE 10]>
<div class="isIE9" style="position: fixed;z-index: 33333;top: 0; left: 0; width: 100%; height: 100%; background-color: #f8f8f8;">
  <div class="dib tc" style="position: absolute;top: 50%;left: 0; width: 100%;margin-top: -80px;">
    <h2>亲爱的用户，小跟斑网站将不再兼容IE10浏览器以下版本</h2>
    <p class="mt10 f18 lh150">
      我们推荐更新至最新版本
      <a href="http://windows.microsoft.com/ie" target="_blank" style="color: #6cf;">Internet Explorer</a>
      ,
      <a href="http://rj.baidu.com/soft/detail/14744.html?ald" target="_blank" style="color: #6cf;">Google Chrome</a>
      , or
      <a href="http://www.firefox.com.cn/" target="_blank" style="color: #6cf;">Firefox</a>
      浏览器<br>
      如果你使用IE9版本以上的浏览器请忽略此提示
    </p>
  </div>
</div>
<![endif]-->

{% block header %}{% endblock %}
{% block content %}{% endblock %}
{% block footer %}{% endblock %}
<script type="text/ng-template" id="templateId">
    <h1>Template heading</h1>
    <p>Content goes here</p>
</script>
{# <script data-main="/javascripts/main.js" src="/javascripts/require.js"></script> #}
<script src="/javascripts/libs/underscore/underscore-min.js"></script>
<script src="/javascripts/libs/jquery/jquery-1.11.2.min.js"></script>
<script src="/javascripts/libs/async.js"></script>
<script src="/javascripts/libs/moment.min.js"></script>
<script src="/javascripts/libs/loglevel.js"></script>
<script src="/javascripts/libs/webuploader-0.1.5/webuploader.min.js"></script>
<script src="/javascripts/libs/jcrop/jquery.Jcrop.min.js"></script>
<script src="/javascripts/libs/socket.io-1.3.5.js"></script>
<script src="/javascripts/libs/echarts-all.js"></script>

<script src="/javascripts/libs/umeditor/umeditor.config.js"></script>
<script src="/javascripts/libs/umeditor/umeditor.min.js"></script>
<script src="/javascripts/libs/umeditor/lang/zh-cn/zh-cn.js"></script>

<script src="/javascripts/charts.js"></script>
<script src="/javascripts/jsquant/message.js"></script>
<script src="/javascripts/jsquant/datastruct.js"></script>
<script src="/javascripts/jsquant/datasource.js"></script>
<script src="/javascripts/jsquant/ui.js"></script>

<script src="/javascripts/libs/angular/angular.min.js"></script>
<script src="/javascripts/libs/angular/angular-ui-router.min.js"></script>
<script src="/javascripts/services/services.js"></script>
<script src="/javascripts/controllers/controllers.js"></script>
<script src="/javascripts/controllers/room-controller.js"></script>
<script src="/javascripts/directives/directives.js"></script>
<script src="/javascripts/directives/angucomplete.js"></script>
<script src="/javascripts/app.js"></script>
</body>
</html>

