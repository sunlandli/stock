{% extends "./layouts/base.swig" %}
{% block title %}排行榜 - 小跟班{% endblock %}
{% block keywords %}{% endblock %}
{% block description %}{% endblock %}
{% block footer %}{% include "./layouts/footer.swig" %}{% endblock %}

{% block content %}
<div style="background-color: #f8f8f8;padding-top: 30px;min-height: 550px;padding-bottom: 50px;">
  <div class="container">
    <!-- 左栏 -->
    <div class="sidebar" style="width: 18%;">
      <!-- 排行榜菜单 -->
      <div class="box box-rank-menu">
        <h5 class="title mb0">组合排行榜</h5>
        <ul class="list nols">
          <li class="active getProductRank" data-type="total">
            <a href="javascript:">所有组合</a>
          </li>
          <li class="getProductRank" data-type="follow">
            <a href="javascript:">跟投组合</a>
          </li>
          <li class="getProductRank" data-type="trade">
            <a href="javascript:">交易组合</a>
          </li>
        </ul>
      </div> <!-- 排行榜菜单 end -->

      <div class="box box-rank-menu">
        <h5 class="title mb0">用户排行榜</h5>
        <ul class="list nols" ng-init="targetRank = 1">
          <li class="getUserRank" data-type="total">
            <a href="javascript:">总获利排行</a>
          </li>
          <li class="getUserRank" data-type="follow">
            <a href="javascript:">跟投获利排行</a>
          </li>
          <li class="getUserRank" data-type="trade">
            <a href="javascript:">交易获利排行</a>
          </li>
        </ul>
      </div>

      <!-- 用户排行榜 -->
      <div class="box box-user-rank hide">
        <h5 class="title mb0" style="border-bottom:1px solid #f8f8f8;padding: 10px 20px;">用户排行榜</h5>
        <ul class="list-tab nols clearfix">
          <li class="fl tc active" click="getUserRank(1);">人气榜</li>
          <li class="fr tc" click="getUserRank(2);">收益榜</li>
        </ul>
        <table class="table-user" width="100%" cellpadding="0" cellspacing="0" class="recommend_table">
          <thead class="thead">
            <tr>
              <th align="left">用户</th>
              <th id="userLabelA" align="right">粉丝数</th>
              <th id="userLabelB" align="right" style="display: none;">平均收益</th>
            </tr>
          </thead>
          <!-- 人气榜 -->
          <tbody id="userRanks" class="tbody" ng-show="showList == 1">
            {# <tr>
              <td>
                <img class="img-circle" width="36" height="36" src="[[ item.target.avatar ]]">
                <a href="#">[[ item.target.name.first ]]</a>
              </td>
              <td align="right">[[ item.followersAccount ]]</td>
            </tr> #}
          </tbody> <!-- 人气榜 end -->

          <!-- 活跃榜 -->
          {# <tbody class="tbody" ng-show="showList == 2">
            <tr ng-repeat="item in activeRank">
              <td>
                <img class="img-circle" width="36" height="36" ng-src="[[ item.avatar ]]">
                <a ui-sref="user({id: item._id})">[[ item.name.first ]]</a>

              </td>
              <td align="right">[[ (item.trading.aveEquity).toFixed(1) ]]%</td>
            </tr>
          </tbody>  #}<!-- 活跃榜 end -->

        </table>
      </div> <!-- 用户排行榜 end -->
    </div> <!-- 左栏 end -->

    <!-- 右栏 -->
    <div class="main" style="width: 82%;">
      <div id="rankBoxAA" class="hide">
        {# 产品排行榜 #}
        <div class="box box-rank-info">
          <table class="table-list" width="100%" cellspacing="0" cellpadding="0">
            <thead class="thead">
              <tr>
                <th align="center">组合名称</th>
                {# <th align="center">日收益率</th> #}
                {# <th align="center">周收益率</th> #}
                {# <th align="center">月收益率</th> #}
                <th align="center">最大回撤率</th>
                <th align="center">夏普率</th>
                <th align="center">获利总额</th>
                <th align="center">总收益额</th>
                <th align="center">跟单人数</th>
                <th align="center">交易次数</th>
                <th align="center" width="82">跟单</th>
              </tr>
            </thead>
            <script id="productRankTep" type="text/html">
            <% for(var i = 0; i < products.length; i++) { %>
              <tr>
                <td align="center">
                  <a href="/sp/<%= products[i].pid %>"><%= products[i].name %></a>
                </td>

                <% if( products[i].dayEquity.toFixed(1) > 0 ) { %>
                  <td align="center" class="red"><i>+</i>
                <% } else if( products[i].dayEquity.toFixed(1) < 0 ) { %>
                  <td align="center" class="green">
                <% } else { %>
                  <td align="center">
                <% } %>
                  <%= products[i].dayEquity.toFixed(1) %>%
                </td>

                <% if(products[i].weekEquity.toFixed(1) > 0) { %>
                  <td align="center" class="red"><i>+</i>
                <% } else if( products[i].weekEquity.toFixed(1) < 0 ) { %>
                  <td align="center" class="green">
                <% } else { %>
                  <td align="center">
                <% } %>
                  <%= products[i].weekEquity.toFixed(1) %>%
                </td>

                <% if(products[i].monthEquity.toFixed(1) > 0) { %>
                  <td align="center" class="red"><i>+</i>
                <% } else if( products[i].monthEquity.toFixed(1) < 0 ) { %>
                  <td align="center" class="green">
                <% } else { %>
                  <td align="center">
                <% } %>
                  <%= products[i].monthEquity.toFixed(1) %>%
                </td>

                <% if(products[i].dayEquity.toFixed(1) > 0) { %>
                  <td align="center" class="red"><i>+</i>
                <% } else if( products[i].dayEquity.toFixed(1) < 0 ) { %>
                  <td align="center" class="green">
                <% } else { %>
                  <td align="center">
                <% } %>
                  <%= products[i].dayEquity.toFixed(1) %>%
                </td>

                {# <% if(products[i].captial.initEquity.toFixed(1) > 0) { %> #}
                  {# <td align="center" class="red"><i>+</i> #}
                {# <% } else { %> #}
                  <td align="center">
                {# <% } %> #}
                  <%= products[i].captial.initEquity.toFixed(1) %>
                </td>
                <td align="center"><%= products[i].statics.tradingNum %></td>
                <td align="center">
                  <i class="btn-follow no iconfont" title="关注">&#xe632;</i>
                  {# <i class="btn-follow yes iconfont" ng-if="peoduct[i].isFollow" ng-click="followProduct(peoduct[i]._id); peoduct[i].isFollow = false;" title="取消关注">&#xe631;</i> #}
                </td>
              </tr>
              <% } %>
            </script>
            <tbody id="productRank" class="tbody">
              {# 存放产品列表 #}
            </tbody>
          </table>
        </div>{# 产品排行榜 end #}
        <div class="tc">
          <div id="productPage" class="m-pagination dib"></div>
        </div>
      </div>

      <div id="rankBoxA">
        <table id="tableTotal"></table>
        <div style="text-align:right;">
          <div id="pTotal"></div>
        </div>
      </div>
      <div id="rankBoxB">
        <table id="tableFollow"></table>
        <div style="text-align:right;">
          <div id="pFollow"></div>
        </div>
      </div>
      <div id="rankBoxC">
        <table id="tableTrade"></table>
        <div style="text-align:right;">
          <div id="pTrade"></div>
        </div>
      </div>

      <div id="rankBoxBB" style="display: none;">
        {# 用户排行榜 #}
        <div class="box box-rank-info">
          <table class="table-list" width="100%" cellspacing="0" cellpadding="0">
            <thead class="thead">
              <tr>
                <th align="center">用户名称</th>
                {# <th align="center">日收益率</th> #}
                {# <th align="center">周收益率</th> #}
                {# <th align="center">月收益率</th> #}
                <th align="center">产品数量</th>
                <th align="center">获利总额</th>
                <th align="center">跟随获利总额</th>
                <th align="center">交易获利总额</th>
                <th align="center">交易次数</th>
                <th align="center">粉丝人数</th>
              </tr>
            </thead>
            <script id="userRankTep" type="text/html">
            <% for(var j = 0; j < users.length; j++) { %>
              <tr>
                <td align="left" style="padding-left: 30px;">
                  <a href="/global/u/<%= users[j]._id %>">
                    <img src="<%= users[j].avatar %>" alt="" style="width: 30px;height: 30px;border-radius: 30px;">
                    <%= users[j].name.first %>
                  </a>
                </td>
                <td align="center"><%= users[j].trading.curProductsAccount %></td>
                <td align="center"><%= users[j].trading.followingProfit + users[j].trading.tradingProfit %></td>
                <td align="center"><%= users[j].trading.followingProfit %></td>
                <td align="center"><%= users[j].trading.tradingProfit %></td>
                <td align="center"><%= users[j].trading.tradingNum %></td>
                <td align="center"><%= users[j].trading.tradingNum %></td>
              </tr>
            <% } %>
            </script>
            <tbody id="userRank" class="tbody">
              {# 存放用户列表 #}
            </tbody>
          </table>
        </div>{# 用户排行榜 end #}
        <div class="tc">
          <div id="userPage" class="m-pagination dib"></div>
        </div>
      </div>

      <div id="rankBoxUA">
        <table id="tableUTotal"></table>
        <div style="text-align:right;">
          <div id="pUTotal"></div>
        </div>
      </div>

      <div id="rankBoxUB">
        <table id="tableUFollow"></table>
        <div style="text-align:right;">
          <div id="pUFollow"></div>
        </div>
      </div>

      <div id="rankBoxUC">
        <table id="tableUTrade"></table>
        <div style="text-align:right;">
          <div id="pUTrade"></div>
        </div>
      </div>

    </div> <!-- 右栏 end -->
  </div>
</div>


{% block script %}
<script src="/javascripts/rank.js"></script>
{% endblock %}

{% endblock %}
