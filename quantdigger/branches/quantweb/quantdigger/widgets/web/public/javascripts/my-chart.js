var myChart = echarts.init(document.getElementById('myChart'));

/*var msg = new Message(socket1);*/


/*dt2index(strdt);*/





// 注册回调消息处理函数。
var priceUpdate = $('.latest-num');
var volumeUpdate = $('.deal-num');
var settleUpdate = $('.settle-num');
var diffUpload = $('.ups-downs-num');
var incUpload = $('.increase-num');



// 过渡---------------------
myChart.showLoading({
    text: '正在努力的读取数据中...',    //loading话术
});

var datetime = []; // 时间数据
var datetimek = []; // 时间数据
var num = [];     // 价格数据
var gdata = []
var option = { };

function displayChart(yesterdayClose) {
    // 重绘中线。
    var interval = getInterval(strdt),
        num = [];
    for (var i = 0; i < interval; i++) {
        /*gdata.push(3300);*/
        datetime.push("2015-04-12 10:04:04");
        num.push(yesterdayClose);
    };

    /*for (var i = 0; i < 100; i++) {*/
    /*var cc = [];*/
    /*cc.push(res[i].open, res[i].close, res[i].low, res[i].high);*/
    /*datetimek.push(res[i].datetime);*/
    /*num.push(cc);*/
    /*};*/


option = {

    backgroundColor: "#191F26", //图标背景颜色
    color: [
        // 'red', 'green', 'blue', 'yellow'
        '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
        '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
    ],
    animation: false,
    calculable: false, //托拽重计量
    calculableColor: 'rgba(255,0,0,1)',

    title: {
        show: false, //显示标题
        link: 'https://www.baidu.com', //标题链接
        x: 'left', //在水平线上的位置
        text: '2010年第二季上证指数',
        backgroundColor: "rgba(0,0,88,0)", //标题背景颜色
        borderColor: '#ccc',
        borderWidth: 1,
        itemGap: 20 //与副标题的纵向间距
    },
    tooltip: {
        showContent: true, //显示主题内容
        trigger: 'axis', // item or axis
        showDelay: 0,
        hideDelay: 50,
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 2,
        padding: 10, // [5, 10, 15, 20]
        formatter: function(params) {
            var res = /* params[0].seriesName + */ '时间 : ' + params[0].name;
            res += '<br/>  开盘 : ' + params[0].value[0] + '  最高 : ' + params[0].value[3];
            res += '<br/>  收盘 : ' + params[0].value[1] + '  最低 : ' + params[0].value[2];
            return res;
        },
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
        }
    },
    legend: { // 图例
        show: true,
        x: 'left',
        selectedMode: 'single', //图例选择的开关true or false/ 可选single，multiple
        selected: {
            '1分钟': true,
            '3分钟': false,
            '5分钟': false,
            '10分钟': false,
            '15分钟': false,
            '30分钟': false
                // '分时图' : false
        },
        data: ['1分钟', '3分钟', '5分钟', '10分钟', '15分钟', '30分钟', '分时图']
    },
    grid: {
        borderWidth: 0,
        borderColor: 'green', //网格左右边框颜色
        x: 50,
        y: 50,
        x2: 10, //相当于网格的外边距
        y2: 50
    },
    // toolbox: {  // 工具栏
    //   show : true,
    //   orient: 'horizontal', //vertical or horizontal
    //   color: ['red','green','blue','yellow'],  // 图标颜色 循环使用
    //   feature : {
    //     mark : {show: true},
    //     dataZoom : {show: true},
    //     dataView : {show: true, readOnly: false},
    //     magicType: {show: true, type: ['line', 'bar']},
    //     restore : {show: true},
    //     saveAsImage : {show: true}
    //   }
    // },
    dataZoom: { // 数据缩放
        show: true,
        realtime: true,
        position: 'top',
        start: 0,
        end: 100,
        height: 30,
        showDetail: false,
        zoomLock: false //锁定手柄间宽度
    },
    polar: {
        axisLine: {
            show: true,
            width: 2
        }
    },
    xAxis: [{
        show: false,
        type: 'category',
        boundaryGap: true, //K线柱与边框的间距，true留白
        scale: true,
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
        data: datetime
    }],
    // 初始化的时候显示k线
    /*series: [{*/
    /*itemStyle: {*/
    /*normal: {*/
    /*color: '#FF0033', // 阳线填充颜色*/
    /*color0: '#99CC33', // 阴线填充颜色*/
    /*lineStyle: {*/
    /*width: 1,*/
    /*color: '#FF0033', // 阳线边框颜色*/
    /*color0: '#99CC33' // 阴线边框颜色*/
    /*}*/
    /*}*/
    /*// emphasis: { // 鼠标滑过*/
    /*//     color0: 'green'          // 阴线填充颜色*/
    /*// }*/
    /*},*/
    /*name: '1分钟',*/
    /*type: 'k',*/
    /*data: num,*/

    /*}*/
    /*],*/

    series: [
            // 中间线
            {
                name: '分时图',
                type: 'line',
                symbolSize: 0,
                data: num,

                    itemStyle : {
                        normal : {
                            color:'white',
                            label : {
                                show:false,
                            },
                            lineStyle:{
                                type: 'dotted'
                            }
                        }
                    },

            },
            {
            name: 'realtime',
            type: 'line',
            symbolSize: 0,
            data: [],

            itemStyle : {
                normal : {
                    color:'#1e90ff',
                    /*label : {*/
                    /*show:true,*/
                    /*formatter: function (param) {*/
                    /*return Math.round(param.value/1000) + ' 万'*/
                    /*}*/
                    /*},*/
                }
            },
        }


        ],

    yAxis: [{
        show: true,
        type: 'value',
        scale: true,
        boundaryGap: [0.1, 0.1],
        axisLine: {
            show: false
        }, // 纵坐标
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#333'],
                width: 1,
                type: 'solid'
            }
        }, // 网格横线
        max: parseInt(yesterdayClose*1.001)+2,
        min: parseInt(yesterdayClose*0.999)-2,
        // scale: true,
        precision: 3,
        // splitNumber: 6, // 横线分割条数

    }],
};

console.log("--------" );
    // console.log(parseInt(yesterdayClose*0.9));
    console.log(yesterdayClose*1.1);
    console.log(yesterdayClose*0.9);
console.log("--------" );
    // ajax callback
    myChart.hideLoading();

    // 为echarts对象加载数据
    myChart.setOption(option);


}

var firstTick = true;

function onTick(data) {
    priceUpdate.text(parseFloat(data.price).toFixed(2));
    volumeUpdate.text(data.volume);
    settleUpdate.text(data.preClosePrice);
    var diff = data.price-parseFloat(data.preClosePrice).toFixed(2);
    var inc = diff / data.preClosePrice * 100; 
    diffUpload.text(diff.toFixed(2));
    incUpload.text(inc.toFixed(2).toString() + "%");

    if (firstTick) {
        displayChart(parseFloat(data.price));
        firstTick = false;
    } else {
        option.series[1].data.push(parseFloat(data.price));
        myChart.setOption(option);
        console.log(data.price);
    }
}


/*$.ajax({*/
/*url: '/getData',*/
/*type: 'POST',*/
/*dataType: 'json',*/
/*data: {data: "done"},*/
/*}).done(function(res) {*/

/*displayChart();*/

/*}).fail(function() {*/
/*console.log("error");*/
/*}).always(function() {*/
/*console.log("complete");*/
/*});*/




// 增加些数据------------------
// option.legend.data.push('win');
// option.series.push({
//         name: 'win',                            // 系列名称
//         type: 'line',                           // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
//         data: [112, 23, 45, 56, 233, 343, 454, 89, 343, 123, 45, 123]
// });
 

// 动态添加默认不显示的数据
myChart.on(echarts.config.EVENT.HOVER, function(callback) {
    $('.open-num').text(callback.data[0]);
    $('.close-num').text(callback.data[1]);
    $('.high-num').text(callback.data[3]);
    $('.low-num').text(callback.data[2]);
});

function plotKline() {
    console.log("kline...");

                option.series = [{
                    name:'1分钟',
                    type:'k',
                    data:num
                }];

    option.xAxis= [{
        show: true,
        type: 'category',
        boundaryGap: true, //K线柱与边框的间距，true留白
        scale: true,
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
        data: datetimek
    }];
    console.log(num.length);
    console.log(datetimek.length);


                // option.legend.selected['1分钟'] = false;
myChart.hideLoading();
myChart.setOption(option);
console.log(option.xAxis);

}

function plotRealTime() {
        var len;
        var added;
        len = option.series.length;
        added = false;
        while (len--) {
            if (option.series[len].name == '分时图') {
                // 已经添加
                added = true;
                break;
            }
        }
        if (!added) {
            // timeout
            myChart.showLoading({
                text: '数据获取中',
                effect: 'whirling'
            });

            // 模拟加载第一次数据
                var lineData = [];
                //for(var i=0; i < num.length - 1; i++) {
                // 初始数据
                /*for (var i = 0; i < 10; i++) {*/
                /*lineData.push(num[i][3]);*/
                /*};*/
                //}

                // 新加数据
                option.series.push({
                    name: '分时图',
                    type: 'line',
                    symbolSize: 0,
                    data: lineData,

                });

                option.series.push({
                    name: 'ss',
                    type: 'line',
                    symbolSize: 0,
                    data: [3300, 3300, 3300, 3300, 3300, 3300],

                        itemStyle : {
                            normal : {
                                color:'#1e90ff',
                                label : {
                                    show:true,
                                    formatter: function (param) {
                                        return Math.round(param.value/1000) + ' 万'
                                    }
                                },
                                lineStyle:{
                                    type: 'dotted'
                                }
                            }
                        },
                });
                // option.legend.selected['1分钟'] = false;
                myChart.hideLoading();
                myChart.setOption(option);
            }


            // 启动最新数据模拟加载。
            var tt, ii = 0;
            tt = setInterval(function() {
                option.series[1].data.push(3400);
                myChart.setOption(option);
                ii++;
                if (ii > 50) {
                    clearInterval(tt);  // 取消模拟
                };
            }, 1000);

}

myChart.on(echarts.config.EVENT.LEGEND_SELECTED, function(param) {
    var selected = param.selected;
    if (selected['分时图']) {
        plotRealTime();
    }

    if (selected['1分钟']) {
        plotKline();
    }
});
// myChart.setOption(option);


// 图表清空-------------------
// myChart.clear();

// 图表释放-------------------
// myChart.dispose();


function setData(data) {
    // 卖出
    $('.sell-num').text(data.xx);
    $('.sell-share').text(data.xx);
    // 买入
    $('.buy-num').text(data.xx);
    $('.buy-share').text(data.xx);
    // 最新
    $('.latest-num').text(data.xx);
    // 昨结
    $('.settle-num').text(data.xx);
    // 涨跌
    $('.ups-downs-num').text(data.xx);
    // 涨幅
    $('.increase-num').text(data.xx);
    // 成交
    $('.deal-num').text(data.xx);
    // 开盘
    $('.open-num').text(data.xx);
    // 持仓
    $('.hold-num').text(data.xx);
    // 最高
    $('.high-num').text(data.xx);
    // 日增
    $('.mount-num').text(data.xx);
    // 最低
    $('.low-num').text(data.xx);
    // 涨停
    $('.limit-up-num').text(data.xx);
    // 均价
    $('.average-num').text(data.xx);
    // 跌停
    $('.limit-down-num').text(data.xx);
    // 昨收
    $('.close-num').text(data.xx);
}



