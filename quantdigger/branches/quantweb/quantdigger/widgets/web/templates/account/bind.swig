{% extends '../layouts/base.swig' %}
{% block title %}绑定账号{% endblock %}
{% block header %}{% endblock %}
{% block footer %}{% endblock %}
{% block content %}
<a href="/" class="back-home"><i class="iconfont">&#xe626;</i> 首页</a>
<div class="container">
    <div class="join">
        <div class="j-header clearfix">
            <div class="pull-left">
                <h2>绑 定</h2>
                <p>那些年我们一起追风的组合</p>
            </div>
        </div>

        <div class="j-body">
            <form action="" method="POST">
                <input type="hidden" name="action" value="join">
                <div class="form-group">
                    <input class="form-control username" name="username" type="text" value="{{ form.username }}" placeholder="账号"/>
                    <span class="username-ok" style="color:green;display:none"></span>
                    <span class="username-no" style="color:red;display:none"></span>
                    <span class="username-tip" style="color:red;display:none">输入长度在1-12之间(包含中文、字母、数字、下划线)。</span>
                </div>
                <div class="form-group">
                    <input class="form-control user-email" name="email" type="email" value="{{ form.email }}" placeholder="邮箱"/>
                    <span class="email-ok" style="color:green;display:none"></span>
                    <span class="email-no" style="color:red;display:none"></span>
                    <span class="email-tip" style="color:red;display:none">格式错误</span>
                </div>
                <div class="form-group">
                    <input class="form-control new-password" name="password" type="password" placeholder="密码"/>
                    <span class="new-password-tip" style="display:none;">输入长度在6-18之间(包含字母,数字,下划线)。</span>
                </div>
                <div class="form-group checkbox">
                  <label class="checkbox-inline">
                    <input type="checkbox" name="agree" checked />
                    我同意并愿意遵守追风
                    <a href="###" style="color:#43dbf8;">服务协议</a>
                    和
                    <a href="###" style="color:#43dbf8;">隐私政策</a>
                  </label>
                </div>
                <div class="form-group">
                  <button type="submit">立即注册</button>
                </div>
            </form>
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
