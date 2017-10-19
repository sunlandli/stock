{% extends "../layouts/base.swig" %}
{% block title %}社区 - 小跟班{% endblock %}

{% block content %}
<div class="forum-wrap">
  <div class="container">
    <div class="forum-main fl">
      <div class="box">
        <div class="forum-filter">
          <ul id="topicFilter" class="nols clearfix">
            <li class="active" data-sort="-createAt"><a href="javascript:" title="">最新</a></li>
            <li data-sort="-postCount"><a href="javascript:" title="">回复</a></li>
            <li data-sort="-viewCount"><a href="javascript:" title="">浏览</a></li>
          </ul>
        </div>
        <script id="topicListTel" type="text/html">
        <% for(var i = 0; i < data.length; i++) { %>
          <li class="forum-topic-item">
            <a href="/global/u/<%= data[i].user._id %>" title="<%= data[i].user.name.first %>"><img class="avatar" src="<%= data[i].user.avatar %>" alt=""></a>
            <a class="title" href="/forum/topic/<%= data[i]._id %>" title=""><%= data[i].title %></a>
            <div class="fr">
              <span class="r-count" title="评论"><%= data[i].postCount %></span> /
              <span class="v-count mr15" title="浏览"><%= data[i].viewCount %></span>
              <span style="color: #999;"><%= moment(data[i].createAt).format('YYYY.MM.DD') %></span>
            </div>
          </li>
        <% } %>
        </script>
        <ul id="topicList" class="forum-topic-list nols"></ul>
        <div class="pagination pt30 pb30 tc">
          <div id="topicPage" class="clearfix dib"></div>
        </div>
      </div>
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
    getTopic('all');
    getTopic('hot');
    getTopic('cold');
  });
</script>
{% endblock %}

{% endblock %}
