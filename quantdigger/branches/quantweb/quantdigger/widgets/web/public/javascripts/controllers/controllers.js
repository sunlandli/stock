
// define(['../app', '../services/services'], function(app, logger) {

  angular.module('app.controllers', ['app.services'])

  // 最外层controller
  .controller('appController', [
    '$rootScope',
    '$scope',
    'AuthService',
    'util',
    'room', function($rootScope, $scope, AuthService, util, room) {
    var logger = util.logger;

    // 解决再次$apply()的报错问题
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

    $scope.logout = function() {
      AuthService.logout().then(function(data) {
        data.isDone && console.log('退出成功');
        $rootScope.gUser = gUser = null;
        $rootScope.isLogin = false;
        localStorage.removeItem('session');
        window.location.href = '/';
        // $scope.$state.go('index');
      }, function() {
        console.log('退出失败');
      })
    };

    // 搜索股票---指令的callback
    // html 在 /templates/myapp/index.swig
    $scope.redirect = function(result) {
      $scope.$state.go('room', {id: result.key} );
    };


  }])

  // 注册
  .controller('joinController', ['$scope', 'AuthService', function($scope, AuthService) {
      $scope.join = function(formData) {
        var user = formData || {};
        $scope.formData = {
          username: user.username,
          email: user.email
        };
        AuthService.join(user).then(function(data) {
          console.log(data);
          if (!data.isDone) {
            $scope.isDone = false;
            return $scope.message = data.err;
          };
          $scope.isDone = true;
          $scope.url = data.url;
        }, function(res) {
          $scope.isDone = false;
          console.log(res);
        });
      };

  }])

  // 激活
  .controller('activateController', ['$scope', 'AuthService', function($scope, AuthService) {

    var activateInfo = $scope.$stateParams;

    AuthService.activate(activateInfo).then(function(data) {
      console.log(data);
      if (!data.isDone) {
        return $scope.message = data.err;
      };
      $scope.message = '激活成功';
    }, function(res) {
      $scope.message = '激活失败';
      console.log(res);
    });

  }])

  // 登录
  .controller('loginController', ['$scope', 'AuthService', function($scope, AuthService) {
      $scope.login = function(formData) {
        AuthService.login(formData).then(function(data) {
          // console.log(data);
          if (!data.isDone) {
            return Ply.dialog("alert", { effect: "scale" }, {text: "登录失败", ok: '好'});
          };

          gUser = data.user;
          gUser.id = data.user._id;
          gUser.username = data.user.name.first;

          // $scope.gUser = gUser;
          // $scope.isLogin = true;

          var session = {
            gUser: gUser,
            expires: new Date().getTime() + 24*60*60*1000
          };

          try {
            localStorage.setItem('session', JSON.stringify(session));
          } catch(e) {
            console.log('您的浏览器不支持localStorage!');
          };

          var back = $scope.$state.current.data.fromState.name;
          var params = $scope.$state.current.data.fromParams;

          $scope.$state.go('index');
          // $scope.$state.go(back, params, {reload: true});
          // window.location.reload();
        }, function() {
          Ply.dialog("alert", { effect: "scale" }, {text: "登录失败", ok: '好'});
          // $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
      };

  }])
  // 找回密码
  .controller('findpwController', ['$scope', 'AuthService', function($scope, AuthService) {
      $scope.findpw = function(formData) {
        console.log(formData);
        AuthService.findpw(formData).then(function(data) {
          console.log(data);
          if (!data.isDone) {
            $scope.message = data.err;
            $scope.isDone = false;
            return $scope.message = data.err;
          };
          $scope.isDone = true;
          $scope.url = data.url;
          $scope.message = '邮件已发送，请登录邮箱设置新密码';
        }, function() {
          $scope.isDone = false;
          $scope.message = '操作错误，请重试';
        });
      };

  }])
  // 重设密码
  .controller('resetpwController', ['$scope', 'AuthService', function($scope, AuthService) {
      $scope.resetpw = function(formData) {
        formData.id = $scope.$stateParams.id;
        formData.key = $scope.$stateParams.key;
        console.log(formData);
        AuthService.resetpw(formData).then(function(data) {
          console.log(data);
          if (!data.isDone) {
            return $scope.message = data.err;
          }
          $scope.$state.go('login');
        }, function() {
          $scope.message = '设置新密码失败，请重试';
        });
      };

  }])

  // 首页
  .controller('indexController', ['$scope', '$http', function($scope, $http) {
    // 首页banner 实例化
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        // spaceBetween: 30,
        // effect: 'fade',
        grabCursor: true,
        // autoplay: 5000,
        speed: 1000,
        parallax: true,
        loop: true
    });

    // 获取实时交易总额 & 跟投获利
    $scope.getRealtimeTrade = function() {
      $http({
        url: '/api/trade/status/',
        type: 'GET',
        params: {}
      }).success(function(data,header,config,status) {
        var realtimeFollowingProfit = data.data.realtimeFollowingProfit.toFixed(0),
            allTransaction = data.data.allTransaction.toFixed(0);
        // 跟投获利总额
        var profitCount = new CountUp("profitCount", 1000, realtimeFollowingProfit, 0, 2.5, {  
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '￥',
          suffix: ''
        });
        profitCount.start();

        // 交易获利总额
        var tradeCount = new CountUp("tradeCount", 10000, allTransaction, 0, 2.5, {  
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '￥',
          suffix: ''
        });
        tradeCount.start();
      }).error(function(data,header,config,status) {
        console.log("error");
      });
    };
    $scope.getRealtimeTrade();

    // 获取产品排行数据======================================
    $scope.getProductRank = function(type, sort) {
      $http({
          url: '/api/rank/product/?_='+new Date().getTime(),
          method: 'GET',
          dataType: 'json',
          params: { type: type, sort: sort },
        }).success(function(data,header,config,status) {

          if (sort == 'captial.equity.desc') {
            $scope.productsRankA = data.products;
            // 画走势图
            $scope.$on('isLoaded', function(event){
              $.each(data.products, function(index, val) {
                var xData = val.statics.datetimes;
                var yData = val.statics.equities;
                makeProductRankChart(xData, yData, val.pid);
              });
            });
          } else {
            $scope.productsRankB = data.products;
          };

        }).error(function(data,header,config,status) {
          console.log("error");
        });
    };

    $scope.getProductRank('total', 'captial.equity.desc'); // 交易获利排行
    $scope.getProductRank('total', 'totalFollowersAccount.desc'); // 跟投最多排行

    /**
     * 获取用户跟投获利排行
     * @param  {[type]} type [follow: 跟投获利, total: 总获利, trade: 交易获利]
     * @return {[type]}      [description]
     */
    $scope.getUserRank = function(type, sort) {
      $http({
        url: '/api/rank/user/',
        type: 'GET',
        params: { type: type, sort: sort }
      }).success(function(data,header,config,status) {
        $scope.userRankList = data.users;
      }).error(function(data,header,config,status) {
        console.log("error");
      });
    };
    $scope.getUserRank('total', 'trading.realtimeFollowingProfit.desc');

  }])

  // 用户中心--首页
  .controller('homeController', ['$scope', '$http', 'util', 'application', 'web', 'trader', function($scope, $http, util, application, web, trader) {

    var logger = util.logger;
    $scope.isValid = function () {
      return $scope.$parent != undefined;
    };
    $scope.onCaptial = (function (products) {
      if (!$scope.isValid()) {
        return QEvent.INVALID_OBSERVER;
      };
      /*$scope.myproduct = products;*/
      /*$scope.$apply();*/
    });

    /*application.addObserver('home', $scope);*/
    application.prepareTrading();

    /**
     * 自动跟投[2]、手动跟投[1]、离线跟投[4] 9月12日
     * @param  {[type]} id   [产品id]
     * @param  {[type]} type [操作类别]
     * @return {[type]}      [noting]
     */
    $scope.autoFollow = function(id, type) {
      console.log('pid：' + id + '类别：' + type);
    };



    $scope.allGroup = [];
    $scope.selectedG = [];
    $scope.addG = [];
    // 创建组合按钮
    $scope.getAllProduct = function(){
      application.dataManager.getAllProductSnap(function (err, data) {
        if (err) {
          logger.error(err);
        };
        $scope.allGroup = data
        $scope.$apply();
      });

    };

    // 选择组合
    $scope.selectGroup = function(item, index) {
      $scope.selectedG.unshift(item);
      $scope.allGroup.splice(index, 1);
      console.log($scope.allGroup);
    }
    // 移除组合
    $scope.removeGroup = function(item, index) {
      $scope.allGroup.unshift(item);
      $scope.selectedG.splice(index, 1);
      console.log($scope.allGroup);
    }
    // 添加组合
    $scope.addGroup = function() {
      $scope.addG = $scope.selectedG;
    }


    $scope.mycontracts = [ ],

    $scope.indexContract = [
      { key: '000001.SSE',
        name: '上证指数',
        close: '-',
        change: '-',
        diff: '-',
      },
      { key: '399001.SZSE',
        name: '深证指数',
        close: '-',
        change: '-',
        diff: '-',
      },
      { key: '399006.SZSE',
        name: '创业板指',
        close: '-',
        change: '-',
        diff: '-',
      },
      { key: '399005.SZSE',
        name: '中小板指',
        close: '-',
        change: '-',
        diff: '-',
      },
      { key: '000300.SSE',
        name: '沪深300',
        close: '-',
        change: '-',
        diff: '-',
      }
    ];

    /** 获取用户的自选股 */
    $scope.showMyContract = function() {
      web.showMyContract($scope, function (err, contracts) {
        if (err) {
          logger.error("获取自选合约失败");
          return;
        };
        $scope.mycontracts = contracts;
        contracts = _.sortBy(contracts, function (c) { return c.key ; });
        $scope.safeApply();
      });


    };

    //
    $scope.onTick = function (tick) {
      /*console.log(tick);*/
      var isIndex = _.find($scope.indexContract, function (c) {
        return c.key == tick.key
      });
      if (isIndex) {
        /*console.log(tick.key);*/
        var contract = _.findWhere($scope.indexContract, { key: tick.key });
        if (contract) {
          contract.close = tick.close;
          contract.diff = (tick.close-tick.preClose).toFixed(2);
          contract.change = ((tick.close-tick.preClose)/tick.preClose*100).toFixed(2);
        };
        // 指数合约
      } else {
        var contract = _.find($scope.mycontracts, function (c) { return c.key == tick.key; })
          if (contract) {
            contract.close = tick.close;
            contract.open = tick.open;
            contract.high = tick.high;
            contract.low = tick.low;
            contract.volume = parseFloat(tick.volume);
            contract.change = (tick.close - tick.preClose) / tick.preClose * 100;
            /// @todo deep $scocpe.mycontracts
            util.fixAttributePrecision(contract, ['open', 'close', 'high', 'low', 'preClose', 'change'], 2);
          };
      }
      $scope.$apply();
    };

    /** 获取用户关注的产品 */
    $scope.showFollowProduct = function() {
      logger.info("获取跟投关注的产品");
      web.getFollowProduct(function (err, data) {
        if (!err) {
          console.log(data)
          $scope.followProducts = data.followings;
          $scope.autoFollowProducts = data.autoFollowings;
          $scope.safeApply();
          $.each(data.followings, function(index, val) {
            var xData = val.statics.datetimes,
              yData = val.statics.equities;
            makeProductRankChart(xData, yData, val.pid + 'F' + index);
          });
          $.each(data.autoFollowings, function(index, val) {
            var xData = val.statics.datetimes,
              yData = val.statics.equities;
            makeProductRankChart(xData, yData, val.pid + 'AF' + index);
          });
        };
      });
    };

    // 初始化
    (function () {
    // $scope.$watch('isLogin', function(newValue, oldValue) {
      // console.log('监控')
      // console.log(newValue)
      // console.log(oldValue)
      // if (newValue == false) return;

      var keys = _.map($scope.indexContract, function (c) { return c.key; });
      web.showIndexContract(keys, $scope, function (err, contracts) {
        if (err) {
          logger.error("获取指数合约失败");
          return;
        };
        $scope.indexContract = _.sortBy(contracts, function (elem) { return elem.key });
        logger.debug("指数合约:", contracts);
        $scope.safeApply();
      });
    // });

    })();

    // 添加自选股---应用于自动补全插件的callback
    $scope.addMyContract = function(contract) {
      web.addMyContract(contract, $scope, function (err, contracts) {
        if (err) {
          logger.error("添加自选股失败!");
          return;
        };
        $scope.mycontracts = contracts;
        $scope.safeApply();
      })
    };

    // 添加自选组合---应用于自动补全插件的callback
    $scope.addProduct = function() {
      console.log('添加组合');
    };

    // 获取我的消息
    $scope.getMyPostMessage = function(type) {
      $http({
        url:'/api/user/message/',
        method:'GET',
        params: {type: type}
      }).success(function(data,header,config,status){
        if (data.isDone) {
          console.log('--------获取：' + type + ' 的消息--------');
          console.log(data);
          if (type == 'read') {
            $scope.readCount = data.messages.length;
          } else {
            $scope.unreadCount = data.messages.length;
          }
          $scope.myPostMessage = data.messages;

        }
      }).error(function(data,header,config,status){
        console.log('请求失败');
      });
    };
    $scope.getMyPostMessage('unread');

    // 读消息
    $scope.readMyPostMessage = function(id) {
      $http({
        url:'/api/user/message/',
        method:'POST',
        data: {id: id}
      }).success(function(data,header,config,status){
        if (data.isDone) {
          console.log('--------标志ID为' + id + '的消息为已读--------');
          console.log(data);
        }
      }).error(function(data,header,config,status){
        console.log('请求失败');
      });
    };

  }]) // homeController end

  // 交易总览
  .controller('homeTradeController', ['$scope', '$http', 'web', 'application', function($scope, $http, web,  application) {

    var getMyProduct = function() {
      web.getMyProduct(function (err, data) {
        if (err) {
          logger.error(err);
          return;
        };
        $scope.myproduct = data;
        $scope.loadStatus = 'loaded';
        $scope.safeApply();
        $.each(data, function(index, val) {
          var xData = val.statics.datetimes;
          var yData = val.statics.equities;
          makeProductRankChart(xData, yData, val.pid + 'M' + index);
        });
      });
    };

    // 创建产品成功后，获取产品列表，添加产品文章，登录产品
    var addProductTopic = function(product) {
      $http({
        url:'/product/add-topic/',
        method:'POST',
        data: {
          productId: product._id,
          title: product.name,
          body: product.name,
          user: gUser.id,
        }
      }).success(function(data,header,config,status){
        if (!data.isDone) return console.log('创建产品文章失败');
        console.log('--------创建产品文章成功--------');
        getMyProduct();
        Ply.dialog("alert", { effect: "scale" }, {text: "创建成功", ok: '好'});

        application.trader
          .login('127.0.0.1', '6379', product._id, product._id, product._id, product._id,
            'futurePsw', 'stockPsw', 'productPsw', 'futureSimulate', 'stockSimulate',
            function(err, data) {
              console.log('########登录产品########');
              console.log(err);
              console.log(data);
            });

        if (!application.defaultAccount) {
          application.defaultAccount =  product;
        };

      }).error(function(data,header,config,status){
        Ply.dialog("alert", { effect: "scale" }, {text: "创建失败", ok: '好'});
      });
    }

    $scope.myproduct = [];
    $scope.showMyProduct = function() {
      $scope.loadStatus = 'loading';
      getMyProduct();
    };

    $scope.showMyProduct();


    // 创建实盘产品
    var realProductData = {
      name: '实盘产品测试1号',
      description: '测试产品，请勿跟！',
      subProduct: {
        ip: '127.0.0.1',
        port: '6345',
        brokerId: '32werwqr432543rterw',
        account: 'admin',
        password: '1234567',
      },
      child: [],
      initEquity: -1,
      sCommission: 0.03,
      fCommission: 0.01,
    }

    $scope.createRealProduct = function(data) {

      data.isSimulate = false;
      data.initEquity = -1;
      logger.debug("创建实盘产品：", data);
      application.dataManager.createRealProduct(data, function(err, product) {
        if (err) {
          Ply.dialog("alert", { effect: "scale" }, {text: "创建失败", ok: '好'});
          return logger.error('创建实盘产品失败');
        };
        logger.info('创建实盘产品成功');
        $scope.showModal = false;
        addProductTopic(product);
      });

    };

    // $scope.createRealProduct(realProductData);

    /**
     * 创建组合---提交函数 9月1日 23:15
     * html 写在 home.html 文件里
     * @param  {[json]} formData [表单数据]
     * @return {[type]}          [description]
     */
    $scope.createProduct = function(formData) {
      logger.debug("表格数据：", formData);
      var t = [];
      for (key in formData.child) {
        t.push(formData.child[key]);
      }
      formData.child = t;
      formData.isSimulate = true;
      web.createProduct(formData, function (err, product) {
        if (err) {
          logger.error("创建产品失败!");
          return;
        };
        logger.info("创建产品成功！");
        $scope.showModal = false;
        $scope.data.name = '';
        $scope.data.description = '';
        $scope.addG = [];

        addProductTopic(product);

      });
    }; // 9月1日 23:15

  }]) // homeTradeController end

  // 我的主题
  .controller('homeTopicController', ['$scope', '$http', function($scope, $http) {

    // 获取我的话题
    $scope.getMyTopic = function() {
      $http({
        url:'/api/user/topic/',
        method:'GET',
        params: {}
      }).success(function(data,header,config,status){
        if (data.isDone) {
          console.log('--------获取我的话题--------');
          console.log(data);
          $scope.myTopics = data.topics;
        }
      }).error(function(data,header,config,status){
        console.log('请求失败');
      });
    };

    $scope.getMyTopic();

  }]) // homeTopicController end

  // 我的评论
  .controller('homePostController', ['$scope', '$http', function($scope, $http) {

    // 获取我的评论
    $scope.getMyPost = function() {
      $http({
        url:'/api/user/post/',
        method:'GET',
        params: {}
      }).success(function(data,header,config,status){
        if (data.isDone) {
          console.log('--------获取我的评论--------');
          console.log(data);
          $scope.myPosts = data.posts;
        }
      }).error(function(data,header,config,status){
        console.log('请求失败');
      });
    };

    $scope.getMyPost();

  }]) // homePostController end

  // 我的消息
  .controller('homeMessageController', ['$scope', '$http', function($scope, $http) {


  }]) // homeMessageController end

  // 个人资料设置
  .controller('homeSettingController', ['$rootScope', '$scope', '$http', '$timeout', 'AuthService',  function($rootScope, $scope, $http, $timeout, AuthService) {

      var uploader = WebUploader.create({
          // thumb: {
            width: 350,
            height: 350,

          //   // 是否允许裁剪。
          //   crop: true,

          //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
          //   allowMagnify: true,

          //   // 为空的话则保留原有图片格式。
          //   // 否则强制转换成指定的类型。
          //   type: 'image/jpeg'
          // },

          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
          },

          fileSingleSizeLimit: 2 * 1024 * 1024,

          // 选完文件后，是否自动上传。
          auto: true,

          // swf文件路径
          swf: '/javascripts/libs/webuploader-0.1.5/Uploader.swf',

          // 文件接收服务端。
          server: '/api/upload/',

          // 选择文件的按钮。可选。
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          pick: '#picker',

          // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
          resize: false
      });
      // 当有文件被添加进队列的前
      // uploader.on( 'beforeFileQueued', function( file ) {
      //     console.log('当有文件被添加进队列的前');
      //     console.log(file);
      // });
      // 文件上传过程中创建进度条实时显示。
      uploader.on( 'uploadProgress', function( file, percentage ) {
          var $li = $( '#'+file.id ),
              $percent = $li.find('.progress .progress-bar');

          // 避免重复创建
          if ( !$percent.length ) {
              $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
              '</div>').appendTo( $li ).find('.progress-bar');
          }

          $li.find('p.state').text('上传中');

          $percent.css( 'width', percentage * 100 + '%' );
      });
      uploader.on( 'uploadSuccess', function( file, res ) {
          console.log('上传成功');
          console.log(res);
          resImg = res.data;
          jcrop_api.setImage('/temp/' + resImg.filename);
          jcrop_api.setSelect([50, 50, 300, 300]);
          $('#avatarCrop').attr('src', '/temp/' + resImg.filename);
          // $('#'+file.id ).find('p.state').text('已上传');
          $('#cropAvatar').show();
          $('#setAvatar').show();
      });

      uploader.on( 'uploadError', function( file ) {
          console.log('上传失败');
          $( '#'+file.id ).find('p.state').text('上传出错');
      });

      uploader.on( 'uploadComplete', function( file ) {
          console.log('上传完成');
          $( '#'+file.id ).find('.progress').fadeOut();
      });


      //显示 选择区域
      var selectData = {},
          resImg;
      var jcrop_api;
      //初始化
      $("#avatarCrop").Jcrop({
        aspectRatio:1,
        onChange:showCoords,
        onSelect:showCoords,
        boxWidth: 350,
        boxHeight: 350,
        setSelect: [50, 50, 300, 300]
      }, function() {
        jcrop_api = this;
      });
      function showCoords(obj){
        // $("#x").val(obj.x);
        // $("#y").val(obj.y);
        // $("#w").val(obj.w);
        // $("#h").val(obj.h);
        selectData = {
          x: obj.x,
          y: obj.y,
          w: obj.w,
          h: obj.h,
          img: resImg
        }
      }

      $('#setAvatar').on('click', function() {
        console.log(selectData);
        $http({
          url: '/api/account/avatar/',
          method: 'POST',
          data: {data: selectData}
        }).success(function(data) {
          console.log("-----------设置头像--------");
          console.log(data);
          if (!data.isDone) {
            return Ply.dialog("alert", { effect: "scale" }, {text: "设置头像失败", ok: '好'});
          };
          var getSession = JSON.parse(localStorage.getItem('session'));
          if (getSession) {
            getSession.gUser.avatar = data.avatar;
            localStorage.setItem('session', JSON.stringify(getSession));
          };
          $rootScope.gUser.avatar = data.avatar;
          Ply.dialog("alert", { effect: "scale" }, {text: "设置头像成功", ok: '好'});
        }).error(function() {
          Ply.dialog("alert", { effect: "scale" }, {text: "设置头像失败", ok: '好'});
        });

      });

    // 用户资料设置
    $scope.formData= {
      nickname: $scope.gUser.name.first,
      sex: $scope.gUser.profile.sex,
      age: $scope.gUser.profile.age,
      phone: $scope.gUser.profile.phone,
      job: $scope.gUser.profile.job,
      city: $scope.gUser.profile.city,
      signature: $scope.gUser.profile.signature
    };

    $scope.setMyProfile = function(user) {
      console.log('-------------------------------------');
      console.log(user);
      console.log('-------------------------------------');
      AuthService.setProfile(user).then(function(data){
        console.log(data);
        if (!data.isDone) {
          return Ply.dialog("alert", { effect: "scale" }, {text: "保存失败", ok: '好'});
        };
        $rootScope.gUser = data.user;
        Ply.dialog("alert", { effect: "scale" }, {text: "保存成功", ok: '好'});
      }, function() {
        Ply.dialog("alert", { effect: "scale" }, {text: "保存失败", ok: '好'});
      });
    };


    $scope.setMyPassword = function(pw) {
      pw.action = 'resetpw';
      console.log('-------------------------------------');
      console.log(pw);
      console.log('-------------------------------------');
      $http({
        url:'/api/account/resetpw/',
        method:'POST',
        data: pw
      }).success(function(data,header,config,status){
        console.log('---------------修改密码---------------');
        console.log(data);
        if (!data.isDone) {
          return Ply.dialog("alert", { effect: "scale" }, {text: "修改失败", ok: '好'});
        };
        Ply.dialog("alert", { effect: "scale" }, {text: "修改成功", ok: '好'});
      }).error(function(data,header,config,status){
        Ply.dialog("alert", { effect: "scale" }, {text: "修改失败", ok: '好'});
      });
    };

  }])

  // 排行
  .controller('rankController', [
    '$scope',
    '$http',
    'application',
    'util',
    'TABLE_MODEL', function($scope, $http, application, util, TABLE_MODEL) {

    var pTable = null, uTable = null;
    var mmGridInit = function($el, url, cols, root) {
      return $el.mmGrid({
          // width: '119',
          height: 'auto', // 显示全部
          loadingText: '正在载入...',
          noDataText: '没有数据',
          loadErrorText: '数据加载出现异常',
          // indexCol: true, // 显示索引
          indexColWidth: 35,
          fullWidthRows: true, // 自动铺满
          nowrap: true, //超出列宽
          remoteSort: true, // ajax排序
          sortName: 'captial.equity', //排序字段
          sortStatus: 'desc', //排序方向
          cols: cols,
          url: url,
          method: 'get',
          params: {type: 'total'},
          cache: false,
          root: root, // 数据字段名称
          plugins : [
              $('#'+$el.data('page')).mmPaginator()
          ]
      });
    };

    $scope.$on('isLoaded', function(isLoadedEvent){
      var urlP = '/api/rank/product/?_='+new Date().getTime(),
          urlU = '/api/rank/user/?_='+new Date().getTime();

      pTable = mmGridInit($('#pTable'), urlP, TABLE_MODEL.pCols, 'products');
      pTable.on('loadSuccess', function(e, data) {
        $.each(data.products, function(index, val) {
          var xData = val.statics.datetimes,
            yData = val.statics.equities;
          makeProductRankChart(xData, yData, val.pid + 'A' + index);
        });
      }).on('loadError', function(e, data) {
        console.log('get产品排行榜失败。');
      });

      uTable = mmGridInit($('#uTable'), urlU, TABLE_MODEL.uCols, 'users');
      // uTable.on('loadSuccess', function(e, data) {
      //   console.log('get用户排行榜成功。');
      //   console.log(data);
      // }).on('loadError', function(e, data) {
      //   console.log('get用户排行榜失败。');
      // });

      $(document).on('click', '.btnFollowProduct', function() {
        if (!$scope.isLogin) {
          return Ply.dialog(
            "confirm",
            { effect: "scale" }, // fade/scale/fall/slide/3d-flip/3d-sign
            {text: "您还没有登录，是否前往登录？", ok: '好', cancel: '取消'}
          ).always(function (ui) {
            if (ui.state) {
              $scope.$state.go('login');
            };
          });
        };
        var $this = $(this),
            id = $this.data('id');

        $.ajax({
          url: '/api/product/follow/',
          type: 'POST',
          dataType: 'json',
          data: {id: id}
        })
        .done(function(res) {
          console.log("success");
          console.log(res);
          if (res.isFollow == true) {
            $this.text('取消').addClass('yes').removeClass('no');
            Ply.dialog("alert", { effect: "scale" }, {text: "跟投成功", ok: '好'});
          } else {
            $this.text('跟投').addClass('no').removeClass('yes');
            Ply.dialog("alert", { effect: "scale" }, {text: "取消跟投成功", ok: '好'});
          }
        })
        .fail(function() {
          console.log("error");
          Ply.dialog("alert", "跟投失败，请重试！");
        })
        .always(function() {
          console.log("complete");
        });
      });

    });

    $scope.getProductRank = function(type) {
      // console.log('获取'+ type +'产品排行榜');
      pTable.load({type: type, page: 1});
    };

    $scope.getUserRank = function(type) {
      // console.log('获取'+ type +'产品排行榜');
      uTable.load({type: type, page: 1});
    };

    // 关注产品
    // $scope.followProduct = function(id) {
    //   // console.log('关注id为：' + id + ' 的产品');
    //   application.dataManager.followProduct(id, function (err, data) {
    //     /// @todo 给用户提示
    //     if (err) {
    //       util.logger.error('操作失败！');
    //       return;
    //     };
    //     if (data.follow) {
    //       util.logger.info('关注成功！');
    //     } else {
    //       util.logger.info('取消关注成功！');
    //     }
    //     // console.log(data);
    //   });
    // }

  }]) // rankController end

  // 产品详情
  .controller('detailController', ['$scope', '$http', '$stateParams', 'web', 'application', 'util', function($scope, $http, $stateParams, web, application, util) {

    $http({
      url:'/api/product/detail/',
      method:'GET',
      params: {pid: $stateParams.id}
    }).success(function(data,header,config,status){
      console.log(data);
      if (data.isDone) {
        // 拼装数据
        data.body.created = moment(data.body.created).format("YYYY-MM-DD");
        data.body.followersAccount = data.followersAccount;
        $scope.product = data.body;
        $scope.topicId = data.topicId;
        $scope.trans = data.trans;
        $scope.pos = data.pos;
        $scope.isFollow = data.isFollow;
        // 画图收益图
        var xData = data.body.statics.datetimes.map(function(v, i) {
          return moment(v).format("YYYY-MM-DD");
        });
        var yData = data.body.statics.equities;
        makeProductLine(xData, yData);
        // 格式化时间
        $scope.posts = data.posts.map(function(v, i) {
          v.created = moment(v.created).format("YYYY-MM-DD");
          return v;
        });


        var profit = 0, loss = 0, equal = 0;
        $scope.tradeCount = 0;
        for (var i = 0; i < data.trans.length; i++) {
          if(data.trans[i].side == 8 && data.trans[i].profit > 0) {
            profit += 1;
          } else if(data.trans[i].side == 8 && data.trans[i].profit < 0) {
            loss += 1;
          } else if(data.trans[i].side == 8 && data.trans[i].profit == 0) {
            equal += 1;
          };
        };
        $scope.tradeCount = profit + loss + equal;

        // 画饼图
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

      }
    }).error(function(data,header,config,status){
      console.log('获取产品详情失败');
    });
    /*web.getProduct($stateParams.id, function function_name(argument) {*/
    /*// body...*/
    /*})*/

    // 评论
    $scope.addPost = function(formData) {
      $http({
        url:'/api/forum/add/post/',
        method:'POST',
        data: {tid: $scope.topicId, content: formData.body}
      }).success(function(data,header,config,status){
        if (data.isDone) {
          $scope.posts.unshift(data.body);
          Ply.dialog("alert", { effect: "scale" }, {text: "评论成功", ok: '好'});
        }
      }).error(function(data,header,config,status){
        Ply.dialog("alert", { effect: "scale" }, {text: "评论失败", ok: '好'});
      });
    };

    // 关注产品
    $scope.followProduct = function(id) {
      $.ajax({
        url: '/api/product/follow/',
        type: 'POST',
        dataType: 'json',
        data: {id: id}
      }).done(function(res) {
        console.log("success");
        console.log(res);
        if (res.isFollow == true) {
          Ply.dialog("alert", { effect: "scale" }, {text: "跟投成功", ok: '好'});
        } else {
          Ply.dialog("alert", { effect: "scale" }, {text: "取消跟投成功", ok: '好'});
        }
      }).fail(function() {
        console.log("error");
        Ply.dialog("alert", "跟投失败，请重试！");
      });
    }

  }]) // productDetailController end


  // 他的主页
  .controller('userController', ['$scope', '$http', 'AuthService', 'TABLE_MODEL', function($scope, $http, AuthService, TABLE_MODEL) {

    var id = $scope.$stateParams.id;

    AuthService.getProfile({uid: id}).then(function(data) {
      if (!data.isDone) {
        $scope.userInfo = {};
        Ply.dialog("alert", { effect: "scale" }, {text: "获取用户信息失败", ok: '好'});
      };
      console.log(data);
      $scope.userInfo = data.user;
      $scope.isFollow = data.isFollow;
    }, function(data) {
      $scope.userInfo = {};
      Ply.dialog("alert", { effect: "scale" }, {text: "获取用户信息失败", ok: '好'});
    });

    var pTable = null;
    var mmGridInit = function($el, url, cols, root) {
      return $el.mmGrid({
          // width: '119',
          height: 'auto', // 显示全部
          loadingText: '正在载入...',
          noDataText: '没有数据',
          loadErrorText: '数据加载出现异常',
          // indexCol: true, // 显示索引
          indexColWidth: 35,
          fullWidthRows: true, // 自动铺满
          nowrap: true, //超出列宽
          remoteSort: true, // ajax排序
          sortName: 'captial.equity', //排序字段
          sortStatus: 'desc', //排序方向
          cols: cols,
          url: url,
          method: 'get',
          params: {uid: id},
          cache: false,
          root: root, // 数据字段名称
          plugins : [
              $('#'+$el.data('page')).mmPaginator()
          ]
      });
    };

    $scope.$on('isLoaded', function(isLoadedEvent){
      var urlP = '/api/user/product/self/?_='+new Date().getTime(),
          urlU = '/api/rank/user/?_='+new Date().getTime();

      pTable = mmGridInit($('#userProductTable'), urlP, TABLE_MODEL.pCols, 'products');

      pTable.on('loadSuccess', function(e, data) {
        // console.log('get产品排行榜成功。');
        // console.log(data);
        $.each(data.products, function(index, val) {
          var xData = val.statics.datetimes,
            yData = val.statics.equities;
          makeProductRankChart(xData, yData, val.pid + 'A' + index);
        });
      }).on('loadError', function(e, data) {
        console.log('get产品排行榜失败。');
      });

      $(document).on('click', '.btnFollowProduct', function() {
        if (!$scope.isLogin) {
          return Ply.dialog(
            "confirm",
            { effect: "scale" }, // fade/scale/fall/slide/3d-flip/3d-sign
            {text: "您还没有登录，是否前往登录？", ok: '好', cancel: '取消'}
          ).always(function (ui) {
            if (ui.state) {
              $scope.$state.go('login');
            };
          });
        };
        var $this = $(this),
            id = $this.data('id');
        console.log(id);

        $.ajax({
          url: '/api/product/follow/',
          type: 'POST',
          dataType: 'json',
          data: {id: id}
        })
        .done(function(res) {
          console.log("success");
          console.log(res);
          if (res.isFollow == true) {
            $this.text('取消').addClass('yes').removeClass('no');
            Ply.dialog("alert", { effect: "scale" }, {text: "跟投成功", ok: '好'});
          } else {
            $this.text('跟投').addClass('no').removeClass('yes');
            Ply.dialog("alert", { effect: "scale" }, {text: "取消跟投成功", ok: '好'});
          }
        })
        .fail(function() {
          // console.log("error");
          Ply.dialog("alert", "跟投失败，请重试！");
        })
        .always(function() {
          console.log("complete");
        });
      });

    });

    $scope.getUserProduct = function(type) {
      if (type == 'follow') {
        pTable.load({
          url: '/api/user/product/follow/?_='+new Date().getTime(),
          page: 1
        });
      } else {
        pTable.load({
          url: '/api/user/product/self/?_='+new Date().getTime(),
          page: 1
        });
      };
    };

    // 关注
    $scope.addFollow = function() {
      $http({
        url:'/api/user/follow/',
        method:'POST',
        data: {uid: id}
      }).success(function(data,header,config,status){
        if (!data.isDone) {
          console.log('关注失败');
          return Ply.dialog("alert", { effect: "scale" }, {text: "关注失败", ok: '好'});
        };
        console.log('---------------关注成功---------------');
        console.log(data.body);
        $scope.isFollow = data.body.follow;
        if ($scope.isFollow) {
          Ply.dialog("alert", { effect: "scale" }, {text: "关注成功", ok: '好'});
        } else {
          Ply.dialog("alert", { effect: "scale" }, {text: "取消关注成功", ok: '好'});
        };
      }).error(function(data,header,config,status){
        console.log('请求失败');
        Ply.dialog("alert", { effect: "scale" }, {text: "关注失败", ok: '好'});
      });
    }

  }])

  // 社区
  .controller('forumController', ['$scope', '$stateParams', 'application', '$http', function($scope, $stateParams, application, $http) {

    $scope.getTopic = function(type, sort) {
      if (type == 'total') {
        $("#topicPage").page('destroy');
        $("#topicPage").page({
          showInfo: false,
          showJump: false,
          showPageSizes: false,
          pageSize: 30,
          firstBtnText: '首页',
          lastBtnText: '末页',
          remote: {
            url: '/api/forum/topic/?_='+new Date().getTime(),
            params: { type: type, sort: sort },
            beforeSend: function(XMLHttpRequest) {
              //...
            },
            success: function(data, pageIndex) {
              $scope.topicList = data.topics;
              $scope.safeApply();
            },
            complete: function(XMLHttpRequest, textStatu) {
              //...
            }
          }
        });
      } else {
        $http({
          url:'/api/forum/topic/',
          method:'GET',
          params: { type: type, sort: sort }
        }).success(function(data,header,config,status){
          if (!data.isDone) return console.log('获取失败');
          if (type == 'hot') {
            $scope.hotList = data.topics;
          } else if (type == 'cold') {
            $scope.coldList = data.topics;
          }
        }).error(function(data,header,config,status){
          Ply.dialog("alert", { effect: "scale" }, {text: "获取话题列表失败", ok: '好'});
        });
      }

    }; // getTopic() end

    $scope.$on('isLoaded', function(isLoadedEvent){
      $scope.getTopic('total', 'createAt.desc');
      $scope.getTopic('hot', 'postCount.desc');
      $scope.getTopic('cold', 'createAt.sec');

      UM.delEditor('topicContent');
      $scope.topicEditor = UM.getEditor('topicContent');

    });

    $scope.addTopic = function(data) {
      if (!$scope.gUser.isLogin) {
        return Ply.dialog(
          "confirm",
          { effect: "scale" }, // fade/scale/fall/slide/3d-flip/3d-sign
          {text: "您还没有登录，是否前往登录？", ok: '好', cancel: '取消'}
        ).always(function (ui) {
          if (ui.state) {
            $scope.$state.go('login');
          }
        });
      };

      $http({
        url:'/api/forum/add/topic/',
        method:'POST',
        data: { title: data.title, content: $scope.topicEditor.getContent()}
      }).success(function(data,header,config,status){
        $scope.$state.go('forum.topic', {id: data.topic._id});
      }).error(function(data,header,config,status){
        Ply.dialog("alert", { effect: "scale" }, {text: "发表话题失败", ok: '好'});
      });
    };

  }])

  .controller('topicController', ['$scope', '$http', 'application', function($scope, $http, application) {

    UM.delEditor('postContent');
    $scope.postEditor = UM.getEditor('postContent');

    var tid = $scope.$stateParams.id;


    function getTopicDetail(id) {
      $http({
        url: '/api/forum/topic/detail/',
        type: 'GET',
        params: {id: id}
      }).success(function(res) {
        $scope.topic = res.topic;
        $scope.posts = res.posts;
      }).error(function() {
        console.log("error");
      });
    };
    getTopicDetail(tid);

    $scope.addPost = function() {
      if (!$scope.gUser.isLogin) {
        return Ply.dialog(
          "confirm",
          { effect: "scale" }, // fade/scale/fall/slide/3d-flip/3d-sign
          {text: "您还没有登录，是否前往登录？", ok: '好', cancel: '取消'}
        ).always(function (ui) {
          if (ui.state) {
            $scope.$state.go('login');
          };
        });
      };

      var data = {
        tid: tid,
        content: $scope.postEditor.getContent()
      };

      $http({
        url: '/api/forum/add/post/',
        method: 'POST',
        data: data
      }).success(function(data) {
        getTopicDetail(tid);
        $scope.postEditor.execCommand('cleardoc');
      }).error(function() {
        console.log("error");
      });
    }

  }])

// });
