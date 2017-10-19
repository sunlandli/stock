log.setLevel('debug');
var flogger = new FuncDebug(log);
var logger = log;

var Trader = (function Trader() {

  function Trader() {
    var B1_URL = '120.24.51.36:3005/';
    var socket = io.connect(B1_URL, {query: "username=wdj"});
    this._traderMsger = new Message(socket);

  }

  Trader.prototype = {

    constructor: Trader,

    get data() { return "data"; }


  };

  return Trader;
})();

