{% extends '../layouts/base.swig' %}
{% block title %}注册 - 小跟班{% endblock %}
{% block header %}{% endblock %}
{% block footer %}{% endblock %}
{% block content %}
<a href="/" class="back-home"><i class="iconfont">&#xe626;</i> 首页</a>
<div class="container">
    {{ FlashMessages.renderMessages(messages) }}
    <div class="join">
        <div class="j-header clearfix">
            <div class="pull-left">
                <h2>注 册</h2>
                <p>和你一起寻找投资达人</p>
            </div>
        </div>

        <div class="j-body">
            <form action="" method="POST">
                <input type="hidden" name="action" value="join">
                <div class="form-group">
                    <input class="form-control username" name="username" type="text" value="{{ form.username }}" placeholder="昵称"/>
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
                    <input class="form-control new-password" name="password" type="password" placeholder="密码（6~18位）"/>
                    <span class="new-password-tip" style="display:none;color: #f90;">输入长度在6-18之间(包含字母,数字,下划线)。</span>
                </div>
                <div class="form-group">
                    <input class="form-control confirm-password" name="confirmPassword" type="password" placeholder="确认密码"/>
                    <span class="confirm-password-tip" style="display:none;color: #f90;">输入的密码不一致，请重试。</span>
                </div>
                <div class="form-group checkbox">
                  <label class="checkbox-inline">
                    <input type="checkbox" name="agree" checked />
                    我同意并愿意遵守小跟班
                    <a href="/other/protocol" style="color:#43dbf8;">用户协议</a>
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

<script>
    $(document).ready(function() {
        // 用户名验证
        // $("input.username").blur(function(){
        //     var isUsername=/^[\u4e00-\u9fa5-_0-9a-zA-Z]{1,12}$/;
        //     var userUsername=$(this).val();
        //     if (isUsername.test(userUsername)) {
        //         var user={username:$("input.username").val()};
        //         $.ajax({
        //             type: "post",
        //             url: "/accounts/api/unique_username/",
        //             dataType: "json",
        //             data: user,
        //             success:function(data){
        //                 console.log(data);
        //                 if (data) {
        //                     $("span.username-ok").show();
        //                     $("span.username-no").hide();
        //                     console.log('用户名可用');
        //                 }else{
        //                     $("span.username-no").show();
        //                     $("span.username-ok").hide();
        //                     console.log('用户名不可用');
        //                 };
        //             },
        //             error:function(){
        //                 console.log('发生意外错误，无法验证用户名。');
        //             }

        //         });
        //     }else{
        //         if (userUsername!="") {
        //             $("span.username-tip").show();
        //         };
        //     };
        // }).focus(function(){
        //     $("span.username-tip").hide();
        //     $("span.username-ok,span.username-no").hide();
        // });

      // 邮箱验证
      // $("input.user-email").blur(function(){
      //     var isEmail=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      //     var userEmail=$(this).val();
      //     if (isEmail.test(userEmail)) {
      //         var user={email:$("input.user-email").val()};
      //         $.ajax({
      //             type: "post",
      //             url: "/accounts/api/unique_email/",
      //             dataType: "json",
      //             data: user,
      //             success:function(data){
      //                 console.log(data);
      //                 if (data) {
      //                     $("span.email-ok").show();
      //                     $("span.email-no").hide();
      //                     console.log('邮箱可用');
      //                 }else{
      //                     $("span.email-no").show();
      //                     $("span.email-ok").hide();
      //                     console.log('邮箱不可用');
      //                 };
      //             },
      //             error:function(){
      //                 console.log('发生意外错误，无法验证邮箱。');
      //             }

      //         });
      //     }else{
      //         if (userEmail!="") {
      //             $("span.email-tip").show();
      //         };
      //     };
      // }).focus(function(){
      //     $("span.email-tip").hide();
      //     $("span.email-ok,span.email-no").hide();
      // });

      // 新密码验证
      $("input.new-password").blur(function(){
          var isPassword=/^\w{6,18}$/;
          var newPassword=$(this).val();
          // var oldPassword=$("input.old-password").val();
          if (!isPassword.test(newPassword)) {
              $(".new-password-tip").show();
              if (newPassword=="") {
                  $(".new-password-tip").hide();
              };
          };
      }).focus(function(){
          $(".new-password-tip").hide();
      });
      // 确认密码验证
      $("input.confirm-password").blur(function(){
          var confirmPassword=$(this).val();
          var newPassword=$("input.new-password").val();
          if (confirmPassword!=newPassword) {
              $(".confirm-password-tip").show();
              if (confirmPassword=="") {
                  $(".confirm-password-tip").hide();
              };
          };
      }).focus(function(){
          $(".confirm-password-tip").hide();
      });
    });
</script>
{% endblock %}
