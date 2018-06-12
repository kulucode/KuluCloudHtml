function loadpathTable() {
  layui.use("table", function() {
    var table = layui.table;
    pg_truck = $(".selectCarplate").val();
    pg_sdate = $("#test5").val();
    pg_edate = $("#test6").val();
    //第一个实例
    table.render({
      elem: "#demo",
      url:
        "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=250&TTDT=json&opname=getTruckTraceList&TTSSID=" +
        datas +
        "&TTKEY=null&pg_truck=" +
        pg_truck +
        "&pg_sdate=" +
        pg_sdate +
        "&pg_edate=" +
        pg_edate +
        "&pg_num=0&pg_size=-1", //数据接口
      page: false, //开启分页
      height: "full-860",
      cols: [
        [
          //表头
          { field: "tbindex", title: "ID", sort: true },
          { field: "truckorg", title: "项目组", width: 200 },
          { field: "分段", title: "分段" },
          { field: "trucktype", title: "设备类型",width: 200 },
          { field: "truckno", title: "物料编号" },
          { field: "platenum", title: "车牌号" },
          { field: "fdate", title: "起始时间", width: 200, sort: true },
          { field: "tdate", title: "终止时间", width: 200,sort: true },
          { field: "speed", title: "平均时速(km/h)", sort: true },
          { field: "distance", title: "行驶里程(km)", sort: true }
        ]
      ]
    });
  });
}

function progress() {
  //进度条
  doRefresh(null, "KULUINTERFACE", "searchTruckWordParasList", "", function(
    data
  ) {
    var cars = data.data;
    $.each(cars, function(i, data) {
      car = Car.createNew(data, map);
      car.initCar();
      $(".search_Carlist").click(function() {
        map.removeOverlay(car.marker);
        map.clearOverlays(); 
      });
    })
    if (data.data.length > 0) {
      //执行正确动作
      $(".search_Carlist").click(function() {
        var matchResult = true;
        if (matchResult == true) {
          var startTime = $("#test5").val();
          var endTime = $("#test6").val();
          var d1 = new Date(startTime.replace(/\-/g, "/"));
          var d2 = new Date(endTime.replace(/\-/g, "/"));
          // $("#btnResetRoute").click()
          if (startTime == "" || endTime == "") {
            layer.msg("请选择起始时间！");
            return false;
          }

          if (startTime != "" && endTime != "" && d1 >= d2) {
            layer.msg("开始时间不能大于结束时间！");
            return false;
          }
          car.loadTrace();
          $(".btnStartRoute").click(function(e) {
            //鼠标点击
            car.resetRoute();
            car.route();
          });
          $(".btnPauseRoute").click(function(e, runnum) {
            var btn = $(".btnPauseRoute")[0];
            if (car.isRoteRunning) {
              e.stopPropagation();
              e.preventDefault();
              car.startRoute(true, car.runnum);
              car.isTimerRunning = true;
            } else {
              e.stopPropagation();
              e.preventDefault();
              car.startRoute(false, car.runnum, car.currentCount);
            }
          });
        } else {
          layer.msg("您选择的时间段车辆没有行驶记录");
        }
        pg_truck = $(".selectCarplate").val();
        pg_sdate = $("#test5").val();
        pg_edate = $("#test6").val();
        loadpathTable();
        matchResult = false;
      });
    }
  });
}
layui.use(["form", "layedit", "laydate"], function() {
  var form = layui.form,
    layer = layui.layer,
    layedit = layui.layedit,
    laydate = layui.laydate;
  //日期
  laydate.render({
    elem: "#date"
  });
  laydate.render({
    elem: "#date1"
  });

  //创建一个编辑器
  var editIndex = layedit.build("LAY_demo_editor");

  //自定义验证规则
  form.verify({
    title: function(value) {
      if (value.length < 5) {
        return "标题至少得5个字符啊";
      }
    },
    pass: [/(.+){6,12}$/, "密码必须6到12位"],
    content: function(value) {
      layedit.sync(editIndex);
    }
  });

  //监听指定开关
  form.on("switch(switchTest)", function(data) {
    layer.msg("开关checked：" + (this.checked ? "true" : "false"), {
      offset: "6px"
    });
    layer.tips(
      "温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF",
      data.othis
    );
  });

  //监听提交
  form.on("submit(demo1)", function(data) {
    layer.alert(JSON.stringify(data.field), {
      title: "最终的提交信息"
    });
    return false;
  });
});
