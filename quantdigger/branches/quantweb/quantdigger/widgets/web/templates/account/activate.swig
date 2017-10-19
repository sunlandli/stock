{% extends '../layouts/base.swig' %}
{% block title %}激活邮箱 - 小跟斑{% endblock %}
{% block header %}{% endblock %}
{% block footer %}{% endblock %}
{% block content %}
<a href="/" class="back-home"><i class="iconfont">&#xe626;</i> 首页</a>
<div class="container">
    <div class="join">
        <div class="j-header clearfix">
            <div class="pull-left">
                <h2>激活邮箱</h2>
                <p>注册成功，立即前往激活邮箱</p>
            </div>
        </div>

        <div class="j-body">
            <a href="//{{ type }}" title="" target="_blank">点击登陆邮箱</a>
        </div>

        <div class="j-footer">
            <span>
                已有账号？
                <a href="/accounts/login/">立即登录</a>
            </span>
        </div>
    </div>
</div>
{% endblock %}
