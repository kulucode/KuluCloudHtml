(function(window, document) {
  var timeLine = jQuery(".timeLine").width(); //总宽
  //        console.log(timeLine);
  var unitCount = 24 * 6; //总共多少刻度线
  //        console.log(unitCount);
  var unitPx = timeLine / unitCount; //每个格子的间距 减刻度线的宽度
  //        console.log(unitPx);
  for (var i = 0; i <= unitCount; i++) {
    var classstr = "";
    var hourstr = "";
    if (i % 6 == 0) {
      classstr = "hourLine";
      hourstr = i / 6;
      //            console.log("hourLine"+i);
      if (hourstr == 24) {
        hourstr = 0;
      }
    } else if (i % 5 == 0) {
      classstr = "midLine";
      //            console.log("midLine"+i);
    }
    var unitTime = jQuery(
      "<div id='time_" +
        i +
        "' class='line " +
        classstr +
        "'>" +
        "<span class='hourstr'>" +
        hourstr +
        "</span>" +
        "</div>"
    );
    unitTime.css("left", i * unitPx);
    jQuery(".timeLine").append(unitTime);
  }

  layui.use("laydate", function() {
    var laydate = layui.laydate;
    laydate.render({
      elem: "#test12",

      format: "yyyy年MM月dd日",
      done: function(value, date, endDate) {
        jQuery(".search_Carlists").click(function() {
          // init();
          // remotesearch();
          init();
          remotesearch(date);
          console.log(
            jQuery(".selectCarplates")[0].name,
            jQuery(".selectCarplates")
          );
        });
        console.log(value); //得到日期生成的值，如：2017-08-18
        console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
        console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
      }
    });
  });
})(this, document);
$(".search_Carlists").click(function() {
  
doRefresh("viedoport", "KULUINTERFACE", "searchTruckVideoList", "", function (data) {
  if (data.code == 0) {
      //执行正确动作
      console.log(data.data,"!@31321")
      NetVideo.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
      NetVideo2.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
      NetVideo3.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
      NetVideo4.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
      NetVideo.OpenStream(data.data[0].eqpno, 1, 0, 0);
      NetVideo2.OpenStream(data.data[0].eqpno, 2, 0, 0);
      NetVideo3.OpenStream(data.data[0].eqpno, 3, 0, 0);
      NetVideo4.OpenStream(data.data[0].eqpno, 4, 0, 0);
      // NetVideo.Login("182.61.39.135", 7708, "admin", "888888");
      // NetVideo2.Login("182.61.39.135", 7708, "admin", "888888");
      // NetVideo3.Login("182.61.39.135", 7708, "admin", "888888");
      // NetVideo4.Login("182.61.39.135", 7708, "admin", "888888");
      // NetVideo.OpenStream("9999999", 1, 0, 0);
      // NetVideo2.OpenStream("9999999", 2, 0, 0);
      // NetVideo3.OpenStream("9999999", 3, 0, 0);
      // NetVideo4.OpenStream("9999999", 4, 0, 0);
  }
  else {
      alert(data.msg);
  }
});
  // NetVideo.Login("182.61.39.135", 7708, "admin", "888888");
  // NetVideo2.Login("182.61.39.135", 7708, "admin", "888888");
  // NetVideo3.Login("182.61.39.135", 7708, "admin", "888888");
  // NetVideo4.Login("182.61.39.135", 7708, "admin", "888888");
  // NetVideo.OpenStream("9999999", 1, 0, 0);
  // NetVideo2.OpenStream("9999999", 2, 0, 0);
  // NetVideo3.OpenStream("9999999", 3, 0, 0);
  // NetVideo4.OpenStream("9999999", 4, 0, 0);
  var Carvalue=$(".selectCarplate").val()
  videoInit(Carvalue)
});
function datainit() {//获取sel  ect初始化的数据
  // var aplate = $(".selectCarplate option:first").val();
  // var aplates = $(".selectCarplate option:first").text();
  new Promise(function(resolve,reject) {
    setTimeout(function() {
      var aplate = $(".selectCarplate option:selected").val();
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
    videoInit(result[0]);
      console.log(result)
    }).catch(function(reason) {
      console.log(reason)
      videoInit(reason[0]);
    });
}
doRefresh(null, "KULUINTERFACE", "searchTruckVideoList", "", function (data) {
  if (data.code == 0) {
      //执行正确动作
      console.log(data,"!@31321")
  }
  else {
      alert(data.msg);
  }
});
function videoInit(Cardata){
  doRefresh(null, "KULUINTERFACE", "searchTruckList", "&pg_truck="+Cardata, function(data) {
    if (data.code == 0) {
      //执行正确动作
      var dataTeam=data.data[0].truckorg.split("-")
      var datatype=data.data[0].trucktype.substr(0,9)
      // var datatype=datatype[1].replace("】", "");
      console.log(datatype)
      $(".people_lists li:eq(1)").html(dataTeam[0]);
      $(".people_lists li:eq(3)").html(dataTeam[1]);
      $(".people_lists li:eq(5)").html(data.data[0].trucknno);
      $(".people_lists li:eq(7)").html(data.data[0].paltenum);
      $(".people_lists li:eq(9)").html(datatype);
      $(".people_lists li:eq(11)").html(data.data[0].username);
    } else {
      alert(data.msg);
    }
  });
}