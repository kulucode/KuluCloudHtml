(function(window, document) {
  window.left=0;
  Nowtimes=0;
  function timetrans(date) {
    var date = new Date(date * 1000); //如果date为10位不需要乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  layui.use("laydate", function() {
    var laydate = layui.laydate;
    laydate.render({
      elem: "#test12",
      format: "yyyy年MM月dd日",
      done: function(value, date, endDate) {
      
      }
    });
  });
  j = 0;
  function videoinit(datas,Cardata,Cartime,aisleID) {
    // console.log("212121", 0, data + " 000000", "235959");
    doRefresh("viedoport", "KULUINTERFACE", "searchTruckVideoList","&pg_truck="+Cardata, function (data) {
      console.log(data)
      NetVideo.Login(data.data[0].ip,data.data[0].port, data.data[0].user, data.data[0].password);
      // NetVideo.Login("182.61.39.135", 7708, "user_viewer", "situouser2834");
      var ret = NetVideo.QueryHistoryVideo(data.data[0].eqpno, 0, ""+datas+" 000000", "235959");
    console.log(ret)
    if(ret == "" || ret == null){
      layer.msg("该视频的数据为空")
    }
    ret = ret.replace(/\"/g, "");
    var list = ret.split(",");
    array = [];
    VideoTime = 0;
    for (var i = 0; i < list.length; i++) {
      var lists = list[i].split(":");
      array.push(lists[1]);
    }
    for (var z = 0; z < array.length / 6; z++) {
      VideoTime = VideoTime + parseInt(array[6 * z + 3]);
    }
    NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[j], 0, 0);
    console.log((data.data[0].eqpno, 0, array[j], 0, 0));
    var intervalProcess = setInterval(function showTime() {
      NowTime = NetVideo.GetPlayedTime();
      window.left =(Nowtimes+parseInt(NowTime) )/ parseInt(VideoTime);
      if (NetVideo.GetPlayedTime() == array[j + 3]) {
        NetVideo.Logout();
        NetVideo.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
        j = j + 6;
        NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[j], 0, 0);
      }
      $(".progress_btn").css("left", window.left * 1175);
      $(".progress_bar").width(window.left * 1175);
      $(".text").html(parseInt(window.left * 100) + "%");
    }, 1000);
    var tag = false,
      ox = 0,
      bgleft = 0;
    $(".progress_btn").mousedown(function(e) {
      ox = e.pageX - window.left;
      tag = true;
    });
    $(document).mouseup(function() {
      tag = false;
    });
    let Width = $(".progress_bg").width();
    $(".progress_bg").click(function(e) {
      //鼠标点击
      if (!tag) {
        bgleft = $(".progress_bg").offset().left;
        window.left = e.pageX - bgleft;
        if (window.left <= 0) {
          window.left = 0;
        } else if (window.left > 1175) {
          window.left = 1175;
        }
        window.left=window.left/1175
        $(".progress_btn").css("left", window.left * 1175);
        $(".progress_bar").width(window.left * 1175);
        $(".text").html(parseInt(window.left * 100) + "%");
        Nowtime = parseFloat(window.left)* VideoTime;
        Nowtimes = Nowtime;
        var h=0;
        timeInit(h)
        function timeInit(h){
          if (parseFloat(Nowtime) < parseFloat(array[h + 3])) {
            NetVideo.Logout();
            NetVideo.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
            NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[h], Nowtime, 0);
          } else {
            Nowtime = parseInt(Nowtime) - parseInt(array[h + 3]);
            h=h+6;
            timeInit(h)
          }
        }
      }
    });
  })
}
  jQuery(".search_Carlists").click(function() {
    var DevID = jQuery("#test12").val();
    var timeVideo = DevID;
    var aisleID =  jQuery("#aisleID").val();
    console.log(aisleID)
    timeVideo = timeVideo.replace("月", "-");
    timeVideo = timeVideo.replace("年", "-");
    timeVideo = timeVideo.replace("日", "");
    DevID = DevID.substr(2, 8);
    DevID = DevID.replace("年", "");
    DevID = DevID.replace("月", "");
    var carValues=$(".selectCarplate").val();
    // console.log(carValues,DevID,timeVideo)
    videoinit(DevID,carValues,timeVideo,aisleID);
    historyInit(carValues)
    // remotesearch(DevID, window.datas);
  });
  $(".line").click(function(e) {
    console.log(this.style.left);
  });
  progress();
  function progress() {
    //进度条
    var tag = false,
      ox = 0,
      bgleft = 0;
    window.left=0;
    $(".progress_btn").mousedown(function(e) {
      ox = e.pageX - window.left;
      tag = true;
    });
    $(document).mouseup(function() {
      tag = false;
    });
    // $(".progress").mousemove(function(e) {
    //   //鼠标移动
    //   if (tag) {
    //     window.left = e.pageX - ox;
    //     if (window.left <= 0) {
    //       window.left = 0;
    //     } else if (window.left > 1175) {
    //       window.left = 1175;
    //     }
    //     $(".progress_btn").css("left", window.left/100*1175);
    //     $(".progress_bar").width(window.left/100*1175);
    //     $(".text").html(parseInt(window.left) + "%");
    //   }
    // });

    // let Width = $(".progress_bg").width();
    // $(".progress_bg").click(function(e) {
    //   //鼠标点击
    //   if (!tag) {
    //     bgleft = $(".progress_bg").offset().left;
    //     window.left = e.pageX - bgleft;
    //     if (window.left <= 0) {
    //       window.left = 0;
    //     } else if (window.left > 1175) {
    //       window.left = 1175;
    //     }
    //     var Nowtime=window.left*VideoTime;
    //     let h=0;
    //     console.log(array[6*h],Nowtime,"123")
    //      if(Nowtime>parseInt(array[6*h+3])){
    //       Nowtime=Nowtime-array[6*h+3];
    //       h=h+6
    //      }else{
    //        console.log(array[6*h],Nowtime,"123")
    //        NetVideo.Logout();
    //        NetVideo.Login("193.112.132.150", 7708, "admin", "888888");
    //       NetVideo.OpenHistoryStream("212121", 1, array[6*h], Nowtime, 0);
    //      }
    //     }
    //     $(".progress_btn").css("left", window.left);
    //     $(".progress_bar").width(window.left);
    //     $(".text").html(parseInt(window.left/Width*100) + "%");

    // });
  //   try{  
  //     if(document.all.NetVideo.object == null) {  
  //         alert("控件不存在，您还不能使用此功能！")  
  //     }else{  
  //         alert("控件已安装");  
  //     }  
  // }catch(e){  
  //     alert("异常调用")  
  // } 
  }
})(this, document);
function datainit() {//获取sel  ect初始化的数据
  new Promise(function(resolve,reject) {
    setTimeout(function() {
      var aplate = $(".selectCarplate option:selected").val();
      var aplates = $(".selectCarplate option:selected").text();
      var CarArray=[];
      CarArray.push(aplate,aplates)
      if (CarArray[0] == null &&CarArray[1]==""){
           resolve(CarArray);
      } else {
          reject(CarArray);
      }
    }, 300);
  }).then(function(result) {
    historyInit(result[0]);
    }).catch(function(reason) {
      historyInit(reason[0]);
    });
}

function historyInit(Cardata){
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