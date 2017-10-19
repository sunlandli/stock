<div class="public-navbar">
  <div class="container">
    <div class="brand fl mr20">
      <a href="/">小跟班</a>
    </div>
    <ul class="navbar fl nols">
        <li><a href="/p/rank">排行榜</a></li>
        {% if section == 'forum' %}
        <li class="active"><a href="/forum">社区</a></li>
        {% else %}
        <li><a href="/forum">社区</a></li>
        {% endif %}
        {# <li><a href="">接口下载</a></li> #}
        {# <li><a href="">关于我们</a></li> #}
    </ul>
    <ul class="navbar fr nols">
      {# <li class="sreach-form mr30">
        <form action="" method="GET">
          <input class="input-search" type="text" placeholder="股票/组合/用户">
          <button class="btn-search" type="submit"><i class="iconfont">&#xe610;</i></button>
        </form>
      </li> #}
      {% if user %}
      <li class="user dropdown">
        <a href="/u/{{ user.id }}/home/#/index/">
          <img src="{{ user.avatar }}" alt="">
          <span>{{ user.username  }}</span> <i class="iconfont">&#xe629;</i>
        </a>
        <ul class="dropdown-menu nols">
          <li>
            <a href="/u/{{ user.id }}/home/#/index/"><i class="iconfont">&#xe62b;&nbsp;</i>进入房间</a>
          </li>
          {# <li>
            <a href="#@"><i class="iconfont">&#xe62c;&nbsp;</i>个人设置</a>
          </li>
          <li>
            <a href="#@"><i class="iconfont">&#xe62e;&nbsp;</i>股票设置</a>
          </li> #}
          <li>
            <a href="javascript:;" onclick="logout()"><i class="iconfont">&#xe62a;&nbsp;</i>退出登录</a>
          </li>
        </ul>
      </li>
      {% else %}
      <li><a href="/accounts/login">登录</a></li>
      <li><a href="/accounts/join">注册</a></li>
      {% endif %}
    </ul>
  </div>
</div>
