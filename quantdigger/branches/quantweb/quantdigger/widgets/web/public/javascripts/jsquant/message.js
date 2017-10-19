// Copyright 2015 QuantFans Inc. All Rights Reserved.
/**
 * @fileoverview 消息模块
 *
 * @author wondereamer(dingjie.wang@foxmail.com)
 */

// define(function() {

'use strict';

var contract2time = {};
var Message = (function Message() {

  function Message(socket, name) {
    // requestId只用来表示相同的socket发出的请求。
    // 本身具有局部空间作用域，而在包子那边需要一个全局空间的request
    // 可用用户名加上毫秒数来唯一标示。
    // gUser.username + new Date().getTime()
    this.requestId = (new Date()).getTime()
    this.socket = socket;
    this.socket.reqid2cb = {}
    this.msg2cbk = {}

    this.socket.on('message', function(data) {
      console.log('[ ' + name + ' ]' + data.msg + " return");
      /*console.log(this.reqid2cb);*/
      console.log("requestId: " + data.requestId);
      /*console.log("requestId: " + data.requestId);*/
      this.reqid2cb[data.requestId](data);
      delete this.reqid2cb[data.requestId];
    });
  }

  Message.prototype = {
    constructor: Message,

    /**
     * @brief 注册消息处理函数, 无法取消。
     *
     * @note 如果重复注册一个消息，那么事件会被多次调用。
     * @param msg 消息
     * @param cb 回调
     *
     */
    registerHandler: function(msg, cb) {
      if (this.msg2cbk[msg] !== undefined) {
        // 消息已经注册了。
        // 如果没有注册该函数该函数，则注册。
        var cbs = this.msg2cbk[msg];
        var i = 0;
        for (; i < cbs.length; i++) {
          if (cbs[i] == cb) { // == 和 === 结果是一样的
            break;
          };
        };
        if (i == cbs.length) {
          cbs.push(cb);
        };
        /*for (var i = 0; i < cbs.length; i++) {*/
        /*console.log(cbs[i]);*/
        /*};*/
        /*console.log(cbs.length);*/
        /*console.log("ddddddddddd");*/
      } else {
        // 注册消息
        this.msg2cbk[msg] = [cb];
        var handler = this;
        console.log("register message [" + msg + "]");
        this.socket.on(msg, function(data) {
          /*console.log(msg);*/
          // 预处理，或者过滤
          if (msg == 'onTick') {
            var key = (data.contract + '.' + data.exchangeId).toLowerCase();
            if (key == 'cctest.cc') key = 'cctest.sse';
            var dt = data.datetime.split('.');
            dt[0] = dt[0].replace(new RegExp('-', 'g'), '/');

            data.time = Date.parse(dt[0]) + parseInt(dt[1]);

            var now = data.time;
            var lastTime = contract2time[key];
            if (lastTime == undefined || lastTime < now) {
              contract2time[key] = now;
              data.key = key;

              var cbs = handler.msg2cbk[msg];
              for (var i = 0; i < cbs.length; i++) {
                cbs[i](data);
              };
            } else {
              /*console.log("repeat--------------------------");*/
            }
          } else {
            var cbs = handler.msg2cbk[msg];
            for (var i = 0; i < cbs.length; i++) {
              cbs[i](data);
            };
          }
        });

      }
    },

    unRegisterHandler: function(msg, cb) {
      if (this.msg2cbk[msg] !== undefined) {
        // 消息已经注册了。
        // 如果没有注册该函数该函数，则注册。
        var cbs = this.msg2cbk[msg];
        for (var i = 0; i < cbs.length; i++) {
          if (cbs[i] === cb) {
            console.log("remove msg handler..");
            cbs.splice(i, 1);
            break;
          };
        };
      } else {
        console.log("WARFING: msg not registered");
      }
    },


    /**
     * @brief 通过消息调用服务器函数。
     *
     * @param msg 函数消息。
     * @param args 函数参数。
     * @param cb 回调函数。
     *
     */
    remoteCall: function(msg, args, cb) {
      console.log("send message: " + msg);
      // console.log('###############登录用户###############');
      // console.log(gUser)
      this.requestId++;
      var uniqueId = gUser.id + this.requestId;
      this.socket.reqid2cb[uniqueId] = cb;
      args.requestId = uniqueId;
      args.url = '/tempUrl';
      /*console.log(args.requestId);*/
      this.socket.emit(msg, args);
    },

    /*on: function(eventName, callback) {*/
    /*socket.on(eventName, function() {*/
    /*var args = arguments;*/
    /*$rootScope.$apply(function() {*/
    /*callback.apply(socket, args);*/
    /*});*/
    /*});*/
    /*},*/

    /*emit: function(eventName, data, callback) {*/
    /*socket.emit(eventName, data, function() {*/
    /*var args = arguments;*/
    /*$rootScope.$apply(function() {*/
    /*if (callback) {*/
    /*callback.apply(socket, args);*/
    /*}*/
    /*});*/
    /*})*/
    /*}*/

  };

  return Message;
})();

// return Message;

/*return {*/
/*'Message': Message*/
/*}*/
// });


var QEvent = (function QEvent() {

  function QEvent() {
    this._events = {};
  }

  QEvent.INVALID_OBSERVER = "None";

  QEvent.prototype = {

    constructor: QEvent,

    addListener: function(evt, func) {
      if (evt in this._events) {
        this._events[evt].push(func);
        return;
      }
      this._events[evt] = [func];
    },

    emitEvent: function(evt, args) {
      var events = this._events[evt];
      if (events) {
        var toremove = [];
        for (var i = 0; i < events.length; i++) {
          var rst = events[i].apply(events[i], args);
          // 移除失效的view
          if (rst == QEvent.INVALID_OBSERVER) {
            toremove.push(events[i]);
          };
        };
        if (toremove.length > 0) {
          this._events[evt] = _.difference(events, toremove);
        };
      };
    },

  };
  return QEvent;
})();

function clone(source) {
  return JSON.parse(JSON.stringify(source));
};