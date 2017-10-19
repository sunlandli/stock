/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

// angular.module('angucomplete', ["myServices"] )

// define(['../app', '../services/services'], function(app) {

    'use strict';

    angular.module('app.angucomplete', ['app.services'])

    .directive('angucomplete', ['$parse', '$sce', '$timeout', 'application', function ($parse, $sce, $timeout, application) {
        return {
            restrict: 'EA',
            scope: {
                "id": "@id",
                "placeholder": "@placeholder", // 默认填充
                "selectedObject": "=selectedobject", // 把选中结果赋值给外层scope
                "url": "@url", // 请求地址 GET方式
                "dataField": "@datafield", // 返回查询对象json的名称
                "titleField": "@titlefield",
                "descriptionField": "@descriptionfield",
                "imageField": "@imagefield",
                "imageUri": "@imageuri",
                "inputClass": "@inputclass", // input的样式类
                "userPause": "@pause",  // 延时
                "localData": "=localdata", // 本地数据
                "callback": "&callback",
                "searchFields": "@searchfields",
                "minLengthUser": "@minlength",
                "matchClass": "@matchclass" // 匹配字符的样式
            },
            templateUrl: '/views/includes/angucomplete.html',

            link: function($scope, elem, attrs) {
                $scope.lastSearchTerm = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.hideTimer = null;
                $scope.searching = false; // true 显示“正在搜索。。。”
                $scope.pause = 500;
                $scope.minLength = 3;
                $scope.searchStr = null;

                if ($scope.minLengthUser && $scope.minLengthUser != "") {
                    $scope.minLength = $scope.minLengthUser;
                }

                if ($scope.userPause) {
                    $scope.pause = $scope.userPause;
                }

                var isNewSearchNeeded = function(newTerm, oldTerm) {
                    return newTerm.length >= $scope.minLength && newTerm != oldTerm
                }

                // 匹配之后的菜单显示等操作, 未选中。
                $scope.processResults = function(responseData, str) {
                  // console.log(responseData);
                  // console.log("*******************");
                  // responseData = [
                  // { 'code': 'hello', 'name': 'ok' }
                  // ];


                    if (responseData && responseData.length > 0) {
                        $scope.results = [];

                        var titleFields = [];
                        if ($scope.titleField && $scope.titleField != "") {
                            titleFields = $scope.titleField.split(","); //
                        }

                        for (var i = 0; i < responseData.length; i++) {
                            // Get title variables
                            var titleCode = [];

                            for (var t = 0; t < titleFields.length; t++) {
                                titleCode.push(responseData[i][titleFields[t]]);
                            }

                            var description = "";
                            if ($scope.descriptionField) {
                                description = responseData[i][$scope.descriptionField];
                            }

                            var imageUri = "";
                            if ($scope.imageUri) {
                                imageUri = $scope.imageUri;
                            }

                            var image = "";
                            if ($scope.imageField) {
                                image = imageUri + responseData[i][$scope.imageField];
                            }

                            var text = titleCode.join(' ');
                            // console.log(text);
                            if ($scope.matchClass) {
                              try {
                                var re = new RegExp(str, 'i');
                                var strPart = text.match(re)[0];
                                text = $sce.trustAsHtml(text.replace(re, '<span class="'+ $scope.matchClass +'">'+ strPart +'</span>'));
                              } catch(e) {
                                text = $sce.trustAsHtml(text);
                              }
                            }
                            // console.log(text);

                            var resultRow = {
                                title: text,
                                description: description,
                                image: image,
                                originalObject: responseData[i]
                            }

                            $scope.results[$scope.results.length] = resultRow;
                            // console.log($scope.results);
                        }


                    } else {
                        $scope.results = [];
                    }
                }

                // 搜索入口点
                /*$scope.searchTimerComplete = function(str) {*/
                /*if (str.length >= $scope.minLength) {*/
                /*if ($scope.localData) {  // 如果存在本地数据*/
                /*var searchFields = $scope.searchFields.split(",");*/
                /*console.log(searchFields);*/

                /*var matches = [];*/

                /*for (var i = 0; i < $scope.localData.length; i++) {*/
                /*var match = false;*/

                /*for (var s = 0; s < searchFields.length; s++) {*/
                /*match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);*/
                /*}*/

                /*if (match) {*/
                /*matches[matches.length] = $scope.localData[i];*/
                /*}*/
                /*}*/

                /*$scope.searching = false;*/
                /*$scope.processResults(matches, str);*/

                /*} else {*/
                /*$http.get($scope.url + str, {}).*/
                /*success(function(responseData, status, headers, config) {*/
                /*console.log(responseData);*/
                /*$scope.searching = false;*/
                /*$scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);*/
                /*}).*/
                /*error(function(data, status, headers, config) {*/
                /*console.log("error");*/
                /*});*/
                /*}*/
                /*}*/
                /*}*/


                // 搜索入口点
                $scope.searchTimerComplete = function(str) {
                    if (str.length >= $scope.minLength) {
                      application.dataManager.getAllContract(function (err, data) {
                        /*if (!err) {*/
                            console.log('#########搜索初始数据#########');
                            console.log(data);
                          $scope.responseData = data;

                          var searchFields = $scope.searchFields.split(",");
                          var matches = [];
                          for (var i = 0; i < $scope.responseData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                              match = match || (typeof $scope.responseData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.responseData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                              matches[matches.length] = $scope.responseData[i];
                            }
                          }
                          $scope.searching = false;
                          $scope.processResults(matches, str);
                          $scope.$apply();

                          /*};*/
                      });
                    }
                }

                $scope.hideResults = function() {
                    $scope.hideTimer = $timeout(function() {
                        $scope.showDropdown = false;
                    }, $scope.pause);
                };

                $scope.resetHideResults = function() {
                    if($scope.hideTimer) {
                        $timeout.cancel($scope.hideTimer);
                    };
                };

                $scope.hoverRow = function(index) {
                    $scope.currentIndex = index;
                }

                $scope.keyPressed = function(event) {
                    if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                        if (!$scope.searchStr || $scope.searchStr == "") {
                            $scope.showDropdown = false;
                            $scope.lastSearchTerm = null
                        } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                            $scope.lastSearchTerm = $scope.searchStr
                            $scope.showDropdown = true;
                            $scope.currentIndex = -1;
                            $scope.results = [];

                            if ($scope.searchTimer) {
                                $timeout.cancel($scope.searchTimer);
                            }

                            $scope.searching = true;

                            $scope.searchTimer = $timeout(function() {
                                $scope.searchTimerComplete($scope.searchStr);
                            }, $scope.pause);
                        }
                    } else {
                        event.preventDefault();
                    }
                }

                $scope.selectResult = function(result) {
                    if ($scope.matchClass) {
                        result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                    }
                    $scope.searchStr = $scope.lastSearchTerm = result.title;
                    $scope.selectedObject = result;
                    $scope.showDropdown = false;
                    $scope.results = [];
                    // 选中结果后发送一个POST请求

                    if ($scope.callback) {
                        // console.log(result);
                        $scope.callback({r:result.originalObject});
                    };
                }

                var inputField = elem.find('input');

                inputField.on('keyup', $scope.keyPressed);

                elem.on("keyup", function (event) {
                    if(event.which === 40) { //下箭头
                        if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                            $scope.currentIndex ++;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                        $scope.$apply();
                    } else if(event.which == 38) { //上箭头
                        if ($scope.currentIndex >= 1) {
                            $scope.currentIndex --;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 13) { // enter 键
                        if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                            $scope.selectResult($scope.results[$scope.currentIndex]);

                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        } else {
                            $scope.results = [];
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 27) { // esc 键
                        $scope.results = [];
                        $scope.showDropdown = false;
                        $scope.$apply();
                    } else if (event.which == 8) { // backspace 键
                        $scope.selectedObject = null;
                        $scope.$apply();
                    }
                });

            }
        };
    }]);

// })
