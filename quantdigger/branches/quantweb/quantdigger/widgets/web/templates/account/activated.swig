{% extends '../layouts/base.swig' %}
{% block title %}{{ state }} - 小跟斑{% endblock %}
{% block header %}{% endblock %}
{% block footer %}{% endblock %}
{% block content %}
<a href="/" class="back-home"><i class="iconfont">&#xe626;</i> 首页</a>
<div class="container">
    <div class="join">
        <div class="j-header clearfix">
            <div class="pull-left">
                <h2>{{ state }}</h2>
                {# <p></p> #}
            </div>
        </div>

        <div class="j-body">
            <a href="/accounts/login/">立即登录</a>
        </div>

        <div class="j-footer">
        </div>
    </div>
</div>
{% endblock %}
