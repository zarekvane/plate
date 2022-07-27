function getStatisticsData(type, flag) {
    return new Promise((resolve)=>{
        gAjax({
            url: `/admin/statistics/${type}?flag=${flag}`,
            method: "get",
            success: function (data) {
                if (data.code == 200) {
                    resolve(data.data)
                } else {
                    alert(data.data);
                }
            },
            error: function () {
                alert("获取数据失败");
            },
        });
    })
}

function getCompareData(type, date) {
    return new Promise((resolve)=>{
        gAjax({
            url: `/admin/statistics/${type}?date=${date}`,
            method: "get",
            success: function (data) {
                if (data.code == 200) {
                    resolve(data.data)
                } else {
                    alert(data.data);
                }
            },
            error: function () {
                alert("获取数据失败");
            },
        });
    })
  
}

// part_one
const domDayAmount = document.getElementById("day_amount");
getStatisticsData('amounts', 1).then((res)=>{
    domDayAmount.innerHTML = res[0]?.amount
})

const domDayNumber = document.getElementById("day_number");
getStatisticsData('sales/order', 1).then((res)=>{
    domDayNumber.innerHTML = res[0]?.order_sales
})

const domDayCompare = document.getElementById("day_compare");
getCompareData('compare', getNowFormatDay()).then((res)=>{
    domDayCompare.innerHTML = res + '%'
})


// part_two
/* 1.一周营业额的曲线图 */
var week_amount_chart = echarts.init(document.getElementById('week_amount'));
var week_amount_data = { flag: [], data: []}
getStatisticsData('amounts', 2).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            week_amount_data.flag.push(e.date)
            week_amount_data.data.push(e.amount)
        })
    }
    week_amount_chart.setOption(week_amount_option);
})
var week_amount_option = {
  title: {
    text: '一周营业额的曲线图',
    textStyle:{
        //文字颜色
        color:'white',
        //字体风格,'normal','italic','oblique'
        fontStyle:'normal',
        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
        fontWeight:'bold',
        //字体系列
        fontFamily:'sans-serif',
        //字体大小
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: week_amount_data.flag
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: week_amount_data.data,
      type: 'line'
    }
  ]
};


/* 2.一周消费单数的曲线图 */
var week_number_chart = echarts.init(document.getElementById('week_number'));
var week_number_data = { flag: [], data: []}
getStatisticsData('sales/order', 2).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            week_number_data.flag.push(e.date)
            week_number_data.data.push(e.order_sales)
        })
    }
    week_number_chart.setOption(week_number_option);
})
var week_number_option = {
  title: {
    text: '一周消费单数的曲线图',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: week_number_data.flag
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: week_number_data.data,
      type: 'line'
    }
  ]
};

week_number_chart.setOption(week_number_option);

// part_three
/* 3.一月营业额的曲线图 */
var month_amount_chart = echarts.init(document.getElementById('month_amount'));
var month_amount_data = { flag: [], data: []}
getStatisticsData('amounts', 3).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            month_amount_data.flag.push(e.date)
            month_amount_data.data.push(e.amount)
        })
    }
    month_amount_chart.setOption(month_amount_option);
})
var month_amount_option = {
  title: {
    text: '一月营业额的曲线图',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: month_amount_data.flag
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: month_amount_data.data,
      type: 'line'
    }
  ]
};

month_amount_chart.setOption(month_amount_option);


/* 4.一月消费单数的曲线图 */
var month_number_chart = echarts.init(document.getElementById('month_number'));
var month_number_data = { flag: [], data: []}
getStatisticsData('sales/order', 3).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            month_number_data.flag.push(e.date)
            month_number_data.data.push(e.order_sales)
        })
    }
    month_number_chart.setOption(month_number_option);
})
var month_number_option = {
  title: {
    text: '一月消费单数的曲线图',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: month_number_data.flag
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: month_number_data.data,
      type: 'line'
    }
  ]
};

month_number_chart.setOption(month_number_option);

// part_four
/* day_plate_amount */
var day_plate_chart = echarts.init(document.getElementById('day_plate_amount'));
var day_plate_data = { flag: [], data: []}
getStatisticsData('sales/plate', 1).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            day_plate_data.flag.push(e.plate_name)
            day_plate_data.data.push(e.plate_sales)
        })
    }
    day_plate_chart.setOption(day_plate_option);
})
var day_plate_option = {
  title: {
    text: '一日内各种盘子的销量',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    data: day_plate_data.flag
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: day_plate_data.data
    }
  ]
};

/* week_plate_amount */
var week_plate_chart = echarts.init(document.getElementById('week_plate_amount'));
var week_plate_data = { flag: [], data: []}
getStatisticsData('sales/plate', 2).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            week_plate_data.flag.push(e.plate_name)
            week_plate_data.data.push(e.plate_sales)
        })
    }
    week_plate_chart.setOption(week_plate_option);
})
var week_plate_option = {
  title: {
    text: '一周内各种盘子的销量',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    data: week_plate_data.flag
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: week_plate_data.data
    }
  ]
};


/* month_plate_amount */
var month_plate_chart = echarts.init(document.getElementById('month_plate_amount'));
var month_plate_data = { flag: [], data: []}
getStatisticsData('sales/plate', 3).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            month_plate_data.flag.push(e.plate_name)
            month_plate_data.data.push(e.plate_sales)
        })
    }
    month_plate_chart.setOption(month_plate_option);
})
var month_plate_option = {
  title: {
    text: '一月内各种盘子的销量',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    data: month_plate_data.flag
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: month_plate_data.data
    }
  ]
};

/* total_plate_amount */
var total_plate_chart = echarts.init(document.getElementById('total_plate_amount'));
var total_plate_data = { flag: [], data: []}
getStatisticsData('sales/plate', 0).then((res)=>{
    if(res instanceof Array){
        res.forEach((e) => {
            total_plate_data.flag.push(e.plate_name)
            total_plate_data.data.push(e.plate_sales)
        })
    }
    total_plate_chart.setOption(total_plate_option);
})
var total_plate_option = {
  title: {
    text: '所有的各种盘子的销量',
    textStyle:{
        color:'white',
        fontStyle:'normal',
        fontWeight:'bold',
        fontFamily:'sans-serif',
　　　　 fontSize:18
    }
  },
  tooltip: {},
  xAxis: {
    data: total_plate_data.flag
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: total_plate_data.data
    }
  ]
};