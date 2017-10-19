

(function(){
  var getPathName = window.location.pathname,
      pid = getPathName.split('/')[2];

  var bt = baidu.template;

  // 渲染模板
  var Rander = {
    history: function(time, data, index) {
      var html = '<li>' +
                  '<div class="process" style="width: 0%;background-color:#666;"></div>' +
                  '<div class="content">' +
                    '<span>' + time + '</span>' +
                    '<span class="fr">' + data + '元</span>' +
                  '</div>' +
                '</li>';
      return html;
    },
    comment: function(data) {
      var html = '<li class="comment">' +
                    '<a href="javascript:">' +
                      '<div class="author">' +
                        '<img src="' + data.user.avatar + '" alt="">' +
                        '<span class="name">' + data.user.name.first + '</span>' +
                        '<span class="time fr">' + data.created + '</span>' +
                      '</div>' +
                      '<div class="content">' + data.body + '</div>' +
                    '</a>' +
                  '</li>';
      return html;
    }
  };
  /**
   * 获取产品详情
   * @param  {[type]} type [获取排名类型，1：人气榜  2：活跃榜]
   * @return {[type]}      [description]
   */
  var getProductDetail = function(pid) {
    $.ajax({
      url: '/api/product/detail/',
      type: 'GET',
      dataType: 'json',
      data: {pid: pid},
    })
    .done(function(data) {
      console.log("success");
      if (!data.isDone) return console.log('获取失败');
      console.log('--------获取产品详情成功--------');
      console.log(data);
      var product = data.body,
          posts = data.posts,
          template = '',
          time = product.statics.datetimes.map(function(v, i) {
            return moment(v).format("YYYY-MM-DD");
          });

      $('#followerNum').text(data.followersAccount);
      $('#totalData').text(((product.captial.equity-product.captial.initEquity)/product.captial.initEquity*100).toFixed(2));
      $('#created').text(moment(product.created).format('YYYY-MM-DD'));

      // 遍历渲染历史数据
      // $.each(product.statics.equities, function(index, val) {
      //   var data = val.toFixed(2);
      //   template += Rander.history(time[index], data, index);
      // });
      // $('#historyDataList').empty();
      // $(template).appendTo('#historyDataList');
      // template = '';

      var xData = time,
          yData = product.statics.equities;
      // 画走势图表
      makeProductLine(xData, yData);

      // 画饼图
      var profit = 0, loss = 0, equal = 0, tradeCount = 0;
      for (var i = 0; i < data.trans.length; i++) {
        if(data.trans[i].side == 8 && data.trans[i].profit > 0) {
          profit += 1;
        } else if(data.trans[i].side == 8 && data.trans[i].profit < 0) {
          loss += 1;
        } else if(data.trans[i].side == 8 && data.trans[i].profit == 0) {
          equal += 1;
        };
      };
      tradeCount = profit + loss + equal;
      $('#tradeCount').empty().html(tradeCount);

      var pieData = [
        {value: profit, name: '盈利',
          itemStyle: {
            normal:{
              color: '#FF9999',
              label: {
                show: true,
                textStyle: {
                  color: '#FF9999'
                }
              },
              labelLine: {
                lineStyle: {
                  color: '#FF9999'
                }
              },
            }
          },
        },
        {value: loss, name: '亏损',
          itemStyle: {
            normal:{
              color: '#77FFB3',
              label: {
                show: true,
                textStyle: {
                  color: '#77FFB3'
                }
              },
              labelLine: {
                lineStyle: {
                  color: '#77FFB3'
                }
              },
            }
          }
        }
      ];
      makePie(pieData);

      // 画柱状图
      var yDataToBar = yData.map(function(value, index, array) {
        if (index == 0) {
          return value - value;
        } else {
          return value - array[index-1];
        };
      });
      makeBar(xData, yDataToBar); // 函数写在myPie

      // 渲染交易明细
      template = bt('tabBtel', data);
      $('#tabB').empty();
      $(template).appendTo('#tabB');
      // 渲染持仓
      template = bt('tabCtel', data);
      $('#tabC').empty();
      $(template).appendTo('#tabC');
      template = '';

      // 遍历渲染评论数据
      $.each(posts, function(index, val) {
        val.created = moment(val.created).format('YYYY-MM-DD');
        template += Rander.comment(val);
      });
      $('#commentsList').empty();
      if (template == '') {
        $('<span style="color: #999;">暂无评论</span>').appendTo('#commentsList');
      } else {
        $(template).appendTo('#commentsList');
      }

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  };
  // 初始时，获取人气排名
  getProductDetail(pid);

  $(document).ready(function() {
    // 获取不同产品排行榜的事件
    // $('.getProductRank').on('click', function() {
    //   var type = $(this).data('type');
    //   $(this).addClass('active').siblings('li').removeClass('active');
    //   getProductRank(type);
    // })

    $('#detailTab li').on('click', function() {
      $(this).addClass('active').siblings('li').removeClass('active');
      $('#detialBody>div').eq($(this).index()).show().siblings('div').hide();
    });

  });

})()