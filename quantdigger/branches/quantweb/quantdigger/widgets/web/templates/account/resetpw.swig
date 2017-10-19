{% extends '../layouts/base.swig' %}
{% block title %}设置新密码 - 小跟班{% endblock %}
{% block header %}{% endblock %}
{% block footer %}{% endblock %}

{% block content %}
<a href="/" class="back-home"><i class="iconfont">&#xe626;</i> 首页</a>
<div class="container">
  {{ FlashMessages.renderMessages(messages) }}
  <div class="login">
    <div id="loginContent">
      <!--登录弹出框区域开始-->
      <div class="lo-header clearfix">
        <div class="pull-left">
          <h2>设置新密码</h2>
          <p>请填写新密码，设置成功后即可登录</p>
        </div>
      </div>
      <div class="lo-body">
        <form class="login-form" action="" method="POST">
          <input type="hidden" name="action" value="resetpw">
          <div class="form-group">
            <input class="form-control" name="newPassword" type="password" placeholder="新密码" required/>
          </div>
          <div class="form-group">
            <input class="form-control" name="rePassword" type="password" placeholder="确认密码" required/>
          </div>
          {# <div class="form-group clearfix">
            <div class="checkbox pull-left">
              <label style="font-size:12px;color:#b5b5b6;line-height:20px;">
                <input type="checkbox" name="auto" checked>记住我，以后两周保持登录</label>
            </div>
          </div> #}
          <div class="form-group">
            <button type="submit">立即设置</button>
          </div>
          {# <div class="text-center" style="height:80px;position:relative;">
            <div style="width:100%;border-bottom:1px solid #f0f0f0;position:absolute;top:50%;left:0;"></div>
            <span style="display:block;padding:0 10px;color:#9F9FA0;background-color:#fff;position:absolute;top:50%;left:50%;margin-top:-10px;margin-left:-66px;color:#666;font-size:12px;">或者其他账号登录</span>
          </div> #}
          <div class="form-group">
            {# <a id="weibologin" class="btn btn-block" style="background-color:#e56150;color:#fff;border-radius:2px;margin-bottom:24px;"></a> #}
            {# <span id="qqLoginBtn" class="btn btn-block"></span> #}
          </div>
        </form>
      </div>

      <div class="lo-footer">
        <span>
          {# 没有账号？ #}
          <a href="/accounts/login">立即登录</a>
        </span>
        {# | #}
        {# <a class="" href="/accounts/findpw">忘记密码？</a> #}
      </div>
    </div>

  </div>
</div>
{% endblock %}