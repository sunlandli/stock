{% extends "./layouts/base.swig" %}
{% block title %}{{ userInfo.name.first }}的主页 - 小跟班{% endblock %}
{% block keywords %}{% endblock %}
{% block description %}{% endblock %}

{% block content %}
<div style="background-color: #f8f8f8;padding-top: 30px;padding-bottom: 50px;min-height: 550px;">
  <div class="container">
    <!-- 左栏 -->
    <div class="sidebar">
      <div class="uu-profile">
        <img class="avatar" src="{{ userInfo.avatar }}" alt="">
        <h3 class="name mt10 mb20">{{ userInfo.name.first }}</h3>
        <ul class="nols clearfix tc">
          <li id="btnFollow" class="btn-follow" style="display: inline-block;">关注</li>
          {# <li class="btn-share fr">分享</li> #}
        </ul>
      </div>
      <div class="uu-tab">
        <ul class="nols" ng-init="showA=1">
          <li class="getHisProduct active" data-type="productBox">他的组合</li>
          {# <li ng-class="{active: showA==1}">他的自选股</li> #}
          <li class="getHisProduct" data-type="followBox">他的关注</li>
        </ul>
      </div>
    </div> <!-- 左栏 end -->

    <!-- 右栏 -->
    <div class="main">
      <div id="productBox" class="box box-rank-info">
        <table class="table-list" width="100%" cellspacing="0" cellpadding="0">
          <thead class="thead">
            <tr>
              <th align="center">组合名称</th>
              <th align="center">日收益率</th>
              <th align="center">周收益率</th>
              <th align="center">月收益率</th>
              <th align="center">总收益率</th>
              <th align="center">总收益额</th>
              <th align="center">交易次数</th>
              {# <th align="center" width="82">关注</th> #}
            </tr>
          </thead>
          <tbody id="productList" class="tbody">
            {# 存放产品列表 #}
          </tbody>
        </table>
      </div>

      <div id="followBox" class="box box-rank-info" style="display: none;">
        <table class="table-list" width="100%" cellspacing="0" cellpadding="0">
          <thead class="thead">
            <tr>
              <th align="center">组合名称</th>
              <th align="center">日收益率</th>
              <th align="center">周收益率</th>
              <th align="center">月收益率</th>
              <th align="center">总收益率</th>
              <th align="center">总收益额</th>
              <th align="center">交易次数</th>
              {# <th align="center" width="82">关注</th> #}
            </tr>
          </thead>
          <tbody id="followList" class="tbody">
            {# 存放产品列表 #}
          </tbody>
        </table>
      </div>
    </div> <!-- 右栏 end -->
  </div>
</div>


{% block script %}
<script src="/javascripts/guser.js"></script>
{% endblock %}

{% endblock %}
