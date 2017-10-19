// Copyright 2015 QuantFans Inc. All Rights Reserved.
/**
 * @fileoverview 前端交易模块的控制逻辑
 *
 * @author wondereamer(dingjie.wang@foxmail.com)
 */

var key2name = {};
var logger = log;
var flogger = new FuncDebug(log);
var indexContract = [{
  key: '000001.SSE',
  name: '上证指数',
  close: '-',
  change: '-',
  diff: '-',
}, {
  key: '399001.SZSE',
  name: '深证指数',
  close: '-',
  change: '-',
  diff: '-',
}, {
  key: '399006.SZSE',
  name: '创业板指',
  close: '-',
  change: '-',
  diff: '-',
}, {
  key: '399005.SZSE',
  name: '中小板指',
  close: '-',
  change: '-',
  diff: '-',
}, {
  key: '000300.SSE',
  name: '沪深300',
  close: '-',
  change: '-',
  diff: '-',
}];


/**
 * 账号管理，包含当前账号和自己所有账号信息。
 * 仓表，委托表，持仓表等。
 */
var AccountManager = (function AccountManager() {
  function AccountManager(application) {
    this._curAccount = null;
    this._myAccounts = [];
    this._orderItems = [];
    this._transItems = [];
    this._positionItems = [];
    this._followItems = [];

    this._app = application;
    this._ee = new QEvent();

  }

  AccountManager.prototype = {
    constructor: AccountManager,
    set myAccounts(v) {
      this._myAccounts = v;
    },
    get curAccount() {
      return this._curAccount;
    },
    get myAccounts() {
      return this._myAccounts;
    },
    get transItems() {
      return this._transItems;
    },
    get orderItems() {
      return this._orderItems;
    },
    get positionItems() {
      return this._positionItems;
    },

    initialize: function() {
      /** 视图初始化的时候被调用。 */
      this._ee.emitEvent('onUpdateOrderAndTransactions', [clone(this._orderItems), clone(this._transItems)]);
      this._ee.emitEvent('onPosition', [clone(this._positionItems)]);
    },

    addObserver: function(evt, func) {
      this._ee.addListener(evt, func);
    },

    /** 设置当前账号
     *  并更新观察者模型
     *
     * @param {Product} account 产品
     */
    setCurrentAccount: function(account) {
      var self = this;
      this._app.dataManager.setDefaultAccount(account._id);
      this._curAccount = account;
      this._app.dataManager.getMyProduct(function(err, products) {
        // 深拷贝的化loginId可能不会及时赋值。
        // 可把深拷贝放到service里面。
        if (err) {
          throw err;
        };
        self._curAccount._id = account._id;
        self._curAccount.name = account.name;
        self._curAccount.equity = account.captial.equity;
        self._curAccount.cash = account.captial.cash;
        self._myAccounts = products; // note: 没有深拷贝
        self._app.trader.orderToday(self._curAccount._id, function(data) {
          logger.debug("orderToday:", data);
        });
        self._app.trader.transToday(self._curAccount._id, function(data) {
          logger.debug(("transToday", data));
        });
        self.updateAccountObservers()
      });
    },

    /** 撤单 */
    cancelOrder: function(orderNo) {
      var order = _.findWhere(this._orderItems, {orderNo: orderNo});
      logger.debug("撤单: ", order);
      console.log(this._orderItems);
      this._app.trader.cancelOrder(order.productId, order.loginId, orderNo,
        order.exchangeId, order.contract,
        function(err, data) {
          if (err) {
            logger.error("撤单失败！");
            logger.error(err);
            return;
          };
        });
    },

    // ------------------------ slot ------------------------------------------
    updateAccountObservers: function() {
      if (!this._curAccount) {
        return;
      };
      this._ee.emitEvent('onCurAccount', [clone(this._curAccount)]);
    },

    onCaptial: function(data) {
      var account = _.find(this._myAccounts, function(acc) {
        return acc._id == data.productId;
      });
      // 跟新所有可能的账号
      if (account) {
        account.captial.equity = (data.captial.equity).toFixed(1);
        account.captial.cash = (data.captial.cash).toFixed(1);
      } else {
        logger.warn("[onCaptial] Not found account!");
        return;
      }
      if (this._curAccount) {
        // 更新当前账号
        if (this._curAccount._id == data.productId) {
          this._curAccount.name = account.name;
          this._curAccount.equity = account.captial.equity;
          this._curAccount.cash = account.captial.cash;
        };
        this._ee.emitEvent('onCaptial', [clone(this._curAccount), clone(this._myAccounts)]);
      };

    },

    onPosition: function(positions) {
      /// @todo 同时只有一个持仓订阅， 可优化。
      this._positionItems = [];
      var self = this;
      positions.forEach(function(pos) {
        var item = new PositionItem(pos);
        self._positionItems.push(item);
      });
      self._ee.emitEvent('onPosition', [clone(this._positionItems)]);
    },

    onOrder: function(order, productId, loginId) {
      var order = new OrderItem(order);
      order.productId = productId;
      order.loginId = loginId;
      console.log('######### 下单onOrder #########');
      console.log(order);
      var filledQuantity = 0;
      // 处理成交和回报的顺序乱序到达
      // 报单回来的时候，filledQuantity一般都应该是0
      if (order.state == 0) {
        var transList = _.where(this._transItems, {
          orderNo: order.orderNo
        }); // note
        transList.forEach(function(trans) {
          filledQuantity += parseFloat(trans.quantity);
        });
      };
      //
      order.filledQuantity = filledQuantity;
      this._orderItems = _.filter(this._orderItems, function(order) {
        return order.name != ""
      });
      this._orderItems.push(order);
      this._ee.emitEvent('onUpdateOrderAndTransactions', [clone(this._orderItems), clone(this._transItems)]);
    },

    // 撤单回调
    onCancelOrder: function(order) {
      /// @todo 撤单失败的影响
      // console.log('###### 撤单回报 ######');
      // console.log(order);
      var orderItems = this._orderItems;
      //
      var order = _.findWhere(orderItems, {
        orderNo: order.id
      });
      if (order) {
        if (order.filledQuantity > 0) {
          order.state = 4;
          order.status = "部分成交";
        } else {
          order.state = 2;
          order.status = "已撤";
        }
      };
      //
      this._ee.emitEvent('onCancelOrder', [null, clone(this._orderItems)]);
    },

    onTransaction: function(trans) {
      var self = this;
      var newTrans = new TransactionItem(trans);
      // 更新报单
      var item = _.findWhere(self._orderItems, {
        orderNo: trans.orderId,
        state: 0
      }); // note
      if (item) {
        item.filledQuantity += trans.quantity;
        newTrans.orderPrice = item.price;
        newTrans.orderTime = item.datetime;
      };
      // 更新成交单
      self._transItems = _.filter(self._transItems, function(trans) {
        return trans.name != ""
      });
      self._transItems.push(newTrans);
      self._ee.emitEvent('onUpdateOrderAndTransactions', [clone(this._orderItems), clone(this._transItems)]);
    },

    onTransToday: function(transList) {
      var self = this;
      var transList = _.sortBy(transList, function(trans) {
        return trans.datetime;
      });
      self._transItems = [];
      if (transList.length > 0) {
        transList.forEach(function(trans) {
          /*console.log(trans);*/
          var item = new TransactionItem(trans);
          self._transItems.push(item);
        });
        // @note: 成交可以有多个，但是报单只会有一个。
        self._transItems.forEach(function(trans) {
          // 更新报单
          var item = _.findWhere(self._orderItems, {
            orderNo: trans.orderNo
          }); // note
          if (item) {
            // item.filledQuantity += trans.quantity; 服务器中已经做处理了。
            trans.orderPrice = item.price;
            trans.orderTime = item.datetime;
          };
        })
      };
      self._ee.emitEvent('onUpdateOrderAndTransactions', [clone(this._orderItems), clone(this._transItems)]);
    },

    onOrderToday: function(orderList, productId) {
      var self = this;
      var orderList = _.sortBy(orderList, function(order) {
        return order.datetime;
      });

      self._orderItems = [];
      if (orderList.length > 0) {
        //
        orderList.forEach(function(order) {
          order.productId = productId;
          // todo 和onOrder部分代码重叠
          var transList = _.where(self._transItems, {
            orderNo: order.orderNo
          }); // note
          if (transList) {
            transList.forEach(function(trans) {
              trans.orderNo = order.OrderNo;
              trans.orderTime = order.datetime;
              trans.orderPrice = order.price;
            })
          };
          var item = new OrderItem(order);
          self._orderItems.push(item);
        });
      };
      self._ee.emitEvent('onUpdateOrderAndTransactions', [clone(this._orderItems), clone(this._transItems)]);
    },

    onFollow: function(type, data) {
      // console.log('########## accountManager onFollow ##########')
      // console.log(data);
      var trans = data.data;
      trans.name = data.name;
      trans.followLoginId = data.loginId;
      trans.followProductId = data.productId;
      this._followItems.unshift(new FollowItem(type, trans));
      this._ee.emitEvent('onFollow', [clone(this._followItems)]);
    },

  };
  return AccountManager;
})();


var TradingPanel = (function TradingPanel() {
  /** 两份：跟投＋下单模块 */

  function TradingPanel(application) {
    this.toTradeContract = null; // 带五档行情的合约。
    this.toTradePrice = 0;
    this.tradableQuantity = 0;
    this._app = application;
    this._ee = new QEvent();
  }

  TradingPanel.prototype = {

    constructor: TradingPanel,

    contractName: function() {
      if (this.toTradeContract) {
        return this.toTradeContract.name || this.toTradeContract.key;
      };
      return '';
    },

    /**
     * 被room的ontick调用
     */
    updateContractBidSell: function(bids, sells) {
      this.toTradeContract.buy = bids;
      this.toTradeContract.sell = sells;
    },

    addObserver: function(evt, func) {
      this._ee.addListener(evt, func);
    },

    selectContract: function(contract, isBuy, cbk) {
      console.log('############# selectContract ###############')
      console.log(contract);

      var self = this;
      this._app.dataManager.getContract(contract.key, function(err, contract) {
        // 给下单模块
        if (err) {
          return cbk(err);
        };
        if (contract.key == 'CCTEST.SSE') {
          contract.key = 'CCTEST.CC';
        };
        self.toTradeContract = contract;
        self.toTradePrice = self.calcuTradePrice(isBuy);
        var quantity = self.calcuTradable(self.toTradePrice, isBuy);
        /*console.log('选中合约：');*/
        /*console.log(contract.name);*/
        /*console.log("---------------------");*/
        cbk(null);
        self._ee.emitEvent("onSelectContract", [contract.key, self.toTradePrice, quantity]);
      });
    },

    calcuTradable: function(price, isBuy) {
      /** 计算可买可卖数量 */
      var quantity = 0;
      if (isBuy) {
        if (this._app.accountManager.curAccount) {
          quantity = Math.floor(this._app.accountManager.curAccount.cash / price / 100) * 100;
        }
      } else {
        var pos = _.findWhere(this._app.positionItems, {
          key: this.toTradeContract.key
        });
        if (pos) {
          quantity = (pos.quantity - pos.todayQuantity);
        };
      }
      this.tradableQuantity = quantity;
      return quantity;
    },

    calcuTradePrice: function(isBuy) {
      /** 计算交易交易价格 */
      var price = 0;
      // 市价按限价
      if (this.toTradeContract.sell.length > 0) {
        price = (isBuy ? this.toTradeContract.sell[0].price : this.toTradeContract.buy[0].price);
      };
      if (price == 0) {
        price = this.toTradeContract.close; // 五档行情没数据,或者没有
      };
      return price;
    },

    /** 提交订单  */
    insertOrder: function(followProductId, followLoginId, order, cbk) {
      logger.debug("<insertOrder>");
      var account = this._app.dataManager.curAccount;
      var productId = account._id;
      var loginId = account.defaultSubProduct;
      if (order.contract.toUpperCase() == 'CCTEST.SSE') {
        order.contract = 'CCTEST.CC';
      };
      var found = _.findWhere(this._app.indexContract, {
        key: order.contract
      });
      if (found) {
        return cbk('指数合约不能下单！');
      };
      if (order.side == 'KAI' && order.quantity > this.tradableQuantity) {
        return cbk('超过可买股数');
      };
      if (!loginId) {
        return cbk('组合资金已经全部分配给子组合，无法手工下单！');
      };
      if (order.side == "PING") {
        var dir = (order.direction == "LONG" ? "多" : "空");
        var pos = _.findWhere(this._app.positionItems, {
          key: order.contract,
          direction: dir
        });
        if (pos && (pos.quantity - pos.todayQuantity) < parseFloat(order.quantity)) {
          return cbk('可平仓位不足');
        };
      } else {
        /// @todo 当前价格映射
        /*var pirce = (order.priceType == 'MKT' ? room.curContract.price : order.price);*/
        /*if (parseFloat(order.price) * parseFloat(order.quantity) >*/
        /*parseFloat(application.curAccount.cash)) {*/
        /*alert('可用资金不足');*/
        /*};*/
      }
      this._app.trader.order(productId, loginId, followProductId, followLoginId, order, cbk);
    },

    /**
     * 跟投系列 9月16
     * gT 跟投按钮 qH 切换按钮
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    /*$scope.acc = '乘风破浪';*/
    followInvest: function(data) {
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
      order.direction = "LONG";
      order.quantity = data.quantity;
      order.followProductId = data.followProductId;
      order.followLoginId = data.followLoginId;
      this.insertOrder(order.followProductId, order.followLoginId, order, true);
    }

  };
  return TradingPanel;
})();


/**
 * k线窗口类，包括五档行情，k线等信息。
 */
var KWindow = (function KWindow() {
  function KWindow(app) {
    this._app = app;
    this._ee = new QEvent();
    this.curPeriod = null;
    this.basicInfo = {};
    this.bidPercent = '-';
    this.sellPercent = '-';
    this.buys = [{
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, ];
    this.sells = [{
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, {
      price: '-',
      volume: 0
    }, ];
    this.curContract = {
      isStock: true,
      key: null // 默认是股票的UI
    };
  }

  KWindow.prototype = {

    constructor: KWindow,

    addObserver: function(evt, func) {
      this._ee.addListener(evt, func);
    },

    /**
     * 周期切换
     * 被switchContract或者用户触发。
     *
     * @param {str} period 周期
     * @param {bool} init 是否是第一次
     */
    switchPeriod: function(period, init) {
      logger.debug("switchPeriod: ", period);
      var pre = this.curPeriod;
      this.curPeriod = period;
      var isCreate = this._app.dataManager.getPBar(this.curContract, period, this);
      // 非新建的，并且周期切换或者controller切换
      if (!isCreate && (pre != period || init)) {
        this.onBarReady(this._app.dataManager._cache._curPbar);
      };
    },

    onBarReady: function(pbar) {
      this._ee.emitEvent('onBarReady', [pbar, this.curPeriod]);
    },

    onBarTick: function(pbar) {
      this._ee.emitEvent('onBarTick', [pbar, this.curPeriod]);
    },

    onBarNew: function(pbar) {
      this._ee.emitEvent('onBarNew', [pbar, this.curPeriod]);
    },

    /**
     * 合约切换或者初始化交易室的时候被调用。
     */
    switchContract: function(ckey, cbk) {
      var newContract = null;
      var self = this;
      async.series([
        function(cb) {
          if (!self.curContract.key) {
            logger.debug("< FirstTime >");
            // 第一次进入
            ckey = (ckey ? ckey : '');
            self._app.dataManager.getContract(ckey, function(err, data) {
              if (err) {
                return cb(err);
              };
              self._app.dataManager.reqTick(data.key, function(err, num) {
                if (err) {
                  logger.error(err);
                  return cb(err);
                };
                newContract = data;
                return cb();
              }); //,
            });
          } else {
            ckey = (ckey ? ckey : self.curContract.key);
            if (self.curContract.key != ckey) {
              // 换合约
              self._app.dataManager.getContract(ckey, function(err, data) {
                if (err) {
                  return cb(err);
                };
                /// @todo 取消旧合约订阅
                self._app.dataManager.reqTick(data.key, function(err, num) {
                  if (err) {
                    logger.error(err);
                    return cb(err);
                  };
                  newContract = data;
                  return cb();
                }); //,
                logger.debug("< ChangeContract >");
              });
            } else {
              logger.debug("< SameContract >");
              return cb();
            }
          }

        },

      ], function(err) {
        if (err) {
          logger.error(err);
          return;
        };
        var period = self.curPeriod;
        if (newContract) {
          self.curContract = newContract;
          period = '1.RealTime';
        };
        // 用远程的数据初始化。
        /// @todo obj.curContract 没有最新的数据，会导致切后延迟感觉。
        // cctest从历史数据中获取，无五档
        self.setBasic(self.curContract);
        self.switchPeriod(period, true);
        self.setBidSell(self.curContract.buy, self.curContract.sell);
        self._app.dataManager.addTickObserver(self.curContract.key, self);
        self._app.tradingPanel.selectContract(self.curContract, true,
          function(err) {
            if (err) {
              logger.error(err);
            };
          });
        cbk(self.curContract);
      });
    },

    onTick: function(data) {
      /// @todo ...
      if (this.curContract.key != data.key) {
        return;
      };
      this.setBasic(data);
      this.setBidSell(data.buy, data.sell);
      // 用来计算可买股数。
      if (this._app.tradingPanel.toTradeContract == this.curContract.key) {
        this._app.tradingPanel.updateContractBidSell(data.buy, data.sell);
      };
    },

    setBasic: function(data) {
      // console.log('######## 股票基本信息 ########')
      // console.log(data);

      if (!data.isStock && (this.basicInfo.name == key2name[data.key])) {
        this.basicInfo.low = Math.min(this.basicInfo.price, data.price);
        this.basicInfo.high = Math.max(this.basicInfo.price, data.price);
        this.basicInfo.price = data.price;
        this._ee.emitEvent('onBasic', [this.basicInfo]);
        return void 0;
      };

      toFloatAttribute(data, ['price', 'open', 'high', 'preClose', 'low']);
      this.basicInfo = {
        name: key2name[data.key],
        symbol: data.key.toUpperCase(),
        tags: ['港股通', '分类'],
        /*date: '08/16 17:33:56',*/
        date: moment(data.time).format("MM/DD HH:mm:ss"),
        /*<td>最高价： <td>开盘价： <td>成交量： <td>振  幅： <td>量  比： <td>平均价：
          <td>最低价： <td>昨收价： <td>成交额： <td>委  比： <td>市盈率： <td>换手率：
          <td>市  值：*/
        info: {
          price: data.close,
          diff: (data.close - data.preClose).toFixed(2),
          change: ((data.close - data.preClose) / data.preClose * 100).toFixed(2) + "%",
          high: data.high,
          open: data.open,
          volume: data.volume,
          zf: 2.661,
          lb: 0.820,
          pjj: 48.2760,
          low: data.low,
          preClose: data.preClose,
          turnOver: 1.572,
          wb: 27.93,
          totalPrice: data.totalPrice,
          syl: 4.059,
          hsl: 0.11,
        },
      };
      fixAttributePrecision(this.basicInfo.info, ['price', 'open', 'high', 'preClose', 'low']);

      this._ee.emitEvent('onBasic', [this.basicInfo]);
    },

    // 设置买卖盘
    setBidSell: function(buys, sells) {
      // 买档
      this.buys = buys;
      this.sells = sells;
      var bVolume = 0,
        sVolume = 0;
      for (var i = 0; i < this.buys.length; i++)
        bVolume += this.buys[i].volume;
      for (var i = 0; i < this.sells.length; i++)
        sVolume += this.sells[i].volume;

      if (bVolume == 0 && sVolume == 0) {
        this.bidPercent = '-';
        this.sellPercent = '-';
      } else {
        this.bidPercent = ((bVolume - sVolume) / (bVolume + sVolume) * 100).toFixed(1);
        this.sellPercent = bVolume - sVolume;
      }
      this.buys = _.map(this.buys, function(buy) {
        if (buy.price > 0) {
          return {
            price: parseFloat(buy.price).toFixed(2),
            volume: parseFloat(buy.volume).toFixed(0),
          };
        };
        return {
          price: '-',
          volume: '-'
        }
      });
      this.sells = _.map(this.sells, function(sell) {
        if (sell.price > 0) {
          return {
            price: parseFloat(sell.price).toFixed(2),
            volume: parseFloat(sell.volume).toFixed(0),
          }
        };
        return {
          price: '-',
          volume: '-'
        }
      });
      this._ee.emitEvent('onBidSell', [this.buys, this.sells]);
    },

  };

  return KWindow;
})();