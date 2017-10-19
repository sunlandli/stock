// Copyright 2015 QuantFans Inc. All Rights Reserved.
/**
 * @fileoverview 前端交易模块的数据源
 * 
 * @author wondereamer(dingjie.wang@foxmail.com)
 */

log.setLevel('debug');
var flogger = new FuncDebug(log);
var logger = log;
var PRECISION = 2;


function fixAttributePrecision(obj, attrs, precision) {
  if (!precision) {
    precision = PRECISION;
  };
  attrs.forEach(function(attr) {
    obj[attr] = parseFloat(obj[attr]).toFixed(precision); // 字符串
  })
};

function toFloatAttribute(obj, attrs) {
  attrs.forEach(function(attr) {
    obj[attr] = parseFloat(obj[attr]);
  })
};

var Server = (function Server() {

  function Server() {
    this._web = null;
    this._myContracts = [];
    this._myProducts = [];
    this._followProducts = [];
    this._allContracts = [];
    this._curAccount = null;
    this._connected = false;
  }

  Server.prototype = {

    constructor: Server,

    connect: function() {
      if (!this.connected) {
        var socket4 = io.connect('http://www.xgban.com:' + window.location.port + '/web', {
          query: "username=" + gUser.username +
            "&&id=" + gUser.id +
            "&&password=" + gUser.password
        });
        this._web = new Message(socket4, "socket4");
        this._connected = true;
      };
    },

    get curAccount() {
      return this._curAccount;
    },
    get myProducts() {
      return this._myProducts;
    },
    set curAccount(a) {
      this._curAccount = a;
    },

    setDefaultAccount: function(id) {

      this._web.remoteCall("setDefaultAccount", {
        "target": id
      }, function(rst) {});

      var self = this;
      this.getMyProduct(function(err, myAccounts) {
        myAccounts.forEach(function(acc) {
          acc.isDefault = false;
        })
        var target = _.find(myAccounts, function(acc) {
          return acc._id == id;
        })
        target.isDefault = true;
        self._curAccount = target;
      });
    },

    updateAccount: function(id, loginId) {
      var acc = _.find(this._myProducts, function(acc) {
        return acc._id == id;
      })
      if (acc) {
        acc.loginId = loginId;
        return true;
      };
      return false;
    },



    /**
     * @brief 添加或删除自选合约
     *
     * @param c {{ Contract/String }} 目标合约或它key
     * @param cb 回调函数
     *
     * @return 
     */
    followContract: function(c, cbk) {
      // note c是从allcontract进来的，非完全合约。
      // 字符串key
      var target = ((typeof c) == 'string' ? c : c.key);
      var self = this;
      this._web.remoteCall("followContract", {
        "target": target
      }, function(rst) {
        if (rst.errmsg) {
          throw rst.errmsg
        };;

        if (rst.rst.follow) {

          self.getContract(c.key, function(err, contract) {
            if (err) {
              throw err;
            };
            logger.debug('添加到self._myContracts中');
            self._myContracts.push(contract);
            /*console.log("((()))" );*/
            /*console.log(contract);*/
            /*throw "eeeeeeeeeeeeee" */
            flogger.debug("followContract", target, 'sucess', rst.errmsg);
            cbk(rst.errmsg, rst.rst);
          })

        } else {
          // 删除key
          for (var i = 0; i < self._myContracts.length; i++) {
            if (self._myContracts[i].key == target) {
              self._myContracts = self._myContracts.splice(i, 1);
              break;
            };
          };
          flogger.debug("followContract", target, 'sucess');
          return cbk(null, rst.rst);
        }
      })
    },

    /** 关注和取消关注某个产品 */
    followProduct: function(id, cb) {
      var self = this;
      this._web.remoteCall("followProduct", {
        "target": id
      }, function(rst) {
        if (rst.errmsg == "") {
          flogger.debug("followProduct", id, 'sucess');
          if (rst.rst.follow) {
            logger.debug('添加到self._followProducts中', self._followProducts.length);
            self._followProducts.push(rst.product);
            logger.debug('.....', self._followProducts.length);
          } else {
            logger.debug('从self._followProducts中删除');
            for (var i = 0; i < self._followProducts.length; i++) {
              if (self._followProducts[i]._id == id) {
                self._followProducts = self._followProducts.splice(i, 0);
                break;
              };
            };
            logger.debug("aaaaa", self._followProducts);
          }
          return cb(null, rst.rst);
        };
        flogger.debug("followProduct", id, 'failed', rst.errmsg);
        cb(rst.errmsg, rst.rst);
      })
    },

    /** 创建实盘账号 */
    createRealProduct: function(product, cb) {
      var self = this;
      this._web.remoteCall("createRealProduct", {
        'product': product
      }, function(rst) {
        if (rst.errmsg) {
          flogger.debug("createRealProduct", product, 'failed', rst.errmsg);
          return cb(rst.errmsg, null);
        };
        flogger.debug("createRealProduct", product, rst.product);
        self._myProducts.push(rst.product);
        return cb(null, rst.product);
      });
    },

    /** 添加自创产品 */
    createProduct: function(product, cb) {
      var self = this;
      this._web.remoteCall("createProduct", {
        'product': product
      }, function(rst) {
        if (rst.errmsg) {
          flogger.debug("createProduct", product, 'failed', rst.errmsg);
          return cb(rst.errmsg, null);
        };
        flogger.debug("createProduct", product, rst.product);
        self._myProducts.push(rst.product);
        return cb(null, rst.product);
      });
    },

    /** 删除自创产品 */
    removeProduct: function(id, cb) {
      var self = this;
      this._web.remoteCall("removeProduct", {
        'id': id
      }, function(rst) {
        if (rst.errmsg) {
          flogger.debug("removeProduct", id, 'failed', rst.errmsg);
          return cb(rst.errmsg, null);
        };
        for (var i = 0; i < self._myProducts.length; i++) {
          if (self._myProducts[i]._id == id) {
            self._myProducts = self._myProducts.splice(i, 1);
            break;
          }
        };
        flogger.debug("removeProduct", id, 'sucess');
        return cb(null, id);
      });
    },

    // --------------------- gettter ---------------------------

    /** 获取所有合约 */
    getAllContract: function getAllContract(cb) {
      if (this._allContracts.length > 0) {
        return cb(null, this._allContracts);
      };
      var self = this;
      this._web.remoteCall("getAllContract", {}, function(rst) {
        if (rst.errmsg == "") {
          flogger.debug("getAllContract", null, 'sucess', rst.errmsg);
          var arrayContracts = rst.contracts;
          var objContracts = [];
          for (var i = 0; i < arrayContracts['code'].length; i++) {
            objContracts.push({
              key: (arrayContracts['code'][i] + '.' + arrayContracts['exchangeId'][i]).toUpperCase(),
              code: arrayContracts['code'][i] ? (arrayContracts['code'][i]).toUpperCase() : arrayContracts['code'],
              name: arrayContracts['name'][i],
              pinyin: arrayContracts['pinyin'][i],
              isStock: arrayContracts['isStock'][i],
            });
          };
          self._allContracts = objContracts;
          return cb(null, objContracts);
        };
        flogger.debug("getAllContract", null, 'failed', rst.errmsg);
        cb(rst.errmsg, []);
      });
    },

    /** 获取自选合约 */
    getMyContract: function(cbk) {
      /*if (this._myContracts.length > 0) {*/
      /*return cbk(null, this._myContracts);*/
      /*};*/
      // 2此请求才拿到结果！
      var self = this;
      this._web.remoteCall("getMyContract", {}, function(rst) {
        if (rst.errmsg == "") {
          self._myContracts = rst.followings;
          var mycontracts = [];
          async.each(self._myContracts, function(c, cb) {
            self.getContract(c.key, function(err, contract) {
              if (err) {
                throw err;
              };
              // c = contract; 改动无效！
              mycontracts.push(contract);
              cb();
            })
          }, function(err) {
            self._myContracts = _.sortBy(mycontracts, function(c) {
              return c.key;
            });
            flogger.debug("getMyContract", null, rst, rst.errmsg);
            return cbk(null, self._myContracts);
          });
        };
      });

    },

    /** 获取我关注的产品 */
    getFollowProduct: function(cb) {
      var self = this;
      /*if (this._followProducts.length > 0) {*/
      /*return cb(null, this._followProducts);*/
      /*};*/
      this._web.remoteCall("getFollowProduct", {}, function(rst) {
        flogger.debug("getFollowProduct", null, rst, rst.errmsg);
        if (rst.errmsg == "") {
          return cb(null, rst);
        };
        self._followProducts = rst.followings;
        cb(rst.errmsg, []);
      });
    },

    /** 获取我的产品 */
    getMyProduct: function(cb) {
      /*if (this._myProducts.length > 0) {*/
      /*return cb(null, this._myProducts);*/
      /*};*/
      var self = this;
      this._web.remoteCall("getMyProduct", {}, function(rst) {
        flogger.debug("getMyProduct", null, rst, rst.errmsg);
        if (rst.errmsg) {
          return cb(rst.errmsg, []);
        };
        self._myProducts = _.sortBy(rst.products, function(p) {
          return p.created;
        });
        /*self._myProducts.forEach(function (p) {*/
        /*console.log(p.productId);*/
        /*});*/
        return cb(null, rst.products);
      });
    },

    /** 获取产品 */
    getProduct: function(id, cb) {
      this._web.remoteCall("getProduct", {
        'pid': id
      }, function(rst) {
        if (rst.errmsg == '') {
          flogger.debug("getProduct", id, rst.product, '');
          return cb(null, rst.product);
        };
        flogger.debug("getProduct", id, 'failed', rst.errmsg);
        return cb(rst.errmsg, null);
      });
    },

    /** 获取产品 */
    getContract: function(ckey, cb) {
      var defaultKey = '000001.sse';
      ckey = (ckey ? ckey : defaultKey);
      ckey = ckey.toLowerCase();
      $.ajax({
        url: 'http://120.24.222.183:12008/reqPrice', // 深圳
        //url: 'http://10.44.82.83:12008/reqPrice',
        type: 'get', //数据发送方式
        dataType: 'json', //接受数据格式
        data: {
          requestId: 1,
          contract: ckey,
          period: '1.Day'
        },

        success: function(data) {
          /*throw "eeeeeeeeeee";*/
          if (data.errmsg) {
            throw data.errmsg;
          };
          c = data.data;
          /*console.log("**********");*/
          /*console.log(data);*/
          /*console.log("**********");*/
          c.key = c.contract.toUpperCase();
          toFloatAttribute(c, ['open', 'close', 'volume', 'preClose', 'high', 'low']);
          c.change = ((c.close - c.preClose) / c.preClose * 100);
          c.diff = c.close - c.preClose;
          var exId = c.contract.split(".")[1].toUpperCase();
          c.isStock = (exId == 'SSE' || exId == 'SZSE' ? true : false);
          /*c.buy = [];*/
          /*c.sell = [];*/
          c.buy = c.buy.map(function(elem) {
            return {
              price: parseFloat(elem.price),
              volume: parseFloat(elem.volume)
            }
          });
          c.sell = c.sell.map(function(elem) {
            return {
              price: parseFloat(elem.price),
              volume: parseFloat(elem.volume)
            }
          });
          if (c.key.toUpperCase() == 'CCTEST.SSE') {
            var t = {
              price: parseFloat(c.close),
              volume: 0
            };
            c.sell = [t, t, t, t, t];
            c.buy = [t, t, t, t, t];
          };
          flogger.debug("getContract", ckey, c);
          cb(null, c);
        },
        error: function(err) {
          throw new Error("获取合约失败！" + ckey);
        },
      });
    },

    getAllProduct: function(rank, cb) {
      this._web.remoteCall("getAllProduct", {}, function(rst) {
        flogger.debug("getAllProduct", rank, rst, rst.errmsg);
        if (rst.errmsg == "") {
          /*for (var i = 0; i < rst.products.length; i++) {*/
          /*rst.products[i]['follow']=rst.ifFollow[i];*/
          /*};*/
          return cb(null, rst.products);
        };
        cb(rst.errmsg, []);
      });
    },

    getAllProductSnap: function(cb) {
      this._web.remoteCall("getAllProductSnap", {}, function(rst) {
        flogger.debug("getAllProductSnap", null, null, rst.errmsg);
        if (rst.errmsg == "") {
          return cb(null, rst.products);
        };
        cb(rst.errmsg, []);
      });
    },

    onBroadcastOrder: function(cb) {
      this._web.registerHandler("onBroadcastOrder", function(data) {
        cb(null, data);
      });
    },

    onManualFollow: function(cb) {
      this._web.registerHandler("onManualFollow", function(data) {
        cb(data);
      });
    },

    onAutoFollow: function(cb) {
      this._web.registerHandler("onAutoFollow", function(data) {
        cb(data);
      });
    },

    onFocusFollow: function(cb) {
      this._web.registerHandler("onFocusFollow", function(data) {
        cb(data);
      });
    },

    addMyContract: function(contract, cb) {

      /// @todo 添加重复的自选股的时候，会有闪说，因为ONtick没有更新后台自选股！
      var self = this;
      this.getMyContract(function(err, contracts) {
        if (err) {
          throw err;
        };
        var exist = _.findWhere(contracts, {
          key: contract.key
        });
        if (exist) {
          alert("已经存在该自选合约!");
          return cb(null, contracts);
        };
        self.followContract(contract, function(err, data) {
          if (err) {
            throw err;
          };
          if (data != undefined) {
            // 添加合约
            self.getMyContract(function(err, contracts) {
              return cb(err, contracts);
            });
          };
        });

      })
    },

  };

  return Server;
})();

var singleton = {
  server: new Server(),
};


var Quoter = (function Quoter() {

  function Quoter(dataManager) {
    /// @todo cache 用单例
    var R1_URL = 'http://120.24.51.147:3001/';
    /*var R2_URL = 'http://139.196.16.243:3001/';*/

    var rsocket1 = io.connect(R1_URL);
    //var rsocket2 = io.connect(R2_URL);  // 无
    this._source = [
      new Message(rsocket1, "rsocket1"),
      // new Message(rsocket2)
    ];
    // 绑定onTick到QuoteCache
    this._source.forEach(function(source) {
      // logger.debug("register on tick");
      source.registerHandler("onTick", function(tick) {
        dataManager.onTick(tick);
      });
    });
  }

  Quoter.prototype = {

    constructor: Quoter,

    reqTick: function(key, cbk) {
      // todo... 两次订阅的话，更新最新一次的url， requestId
      if (key == 'CCTEST.SSE')
        key = 'CCTEST.CC';
      key = key.toUpperCase();
      var args = {
        'contract': key
      };
      var okNum = 0;
      async.each(this._source, function(source, cb) {
        source.remoteCall('reqTick', args, function(rtn) {
          if (rtn.errmsg == "") {
            okNum += 1;
            flogger.debug("<reqTick>", args, 'sucess', rtn.errmsg);
          } else {
            flogger.debug("<reqTick>", args, 'failed', rtn.errmsg);
          }
          return cb();
        });

      }, function(err) {
        if (okNum = 0) {
          logger.error("number of datasource: " + 0);
          return cbk("all failed!");
        };
        logger.debug("number of datasource: " + okNum);
        return cbk(null, okNum);
      });

    },

  };

  return Quoter;
})();

/// @todo singleton, 避免socket多次创建产生错误。
var Trader = (function Trader() {

  function Trader() {
    this._msger = null;
  }

  Trader.prototype = {

    constructor: Trader,

    connect: function() {
      var B1_URL = '120.24.51.147:3005/';
      //var B1_URL = '120.24.51.36:3005/';  // old
      var socket3 = io.connect(B1_URL, {
        query: "username=" + gUser.username +
          "&&id=" + gUser.id +
          "&&password=" + gUser.password
      });
      this._msger = new Message(socket3, "socket3");
    },

    login: function(ip, port, brokerId, productId, futureAccount, stockAccount,
      futurePsw, stockPsw, productPsw, futureApi, stockApi, cb) {
      var username = 'wdjWeb';
      var args = {
        'ip': ip,
        'port': port,
        'brokerId': brokerId,
        'productId': productId,
        'futureAccount': futureAccount,
        'stockAccount': stockAccount,
        'futurePsw': futurePsw,
        'stockPsw': stockPsw,
        'productPsw': productPsw,
        'futureApi': futureApi,
        'stockApi': stockApi,
      };
      this._msger.remoteCall('login', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("login", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("login", args, rtn, rtn.errmsg);
        singleton.server.updateAccount(productId, rtn.loginId);
        cb(null, rtn);
      });
    },

    logout: function(productId, cb) {
      var args = {
        'productId': productId,
      };
      this._msger.remoteCall('logout', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("logout", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("logout", args, "Sucess", rtn.errmsg);
        cb(null, rtn);
      });
    },

    onPosition: function(cb) {
      this._msger.registerHandler("onPosition", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },

    onCaptial: function(cb) {
      /// @todo update account in DataManager
      this._msger.registerHandler("onCaptial", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },

    onTransToday: function(cb) {
      /// @todo update account in DataManager
      this._msger.registerHandler("onTransToday", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },

    onOrderToday: function(cb) {
      /// @todo update account in DataManager
      this._msger.registerHandler("onOrderToday", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },

    order: function(productId, loginId, followProductId, followLoginId, order, cb) {
      order.contract = order.contract.toUpperCase();
      var args = {
        'productId': productId,
        'loginId': loginId,
        'followLoginId': followLoginId,
        'followProductId': followProductId,
        'order': order
      };
      order.price = parseFloat(order.price);
      this._msger.remoteCall('order', args, function(rtn) {
        // console.log('######### 下单返回 #########');
        // console.log(rtn);
        if (rtn.errmsg) {
          flogger.debug("order", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("order", args, "Sucess", rtn.errmsg);
        cb(null, order);
      });
    },

    cancelOrder: function(productId, loginId, orderId, exchangeId, contract, cb) {
      var args = {
        'productId': productId,
        'loginId': loginId,
        'exchangeId': exchangeId,
        'orderId': orderId,
        'contract': contract,
      }
      this._msger.remoteCall('cancelOrder', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("cancelOrder", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("cancelOrder", args, "Sucess", rtn.errmsg);
        cb(null, rtn);
      });
    },

    cancelAllOrder: function(orders, cb) {
      /// @todo cancelAllOrder
    },

    reqCaptial0: function(productId, cb) {
      var args = {
        'productId': productId
      }
      this._msger.remoteCall('reqCaptial0', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("reqCaptial0", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("reqCaptial0", args, "Sucess", rtn.errmsg);
        cb(null, rtn);
      });
    },

    reqPosition0: function(productId, cb) {
      var args = {
        'productId': productId
      }
      this._msger.remoteCall('reqPosition0', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("reqPosition0", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("reqPosition0", args, "Sucess", rtn.errmsg);
        cb(null, rtn);
      });
    },

    orderToday: function(productId, cb) {
      var args = {
        'productId': productId
      }
      this._msger.remoteCall('orderToday', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("orderToday", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("orderToday", args, "Sucess", rtn.errmsg);
        cb(null, rtn.orderList);
      });
    },

    transToday: function(productId, cb) {
      var args = {
        'productId': productId
      };
      this._msger.remoteCall('transToday', args, function(rtn) {
        if (rtn.errmsg) {
          flogger.debug("transToday", args, "Failed", rtn.errmsg);
          cb(rtn.errmsg, null);
          return;
        };
        flogger.debug("transToday", args, "Sucess", rtn.errmsg);
        cb(null, rtn.transList);
      });
    },

    onOrder: function(cb) {
      this._msger.registerHandler("onOrder", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },

    onCancelOrder: function(cb) {
      this._msger.registerHandler("onCancelOrder", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },

    onTransaction: function(cb) {
      this._msger.registerHandler("onTransaction", function(data) {
        if (data.errmsg) {
          return cb(data.errmsg, data)
        };
        cb(null, data);
      });
    },


  };

  return Trader;
})();


var DataManager = (function DataManager() {

  function DataManager(loc) {
    this._quoter = new Quoter(this);
    this._cache = new QuoteCache(loc);
    this._server = singleton.server;
    this._connected = false;

    /*var allContracts= [ ];*/
    /*// 自选合约*/
    /*var myContracts = [];*/
    /*// 关注的产品*/
    /*var followProducts = [];*/
    /*// 我的产品*/
    /*var myProducts = [];*/
  }

  DataManager.prototype = {

    constructor: DataManager,
    get curAccount() {
      return this._server.curAccount;
    },
    get myProducts() {
      return this._server.myProducts;
    },
    set curAccount(v) {
      return this._server.curAccount = v;
    },
    set myProducts(v) {
      return this._server.myProducts = v;
    },

    connect: function() {
      if (!this._connected) {
        singleton.server.connect();
        this._connected = true;
      };
    },


    batchLogin: function(ip, port, brokerId, futureAccount, stockAccount,
      futurePsw, stockPsw, productPsw, futureApi, stockApi, cbk) {
      var self = this;
      this._server.getMyProduct(function(err, products) {
        if (err) {
          logger.error(err);
          return cb(err);
        };
        if (products) {
          async.each(products, function(product, cb) {
            self._server.login(ip, port, brokerId, product._id,
              futureAccount, stockAccount,
              futurePsw, stockPsw, productPsw,
              futureApi, stockApi,
              function(err, rst) {
                if (err) {
                  return cb(err);
                };
                cb();
              });
          }, function(err) {
            if (err) {
              flogger.debug("batchLogin", null, null, err);
              logger.error(err);
              return cbk(err);
            }
            flogger.debug("batchLogin", null, sucess);
            return cbk(null, 'sucess');
          });
        };
      });
    },

    onTick: function(tick) {
      this._cache.onTick(tick);
    },

    reqTick: function(key, cbk) {
      if (key in this._cache.tickCache) {
        return cbk(null, 2);
      };
      // 订阅数据，并创建新的TickData
      var self = this;
      this._quoter.reqTick(key, function(err, num) {
        if (err) {
          return cbk(err);
        };
        self._cache.newTick(key);
        cbk(null, num);
      });
    },

    reqBatchTick: function(keys, observer, cbk) {
      var self = this;
      async.each(keys, function(key, cb) {
        self.reqTick(key, function(err, num) {
          if (err) {
            return cb(err);
          };
          self.addTickObserver(key, observer);
          cb();
        });
      }, function(err) {
        if (err) {
          logger.error(err);
          return cbk(err);
        }
        return cbk();
      });
    },

    getBatchContract: function(keys, cbk) {
      /// @todo 真正的一次性接口
      var contracts = [];
      var self = this;
      async.each(keys, function(key, cb) {
        self.getContract(key, function(err, contract) {
          contracts.push(contract);
          cb(err);
        })
      }, function(err) {
        if (err) {
          logger.error(err);
          return cbk(err);
        }
        cbk(null, contracts);
      });
    },


    unReqTick: function(key) {
      /// @todo 取消订阅
      console.log("unReqTick");
      throw "ee";
    },

    getPBar: function(contract, period, observer) {
      return this._cache.getPBar(contract, period, observer);
    },

    addTickObserver: function(key, observer) {
      return this._cache.addTickObserver(key, observer);
    },

    /**
     * @brief 添加或删除自选合约
     *
     * @param c {{ Contract/String }} 目标合约或它key
     * @param cb 回调函数
     *
     * @return 
     */
    followContract: function(c, cb) {
      this._server.followContract(c, cb);
    },

    /** 关注和取消关注某个产品 */
    followProduct: function(id, cb) {
      this._server.followProduct(id, cb);
    },

    /** 创建实盘产品 */
    createRealProduct: function(product, cb) {
      this._server.createRealProduct(product, cb);
    },

    /** 添加自创产品 */
    createProduct: function(product, cb) {
      this._server.createProduct(product, cb);
    },

    /** 删除自创产品 */
    removeProduct: function(id, cb) {
      this._server.removeProduct(id, cb);
    },

    // --------------------- gettter ---------------------------

    /** 获取所有合约 */
    getAllContract: function getAllContract(cb) {
      this._server.getAllContract(cb);
    },

    /** 获取自选合约 */
    getMyContract: function(cb) {
      this._server.getMyContract(cb);
    },

    /** 获取我关注的产品 */
    getFollowProduct: function(cb) {
      this._server.getFollowProduct(cb);
    },

    /** 获取我的产品 */
    getMyProduct: function(cb) {
      this._server.getMyProduct(cb);
    },

    /** 获取产品 */
    getProduct: function(id, cb) {
      this._server.getProduct(id, cb);
    },

    /** 获取产品 */
    getContract: function(ckey, cb) {
      this._server.getContract(ckey, cb);
    },

    getAllProduct: function(rank, cb) {
      this._server.getAllProduct(rank, cb);
    },

    getAllProductSnap: function(cb) {
      this._server.getAllProductSnap(cb);
    },

    onBroadcastOrder: function(cb) {
      this._server.onBroadcastOrder(cb);
    },

    /** 添加自选股并订阅数据。 */
    addMyContract: function(contract, observer, cb) {
      var self = this;
      this._server.addMyContract(contract, function(err, contracts) {
        self.reqTick(contract.key, function(err, num) {
          if (err) {
            logger.error(err);
            return cb(err);
          };
          self.addTickObserver(contract.key, observer);
        });
        return cb(null, contracts);
      })
    },

    setDefaultAccount: function(id) {
      return this._server.setDefaultAccount(id);
    },

    onManualFollow: function(cb) {
      this._server.onManualFollow(cb);
    },

    onAutoFollow: function(cb) {
      this._server.onAutoFollow(cb);
    },

    onFocusFollow: function(cb) {
      this._server.onFocusFollow(cb);
    },


  };

  return DataManager;
})();

var QuoteCache = (function QuoteCache() {

  function QuoteCache(location_) {
    /*this._quote = quote;  */
    this._pbarCache = {}; // map contract to [pbar]
    this.tickCache = {};
    this._curPbar = {}; // 要遇到room中，和特定窗口关联. 或则通过在pbar中保存room的id，推断。
    this._location = location_;
  }

  QuoteCache.prototype = {

    constructor: QuoteCache,

    onTick: function(tick) {
      tick.close = parseFloat(tick.price);
      toFloatAttribute(tick, ['open', 'price', 'high', 'low', 'volume', 'preClose', 'totalPrice']);
      tick.key = tick.key.toUpperCase();
      tick.buy = tick.buy.map(function(elem) {
        return {
          price: parseFloat(elem.price),
          volume: parseFloat(elem.volume)
        }
      });
      tick.sell = tick.sell.map(function(elem) {
        return {
          price: parseFloat(elem.price),
          volume: parseFloat(elem.volume)
        }
      });
      //
      var pbars = this._pbarCache[tick.key];
      if (pbars) {
        for (var i = 0; i < pbars.length; i++) {
          pbars[i].onTick(tick);
        };
      };
      this.tickCache[tick.key].onTick(tick);
    },

    addTickObserver: function(key, observer) {
      this.tickCache[key].addObserver(observer);
    },

    newTick: function(key) {
      this.tickCache[key] = new TickData(this._location);
    },

    /**
     * @brief 
     *
     * @param contract
     * @param period
     *
     * @return true: 新建一个， false 激活一个
     */
    getPBar: function(contract, period, observer) {
      /// @todo 缓冲合约数限制
      flogger.debug("getPbar", [contract, period], null, null);
      var pbars = this._pbarCache[contract.key];
      // 
      for (c in this._pbarCache) {
        var pbars2 = this._pbarCache[c];
        for (var i = 0; i < pbars2.length; i++) {
          pbars2[i].setActive(false); // 此时的scope过期对其也无影响。
        };
      };
      //
      if (pbars != undefined) {
        for (var i = 0; i < pbars.length; i++) {
          var pbar = pbars[i];
          if (pbar.key == period) {
            pbar.setActive(true);
            pbar.addObserver(observer); // 重置新的scoep
            this._curPbar = pbar;
            logger.debug("_pbarCache: ", this._pbarCache);
            logger.debug("reuse pbar");
            return false;
          }
        };
        var pbar = new BarsDelegate(contract.key, period, this._location);
        this._curPbar = pbar;
        pbar.addObserver(observer);
        pbars.push(pbar);
        logger.debug("_pbarCache: ", this._pbarCache);
        logger.debug("add pbar to pbar list");
        return true;
      };
      // 换合约的时候清空缓冲
      this._pbarCache = {};
      logger.debug("create pbars list");
      // 新建pbar列表
      var pbar = new BarsDelegate(contract.key, period, this._location);
      this._curPbar = pbar;
      pbar.addObserver(observer);
      this._pbarCache[contract.key] = [pbar];
      logger.debug("_pbarCache: ", this._pbarCache);
      return true;
    },

  };

  return QuoteCache;
})();
