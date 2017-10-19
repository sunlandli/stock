{% extends "./layouts/base.swig" %}
{% block title %}首页 - 小跟班{% endblock %}
{# {% block header %}{% endblock %} #}
{% block footer %}{% endblock %}
{% block content %}
{% block style %}
<style>
  /*.blurr {
    -webkit-filter: blur(3px);
    -moz-filter: blur(3px);
    -ms-filter: blur(3px);
    -o-filter: blur(3px);
    filter: blur(3px);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3, MakeShadow=false);
  }*/
  .parallax-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 130%;
  height: 100%;
  background-image:url(/images/index-banner01.jpg);
  background-size: 100%;
  background-position: center;
}
</style>
{% endblock %}

<div class="index-banner">
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" style="background-image:url(/images/index-bg-02.jpg);">
        <div class="content">
          <h1 class="title" data-swiper-parallax="-500">全方位的投资平台</h1>
          <div class="info mt30">
            <p class="blurb" data-swiper-parallax="-1000">三平台数据同步，用户可以在Web、Ios、Android设备上同步使用，随时随地进行交易、学习互动、查看资讯等一系列操作。 <br>让投资更简单，让交易更有趣。</p>
            <img class="pic fr" src="/images/banner01.jpg" alt="" data-swiper-parallax="-1500">
          </div>
        </div>
      </div>
      <div class="swiper-slide" style="background-image:url(/images/index-bg-02.jpg);">
        <div class="content">
          <h1 class="title" data-swiper-parallax="-500">最具人气的投资平台</h1>
          <div class="info mt30">
            <p class="blurb" data-swiper-parallax="-1000">是目前国内最具人气的投资社交平台之一，致力于为投资者提供跨市场、跨品种的行情查询、资讯订阅和交易分享服务，目前已覆盖A股市场。</p>
            <img class="pic fr" src="/images/banner02.jpg" alt="" data-swiper-parallax="-1500">
          </div>
        </div>
      </div>
      <div class="swiper-slide" style="background-image:url(/images/index-bg-02.jpg);">
        <div class="content">
          <h1 class="title" data-swiper-parallax="-500">最轻松的“跟”交易</h1>
          <div class="info mt30">
            <p class="blurb" data-swiper-parallax="-1000">集成舆论信息的股票行情，实时反馈交易热点与密度，多维度了解金融市场投资信心和动向。</p>
            <img class="pic fr" src="/images/banner03.jpg" alt="" data-swiper-parallax="-1500">
          </div>
        </div>
      </div>
      <div class="swiper-slide" style="background-image:url(/images/index-bg-02.jpg);">
        <div class="content">
          <h1 class="title" data-swiper-parallax="-500">社交互动，学达人投资</h1>
          <div class="info mt30">
            <p class="blurb" data-swiper-parallax="-1000">聚集全球顶级交易员的投资达人库，可实时查看操盘交易记录，当前谁在进行交易，跟单操作一步到位。</p>
            <img class="pic fr" src="/images/banner04.jpg" alt="" data-swiper-parallax="-1500">
          </div>
        </div>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination swiper-pagination-white"></div>
    <!-- Add Arrows -->
    <div class="swiper-button-next swiper-button-white"></div>
    <div class="swiper-button-prev swiper-button-white"></div>
    <!-- navbar -->
    
  </div>
</div>

<div class="index-navbar clearfix">
  <div class="container">
    <div class="brand mr30 fl">
      <a href="/">小跟班</a>
    </div>
    <ul class="navbar-list fl nols">
      <li><a href="/p/rank">排行榜</a></li>
      <li><a href="/forum">社区</a></li>
      {# <li><a href="">接口下载</a></li> #}
      {# <li><a href="">关于我们</a></li> #}
    </ul>
    <ul class="accounts fr nols">
      {% if user %}
      <li class="user">
        <a href="/u/{{ user.id }}/home/#/index/">
          <img src="{{ user.avatar }}" alt="">
          <span>{{ user.username  }}</span>
        </a>
      </li>
      <li><a class="btn-join" href="javascript:logout()">退出</a></li>
      {% else %}
      <li><a class="btn-login" href="/accounts/login">登录</a></li>
      <li><a class="btn-join" href="/accounts/join">注册</a></li>
      {% endif %}
    </ul>
  </div>
</div>



<div style="position: absolute;z-index: 1280;top: 100%; width: 100%;background-color: #fff;">
  <div class="current-status">
    <div class="container">
      <ul class="nols clearfix">
        <li class="fl">跟投获利总额：<b id="profitCount" class="profit-count"></b></li>
        <li class="fr">交易总额：<b id="tradeCount" class="trade-count"></b></li>
      </ul>
    </div>
  </div>
  <div class="index-wrap clearfix">
      <div class="container">
          <div class="main-left">
              <div class="hot-group">
                  <div class="index-header clearfix">
                      <h4 class="title fl">最赚钱跟投组合</h4>
                      {# <a class="more fr" href="/sp/all">组合精选</a> #}
                  </div>
                  <div class="hot-body">
                      <ul id="indexProductRank" class="list nols clearfix">
                          {# 存放GET下来的产品列表 #}
                          <script id="abcd" type="text/html">
                            <% for(var i = 0; i < products.length; i++) { %>
                            <li class="item">
                              <dl class="clearfix">
                                <dt class="news fl">
                                  <div id="<%= products[i].pid %>" style="width: 100%; height: 100%;"></div>
                                  <a class="mask" href="/sp/<%= products[i].pid %>">
                                    <%= products[i].totalEquity.toFixed(2) %>%<br>总收益
                                  </a>
                                </dt>
                                <dd class="fl">
                                  <h4 class="title">
                                    <a href="/sp/<%= products[i].pid %>"><%= products[i].name %></a>
                                    <q class="summary"><%= products[i].description %></q>
                                  </h4>
                                  <div class="data-list">
                                    <table>
                                      {# <caption>table title and/or explanatory text</caption> #}
                                      {# <thead>
                                        <tr>
                                          <th>header</th>
                                        </tr>
                                      </thead> #}
                                      <tbody>
                                        <tr>
                                          <td>
                                            <span class="label">跟投人数：</span>
                                            <span class="value"><%= products[i].totalFollowersAccount %></span>
                                          </td>
                                          <td>
                                            <span class="label">跟投获利：</span>
                                            <span class="value"><%= products[i].realtimeFollowingProfit.toFixed(2) %></span>
                                          </td>
                                          <td>
                                            <span class="label">日收益率：</span>
                                            <span class="value"><%= products[i].dayEquity.toFixed(2) %>%</span>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <span class="label">净&nbsp;&nbsp;&nbsp;值：</span>
                                            <span class="value"><%= (products[i].captial.equity/products[i].captial.initEquity).toFixed(2) %></span>
                                          </td>
                                          <td>
                                            <span class="label">回撤率：</span>
                                            <span class="value"><%= products[i].statics.maxDrawDown.toFixed(2) %>%</span>
                                          </td>
                                          <td>
                                            <span class="label">夏普率：</span>
                                            <span class="value"><%= products[i].statics.sharpeRatio.toFixed(2) %>%</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div class="info">
                                    <span class="author">
                                      <a class="name" href="/global/u/<%= products[i].creator._id %>">
                                        <img class="avatar" src="<%= products[i].creator.avatar %>" alt="">
                                        <b style="vertical-align: middle;"><%= products[i].creator.name.first %></b>
                                      </a> 主理
                                    </span>
                                      <span class="fr"><%= moment(products[i].created).format('YYYY-MM-DD') %> 创建</span>
                                      {# <a class="tag fr hide" href="#@">tag</a> #}
                                  </div>
                                </dd>
                              </dl>
                            </li>
                            <% } %>
                          </script>
                      </ul>
                  </div>
                  <div class="hot-footer">
                      <a href="/p/rank">更多组合</a>
                  </div>
              </div>
          </div>

          <div class="main-right">
              <div class="sort-group">
                  <div class="index-header clearfix">
                      <h4 class="fl">跟投获利排行</h4>
                      <a class="fr" href="#@">Top10</a>
                  </div>
                  <div class="group-body">
                      {# <ul class="switch-tab nols clearfix">
                        <li class="getProductRank active" data-type="day">日收益榜</li>
                        <li class="getProductRank" data-type="week">周收益榜</li>
                        <li class="getProductRank" data-type="month">月收益榜</li>
                      </ul> #}

                      {# <ul class="switch-query nols clearfix">
                          <li class="active">日收益</li>
                          <li>月收益</li>
                          <li>总收益</li>
                      </ul> #}

                      <ol id="userRankList" class="user-list nols">
                        <script id="userRankTep" type="text/html">
                        <% for(var j = 0; j < users.length; j++) { %>
                          <li class="clearfix lh200">
                            <div class="fl pic">
                              <a href="/global/u/<%= users[j]._id %>" title="">
                                <img class="avatar" src="<%= users[j].avatar %>" alt="">
                              </a>
                            </div>
                            <div class="fl author">
                              <p><b class="sort-label">No.<%= j+1 %></b><a href="/global/u/<%= users[j]._id %>" title=""><%= users[j].name.first %></a></p>
                              {# <p><span class="label">收益率：</span><span class="value">178.64%</span></p> #}
                            </div>
                            <div class="fr tr other">
                              <p>{# <span class="label">跟单获利：</span> #}<span class="value">&yen;<%= users[j].trading.realtimeFollowingProfit.toFixed(2) %></span></p>
                              {# <p><span class="label">跟随人数：</span><span class="value">35</span></p> #}
                            </div>
                          </li>
                          <% } %>
                        </script>
                      </ol>
                  </div>
              </div>

              <div class="sort-group">
                  <div class="index-header clearfix">
                      <h4 class="fl">最多跟投排行</h4>
                      <a class="fr" href="#@">Top10</a>
                  </div>
                  <div class="group-body">
                      {# <ul class="switch-tab nols clearfix">
                        <li class="getProductRank active" data-type="day">日收益榜</li>
                        <li class="getProductRank" data-type="week">周收益榜</li>
                        <li class="getProductRank" data-type="month">月收益榜</li>
                      </ul> #}

                      {# <ul class="switch-query nols clearfix">
                          <li class="active">日收益</li>
                          <li>月收益</li>
                          <li>总收益</li>
                      </ul> #}

                      <ol id="productRankA" class="detail-list nols productRankList">
                        {# <li>
                          <span>1</span>
                          <a href="#@">港股测试3</a>
                          <b>75.77%</b>
                        </li> #}
                        <script id="ccc" type="text/html">
                          <% for(var k = 0; k < products.length; k++) { %>
                            <li>
                              <span><%= k+1 %></span>
                              <a href="/sp/<%= products[k].pid %>"><%= products[k].name %></a> <b><%= products[k].totalFollowersAccount %>人</b>
                            </li>
                          <% } %>
                        </script>
                      </ol>
                  </div>
              </div>
          </div>
      </div>
  </div>
  {% include './layouts/footer.swig' %}
</div>

{% block script %}
<script src="/javascripts/libs/countUp/dist/countUp.min.js"></script>
<script src="/javascripts/index.js"></script>
{% endblock %}

{% endblock %}
