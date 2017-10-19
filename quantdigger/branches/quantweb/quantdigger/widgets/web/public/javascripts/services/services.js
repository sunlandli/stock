// define(['../app', '../message', '../libs/loglevel'], function(app, Message, logger) {

  'use strict';

log.setLevel('debug');
var PRECISION = 1;
var logger = log;
var flogger= new FuncDebug(log);

var Application = (function Application() {
  function Application(loc) {
    /*this.events = new QEvent();*/
    this.trader = new Trader();
    this.dataManager = new DataManager(loc);
    this.tradingPanel = new TradingPanel(this);
    this.accountManager = new AccountManager(this);
    this.roomKWindow = new KWindow(this);

    this.followList = []; // 跟投
    this.prepared = false;
    // 当前用户信息
    this.user = gUser;
    this.indexContract = indexContract;
  }

  Application.prototype = {
    constructor: Application,
    get curAccount() { return this.accountManager.curAccount; },
    get myAccounts() { return this.accountManager.myAccounts; },
    get transItems () { return this.accountManager.transItems; },
    get orderItems () { return this.accountManager.orderItems; },
    get positionItems() { return this.accountManager.positionItems; },

    /**
     * 登录交易系统
     */
    batchLogin: function(ip, port, brokerId, futureAccount, stockAccount,
                         futurePsw, stockPsw, productPsw, futureApi, stockApi, cbk) {
      var self = this;
      this.dataManager.getMyProduct(function (err, products) {
        if (err) {
          logger.error(err);
          return cb(err);
        };
        if (products) {
          async.each(products, function (product, cb) {
            if (product.isSimulate) {

              self.trader.login(ip, port, brokerId, product._id,
                product._id, product._id,
                futurePsw, stockPsw, productPsw,
                futureApi, stockApi,
                function (err, rst) {
                  if (err) {
                    return cb(err);
                  };
                  cb();
                });
            } else {
              cb();
            }

          }, function (err) {
            if(err) {
              flogger.debug("batchLogin", null, null, err);
              logger.error(err);
              return cbk(err);
            }
            flogger.debug("batchLogin", null, 'sucess');
            // 登录默认账号
            /// @todo default设置放到后台中, 和前台的curaccoutn设置分离。
            if (products.length == 1) {
              self.accountManager.setCurrentAccount(products[0])
            } else {
              var p = _.findWhere(products, { isDefault: true });
              var account = (p ? p : products[0]);
              self.accountManager.setCurrentAccount(account)
            }
            return cbk(null, 'sucess');
          });
        };
      });
    },

    addObserver: function (name, obsv) {
      switch(name) {
        case 'room': {
          this.accountManager.addObserver("onPosition",
                                              obsv.onPosition.bind(obsv));
          this.accountManager.addObserver("onCancelOrder",
                                                obsv.onCancelOrder.bind(obsv));
          this.accountManager.addObserver("onUpdateOrderAndTransactions",
                                              obsv.onUpdateOrderAndTransactions.bind(obsv));
          this.accountManager.addObserver("onCaptial", obsv.onCaptial.bind(obsv));
          this.accountManager.addObserver("onCurAccount", obsv.onCurAccount.bind(obsv));
          this.accountManager.addObserver("onFollow", obsv.onFollow.bind(obsv));
          this.tradingPanel.addObserver('onSelectContract', obsv.onSelectContract.bind(obsv));
          this.accountManager.initialize();
          this.roomKWindow.addObserver('onBasic', obsv.onBasic.bind(obsv));
          this.roomKWindow.addObserver('onBidSell', obsv.onBidSell.bind(obsv));
          this.roomKWindow.addObserver('onBarReady', obsv.onBarReady.bind(obsv));
          this.roomKWindow.addObserver('onBarTick', obsv.onBarTick.bind(obsv));
          this.roomKWindow.addObserver('onBarNew', obsv.onBarNew.bind(obsv));
          break;
        }

        case 'home': {
          this.accountManager.addObserver('onCaptial', obsv.onCaptial.bind(obsv));
          break;
        }
        default:
          throw "err.............";
      }
    },

    /**
     * 转发交易回调到各个控制模块。
     */
   transmitMessage: function() {
      var self = this;
      self.trader.onPosition(function (err, data) {
        /// @todo 同时只有一个持仓订阅， 可优化。
        var positions = data.pos;
        if (err) {
          logger.error(err);
          return;
        };
        if (data.productId != self.accountManager.curAccount._id)
        return;
        self.accountManager.onPosition(data.pos);
      });


      // this.dataManager.onManualFollow(function (data) {
      //   // logger.info("onManualFollow", data);
      //   console.log('###### 手动跟投onManualFollow ######');
      //   console.log(data);
      //   self.accountManager.onFollow("manual", data);
      // });

      this.dataManager.onAutoFollow(function (data) {
        // logger.info("onAutoFollow", data);
        console.log('###### 自动跟投 ######');
        console.log(data);
        if (data.creator == gUser.id) {
          // 组合跟投
          logger.debug("组合自跟投");
          return;
        };
        self.accountManager.onFollow("auto", data);
      });

      this.dataManager.onFocusFollow(function (data) {
        // logger.info("onFocusFollow", data);
        console.log('###### 手动跟投onFocusFollow ######');
        console.log(data);
        self.accountManager.onFollow("focus", data);
      });

      // 报单回调
      self.trader.onOrder(function (err, data) {
        console.log("onOrder.....");
        console.log(data);
        if (err) {
          logger.error(err);
          return;
        };
        // 判断account是否和当前一样, 辨别是自己的单，还是跟投对象的单。
        if (data.productId != self.accountManager.curAccount._id) {
          var isMine = _.findWhere(self.accountManager.myAccounts, { _id: data.productId });
          if (isMine) {
            return;
          };
          logger.error("order productId:", data.productId);
          logger.error("account:", self.accountManager.curAccount._id);
          logger.error("receive onOrder of other account");
          logger.error("receive onOrder of other account");
          return;
        }
        self.accountManager.onOrder(data.data, data.productId, data.loginId);
      });

      // 撤单回调
      self.trader.onCancelOrder(function (err, data) {
        /// @todo 撤单失败的影响
        logger.debug("onCancelOrder", data);
        if (err) {
          logger.error(err);
          return;
        };
        if (data.productId != self.accountManager.curAccount._id) {
          logger.debug("receive onCancelOrder of other account");
          return;
        }
        self.accountManager.onCancelOrder(data.order)
      });

      // 成交回调
      self.trader.onTransaction(function (err, data) {
        console.log("onTransaction.....");
        if (err) {
          logger.error(err);
          return;
        };
        if (data.productId != self.accountManager.curAccount._id) {
          var isMine = _.findWhere(self.accountManager.myAccounts, { _id: data.productId });
          if (isMine) {
            return;
          };
          logger.error("trans productId:", data.productId);
          logger.error("curAccount:", self.accountManager.curAccount._id);
          logger.error("receive onTransaction of other account");
          return;
        }
        self.accountManager.onTransaction(data.data);
      });

      self.trader.onTransToday(function (err, data) {
        logger.debug("onTransToday: ", data);
        if (err) {
          logger.error(err);
          return;
        };
        if (data.productId != self.accountManager.curAccount._id) {
          logger.error("receive trans of other account");
          logger.error(data.productId, self.accountManager.curAccount._id);
          logger.error("receive trans of other account");
          return;
        };
        self.accountManager.onTransToday(data.transList);
      });

      self.trader.onOrderToday(function (err, data) {
        logger.debug("onOrderToday: ", data);
        if (err) {
          logger.error(err);
          return;
        };
        if (data.productId != self.accountManager.curAccount._id) {
          logger.error("receive orders of other account");
          return
        };
        self.accountManager.onOrderToday(data.orderList, data.productId);
      });

      self.trader.onCaptial(function (err, data) {
        /*logger.debug("onCaptial: ", data);*/
        if (err) {
          logger.error(err);
          return;
        };
        self.accountManager.onCaptial(data);
      });
    },

    /**
     * 用户登录后，做交易前的准备。
     */
    prepareTrading: function () {
      if (this.prepared) {
        return;
      };
      this.prepared = true;
      this.dataManager.connect();
      this.trader.connect();
      // this.accountManager.initialize();
      this.dataManager.getAllContract(function (err, allContracts) {
        for (var i = 0; i < allContracts.length; i++) {
          var c = allContracts[i];
          key2name[c.key] = c.name;
        };
      });
      // 登录
      this.batchLogin('127.0.0.1', '6379', 'xgban',
          '123', '123',
          'futurePsw', 'stockPsw', 'subPsw',
          'futureSimulate', 'stockSimulate',
          function (err, rtn) {
            if (err) {
              throw err;
            };
            console.log('登录成功');
      });
      this.transmitMessage();
    },


  };
  return Application;

})();


angular.module('app.services', [])

  .constant('TABLE_MODEL', {
    pCols: [
      { title:'组合名称', name:'name', width: 80, align:'left', sortable: true, renderer: function(val, item, index) {
        if (typeof angular == 'undefined') {
          return '<a class="f16" href="/sp/'+ item.pid +'" title="' + val + '">'+ val +'</a><br><span style="font-size: 12px;color: #999;">' + item.pid + '</span>'
        } else {
          return '<a class="f16" href="#/rank/detail/'+ item.pid +'" title="' + val + '">'+ val +'</a><br><span style="font-size: 12px;color: #999;">' + item.pid + '</span>'
        }
      }},
      { title:'获利总额', name:'captial.equity', width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        var value = item.captial.equity - item.captial.initEquity;
        return highlihtNormal(value);
      }},
      { title:'总收益率', name:'captial.equity', width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        var value = ((item.captial.equity - item.captial.initEquity)/item.captial.initEquity*100);
        return highlihtPercent(value);
      }},
      { title:'净值', name:'captial.equity', width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        var value = item.captial.equity / item.captial.initEquity;
        return fixed2(value);
      }},
      { title:'回撤率', name:'statics.maxDrawDown', width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        var value = item.statics.maxDrawDown;
        return highlihtPercent(value);
      }},
      { title:'夏普率', name:'statics.sharpeRatio', width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        var value = item.statics.sharpeRatio;
        return highlihtPercent(value);
      }},
      { title:'跟投人数', name:'totalFollowersAccount', width: 30, align:'center', sortable: true},
      { title:'跟投获利', name:'realtimeFollowingProfit', width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        var value = val;
        return highlihtNormal(value);
      }},
      { title:'交易次数', name:'statics.tradingNum' ,width: 30, align:'center', sortable: true, renderer: function(val, item, index) {
        return item.statics.tradingNum;
      }},
      { title:'收益曲线图', name:'' ,width: 30, align:'center', renderer: function(val, item, index) {
        return '<div id="'+ item.pid + 'A' + index + '" style="width: 100%; height: 50px;"></div>';
      }},
      { title:'跟投', name:'', width: 30, align:'center', renderer: function(val, item, index) {
        if (item.isF) {
          return '<button class="btnFollowProduct btn-follow-p yes" type="button" data-id="'+ item._id +'">取消</button>';
        } else {
          return '<button class="btnFollowProduct btn-follow-p no" type="button" data-id="'+ item._id +'">跟投</button>';
        }
      }}
    ],
    uCols: [
      { title:'用户名称', name:'name.first', width: 80, align:'left', sortable: true, renderer: function(val, datas, index) {
        if (typeof angular == 'undefined') {
          return '<img src="' + datas.avatar + '" style="width: 36px;height: 36px;border-radius: 50%;margin-right: 10px;">'+'<a href="/global/u/'+ datas._id +'" title="' + datas.name.first + '">'+ datas.name.first +'</a>'
        } else {
          return '<img src="' + datas.avatar + '" style="width: 36px;height: 36px;border-radius: 50%;margin-right: 10px;">'+'<a href="#/user/'+ datas._id +'" title="' + datas.name.first + '">'+ datas.name.first +'</a>'
        }
      }},
      { title:'产品数量', name:'trading.curProductsAccount', width: 80, align:'center', sortable: true, renderer: function(val, datas, index) {
        return datas.trading.curProductsAccount;
      }},
      { title:'获利总额', name:'trading.realtimeTotalProfit', width: 80, align:'center', sortable: true, renderer: function(val, datas, index) {
        var value = datas.trading.realtimeTotalProfit;
        return highlihtNormal(value);
      }},
      { title:'跟投获利总额', name:'trading.realtimeFollowingProfit', width: 80, align:'center', sortable: true, renderer: function(val, datas, index) {
        var value = datas.trading.realtimeFollowingProfit;
        return highlihtNormal(value);
      }},
      { title:'交易获利总额', name:'trading.realtimeTradingProfit', width: 80, align:'center', sortable: true, renderer: function(val, datas, index) {
        var value = datas.trading.realtimeTradingProfit;
        return highlihtNormal(value);
      }},
      { title:'交易次数', name:'trading.tradingNum' ,width: 80, align:'center', sortable: true, renderer: function(val, datas, index) {
        return datas.trading.tradingNum;
      }}
      // { title:'粉丝人数', name:'statics.tradingNum' ,width: 80, align:'center', sortable: true, renderer: function(val, datas, index) {
      //   return datas.statics.tradingNum;
      // }}
    ]
  })

  // 账户
  .factory('AuthService', function ($http, Session) {
    var authService = {};
    // 注册
    authService.join = function (data) {
      return $http
        .post('/api/account/join/', data)
        .then(function (res) {
          return res.data;
        });
    };
    // 激活
    authService.activate = function (data) {
      return $http
        .post('/api/account/activate/', data)
        .then(function (res) {
          return res.data;
        });
    };
    // 登录
    authService.login = function (data) {
      return $http
        .post('/api/account/login/', data)
        .then(function (res) {
          // Session.create(res.data.user._id, res.data.user._id, '*');
          return res.data;
        });
    };
    // 退出
    authService.logout = function () {
      return $http
        .get('/api/account/logout/', {})
        .then(function (res) {
          return res.data;
        });
    };
    // 找回密码
    authService.findpw = function (data) {
      return $http({
        method: 'GET',
        url: '/api/account/findpw/',
        params: data
      }).then(function (res) {
        return res.data;
      }, function(res) {
        return res.data;
      });
    };
    // 找回密码
    authService.resetpw = function (data) {
      return $http({
        method: 'POST',
        url: '/api/account/resetpw/',
        data: data
      }).then(function (res) {
        return res.data;
      }, function(res) {
        return res.data;
      });
    };
    // 获取用户资料
    authService.getProfile = function (data) {
      return $http({
        method: 'GET',
        url: '/api/user/profile/',
        params: data
      }).then(function (res) {
        return res.data;
      }, function(res) {
        return res.data;
      });
    };

    // 设置用户资料
    authService.setProfile = function (data) {
      return $http({
        method: 'POST',
        url: '/api/user/profile/',
        data: data
      }).then(function (res) {
        return res.data;
      }, function(res) {
        return res.data;
      });
    };

    // 设置用户资料
    authService.setProfile = function (data) {
      return $http({
        method: 'POST',
        url: '/api/user/profile/',
        data: data
      }).then(function (res) {
        return res.data;
      }, function(res) {
        return res.data;
      });
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return authService;
  })

  .service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };
    return this;
  })

  .factory('util', function() {
    log.setLevel('debug');
    var PRECISION = 1;

    return {

      logger: log,

      log: log,

      flogger: new FuncDebug(log),

      fixAttributePrecision: function (obj, attrs, precision) {
        if (!precision) {
          precision = PRECISION;
        };
        attrs.forEach(function (attr) {
          obj[attr] = parseFloat(obj[attr]).toFixed(precision);
        })
      },

      deepCopy: function (source) {
        return JSON.parse(JSON.stringify(source));
      },
    }
  })




.factory('application', function(util, $location) {
    var app = new Application($location);
    return app;
  })

  .factory('room', function(util, application) {
    var flogger = util.flogger;
    var logger = util.logger;
    var obj = {
      legend: "1.RealTime",
      realTimeData : [],
      kData : [],
      scope: null,
      curContract: null,
      account: null,
      curPbar: null,    // 决定数据源， scope决定是否是画实时数据, 还是k线。
      curPeriod: null,
      cachePbars: { },   // 无序
    };


    return {

      legend: obj.legend,
      get curContract() { return obj.curContract; },
      get account() { return obj.account; },
      get curPeriod() { return obj.curPeriod; },
      get curPbar() { return obj.curPbar; },

      setCurContract: function (contract) {
        obj.curContract = contract;
      },

      setCurPeriod: function (period) {
        obj.curPeriod = period;
      },


    }

  })

  .factory('web', function(util, application, room) {
    var flogger = util.flogger;
    var logger = util.logger;

    var obj = {
      scope: null,
      getMyProduct: function (cbk) {
        application.dataManager.getMyProduct(function (err, products) {
          // 深拷贝的化loginId可能不会及时赋值。
          // 可把深拷贝放到service里面。
          if (err) {
            throw err;
          };
          application.accountManager.myAccounts = products;
          cbk(err, application.accountManager.myAccounts);
        });
      },

    };

    return {

      followContract: function (ckey, cb) {
        application.dataManager.followContract(ckey, cb);
      },


      followProduct: function (ckey, cb) {
        application.dataManager.followProduct(ckey, cb);
      },

      removeProduct: function(id, cb) {
        application.trader.logout(id, function (err, data) {
          if (err) {
            return cb(err, null);
          };
          application.dataManager.removeProduct(id, cb);
        });
      },


      getMyContract: function (cbk) {
        application.dataManager.getMyContract(function (err, contracts) {
          // 格式化数据
          if (contracts) {
            contracts = util.deepCopy(contracts);
            contracts.forEach(function (c) {
              util.fixAttributePrecision(c, ['open', 'close', 'high', 'low', 'preClose', 'change'], 2);
            });
            contracts.forEach(function (c) {
              console.log(c.key);
            })
          };
          cbk(err, contracts);
        });
      },

      getProduct: function (id, cb) {
        return application.dataManager.getProduct(id, cb);
      },

     getMyProduct: obj.getMyProduct,

     getFollowProduct: function (cbk) {
        application.dataManager.getFollowProduct(function (err,data) {
          if (data) {
            data = util.deepCopy(data);
            /// @todo 格式化数据
          };
          cbk(err, data);
        });
     },

     createProduct: function (form, cbk) {
        application.dataManager.createProduct(form, cbk);
     },

    addMyContract: function(contract, observer, cbk) {
      application.dataManager.addMyContract(contract, observer, function (err, contracts) {
        if (contracts) {
          contracts = util.deepCopy(contracts);
          contracts.forEach(function (c) {
            util.fixAttributePrecision(c, ['open', 'close', 'high', 'low', 'preClose', 'change'], 2);
          })
        };
        cbk(err, contracts);
      });
    },

    /** 获取并订阅自选合约 */
    showMyContract: function (observer, cbk) {
      application.dataManager.getMyContract(function (err, contracts) {
        if (err) {
          logger.error(err);
          throw err;
        };
        if (contracts) {
          var keys = _.map(contracts, function (c) { return c.key; });
          contracts = util.deepCopy(contracts);
          contracts.forEach(function (c) {
            util.fixAttributePrecision(c, ['open', 'close', 'high', 'low', 'preClose', 'change'], 2);
          })
          cbk(null, contracts);
          // 订阅自选合约
          application.dataManager.reqBatchTick(keys, observer, function (err) {
            if (err)
            logger.error("订阅自选合约失败！");
          });
          return;
        };
        cbk(null, []);
      });
    },

  showIndexContract: function (keys, observer, cbk) {
      application.dataManager.getBatchContract(keys, function (err, contracts) {
        if (err) {
          throw err;
        };
        if (contracts) {
          var keys = [];
          contracts.forEach(function (c) {
            keys.push(c.key);
          });
          contracts = util.deepCopy(contracts);
          contracts.forEach(function (c) {
            util.fixAttributePrecision(c, ['open', 'close', 'high', 'low', 'preClose', 'change', 'diff'], 2);
          })
          cbk(null, contracts);
          application.dataManager.reqBatchTick(keys, observer, function (err) {
            if (err)
            logger.error("订阅指数合约失败！");
          });
          return;
        };
        cbk(null, []);
      });
  },


  onBroadcastOrder: function (cbk) {
    application.dataManager.onBroadcastOrder(cbk);
  },

  }})


/// @todo 删除trader service
  .factory('trader', function($location, room, web, application) {
      var trader = application.trader;
      return {



      }
  })

// });

