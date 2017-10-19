// var myDrective = angular.module('myDrective', ['myServices']);


// define(['../app', 'jquery', '../services/services'], function(app, $) {

  'use strict';

  angular.module('app.directives', ['app.services'])

  // 取消自选
  .directive('cancelStar', ['util', 'application', 'web',  function(util, application, web) {
    return {
      restrict: 'A',
      link: function($scope, elem, attrs) {

        elem.on('click', function() {
          /*if (!confirm('确认取消自选吗？')) {*/
          /*return false;*/
          /*};*/
          var dElem = $(this);
        switch(attrs.type) {
          case 'mycontracts':
              web.followContract(attrs.key, function (err, rst) {
                if (!err) {
                  dElem.parents('tr').remove();
                } else {
                  alert('删除自选失败！');
                }
              })
            break;

          case 'myProducts':
            web.removeProduct(attrs.key, function (err, rst) {
              if (!err) {
                dElem.parents('tr').remove();
                return;
              };
              console.log(err);
              alert('删除失败');
            })
            break;

          case 'followProducts':
            application.dataManager.followProduct(attrs.key, function (err, rst) {
              if (!err) {
                dElem.parents('tr').remove();
                return;
              };
            })
          default:

        }
        });
      }
    };
  }])

  // 导航栏滚动隐藏
  .directive('userHeader', ['$window', '$document', function($window, $document) {
    return {
      restrict: 'A',
      link: function($scope, elem, attrs) {

        var oldScrollTop = 0;

        window.onscroll = function(event) {
          winScroll();
        };

        function winScroll() {
          var newScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          var diff = newScrollTop - oldScrollTop;

          if ( newScrollTop >= 100 || diff > 5 ) {
            elem.removeClass('u-navbar-hide').addClass('u-navbar-show');
          } else if ( newScrollTop < 100 || diff < -5 ) {
            elem.removeClass('u-navbar-show').addClass('u-navbar-hide');
          };

          oldScrollTop = newScrollTop;
        };

      }
    };
  }])

  .directive('isLoaded', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        $timeout(function() {
          scope.$emit('isLoaded');
        });
      }
    };
  }])

  // 交易室菜单
// .directive('makeRank', [function() {
//   return {
//     restrict: 'A',
//     link: function($scope, $elem, $attrs) {
      
//     }
//   };
// }])

  .directive('myMenu', [function() {
    return {
      restrict: 'A',
      scope: {
        'showList': '=ngShow'
      },
      link: function($scope, elem, attrs) {
        elem.on('mouseleave', function(event) {
          event.preventDefault();
          $scope.showList = false;
        });
      }
    };
  }])

// })
