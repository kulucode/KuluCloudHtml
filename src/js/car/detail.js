
function getNowFormatDate() {
  //当日时间
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var starttime =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  $("#test5").val(starttime);
}
function getYesFormatDate() {
  //上日时间
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate() - 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var starttime =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  $("#test5").val(starttime);
}
doRefresh(null, "KULUINTERFACE", "getOrgTree", "", function(data) {
  if (data.code == 0) {
    //执行正确动作
    datas = data.session;
    tables();
  } else {
    alert(data.msg);
  }
});
function tables() {
  //加载表格
  layui.use("table", function() {
    var table = layui.table;
    pg_sdate = $("#test5").val();
    //第一个实例
    table.render({
      elem: "#table_list",
      height: "full-400",
      url:
        "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=296&TTDT=json&opname=searchTruckFaultReportList&TTSSID=" +
        datas +
        "&TTKEY=null&&pg_sdate=" +
        pg_sdate, //数据接口
      page: false, //开启分页
      cols: [
        [
          //表头
          {field: "tbindex", title: "ID", sort: true },
          { field: "paltenum", width: 200, title: "编号" },
          { field: "trucktype", width: 207, title: "车辆类型" },
          { field: "faule", title: "报警类型" },
          { field: "hdate", title: "报警时间", width: 200 ,sort:true},
          { field: "id", title: "报警编码", width: 200 },
          { field: "username", title: "当班司机" },
          { field: "usermphone", title: "联系电话" },
          { field: "opstate", title: "处理情况"},
          { toolbar: "#barDemo", title: "处理标记" }
        ]
      ]
    });
    //监听工具条
    table.on("tool(test)", function(obj) {
      var data = obj.data;
      if (obj.event === "detail") {
        doRefresh(
          null,
          "KULUINTERFACE",
          "updateTruckFaultReportState",
          "&pg_faultid="+obj.data.id+"&pg_state=1",
          function(data) {
            if (data.code == 0) {
              //执行正确动作
              tables();
            } else {
              alert(data.msg);
            }
          }
        );
      }
    });
  });
}
function initDetail(dataX,dataY,dataZ,dataTime) {
  var myChart = echarts.init(document.getElementById("main"));
  option = {
    tooltip: {
      trigger: "axis"
    },
    xAxis: {
      type: "category",
      name: "x",
      splitLine: {
        show: true
      },
      data: dataTime,
      splitLine: {
        show: true,
        interval: "auto",
        lineStyle: {
          color: ["#595959"],
          width: 1
        }
      },
      axisLine: {
        lineStyle: {
          color: "#595959",
          width: 1 //这里是为了突出显示加上的
        }
      },
      axisLabel: {
        formatter: "{value}",
        textStyle: {
          color: "#253236",
          border: 1
        }
      }
    },
    grid: {
      x: 280,
      y: 30,
      x2: 50,
      y2: 20,
      borderWidth: 1,
      containLabel: false
    },
    yAxis: {
      type: "value",
      name: "y",
      splitLine: {
        show: true,
        interval: "auto",
        lineStyle: {
          color: ["#595959"]
        }
      },
      axisLine: {
        lineStyle: {
          color: "#595959",
          width: 2 //这里是为了突出显示加上的
        }
      },
      axisLabel: {
        formatter: "{value}",
        textStyle: {
          color: "#bfbfbf"
        }
      }
    },
    series: [
      {
        name: "交通事故",
        type: "line",
        data:dataZ,
        lineStyle: {
          normal: {
            width: 2, //连线粗细
            color: "#9b9256" //连线颜色
          }
        }
      },
      {
        name: "设备故障",
        type: "line",
        data: dataY,
        lineStyle: {
          normal: {
            width: 2, //连线粗细
            color: "#a8b97f" //连线颜色
          }
        }
      },
      {
        name: "违规作业",
        type: "line",
        data: dataX,
        lineStyle: {
          normal: {
            width: 2, //连线粗细
            color: "#50b4c8" //连线颜色
          }
        }
      }
    ]
  };
  myChart.setOption(option);
}
$("#search_carOil").click(function() {
  var Selectvalue=$("#test5").val();
  if(Selectvalue==""){
    layer.msg("请选择时间");
    return false
  }
  tables();
  tableDetailinit();
});
$("#newDay").click(function() {
  //上日时间
  getYesFormatDate();
});
$("#nowDay").click(function() {
  //选择当日时间
  getNowFormatDate();
});
$("#submitCarD").click(function() {
  layer.msg("成功保存数据");
});
function autocreate() {
  //创建table表格
  var table = document.createElement("table");
  var span = document.createElement("span");
  table.setAttribute("border", "1");
  for (var i = 0; i <= 3; i++) {
    //alert(line);
    //创建tr
    var tr = document.createElement("tr");
    for (var j = 0; j <= 7; j++) {
      //alert(list);
      //创建td
      var td = document.createElement("td");
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  document.getElementById("tabel_detail").appendChild(table);
  $("#tabel_detail tr:eq(1) td:eq(0)").append(
    '违规作业<span class="Operation"></span>'
  );
  $("#tabel_detail tr:eq(2) td:eq(0)").append(
    '设备故障<span class="EquipmentDanger"></span>'
  );
  $("#tabel_detail tr:eq(3) td:eq(0)").append(
    '交通事故<span class="Accident"></span>'
  );
}
tableDetailinit();
function tableDetailinit() {
  doRefresh("pathForm", "KULUINTERFACE", "searchTruckFaultStats", "", function(data) {
    var dataX=[];
    var dataY=[];
    var dataZ=[];
    var dataTime=[];
    console.log(data)
    if (data.code == 0) {
      //执行正确动作
      for (var i = 1; i <= 7; i++) {
          $("tr:eq(0) td").eq(i).html(data.data[i - 1].date);
          $("tr:eq(1) td").eq(i).html(data.data[i - 1].faults[0].count);
          $("tr:eq(2) td").eq(i).html(data.data[i - 1].faults[1].count);
          $("tr:eq(3) td").eq(i).html(data.data[i - 1].faults[4].count);   
          dataX.push(data.data[i - 1].faults[0].count);
          dataY.push(data.data[i - 1].faults[1].count);
          dataZ.push(data.data[i - 1].faults[4].count);
          dataTime.push(data.data[i - 1].date);
      }
    }
    initDetail(dataX,dataY,dataZ,dataTime);
  });
}