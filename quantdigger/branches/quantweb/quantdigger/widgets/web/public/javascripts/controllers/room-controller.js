// define(['../app', '../services/services'], function(app) {
// 最外层controller
'use strict';



angular.module('app.tradeController', ['app.services'])

.controller('roomController', ['$scope', '$rootScope', 'room', 'trader', 'util', 'application', 'web', function($scope, $rootScope, room, trader,  util, application, web) {
  var option = Charts.initOption();
  var chart = Charts.createChart('myChart', $scope);
  /**
   * 创建于 8月31日 9:33
   * 新增echart图表 dataZoom 和 dataViewChanged 变化的事件监听
   * @param1 echart实例
   * @param2 事件回调
   */
  Charts.dataZoom(chart, function(params) {
    console.log(params.type);
  });
  Charts.dataViewChanged(chart, function(params) {
    /*alert('监听'+params.type+'事件');*/
    /*room.scope.draging = true;*/
    console.log(params.type);
  });
  // 变量初始化--------------------------------------------------------------------------
  var logger = util.logger;
  $scope.isKP = 0;
  $scope.change = 0;
  $scope.myAccounts = [];
  $scope.toTradeContractName='';
  $scope.followList = [ ];
  $scope.order = { price: 0 };
  $scope.curAccount = {
    equity: '-',
    cash: '-',
    name: ''
  };

  $scope.captial = {
    'cash': '-',
    'equity': '-'
  };


  // 请求函数------------------------------------------------------------------------------
  $scope.isValid = function () {
    return $scope.$parent != undefined;
  };
  // 获取合约后初始化，
  // 用户切换交易合约的时候改变
  // ontick回来的时候更新五档行情。
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  $scope.switchPeriod = function(period){
    $scope.legend = period;
    application.roomKWindow.switchPeriod(period, false);
  };

  // $scope.setDefaultAccount = function (item) {
  //   application.accountManager.curAccount = item;
  //   application.accountManager.updateAccountObservers();
  // }

  $scope.setDefaultAccount = function (item) {
    application.accountManager.setCurrentAccount(item);
    // application.accountManager.updateAccountObservers();
  };

  /**
   * 跟投成功后，把$scope.showModal=false;关闭对话框
   * 在web.xxx服务里设置，需掉$scope.$aaply()
   * @param  {[type]} item [一个订单对象]
   * @return {[type]}      [无返回]
   */
  $scope.showFollowDlg = function(item) {
    $scope.showModal=true; // 显示跟投对话框
    $scope.eee = item;
    console.log("item:" );
    console.log(item);
    // var dialog = confirm('您当前登录账号为:   ' + item.name);
    // if (dialog) {
    //   alert('跟投成功');
    // }
  };

  $scope.calcuTradable = function (price) {
    var isBuy = ($scope.isKP == 'KAI' ? true : false);
    $scope.tradableQuantity = application.tradingPanel.calcuTradable(price, isBuy);
    $scope.safeApply();
  };

  $scope.setTradePrice = function (isBuy) {
    $scope.order.price = application.tradingPanel.calcuTradePrice(isBuy)
    $scope.tradableQuantity = application.tradingPanel.calcuTradable($scope.order.price, isBuy)
    $scope.safeApply();
  };

  $scope.selectContract = function(contract) {
    /** 只被html调用 */
    var isBuy = ($scope.isKP == 'KAI' ? true : false);
    application.tradingPanel.selectContract(contract, isBuy, function (err) {
      if (err) {
        logger.error(err);
      };
    });
  };

  /** 提交订单  */
  // direction: 'LONG'(买多),'SHORT'(卖空);
  // side: 'KAI'(开仓/买入),'PING'(平仓/卖出);
  $scope.insertOrder = function(followProductId, followLoginId, order, follow) {
    console.log('-------------下单开始-------------');
    if (!follow) {
      order.directionBool ? order.direction = 'LONG': order.direction = 'SHORT';
      order.sideBool ? order.side = 'KAI': order.side = 'PING';
      order.contract = application.tradingPanel.toTradeContract.key;
      // order.side = $scope.isKP;
    };

    order.priceType = 'LMT';
    if (parseFloat(order.price) == 0) {
      order.priceType = 'MKT';
    };
    order.refId = 1;
    order.hedgeType = 'SPEC';
    // if (!order.direction) {
    //   order.direction="LONG";
    // };
    console.log(order);
    application
      .tradingPanel
      .insertOrder(
        followProductId,
        followLoginId,
        order, function (err, res) {
          if (err) {
            Ply.dialog("alert", { effect: "scale" }, {text: "下单失败: "+err, ok: '好'});
            return;
          };
          Ply.dialog("alert", { effect: "scale" }, {text: "下单成功", ok: '好'});
     });

  };

  /**
   * 跟投系列 9月16
   * gT 跟投按钮 qH 切换按钮
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  $scope.followInvest  = function(data) {
    logger.debug("<followtOrder>");
    var order = {};
    //order.priceType = 'MKT';
    order.price = 0;
    order.contract = data.contract + '.' + data.exchangeId;
    order.datetime = new Date();
    order.refId = 1;
    order.hedgeType = 'SPEC';
    /// @todo '绑的太死，界面的改动会影响到逻辑'
    order.side = (data.side == '买入' ? 'KAI' : 'PING');
    order.direction="LONG";
    order.quantity = data.quantity;
    order.followProductId = data.followProductId;
    order.followLoginId = data.followLoginId;
    $scope.insertOrder(order.followProductId, order.followLoginId, order, true);
  }

  /** 撤单 */
  $scope.cancelOrder = function(orderNo) {
    console.log('#######撤单#######');
    console.log(orderNo);
    application.accountManager.cancelOrder(orderNo);
  };

  // 被PContractBar调用。
  $scope._update = function (buffer, newBar) {
    // return;
    var preClose = parseFloat(application.roomKWindow.curContract.preClose);
      switch(application.roomKWindow.curPeriod) {
        case '1.RealTime':
          var timestamps = getInterval(new Date(), 1000*60*1);
          //if (newBar) {
            var price = [];
            var j = 0;
            for (var i = 0; i < timestamps.length; i++) {
              if (timestamps[i] == buffer.time[j]) {
                price.push(buffer.getRealTimeData()[j]);
                j++;
              } else {
                if (j == buffer.length-1) {
                  var alignedTime = buffer.alignedTime;
                  if (!alignedTime) {
                    alignedTime = buffer.time[j];  // 非交易时段
                  }
                  if (alignedTime  == timestamps[i]) {
                    price.push(buffer.getRealTimeData()[j]);
                    break;
                  }
                };
                // 最后一个tick.time是个整数，非字符串
                /// @todo 统一用整数处理。
                /*console.log(buffer.time);*/
                price.push(NaN);
                // logger.warn("Bar数据缺失: ", timestamps[i]);
              }
              if (j == buffer.length) {
                break;
              };
            };
          Charts.plotRealTime(timestamps, price, preClose, chart, option, false);
          break;
        case '1.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '3.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '5.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '10.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '15.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '30.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '60.Minute':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;
        case '1.Day':
          Charts.plotKline(buffer.time, buffer.price, chart, option, false);
          break;

        default:

      }

  };



  // 回调处理-------------------------------------------------------------------------------

  $scope.onPosition = (function (positions) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    if (positions.length < 5) {
      for (var i = positions.length ; i < 5; i++) {
        positions.push(new PositionItem());
      };
    };
    $scope.positions = positions;
    $scope.positionShow = positions;
    $scope.safeApply();
  });

  /**
   * 被roomKWindow或者PContractBar调用
   */
  $scope.onBarReady = function (pbar, legend) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    if (legend) {
      $scope.legend = legend;
    };
    if (pbar) {
      $scope._update(pbar.buffer, false);
    };
  };

  $scope.onBarTick = function (pbar) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    var buffer = pbar.buffer;
    $scope._update(buffer, false);
  };

  $scope.onBarNew = function (pbar) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    var buffer = pbar.buffer;
    $scope._update(buffer, true);

  };

  $scope.onBasic = function (data) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    $scope.basicInfo = data;
    // logger.info('############ basicInfo ############');
    // console.log($scope.basicInfo);
    // logger.info('############ basicInfo ############');
    $scope.safeApply();
  };

  // 设置买卖盘
  $scope.onBidSell = function (bids, sells) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    $scope.bids = bids;
    $scope.sells = sells;
    $scope.safeApply();
  };

  /**
   * 更新交易面板
   */
  $scope.onCaptial = (function (curAccount, myAccounts) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    /*if ($scope.isKP == 'KAI') {*/
    /*var found = _.findWhere(application.indexContract, { key: $scope.curContract.key });*/
    /*if (!found) {*/
    /*$scope.calcuTradable(application.tradingPanel.toTradePrice);*/
    /*};*/
    /*}*/
    /*curAccount.equity = parseFloat(curAccount.equity).toFixed(2);*/
    /*curAccount.cash = parseFloat(curAccount.cash).toFixed(2);*/
    $scope.curAccount = curAccount;
    $scope.myAccounts = myAccounts;
    $scope.safeApply();
  });

  $scope.onCurAccount = function (curAccount) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
      // 数据库中的价格和实时的不一样，所以不能用数据库中的覆盖。
      // 防止闪烁
      if (!$scope.isValid()) {
        return;
      };
      $scope.myAccounts.forEach(function (acc) {
        if (acc._id == curAccount._id) {
          acc.isDefault = true;
          return;
        }
        acc.isDefault = false;
      });
      $scope.curAccount = curAccount;
      /*$scope.curAccount.equity = parseFloat(curAccount.equity).toFixed(2);*/
      /*$scope.curAccount.cash = parseFloat(curAccount.cash).toFixed(2);*/
      // 数据库中没有实时跟新，避免闪烁。
      $scope.curAccount.equity = '-';
      $scope.curAccount.cash = '-';
      // 清空列表
      /*$scope.orderToday = application.orderItems;*/
      /*$scope.transToday = application.transItems;*/
      /*$scope.positions = application.positionItems;*/
      /*$scope.orderShow = application.orderItems;*/
      /*$scope.positionShow = application.positionItems;*/
      $scope.safeApply();
  };

  $scope.onSelectContract = function (key, price, quantity) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
     $scope.order.contract = key,
     $scope.order.price = price,
     $scope.tradableQuantity = quantity;
     $scope.toTradeContractName = application.tradingPanel.contractName();
     $scope.safeApply();
  };


  $scope.onUpdateOrderAndTransactions = function (orderList, transList) {
    // console.log('########### orderList and transList ###########');
    // console.log(orderList);
    // console.log(transList);
    if (orderList.length < 5) {
      for (var i = orderList.length ; i < 5; i++) {
        orderList.push(new OrderItem());
      };
    };
    if (transList.length < 5) {
      for (var i = transList.length ; i < 5; i++) {
        transList.push(new TransactionItem());
      };
    };
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    $scope.orderShow = orderList;
    $scope.orderToday = orderList;
    $scope.transToday = transList;
    $scope.safeApply();
  };

  $scope.onCancelOrder = function (err, orderList) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    if (err) {
      alert(err);
      return;
    };
    $scope.orderShow = orderList;
    $scope.orderToday = orderList;
    $scope.$apply();
  };

  $scope.onFollow = function (data) {
    if (!$scope.isValid()) {
      return QEvent.INVALID_OBSERVER;
    };
    // console.log('######### onFollow #########');
    // console.log(data);
    $scope.followList = data;
    $scope.safeApply();
  }

// --------------------------------------------------------------初始化

  // 如果是第一次进入，或者更换合约，会请求数据。
  // 如果ckey为空值，服务器会返回默认合约。

  // 初始化
  // $scope.$watch('isLogin', function(newValue, oldValue) {
    // if (newValue == false) return;
    application.prepareTrading();
    web.getMyProduct(function (err, data) {
      $scope.myAccounts = data;
      $scope.safeApply();
    })
    application.addObserver('room', $scope);
    /*$scope.curContract = application.roomKWindow.curContract;*/
    $scope.onFollow(application.followList);
    // 获取数据
    application.roomKWindow.switchContract($scope.$stateParams.id, function (c) {
      $scope.curContract = c;
      $scope.order.contract = c.key;
      $scope.curContract.isStock
        ? $scope.rgx = new RegExp('^[1-9]\\d*00$')
        : $scope.rgx = new RegExp('^[1-9]\\d*$');
    });
    if (application.accountManager.curAccount) {
      // 已经存在帐号，切换回来
      application.accountManager.updateAccountObservers();
    };
  // });



}]);

// });

