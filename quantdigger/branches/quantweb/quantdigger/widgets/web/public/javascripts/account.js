
function snsLogin(openId, info) {
  $.ajax({
    url: '/accounts/login/',
    type: 'POST',
    dataType: 'json',
    data: {action: 'sns', openId: openId, info: info},
  })
  .done(function(data) {
    console.log("success");
    console.log(data);
    if (!data.isBind) {
      return showBind(openId, info);
    }
     window.location.href='/u/' + data.body.name.first + '/home/';
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
};

function showBind(openId, info) {
  $('#qqAvatar').attr('src', info.figureurl_qq_2);
  $('[name="openId"]').val(openId);
  $('[name="nickname"]').val(info.nickname);
  $('[name="avatar"]').val(info.figureurl_qq_2);
  $('#loginContent').hide();
  $('#snsBind').show();
  console.log('进行QQ绑定');
}
//QQ登陆开始，建议写在函数内，当检查到没有登录时调用。
// QC.Login({        
//   btnId: "qqLoginBtn" //生成登录按钮的ID
//   // size: "B_M" //QQ图标大小
// }, function(reqData,  opts) {
//   // 自己重载了，所以不会显示默认的头像。
//   // 登陆成功执行
//   console.log('QQ登录')
//   if (QC.Login.check()) {
//                 
//     QC.Login.getMe(function(openId,  accessToken) {
//       console.log("成功获取qq信息:");
//       console.log(openId);
//       console.log(reqData);
//       QC.Login.signOut(); // 退出登录
//       snsLogin(openId, reqData);
//     }); 
//          
//   };

// }, function(opts) {
//   console.log("QQ注销成功");
// });

// 微博登录
// WB2.anyWhere(function(W) {
//   W.widget.connectButton({
//     id: "weibologin",
//     type: '3,2',
//     callback: {
//       login: function(o) { //登录后的回调函数
//         console.log(o.idstr);
//         console.log(o.avatar_large);
//         console.log(o.name);
//         social_bind_and_login(o.idstr, o.name, o.avatar_large);
//       }
//     }
//   });
// });
