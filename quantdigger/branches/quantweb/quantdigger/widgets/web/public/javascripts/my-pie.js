function makePie(data) {
  var myPie = echarts.init(document.getElementById('myPie'));
  // 过渡---------------------
  myPie.showLoading({
    text: '正在努力的读取数据中...', //loading话术
  });

  option = {
    // title : {
    //     text: '某站点用户访问来源',
    //     subtext: '纯属虚构',
    //     x:'center'
    // },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // legend: {
    //     orient : 'vertical',
    //     x : 'left',
    //     data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    // },
    // toolbox: {
    //     show : true,
    //     feature : {
    //         mark : {show: true},
    //         dataView : {show: true, readOnly: false},
    //         magicType : {
    //             show: true,
    //             type: ['pie', 'funnel'],
    //             option: {
    //                 funnel: {
    //                     x: '25%',
    //                     width: '50%',
    //                     funnelAlign: 'left',
    //                     max: 1548
    //                 }
    //             }
    //         },
    //         restore : {show: true},
    //         saveAsImage : {show: true}
    //     }
    // },
    calculable: true,
    series: [{
      name: '交易笔数',
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: data
    }]
  };

  myPie.hideLoading();

  myPie.setOption(option);
}


function makeBar(xData, yData) {
  var myBar = echarts.init(document.getElementById('myBar'));
  // 过渡---------------------
  myBar.showLoading({
    text: '正在努力的读取数据中...', //loading话术
  });

  option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params){
        // console.log('------------params----------------');
        // console.log(params);
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
    calculable: true,
    xAxis: [{
      type: 'category',
      boundaryGap : true,
      data: xData
    }],
    yAxis: [{
      type: 'value',
      name: '日收益(万元)',
      axisLabel: {
        formatter: function (value){
          var num = 0 + value;
          return (num/10000).toFixed(1).replace(/\.0$/, '');
        }
      }
    }],
    series: [{
      name: '日收益',
      type: 'bar',
      data: yData
    }]
  };

  myBar.hideLoading();

  myBar.setOption(option);
}