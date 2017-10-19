{% extends "./layouts/base.swig" %}
{% block title %}{{ product.name }} - 小跟班{% endblock %}
{% block keywords %}{% endblock %}
{% block description %}{% endblock %}
{% block footer %}{% include "./layouts/footer.swig" %}{% endblock %}

{% block content %}
<div id="wrap" class="sp-one-wrap" style="padding: 30px 0 50px;">
    <div class="container">
        <div class="sp-one-header">
            <div class="group-title clearfix">
                <h2>{{ product.name }} <small style="color: #999;">{{ product.pid }}</small></h2>
                {# <span class="following-btn">+加关注</span> #}
            </div>
            <div class="sp-one-main clearfix">
                <div class="main-left">
                    <div class="group-info-box">
                        <div class="top">
                            {# <span class="tag mr5" ng-repeat="t in product.tags">{{ t }}</span> #}
                            <span class="followers"><b id="followerNum">0</b> 人跟投</span>
                        </div>
                        <ul class="middle nols clearfix">
                          <li>
                            <span>夏普率</span>
                            <br>
                            <span>{{ product.statics.sharpeRatio.toFixed(2) }}%</span>
                          </li>
                          <li>
                            <span>回撤率</span>
                            <br>
                            <span>{{ product.statics.maxDrawDown.toFixed(2) }}%</span>
                          </li>
                          <li>
                            <span>交易次数</span>
                            <br>
                            <span>
                              {{ product.statics.tradingNum }}
                            </span>
                          </li>
                        </ul>
                        <ul class="middle nols mt20 clearfix">
                            <li>
                                <span>日收益率</span><br>
                                <span>{{ product.dayEquity.toFixed(2) }}%</span>
                            </li>
                            <li>
                                <span>月收益率</span><br>
                                <span>{{ product.monthEquity.toFixed(2) }}%</span>
                            </li>
                            <li>
                                <span>净值</span><br>
                                <span>{{ (product.captial.equity/product.captial.initEquity).toFixed(2) }}</span>
                            </li>
                        </ul>
                        <div class="bottom clearfix">
                            <h1><span id="totalData"></span><small>%</small></h1>
                            <span> 总收益率</span>
                            <div>
                                <h2>{{ product.creator.name.first }}</h2>
                                <span>创建于 <span id="created"></span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-right">
                    <div class="group-creator">
                        <div>
                            <img src="{{ product.creator.avatar }}" alt="">
                            <a href="/global/u/{{ product.creator.id }}">{{ product.creator.name.first }}</a>
                        </div>
                        <q>{{ product.description }}<i class="arrow"></i></q>
                    </div>
                    <div class="hide">
                        <ul class="other-data nols clearfix">
                            <li>
                                <h5>夏普率</h5>
                                <span>{{ product.statics.sharpeRatio.toFixed(1) }}</span>
                            </li>
                            <li>
                                <h5>最大回撤</h5>
                                <span>{{ product.statics.maxDrawDown.toFixed(1) }}</span>
                            </li>
                            <li>
                                <h5>最大回撤周期</h5>
                                <span>{{ product.statics.maxDrawDownDuration }}</span>
                            </li>
                            <li>
                                <h5>交易次数</h5>
                                <span>{{ product.statics.tradingNum }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="group-detail">
          <div class="group-detail-header">
            <ul id="detailTab" class="gtoup-detail-tab nols clearfix">
              <li class="active">交易报表</li>
              <li>交易明细</li>
              <li>交易持仓</li>
            </ul>
          </div>
          <div id="detialBody" class="group-detail-body">
            <div class="tab-a">
              <div class="tab-box">
                <div class="tab-box-header">
                  <span>资金曲线图</span>
                  <!-- <span class="fr">￥4255</span> -->
                </div>
                <div>
                  <div id="myLine" style="height:450px;"></div>
                </div>
              </div>
              <div class="mt30 clearfix">

                <div class="tab-box fl" style="width: 40%;">
                  <div class="tab-box-header">
                    <span>交易总笔数</span>
                    <span id="tradeCount" class="fr">[[ tradeCount ]]</span>
                  </div>
                  <div>
                    <div id="myPie" style="height:450px;"></div>
                  </div>
                </div>

                <div class="tab-box fl" style="width: 58%; margin-left: 2%;">
                  <div class="tab-box-header">
                    <span>每日收益</span>
                    <!-- <span class="fr">￥4255</span> -->
                  </div>
                  <div>
                    <div id="myBar" style="height:450px;"></div>
                  </div>
                </div>

              </div>
            </div>
            <div class="tab-b" style="display: none;">
              <table>
                <thead>
                  <tr>
                    <th>股票代码</th>
                    <th>股票名称</th>
                    <th>交易类型</th>
                    <th>股数</th>
                    <th>盈亏金额</th>
                    <th>开仓价格</th>
                    <th>开仓时间</th>
                  </tr>
                </thead>
                <script id=tabBtel type="text/html">
                <% var label = {7: '买入', 8: '卖出'}; %>
                <% for(var i = 0; i < trans.length; i++) { %>
                  <tr>
                    <td><%= trans[i].contract %></td>
                    <td><%= trans[i].name %></td>
                    <td><%= label[trans[i].side] %></td>
                    <td><%= trans[i].quantity %></td>
                    <td><%= trans[i].profit.toFixed(2).replace(/\.00$/, '') %></td>
                    <td><%= trans[i].price.toFixed(2).replace(/\.00$/, '') %></td>
                    <td><%= moment(trans[i].datetime).format('YYYY-MM-DD HH:MM:SS') %></td>
                  </tr>
                <% } %>
                </script>
                <tbody id="tabB"></tbody>
              </table>
            </div>
            <div class="tab-c" style="display: none;">
              <table>
                <thead>
                  <tr>
                    <th>股票代码</th>
                    <th>股票名称</th>
                    <th>总持仓数</th>
                    <th>跟投持仓数</th>
                    <th>持仓盈亏</th>
                    <th>跟投持仓盈亏</th>
                    <th>持仓均价</th>
                  </tr>
                </thead>
                <script id=tabCtel type="text/html">
                <% for(var j = 0; j < pos.length; j++) { %>
                  <tr>
                    <td><%= pos[j].contract %></td>
                    <td><%= pos[j].name %></td>
                    <td><%= pos[j].quantity %></td>
                    <td><%= pos[j].followQuantity %></td>
                    <td><%= pos[j].totalProfit.toFixed(2) %></td>
                    <td><%= pos[j].followProfit.toFixed(2) %></td>
                    <td><%= pos[j].cost.toFixed(2) %></td>
                  </tr>
                <% } %>
                </script>
                <tbody id="tabC"></tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="group-trand clearfix hide">
            <div class="trand-line fl">
                <div class="title">
                    <h4>收益率走势</h4>
                </div>
                <div id="myLine" style="height:350px;"></div>
            </div>
            <div class="trand-info fl">
                <div class="title">
                    <h4>历史净值</h4>
                </div>
                <div class="history">
                    <ul id="historyDataList" class="nols">
                        {# {% for item in product.statics.equities %}
                        <li>
                          <div class="process" style="width: 0%;background-color:#666;"></div>
                          <div class="content">
                            <span>{{ product.statics.datetimes[] }}</span>
                            <span class="fr">{{ item.toFixed(3) }}元</span>
                          </div>
                        </li>
                        {% endfor %} #}
                    </ul>
                </div>
            </div>
        </div>

        <div class="group-comment">
          <div class="title mb30">
            <h4>评论</h4>
          </div>
          <div class="comments">
            <ul id="commentsList" class="comments-list nols">
              {# 存放评论列表 #}
            </ul>
          </div>
          {# <div class="comment-form">
            <form ng-submit="addPost(formPost)">
              <textarea ng-model="formPost.body" placeholder="写点关这个组合的想法" required></textarea>
              <div class="tr mt10">
                <button type="submit">评 论</button>
              </div>
            </form>
          </div> #}
        </div>
    </div>
</div>
<script src="/javascripts/my-pie.js"></script>
<script src="/javascripts/my-line.js"></script>
<script src="/javascripts/product-detail.js"></script>

{% endblock %}
