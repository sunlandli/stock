var session = JSON.parse(localStorage.getItem('session')), gUser;
new Date().getTime() - (session && session.expires || 0) < 0
  ? gUser = session.gUser
  : gUser = null;

//保留两位小数
var fixed2 = function(val){
    return val.toFixed(2);
};
//高亮普通
var highlihtNormal = function(val){
    if(val > 0){
        return '<span class="red">' + fixed2(val) + '</span>';
    }else if(val < 0){
        return '<span class="green">' + fixed2(val) + '</span>';
    }
    return fixed2(val);
};
//高亮百分比
var highlihtPercent = function(val){
    if(val > 0){
        return '<span class="red">' + fixed2(val) + '%</span>';
    }else if(val < 0){
        return '<span class="green">' + fixed2(val) + '%</span>';
    }
    return fixed2(val) + '%';
};
/*设置cookie*/
function setCookie(name, value, iDay) {
  var oDate=new Date();
  oDate.setDate(oDate.getDate()+iDay);
  document.cookie=name+'='+value+';expires='+oDate;
};
/*获取cookie*/
function getCookie(name) {
  var arr=document.cookie.split('; '); //多个cookie值是以; 分隔的，用split把cookie分割开并赋值给数组
  for(var i=0;i<arr[i].length;i++) {//历遍数组
    var arr2=arr[i].split('='); //原来割好的数组是：user=simon，再用split('=')分割成：user simon 这样可以通过arr2[0] arr2[1]来分别获取user和simon
    if(arr2[0]==name) //如果数组的属性名等于传进来的name
    {
      return arr2[1]; //就返回属性名对应的值
    }
    return ''; //没找到就返回空
  }
};
/*删除cookie*/
function removeCookie(name) {
  setCookie(name, 1, -1); //-1就是告诉系统已经过期，系统就会立刻去删除cookie
};

// 首页 & 排行榜走势图
// echarts======================================
function makeProductRankChart(xData, yData, domId) {

  var myRankChart = echarts.init(document.getElementById(domId));

  // 过渡---------------------
  myRankChart.showLoading({
    text: '正在努力的读取数据中...', //loading话术
  });

  var getMax = Math.max.apply(null, yData),
    getMin = Math.min.apply(null, yData);
  finalDiff = Math.max(Math.abs(getMax-1000000),
                       Math.abs(getMin-1000000));
  getMax = 1000000+finalDiff*1.1;
  getMin = 1000000-finalDiff*1.1;
  if (getMax == getMin) {
    getMax = getMax + 50000;
    getMin = getMin - 50000;
  };

  option = {
    // title : {
    //     text: '某楼盘销售情况',
    //     subtext: '纯属虚构'
    // },
    // tooltip : {
    //     trigger: 'axis'
    // },
    // legend: {
    //     data:['意向','预购','成交']
    // },
    // toolbox: {
    //     show : true,
    //     feature : {
    //         mark : {show: true},
    //         dataView : {show: true, readOnly: false},
    //         magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
    //         restore : {show: true},
    //         saveAsImage : {show: true}
    //     }
    // },
    backgroundColor: "#fff",
    calculable: true,
    grid: {
      borderWidth: 0,
      borderColor: 'green', //网格左右边框颜色
      x: 0,
      y: 0,
      x2: 0, //相当于网格的外边距
      y2: 0
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#999'
        },
      }, // 横轴
      splitLine: {
        show: false,
        lineStyle: {
          color: ['#999'],
          width: 1,
          type: 'solid'
        }
      }, // 网格横线
      // data : ['周一','周二','周三','周四','周五','周六','周日']
      data: xData
    }],
    yAxis: [{
      type: 'value',
      min: getMin,
      max: getMax,
      splitLine: {
        show: false,
        lineStyle: {
          color: ['#999'],
          width: 1,
          type: 'solid'
        }
      }, // 网格横线
    }],
    series: [{
      name: '意向',
      type: 'line',
      smooth: true,
      symbolSize: 0,
      itemStyle: {
        normal: {
          lineStyle: {
            color: '#517DF8',
            type: 'solid',
            width: 1
          },
          areaStyle: {
            type: 'default',
            color: '#E2F3FF'
          }
        }
      },
      // data:[1320, 1132, 601, 234, 120, 90, 20]
      data: yData
    }]
  };

  myRankChart.hideLoading();

  myRankChart.setOption(option);

}
// echarts======================================


//返回顶部
// var $backTop = $('.back-top');
// $backTop.hide();
// $(window).scroll(function() {
//     if ($(window).scrollTop() > 100) {
//         $backTop.fadeIn(500);
//     } else {
//         $backTop.fadeOut(500);
//     }
// });
// $('.go').click(function() {
//     $('body,html').animate({
//         scrollTop: 0
//     }, 500);
//     return false;
// });
