
function makeProductLine(xData, yData) {
  var myLine = echarts.init(document.getElementById('myLine'));

  // 过渡---------------------
  myLine.showLoading({
      text: '正在努力的读取数据中...',    //loading话术
  });

  var getMax = Math.max.apply(null, yData),
      getMin = Math.min.apply(null, yData);

  option = {
      // title : {
      //     text: '未来一周气温变化',
      //     subtext: '纯属虚构'
      // },
      tooltip : {
          trigger: 'axis',
          formatter: function (params){
            console.log('------------params----------------');
            console.log(params);
            var num = 0 + params[0].value;

            var res = params[0].name;
            res += '<br>' + params[0].seriesName

            if(num >= 100000000 || num <= -100000000) { // 亿
              return res += '<br>' + (num/100000000).toFixed(1).replace(/\.0$/, '') + '亿元';
            };
            if(num >= 10000 || num <= -10000) { // 万
              return res += '<br>' + (num/10000).toFixed(1).replace(/\.0$/, '') + '万元';
            };
            if(params[0].value == '-') {
              return res += '<br>' + params[0].value;
            };
            return res += '<br>' + num.toFixed(1).replace(/\.0$/, '') + '元';
          }
      },
      // legend: {
      //     data:['最高气温','最低气温']
      // },
      // toolbox: {
      //     show : true,
      //     feature : {
      //         mark : {show: true},
      //         dataView : {show: true, readOnly: false},
      //         magicType : {show: true, type: ['line', 'bar']},
      //         restore : {show: true},
      //         saveAsImage : {show: true}
      //     }
      // },
      // calculable : true,
      xAxis : [
          {
              // show: false,
              type : 'category',
              boundaryGap : false,
              data : xData
          }
      ],
      yAxis : [
          // show: false,
          {
              type: 'value',
              name: '资金(万元)',
              min: getMin,
              max: getMax,
              // axisLabel : {
              //     formatter: '{value} %'
              // }
              boundaryGap: [0.1, 0.1],
              axisLabel: {
                formatter: function (value){
                  // return ((value-yData[0])/yData[0]*100).toFixed(1) + '%';
                  return (value/10000).toFixed(0);
                }
              }
          }
      ],
      series : [
          {
              name: '资金',
              type: 'line',
              symbolSize: 3,
              data: yData
          }
      ]
  };

  myLine.hideLoading();

  myLine.setOption(option);

}
