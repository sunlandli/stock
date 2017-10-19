// define([
//   'angular',
//   'uiRouter',
//   ], function(angular) {
  'use strict';

  var app = angular.module('app', [
    'ui.router',
    'app.services',
    'app.controllers',
    'app.tradeController',
    'app.directives',
    'app.angucomplete'
  ]);

  app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
  }]);

  // app.config(['$locationProvider', function($locationProvider) {
  //   $locationProvider.html5Mode({
  //     enabled: true,
  //     requireBase: true
  //   });
  //   $locationProvider.hashPrefix('!');
  // }]);

  // IE GET请求缓存问题
  app.config(['$httpProvider', function($httpProvider) {
    // Initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
       $httpProvider.defaults.headers.get = {};
    }
    // Enables Request.IsAjaxRequest() in ASP.NET MVC
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    // Disable IE ajax request caching
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  }]);

  // 只运行一次，将路由参数赋值给$rootScope
  app.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.gUser = null;
    $rootScope.isLogin = false;
  });
  // 初始化用户状态(只运行一次)
  app.run(function($rootScope, AuthService) {
    AuthService.getProfile({uid: 'self'}).then(function(data) {
      if (!data.isDone || data.user._id != (gUser && gUser._id)) {
        $rootScope.gUser = null;
        $rootScope.isLogin = false;
        localStorage.removeItem('session');
      } else {
        $rootScope.isLogin = true;
      };
    }, function() {
      console.log('验证用户状态出现错误');
    });
  });

  app.run(function($rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      // event.preventDefault();
      // transitionTo() promise will be rejected with
      // a 'transition prevented' error
      // console.log(toState);
      // console.log(fromState);
      toState.data.fromState = fromState;
      toState.data.fromParams = fromParams;

      var isNeedLogin = toState.data.needLogin;
      var isLogin = gUser;

      if (gUser) {
        $rootScope.gUser = gUser;
        $rootScope.isLogin = true;
      };

      if (isNeedLogin) {
        if (isLogin) {
          return;
        } else {
          event.preventDefault();
          alert('您还没有登录，请先登录！');
          // $rootScope.$state.go('login');
        }
      } else {
        return;
      };

      // AuthService.getProfile({uid: 'self'}).then(function(data) {
      //   if (data.isDone) {
      //     $rootScope.gUser = data.user;
      //     $rootScope.isLogin = true;
      //     // gUser = data.user;
      //     // gUser.id = data.user._id;
      //     // gUser.username = data.user.name.first;
      //   } else {
      //     $rootScope.isLogin = false;
      //   };



      // }, function() {
      //   $rootScope.isLogin = false;
      // });

    });

    $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams){
      $(window).scrollTop(0);
    });

  });

  app.filter('unitFormat', function(){
    return function(val){
      var num = +val;
      if(num >= 100000000 || num <= -100000000) { // 亿
        return (num/100000000).toFixed(1).replace(/\.0$/, '') + '亿';
      };
      // if(num >= 10000000) { // 千万
      //   return (num/10000000).toFixed(1).replace(/\.0$/, '') + '千万';
      // };
      // if(num >= 1000000) { // 百万
      //   return (num/1000000).toFixed(1).replace(/\.0$/, '') + '百万';
      // };
      if(num >= 10000 || num <= -10000) { // 万
        return (num/10000).toFixed(1).replace(/\.0$/, '') + '万';
      };
      // if(num >= 1000) { // 千
      //   return (num/1000).toFixed(1).replace(/\.0$/, '') + '千';
      // };
      if(val == '-') { // 万
        return val;
      };
      return num.toFixed(1);
    };

  });
  // 转义html
  app.filter('toHtml', ['$sce', function($sce){
    return function(val){
      return $sce.trustAsHtml(val);
    };
  }]);
  // 去html标签
  app.filter('toText', function(){
    return function(val){
      var rgx = /<[^>]+>/g;
      if (rgx.test(val)) {
        return val.replace(rgx,'');
      };
      return val;
    };
  });

  // 路由
  app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.when('', '/index');
    $stateProvider
      .state('404', {
        url: '/404',
        views: {
          '': {
            templateUrl: '/views/404.html'
          }
        },
        data: {needLogin: false}
      })
      .state('index', {
        url: '/index',
        views: {
          '': {
            templateUrl: '/views/index.html',
            controller: 'indexController'
          }
        },
        data: {needLogin: false}
      })
      .state('join', {
        url: '/join',
        views: {
          '': {
            templateUrl: '/views/account/join.html',
            controller: 'joinController'
          }
        },
        data: {needLogin: false}
      })
      .state('activate', {
        url: '/activate/:id/:key',
        views: {
          '': {
            templateUrl: '/views/account/activate.html',
            controller: 'activateController'
          }
        },
        data: {needLogin: false}
      })
      .state('login', {
        url: '/login',
        views: {
          '': {
            templateUrl: '/views/account/login.html',
            controller: 'loginController'
          }
        },
        data: {needLogin: false}
      })
      .state('findpw', {
        url: '/findpw',
        views: {
          '': {
            templateUrl: '/views/account/findpw.html',
            controller: 'findpwController'
          }
        },
        data: {needLogin: false}
      })
      .state('resetpw', {
        url: '/resetpw/:id/:key',
        views: {
          '': {
            templateUrl: '/views/account/resetpw.html',
            controller: 'resetpwController'
          }
        },
        data: {needLogin: false}
      })
      .state('home', {
        url: '/home',
        views: {
          '': {
            templateUrl: '/views/home.html',
            controller: 'homeController'
          },
          'home@home': {
            templateUrl: '/views/home-trade.html',
            controller: 'homeTradeController'
          }
        },
        data: {needLogin: true}
      })
      .state('home.trade', {
        url: '/trade',
        views: {
          'home': {
            templateUrl: '/views/home-trade.html',
            controller: 'homeTradeController'
          }
        }
      })
      .state('home.topic', {
        url: '/topic',
        views: {
          'home': {
            templateUrl: '/views/home-topic.html',
            controller: 'homeTopicController'
          }
        }
      })
      .state('home.post', {
        url: '/post',
        views: {
          'home': {
            templateUrl: '/views/home-post.html',
            controller: 'homePostController'
          }
        }
      })
      .state('home.message', {
        url: '/message',
        views: {
          'home': {
            templateUrl: '/views/home-message.html',
            controller: 'homeMessageController'
          }
        }
      })
      .state('home.setting', {
        url: '/setting',
        views: {
          'home': {
            templateUrl: '/views/home-setting.html',
            controller: 'homeSettingController'
          }
        }
      })
      .state('user', {
        url: '/user/:id',
        views: {
          '': {
            templateUrl: '/views/user.html',
            controller: 'userController'
          }
        },
        data: {needLogin: false}
      })
      .state('room', {
        url: '/room/:id',
        views: {
          '': {
            templateUrl: '/views/room.html',
            controller: 'roomController'
          }
        },
        data: {needLogin: true}
      })
      .state('rank', {
        url: '/rank',
        views: {
          '': {
            templateUrl: '/views/rank.html',
            controller: 'rankController'
          }
        },
        data: {needLogin: false}
      })
      .state('rank.detail', {
        url: '/detail/:id',
        views: {
          'rank': {
            templateUrl: '/views/product-detail.html',
            controller: 'detailController'
          }
        },
        data: {needLogin: false}
      })
      .state('forum', {
        url: '/forum',
        views: {
          '': {
            templateUrl: '/views/forum/topic-list.html',
            controller: 'forumController'
          }
        },
        data: {needLogin: false}
      })
      .state('forum.topic', {
        url: '/topic/:id',
        views: {
          'forum': {
            templateUrl: '/views/forum/topic-detail.html',
            controller: 'topicController'
          }
        },
        data: {needLogin: false}
      })
      .state('faq', {
        url: '/faq',
        views: {
          '': {
            templateUrl: '/views/others/faq.html'
          }
        },
        data: {needLogin: false}
      })
      .state('protocol', {
        url: '/protocol',
        views: {
          '': {
            templateUrl: '/views/others/protocol.html'
          }
        },
        data: {needLogin: false}
      })
      .state('contact', {
        url: '/contact',
        views: {
          '': {
            templateUrl: '/views/others/contact.html'
          }
        },
        data: {needLogin: false}
      })
      .state('recruit', {
        url: '/recruit',
        views: {
          '': {
            templateUrl: '/views/others/recruit.html'
          }
        },
        data: {needLogin: false}
      })
      .state('about', {
        url: '/about',
        views: {
          '': {
            templateUrl: '/views/others/about.html'
          }
        },
        data: {needLogin: false}
      })
  });

// });