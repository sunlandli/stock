'use strict';

var strdt = "2013-09-12 23:14:03.0" ;
var datetime = strdt.split(".")[0];
var strToday = datetime.split(" ")[0];
var strTime = datetime.split(" ")[1];

// 开始接收和显示tick数据
/*msg.registerHandler('onTick', onTick);*/
/*// 主调服务器上的函数。*/
/**//*msg.remoteCall('reqTick', { 'contract': 'IH1509.SHFE' , 'requestId': 1}, function (data) {*/
/*msg.remoteCall('reqTick', { 'contract': 'CCTEST.SHFE' , 'requestId': 1}, function (data) {*/
/*console.log(data.data);*/

/*});*/

/**
 * @brief 把字符串时间转化为数组索引。
 *
 * @param strDateTime { String }
 *
 * @return
 */
function dt2index(strDateTime) {
    var strToday = strDateTime.split(" ")[0],
        strTime = strDateTime.split(" ")[1],
        moringStart = strToday + " " + "09:15",
        moringEnd = strToday + " " + "11:30",
        afternoonStart = strToday + " " + "13:00",
        afternoonEnd = strToday + " " + "15:00",
        timeUnit = 1000 * 60;  // 一分钟为单位。

    var moringStartIndex = 0;
    var moringEndIndex = (Date.parse(moringEnd)-Date.parse(moringStart)) / timeUnit;
    var afternoonStartIndex = (Date.parse(afternoonStart)-Date.parse(moringStart)) / timeUnit;
    var afternoonEndIndex = (Date.parse(afternoonEnd)-Date.parse(moringStart)) / timeUnit;
    var interval = afternoonStartIndex - moringEndIndex;

    console.log(moringStart);
    console.log(moringEnd);
    console.log(afternoonStart);
    console.log(afternoonEnd);

    diff = (Date.parse(strDateTime)-Date.parse(moringStart)) / timeUnit;
    if (diff > moringEndIndex ) {
       return diff - interval;
    } else
       return diff;


    /*console.log(moringStartIndex);*/
    /*console.log(moringEndIndex);*/
    /*console.log(afternoonStartIndex);*/
    /*console.log(afternoonEndIndex);*/

    /*console.log("------------");*/
    /*console.log((moringEndIndex - moringStartIndex) + (afternoonEndIndex - afternoonStartIndex));*/
    /*console.log((4 * 3600 + 15 * 60));*/
    /*console.log("------------");*/

            /*console.log(interval);*/

}


/**
 * @brief 获取分时数据的数组长度，即横坐标。
 *
 * @param strDateTime
 *
 * @return  { int } 长度
 */
function getInterval(date, timeUnit) {
  /// @todo 计算早于当天的, 区分股票和期货
  /// @todo  没有历史数据的化，会从开始的地方显示，时间点对应不上。
    var moringStart = date.setHours(9, 30, 0);
    var moringEnd = date.setHours(11, 30, 0);
    var afternoonStart = date.setHours(13, 0, 0);
    var afternoonEnd = date.setHours(15, 0, 0);

    var moringStartIndex = 0;
    var moringEndIndex = (moringEnd-moringStart)/timeUnit;
    var afternoonStartIndex = (afternoonStart-moringStart)/timeUnit;
    var afternoonEndIndex = (afternoonEnd-moringStart)/timeUnit;
    var interval = afternoonStartIndex - moringEndIndex;
    var number = afternoonEndIndex - interval;
    var timestamp = [];
    var i = 1;
    if (timeUnit == 60000) {
      i = 0;     // 针对分钟线做特殊处理
    };
    for (; i < number+1; i++) {
      var stamp = moringStart + (i * timeUnit);
      if (i > moringEndIndex) {
        stamp += interval * timeUnit;
      };
      timestamp.push(stamp);
    };
    var strTimeStamp = timestamp.map(function (elem) {
      return moment(elem).format("HH:mm:ss");
    })
    return strTimeStamp;
}




var Charts = {
  initOption: function() {
    var option = {
      backgroundColor: "#fff",
      animation: false,
      tooltip : {
        trigger: 'axis',
        showDelay: 0,
        hideDelay: 50,
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 2,
        padding: 10, // [5, 10, 15, 20]
        backgroundColor: 'rgba(255,255,255,0.7)',
        textStyle: { color:'#333' },
        axisPointer: { // 参考线
          type: 'cross',
          lineStyle: {
            color: '#48b',
            width: 2,
            type: 'solid'
          },
          crossStyle: {
            color: '#1e90ff',
            width: 1,
            type: 'dashed'
          },
          shadowStyle: {
            color: 'rgba(150,150,150,0.3)',
            width: 'auto',
            type: 'default'
          }
        },
        formatter: function (params) {
          var res = params[0].name;
          if (params[0].value instanceof Array) {
            res += '<br/>' + params[0].seriesName;
            res += '<br/>  开盘 : ' + params[0].value[0] + '  最高 : ' + params[0].value[3];
            res += '<br/>  收盘 : ' + params[0].value[1] + '  最低 : ' + params[0].value[2];
          } else {
            /*res += '<br/>分时量';*/
            /*res += ' : ' + params[0].value + ' 万';*/
            res += '<br/>价格';
            res += ' : ' + params[0].value;
          }
          return res;
        }
      },
      grid: {
        borderWidth: 0,
        borderColor: 'green', //网格左右边框颜色
        x: 70,
        y: 30,
        x2: 70, //相当于网格的外边距
        y2: 50
      },
      xAxis: [
        {
          type : 'category',
          boundaryGap : false,
          axisTick: {onGap:false},
          splitLine: {show:false},
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999'
            },
          }, // 横轴
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          },
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value',
          scale:true,
          splitNumber: 5,
          axisLabel: {
            textStyle: {color: '#999'}
          },
          axisLine: {
            show: true,
            lineStyle: {color: '#999'},
            formatter: function (value){
              return value.toFixed(1);
            }
          }, // 纵坐标
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //   color: ['#999'],
          //   width: 1,
          //   type: 'solid'
          //   }
          // }, // 网格横线
          boundaryGap: [0.01, 0.01]
        }
      ],
    };  // end of option

    return option;
  },

  createChart: function(elemId, $scope) {
    var myChart = echarts.init(document.getElementById(elemId));
    // 过渡
    myChart.showLoading({
      text: '正在努力的读取数据中...',    //loading话术
    });

    // 鼠标事件
    myChart.on(echarts.config.EVENT.HOVER, function(callback) {
      /*$scope.stocks.open = callback.data[0];*/
      /*$scope.stocks.close = callback.data[1];*/
      /*$scope.stocks.high = callback.data[3];*/
      /*$scope.stocks.low = callback.data[2];*/
      /*$scope.$apply()*/
    });
    return myChart;
  },

  // 添加新的一根k线
  addData: function (x, y, chart) {
    chart.addData([
        [
          0,        // 系列索引
          y,
          false,     // 新增数据是否从队列头部插入
          false,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
          x,
        ],
    ]);
  },



 /**
  * @brief
  *
  * @param xData
  * @param yData
  * @param chart
  * @param option
  *
  * @return
  */
  plotRealTime: function(xData, yData, preClose, chart, option, update) {
    var temp = [];
    for (var i = 0; i < yData.length; i++) {
        if (yData[i]) {
          // 过滤NaN
          temp.push(yData[i]);
        };
    };
    var getMax = Math.max.apply(null, temp),
        getMin = Math.min.apply(null, temp),
        currentValue = preClose,
        diffOne,
        diffTwo,
        finalMax,
        finalMin,
        finalDiff;

    finalDiff = Math.max(Math.abs(currentValue-getMax), Math.abs(currentValue-getMin));

    finalMax = currentValue + finalDiff * 1.1;
    finalMin = currentValue - finalDiff * 1.1;
    if (!update) {
      chart.clear(); // 清空图表
    };
    option.dataZoom = {
      show: true,
      height: 20,
      realtime: false,
      start: 100,
      end: 0
    };

    option.xAxis = [{
        show: true,
        type: 'category',
        // splitNumber: 13,
        boundaryGap: false, //K线柱与边框的间距，true留白
        // scale: true,
        axisTick: {
            onGap: false
        },
        splitLine: {
            show: false,
            onGap: null
        }, // 网格的竖线
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        },
        axisLine: {
            show: false
        }, // 横坐标
        data: xData
    }];

    option.yAxis = [{
        show: true,
        type: 'value',
        scale: true,
        // splitNumber: 6,
        // boundaryGap: [0.1, 0.1],
        axisLine: {
            show: false
        }, // 纵坐标
        axisLabel: {
            textStyle: {
                color: '#ccc'
            },
            formatter: function (value){
              return parseFloat(value).toFixed(2);
            }
        },
        /*splitLine: {*/
        /*show: true,*/
        /*lineStyle: {*/
        /**//*color: ['#333'],*/
        /**//*width: 1,*/
        /*type: 'solid'*/
        /*}*/
        /*}, // 网格横线*/
        max: finalMax,
        min: finalMin,
        // scale: true,
        precision: 0
    }];

    //option.xAxis[0].data = xData
    option.series = [
      {
        name:'分时',
        type:'line',
        symbolSize: 0,
        itemStyle:{
          normal: {
            lineStyle: {
              type: 'solid',
              width: 2
            }
          }
        },

        markLine : {
          symbol : 'none',
          itemStyle : {
            normal : {
              color:'#1e90ff',
              label : {
                show:true,
                formatter: function (param) {
                  return param.value;
                }
              }
            }
          },
          data : [
            [
              {name: '标线1起点', value: preClose.toFixed(2), xAxis: -1, yAxis: preClose}, // 当xAxis为类目轴时，数值1会被理解为类目轴的index，通过xAxis:-1|MAXNUMBER可以让线到达grid边缘
              {name: '标线1终点', xAxis: xData.length, yAxis: preClose}, // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
            ]
          ]
        },
        data: yData
      },
      /*{*/
      /*name:'分时(柱状)',*/
      /*type:'bar',*/
      /*barWidth: 5,*/
      /*itemStyle: {*/
      /*normal: {*/
      /*barBorderWidth: 1*/
      /*}*/
      /*},*/
      /*data:[*/
      /*2334, 2638.5, 2537, 2597, 2503,*/
      /*2404, 2396, 2270, 2511, 2454,*/
      /*2407, 2423, 2602, 1995, 2130,*/
      /*2683, 2882, 2134, 2619, 2193,*/
      /*2727, 2011, 2551, 2020, 2380,*/
      /*2489, 2760, 2894.5, 2609, 2795.5*/
      /*]*/
      /*}*/
    ];
    chart.hideLoading();

    chart.setOption(option);

  },


  /**
   * @brief
   *
   * @param xData
   * @param yData
   * @param chart
   * @param option
   *
   * @return
   */
  plotKline: function(xData, yData, chart, option, update) {
    //Charts.createChart.dispose(); // 销毁图表
    if (!update) {
      chart.clear(); // 清空图表
      option.yAxis[0].min = undefined;
      option.yAxis[0].max = undefined;
      option.dataZoom = {
        show : true,
        height: 20,
        realtime: false,
        start : 100,
        end : 0
      };
    };

    option.xAxis[0].data = xData;
    option.series = [
      {
        name:'',
        type:'k',
        barMaxWidth: 20,
        itemStyle: {
          normal: {
            color: '#FF0033',    // 阳线填充颜色
            color0: '#99CC33',   // 阴线填充颜色
            lineStyle: {
              width: 1,
              color: '#FF0033',    // 阳线边框颜色
              color0: '#99CC33'    // 阴线边框颜色
            }
          },
          emphasis: {
            color: 'black',         // 阳线填充颜色
            color0: 'black'         // 阴线填充颜色
          }
        },
        data: yData
      }
    ];

    /*chart.hideLoading();*/
    chart.setOption(option);

  },

  dataZoom: function(chart, callback) {
    // 拖动
    chart.on(echarts.config.EVENT.DATA_ZOOM, callback);
  },

  dataViewChanged: function(chart, callback) {
    chart.on(echarts.config.EVENT.DATA_VIEW_CHANGED, callback);
  },

  click: function(chart, callback) {
    // 点击绘图
    chart.on(echarts.config.EVENT.CLICK, callback);
  },

  dbclick: function(chart, callback) {
    chart.on(echarts.config.EVENT.DBCLICK, callback);
  },

  restore: function(chart, callback) {
    chart.on(echarts.config.EVENT.RESTORE, callback);
  },

  refresh: function(chart, callback) {
    // 拖动刷新, 同dataZoom
    chart.on(echarts.config.EVENT.REFRESH, callback);
  },

  mouseout: function(chart, callback) {
    // 离开绘图
    chart.on(echarts.config.EVENT.MOUSEOUT, callback);
  },

  dataChanged: function(chart, callback) {
    chart.on(echarts.config.EVENT.DATA_CHANGED, callback);
  }

};




