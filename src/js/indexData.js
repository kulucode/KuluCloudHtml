(function() {//获取小车人的数据
    doRefresh(null, "KULUINTERFACE", "searchSysBaseStats", "", function (data) {
      if (data.code == 0) {
        $("#carNum").html(data.truck_count);
        $("#peopleNum").html(data.user_count);
        $("#undisposed").html(data.fault_count);
        $("#overTime").html(data.order_count);
      } else {
        // layer.msg("获取数据失败！");
        console.log("err",123)
      }
    });
  })()
  doRefresh(null, "KULUINTERFACE", "searchTruckVideoList", "", function (data) {
    if (data.code == 0) {
        //执行正确动作
        console.log(data)
    }
    else {
        alert(data.msg);
    }
});