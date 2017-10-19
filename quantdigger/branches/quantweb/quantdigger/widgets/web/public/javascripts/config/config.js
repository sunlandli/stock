define(['../app'], function(app) {
  // 设置模板变量标记
  app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
  }]);
  // 只运行一次，将路由参数赋值给$rootScope
  app.run(function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
  });
  // 路由
  app.config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/index');
      $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                  templateUrl: '/views/home.html',
                  controller: 'indexController'
                }
            }
        })
        .state('room', {
            url: '/room',
            views: {
                '': {
                  templateUrl: '/views/room.html',
                  controller: 'roomController'
                }
            }
        })
        .state('products', {
            url: '/products',
            views: {
                '': {
                  templateUrl: '/views/product.html',
                  // controller: 'roomController'
                }
            }
        })
        .state('create', {
            url: '/create',
            views: {
                '': {
                  templateUrl: '/views/create.html'
                }
            }
        })
  });

});