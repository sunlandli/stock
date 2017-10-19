{% extends "../layouts/angular_base.swig" %}
{% block title %}我的首页 - 小跟班{% endblock %}
{% block header %}{% endblock %}

{% block content %}
<script type="text/javascript" charset="utf-8">
// 用户信息
{% if user %}
    var gUser = {
        'username': '{{ user.username }}',
        'id': '{{ user.id }}',
        'password': '{{ user.password }}',
        'avatar': '{{ user.avatar }}',
        'curAvePorfitRatio': '{{ user.trading.curAvePorfitRatio }}',
        'rank': '{{ user.trading.rank }}'
    };
{% else  %}
    var gUser = null;
{% endif %}
</script>

<div class="header">
  <div class="container navbar">
    <ul class="navbar-list nols clearfix">
      <li class="navbar-item">
        <a ui-sref-active="active" ui-sref="home">主页</a>
      </li>
      <li class="navbar-item">
        <a ui-sref-active="active" ui-sref="room">交易室</a>
      </li>
      <li class="navbar-item">
        <a ui-sref-active="active" ui-sref="products">排行</a>
      </li>
      <li class="navbar-item">
        <a ui-sref-active="active" ui-sref="forum">社区</a>
      </li>
    </ul>
    <div class="navbar-logo">
      <a href="/" title="" style="color: #fff;">小跟班</a>
    </div>
    <ul class="navbar-list fr nols clearfix">
      <li class="navbar-item pos-r" style="padding-top: 16px;">
        <form>
            {# 回调函数 $scope.redirect() 写在 appController #}
            {# 选中结果后触发回调，重定向到room页，传递参数为选中结果的 id #}
            {# room 页面的处理：可根据 id 获取对应的股票信息 #}
            <angucomplete id="searchNav"
                          placeholder="搜索股票"
                          pause="300"
                          selectedobject="selectedST"
                          localdata=""
                          callback="redirect(r)"
                          titlefield="code,name"
                          searchfields="code,pinyin"
                          minlength="3"
                          inputclass="form-control input-search form-control-small"
                          matchclass="isMatch"/>
        </form>
          <i class="iconfont icon-search">&#xe610;</i>
      </li>
      {# <li class="navbar-item">
        <a href=""> <i class="iconfont" style="font-size: 24px;color: #eee;">&#xe603;</i>
        </a>
      </li> #}
      <li class="navbar-item dropdown ml15">
        <a ui-sref="setting" style="padding: 0;">
          <img id="Uavatar" class="navbar-avatar" src="{{ user.avatar }}" alt="">
        </a>
        <ul class="dropdown-menu nols">
          <li><a ui-sref="setting" title="">个人设置</a></li>
          <li><a href="/accounts/logout/" title="">退出登录</a></li>
          <li class="arrow"></li>
        </ul>
      </li>
    </ul>
  </div>
</div>
<div class="body">
  <div class="container">
    <div ui-view id="layout" class="layout clearfix"></div>
  </div>
</div>
{% endblock %}
