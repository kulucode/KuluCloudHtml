

function tableInit(datas) {
  //表格初始化
  layui.use("table", function() {
    var table = layui.table;
    pg_truck = $(".selectCarplate").val();
    pg_sdate = $("#test5").val();
    table.render({
      elem: "#test",
      url:
        "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=250&TTDT=json&opname=getTruckTraceList&TTSSID=" +
        datas +
        "&TTKEY=null&pg_truck=" +
        pg_truck +
        "&pg_sdate=" +
        pg_sdate +
        "&pg_num=0&pg_size=1000", //数据接口
      height: "full-750",
      cellMinWidth: 80, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      cols: [
        [
          {field: "tbindex", title: "ID", sort: true },
          {
            field: "team",
            title: "项目组",
            sort: true
          },
          {
            field: "name",
            title: "分段"
          }, //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
          {
            field: "trucktype",
            title: "设备类型",
            sort: true
          },
          {
            field: "truckno",
            title: "物料编号"
          },
          {
            field: "platenum",
            title: "编号"
          },
          {
            field: "fdate",
            title: "起始时间",
            align: "center"
          }, //单元格内容水平居中
          {
            field: "tdate",
            title: "终止时间",
            sort: true,
            align: "center"
          }, //单元格内容水平居中
          {
            field: "speed",
            title: "平均时速(km/h)",
            sort: true,
            align: "center"
          },
          {
            field: "distance",
            title: "行驶里程(km)"
          }
        ]
      ]
    });
  });
}

function echartsInit(timeX, timeY) {
  //图表初始化

  var myChart = echarts.init(document.getElementById("main"));
  option = {
    backgroundColor: "#253236",
    title: {
      text: "油耗总量",
      show: false,
      textStyle: {
        fontWeight: "normal",
        fontSize: 16,
        color: "#ffffff"
      },
      top: "80%",
      left: "center"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#333"
        }
      }
    },
    legend: {
      icon: "rect",
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      data: ["油耗总量"],
      right: "center",
      textStyle: {
        fontSize: 18,
        color: "#ffffff"
      },
      bottom: "5%"
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "20%",
      top:"15%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: "#ffffff"
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14,
            color: "#ffffff"
          }
        },
        data: timeX
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: "#ffffff"
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14,
            color: "#ffffff"
          }
        },
        splitLine: {
          lineStyle: {
            type: "solid",
            color: "#ccc"
          }
        }
      }
    ],
    series: [
      {
        name: "油耗总量",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#5fa5b0"
                },
                {
                  offset: 1,
                  color: "#38575e"
                }
              ],
              false
            ),
            shadowColor: "#38575e",
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: "#50b4c8",
            borderColor: "rgba(0,136,212,0.2)",
            borderWidth: 12
          }
        },
        data: timeY
      }
    ]
  };
  myChart.setOption(option);
}
function echartsInits(Cardata,data,dataVal,dataText){

    var myCharts = echarts.init(document.getElementById("mains"));
    options = {
      backgroundColor: "#253236",
      title: {
        text: dataText+"油耗量",
        show: false,
        textStyle: {
          fontWeight: "normal",
          fontSize: 15,
          color: "#ffffff"
        },
        top: "80%",
        left: "center",
        bottom:"20%"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "#333"
          }
        }
      },
      legend: {
        icon: "rect",
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: [dataText+"油耗量"],
        right: "center",
        top:"80%",
        textStyle: {
          fontSize: 18,
          color: "#ffffff"
        },
        bottom:"10%"
      },  
      grid: {
        left: "3%",
        right: "4%",
        bottom: "20%",
        top:"10%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 13,
              color: "#ffffff"
            }
          },
          data: Cardata
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#ffffff"
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14,
              color: "#ffffff"
            }
          },
          splitLine: {
            lineStyle: {
              type: "solid",
              color: "#ccc"
            }
          }
        }
      ],
      series: [
        {
          name: dataText+"油耗量",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#a8b97f"
                  },
                  {
                    offset: 1,
                    color: "#a8b97f"
                  }
                ],
                false
              ),
              shadowColor: "#a8b97f",
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: "#a8b97f",
              borderColor: "rgba(0,136,212,0.2)",
              borderWidth: 12
            }
          },
          data:data
        }
      ]
    };
  myCharts.setOption(options);
}
$(".search_Carlist").click(function() {
  var initTime = $("#test5").val();
  var initTimes = $("#test6").val();
  if(initTime=="" || initTimes==""){
    layer.msg("请选择时间");
    return false
  }
  doRefresh(null,"KULUINTERFACE","searchTruckOilStats", "&pg_sdate=" + initTime+"&pg_edate="+initTimes,function(data) {
      if (data.code == 0) {
        
       tableInit(data.session);
        //执行正确动作
        var timeX = [],
          timeY = [];
        for (var i = 0; i < data.data.length; i++) {
          timeX.push(data.data[i].date);
          timeY.push(data.data[i].count);
          echartsInit(timeX, timeY);
        }
      } else {
        alert(data.msg);
      }
    }
  );
  datainit();
});
function echartsData(){//总车辆的数据
      doRefresh(null, "KULUINTERFACE", "searchTruckOilStats", "", function(data) {
        if (data.code == 0) {
          //执行正确动作
          var timeX = [],
            timeY = [];
          for (var i = 0; i < data.data.length; i++) {
            timeX.push(data.data[i].date);
            timeY.push(data.data[i].count);
            echartsInit(timeX, timeY);
          }
        } else {
          alert(data.msg);
        }
      });  
}
function echartsDatas(datas,dataText){//单个车辆的数据
    doRefresh("carForm", "KULUINTERFACE", "searchTruckOilStats", "&pg_sdate=" + datas, function(data) {
        if (data.code == 0) {
          //执行正确动作
          var timeX = [],
            timeY = [];
          for (var i = 0; i < data.data.length; i++) {
            timeX.push(data.data[i].date);
            timeY.push(data.data[i].count);
            echartsInits(timeX, timeY,datas,dataText);
          }
        } else {
          alert(data.msg);
        }
      });
}
function datainit() {//获取select初始化的数据
    // var aplate = $(".selectCarplate option:first").val();
    // var aplates = $(".selectCarplate option:first").text();
    new Promise(function(resolve,reject) {
      setTimeout(function() {
        var aplate = $(".selectCarplate").val();
        var aplates = $(".selectCarplate option:selected").text();
        console.log(aplates)
        var CarArray=[];
        CarArray.push(aplate,aplates)
        if (CarArray[0] == null &&CarArray[1]==""){
             resolve(CarArray);
        } else {
            reject(CarArray);
        }
      }, 500);
    }).then(function(result) {
        echartsDatas(result[0],result[1]);
        console.log(result)
      }).catch(function(reason) {
        console.log(reason)
        echartsDatas(reason[0],reason[1]);
      });
}
