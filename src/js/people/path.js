doRefresh(null, "KULUINTERFACE", "searchUserWordParasList", "", function(data) {
  if (data.data.length > 0) {
    //执行正确动作
    
    var cars = data.data;
    $.each(cars, function(i, data) {
      people = People.createNew(data, map);
      people.initCar();
      $(".search_Carlist").click(function() {
        map.removeOverlay(people.marker);
        map.clearOverlays();
      });
    })
    $(".search_Carlist").click(function() {
      var matchResult = true;
      if (matchResult == true) {
        map.clearOverlays();
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
        people.loadTrace();
        $(".btnStartRoute").click(function(e) {
          //鼠标点击
          people.resetRoute();
          people.route();
        });
        $(".btnPauseRoute").click(function(e, runnum) {
          var btn = $(".btnPauseRoute")[0];
          if (people.isRoteRunning) {
            e.stopPropagation();
            e.preventDefault();
            people.startRoute(true, people.runnum);
            people.isTimerRunning = true;
          } else {
            e.stopPropagation();
            e.preventDefault();
            people.startRoute(false, people.runnum, people.currentCount);
          }
        });
      } else {
        layer.msg("您选择的时间段车辆没有行驶记录");
      }
    });
  }
});
