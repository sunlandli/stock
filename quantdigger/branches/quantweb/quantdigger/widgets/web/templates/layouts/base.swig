{% import "../mixins/flash-messages.swig" as FlashMessages %}

<!DOCTYPE html>
<html lang="zh-CN" xmlns:wb="http://open.weibo.com/wb">
<head>
  <meta charset="UTF-8"/>
  <meta name="renderer" content="webkit"/>
  <meta name="format-detection" content="telephone=no"/>
  {# <meta name="viewport" content="width=device-width, initial-scale=1.0"/> #}
  <title>{% block title %}{% endblock %}</title>
  <meta name="keywords" content="{% block keywords %}{% endblock %}"/>
  <meta name="description" content="{% block description %}{% endblock %}"/>

  {# <meta property="qc:admins" content="37432620776072166375"/> #}

  <link rel="stylesheet" href="/styles/rest.css"/>
  <link rel="stylesheet" href="/styles/common.min.css"/>
  <link rel="stylesheet" href="/javascripts/libs/Swiper-3.2.0/css/swiper.min.css"/>
  <link rel="stylesheet" href="/javascripts/libs/JqueryPagination/jquery.pagination.css"/>
  <link rel="stylesheet" href="/javascripts/libs/mmGrid/src/mmGrid.css"/>
  <link rel="stylesheet" href="/javascripts/libs/mmGrid/src/mmPaginator.css"/>
  <link rel="stylesheet" href="/javascripts/libs/PlyDialog/ply.css"/>
  <link rel="stylesheet" href="/javascripts/libs/umeditor/themes/default/css/umeditor.css"/>
  <link rel="stylesheet" href="/styles/site.min.css"/>
  {% block style %}{% endblock %}
  <script src="/javascripts/libs/jquery/jquery-2.1.3.min.js"></script>
  <script src="/javascripts/libs/baiduTemplate.js"></script>
  <script src="/javascripts/libs/Swiper-3.2.0/swiper.jquery.min.js"></script>
  <script src="/javascripts/libs/underscore/underscore-min.js"></script>
  <script src="/javascripts/libs/moment.min.js"></script>
  <script src="/javascripts/libs/JqueryPagination/jquery.pagination-1.2.7.min.js"></script>
  <script src="/javascripts/libs/mmGrid/src/mmGrid.js"></script>
  <script src="/javascripts/libs/mmGrid/src/mmPaginator.js"></script>
  <script src="/javascripts/libs/PlyDialog/Ply.min.js"></script>
  <script src="/javascripts/libs/echarts-all.js"></script>
  <script src="/javascripts/libs/umeditor/umeditor.config.js"></script>
  <script src="/javascripts/libs/umeditor/umeditor.min.js"></script>
  <script src="/javascripts/libs/umeditor/lang/zh-cn/zh-cn.js"></script>
  <script src="/javascripts/public.js"></script>
  {# <script type="text/javascript" src="http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js" data-appid="101245425" data-redirecturl="http://www.xgban.com/accounts/login" charset="utf-8"></script> #}
  {# <script type="text/javascript" src="http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js" data-callback="true" charset="utf-8"></script> #}
  <script type="text/javascript">
    var gUser = {
      'username': '{{ user.username }}',
      'id': '{{ user.id }}',
      'avatar': '{{ user.avatar }}'
    };
  </script>
</head>
<body>
{% block header %}{% include "header.swig" %}{% endblock %}
{% block content %}{% endblock %}
{% block footer %}{# {% include "footer.swig" %} #}{% endblock %}

{% block script %}{% endblock %}
</body>
</html>

