{% extends "../layouts/base.swig" %}
{% block title %}社区 - 小跟班{% endblock %}

{% block content %}
<div class="forum-wrap">
  <div class="container">
    <div class="forum-main fl">
      <script id="topicBodyTel" type="text/html">
        <div class="fourm-topic-hd">
          <h4 class="title"><%= topic.title %></h4>
          <ul class="nols clearfix">
            <li>发布于 <span class="value"><%= moment(topic.createAt).format('YYYY-MM-DD') %></span></li>
            <li>作者 <a class="value" href="/global/u/<%= topic.user._id %>"><%= topic.user.name.first %></a></li>
            <li>回复 <span class="value"><%= topic.postCount %></span></li>
            <li>浏览 <span class="value"><%= topic.viewCount %></span></li>
          </ul>
        </div>
        <div class="forum-topic-bd"><%- topic.body %></div>
      </script>
      <div id="topicBody" class="box">
      </div>
      <!-- 回复列表 -->
      <script id="commentListTel" type="text/html">
      <% if(posts.length > 0) { %>
        <div class="forum-title"><%= posts.length %> 个回复</div>
        <ul class="forum-comment-list nols">
        <% for(var i = 0; i < posts.length; i++) { %>
          <li class="forum-comment-item clearfix">
            <div class="pic fl">
              <a href="/global/u/<%= posts[i].user._id %>" title=""><img class="avatar" src="<%= posts[i].user.avatar %>" alt=""></a>
            </div>
            <div class="info">
              <div class="">
                <a class="author" href="" title=""><%= posts[i].user.name.first %></a>
                <span class="time ml10"><%= moment(posts[i].createAt).format('YYYY-MM-DD') %></span>
                <span class="sort fr"><%= i < 3 ? ['沙发', '板凳', '地板'][i] : i+1+'楼' %></span>
              </div>
              <div class="mt5"><%- posts[i].body %></div>
            </div>
          </li>
          <% } %>
        </ul>
        {# <div class="pagination pt30 pb30 tc">
          <div id="topicPage" class="clearfix dib"></div>
        </div> #}
      <% } %>
      </script>
      <div id="commentList" class="box mt20">
      </div><!-- 回复列表 end -->
      <!-- 回复表单 -->
      <div class="box mt20">
        <div class="forum-title">添加回复</div>
        <div class="p15">
          <form>
            {# <textarea id="postBody" name="" style="width: 100%; height: 75px;"></textarea> #}
            <script type="text/plain" id="postBody" style="width: 726px;height:240px;"></script>
            <div class="tr mt10">
              <button id="btnAddPostSubmit" type="button">评 论</button>
            </div>
          </form>
        </div>
      </div><!-- 回复表单 end -->
    </div>
    <div class="forum-side fl">
      <div class="box">
        <div class="form-add-topic tc">
          <p class="f16 mb10">小跟班，最专业做跟投的社区！</p>
          <a id="btnAddTopic" href="javascript:" title=""><i class="iconfont f18">&#xe602;&nbsp;</i>发表话题</a>
        </div>
      </div>
      <div class="box mt20">
        <div class="forum-title">热门话题</div>
        <script id="topicHotTel" type="text/html">
        <% for(var i = 0; i < data.length; i++) { %>
          <li><a href="/forum/topic/<%= data[i]._id %>" title=""><%= data[i].title %></a></li>
        <% } %>
        </script>
        <ul id="topicHot" class="forum-hot-list nols">
        </ul>
      </div>
      <div class="box mt20">
        <div class="forum-title">无人回复话题</div>
        <ul id="topicCold" class="forum-hot-list nols">
        </ul>
      </div>
    </div>
  </div>
</div>

<div id="modal" class="add-topic-modal" style="display: none;">
  <div id="dialog" class="dialog">
    <div class="hd">发表话题</div>
    <div class="bd">
      <form>
        <div class="mt10">
          <label class="lh150">标题：</label>
          <input id="topicTitle" style="width: 100%;height: 30px;">
        </div>
        <div class="mt10">
          <label class="lh150">内容：</label>
          <script type="text/plain" id="topicContent" style="width: 720px;height:240px;"></script>
          {# <textarea id="topicContent" name="" style="width: 100%;height: 120px;"></textarea> #}
        </div>
        <div class="mt10 tr">
          <button id="btnAddTopicSubmit" type="button">发 表</button>
        </div>
      </form>
    </div>
    <div class="ft"></div>
  </div>
</div>

{% block script %}
<script src="/javascripts/forum.js"></script>
<script>
  $(document).ready(function() {
    var getTopicId = window.location.pathname.split('/')[3];

    var postEditor = UM.getEditor('postBody');


    function getTopicDetail(type) {
      // var bt = baidu.template;
      $.ajax({
        url: '/api/forum/topic/?'+new Date(),
        type: 'GET',
        dataType: 'json',
        data: {type: type, id: getTopicId},
      })
      .done(function(res) {
        console.log("success");
        console.log(res)
        // 渲染文章主体
        var template = bt('topicBodyTel', res.data);
        $('#topicBody').empty();
        $(template).appendTo('#topicBody');

        //渲染评论
        template =  bt('commentListTel', res.data);
        $('#commentList').empty();
        $(template).appendTo('#commentList');
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    };
    getTopicDetail('one');

    getTopic('hot');
    getTopic('cold');


    // 提交评论
    $('#btnAddPostSubmit').on('click', function() {
      if (gUser.username == '') {
        return Ply.dialog(
          "confirm",
          { effect: "scale" }, // fade/scale/fall/slide/3d-flip/3d-sign
          {text: "您还没有登录，是否前往登录？", ok: '好', cancel: '取消'}
        ).always(function (ui) {
          if (ui.state) {
            // Clicked "OK"
            var getPathname = window.location.pathname;
            window.location.href="/accounts/login/?next=" + getPathname;
          } else {
            // Clicked "Cancel"
            //   details: `ui.by` — "cancel", "overlay", "esc", "x"
          }
        });
      };

      var data = {
        topicId: getTopicId,
        body: postEditor.getContent()
      };

      $.ajax({
        url: '/api/forum/add-post/',
        type: 'POST',
        dataType: 'json',
        data: data
      })
      .done(function(res) {
        console.log("success");
        console.log(res);
        getTopicDetail('one');
        postEditor.execCommand('cleardoc');
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

    });

  });
</script>
{% endblock %}

{% endblock %}
