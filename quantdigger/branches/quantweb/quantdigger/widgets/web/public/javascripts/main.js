requirejs.config({
  baseUrl: '/javascripts',
  paths: {
    jquery: 'libs/jquery/jquery-1.11.2.min',
    angular: '//cdn.bootcss.com/angular.js/1.3.13/angular.min',
    uiRouter: '//cdn.bootcss.com/angular-ui-router/0.2.15/angular-ui-router.min',
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    uiRoute: {
      exports: 'uiRoute'
    }
  }
});

requirejs([
  'domReady',
  'angular',
  'app',
  'config/config',
  'message',
  'libs/loglevel',
  'services/services',
  'directives/directive',
  'directives/angucomplete',
  'controllers/controllers',
  'controllers/room-controller',
  ], function(domReady, angular, app) {
    domReady(function() {
      angular.bootstrap(document, [app.name]);//启动angularjs 就可以
    });
});
