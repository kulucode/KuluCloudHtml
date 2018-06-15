(function(window, document) {
  window.left=0;
  Nowtimes=0;
  VideoTime = 0;
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
  j = 0;
  function videoinit(datas,Cardata,Cartime,aisleID) {
    Cartime = Cartime.substring(11)
    var Cararrays = Cartime.split(":");
    datas= datas.replace("-","");
    datas= datas.replace("-","")//转换搜索时间格式
    var CarNum = parseFloat(Cararrays[0])*3600+parseFloat(Cararrays[1])*60+parseFloat(Cararrays[2])
    console.log(datas,"CarNum")
    // console.log("212121", 0, data + " 000000", "235959");
    doRefresh("viedoport", "KULUINTERFACE", "searchTruckVideoList","&pg_truck="+Cardata, function (data) {
      NetVideo.Login(data.data[0].ip,data.data[0].port, data.data[0].user, data.data[0].password);
      // NetVideo.Login("182.61.39.135", 7708, "user_viewer", "situouser2834");
      var ret = NetVideo.QueryHistoryVideo(data.data[0].eqpno, 0, ""+datas+" 000000", "235959");
      // var ret = NetVideo.QueryHistoryVideo("1000016", 0, "180613 000000", "235959");
    console.log(ret,"ret")
    if(ret == "" || ret == null){
      layer.msg("该视频的数据为空")
    }
    ret = ret.replace(/\"/g, "");
    var listssss = ret.split(",");
    array = [];
    for (var i = 0; i < listssss.length; i++) {
      var lists = listssss[i].split(":");
      array.push(lists[1]);
    }
    // NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[j], 0, 0);
    console.log(array,"array")
    // NetVideo.OpenHistoryStream(1000012, aisleID, array[j], 0, 0);
    var SelectTime = Cartime.replace(":","");//选择时分秒
    SelectTime = SelectTime.replace(":","")
    var timeList = array[1].substring(7);//列表初始时间
    console.log(timeList,Cartime,"timeList")
    if(parseFloat(SelectTime)<parseFloat(timeList)){
      layer.open({
        title: '提示',
         offset: 'b'
        ,content: '该时间段没有视频，今天的行驶时间是从'+array[1]+'开始的'
      });  
    }else{
      list = 0;
        
      var hour = Cartime.split(':')[0];
      var min = Cartime.split(':')[1];
      var sec = Cartime.split(':')[2];
      s = Number(hour*3600) + Number(min*60) + Number(sec);//选择时间的时间戳
        videoTimeinit(list,s)
    }
    function videoTimeinit(list,s){
        var hours = array[list + 1].substring(7,9);
        var mins =  array[list + 1].substring(9,11);
        var secs =  array[list + 1].substring(11,13);
        ss = Number(hours*3600) + Number(mins*60) + Number(secs)+Number(array[list + 3]);//列表的时间戳
        var slisttime =  Number(hours*3600) + Number(mins*60) + Number(secs)
        if(s<ss){
          
      console.log(array[list + 1],s)
      console.log(ss,slisttime)
          var slength= array.length-list;
          slist = list/6;
          for (var z=list/slist; z < slength/ 6; z++) {
            VideoTime = parseInt(VideoTime) + parseInt(array[6 * z + 3]);
          }
          let stime = s-slisttime;
          console.log("1000016", aisleID, array[list], stime, 0)
          NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[list], stime, 0);
          // NetVideo.OpenHistoryStream("1000016", 1, array[list], stime, 0);
          
        }else{
          list = list+6;
          videoTimeinit(list,s)
        }
    }
    var intervalProcess = setInterval(function showTime() {
      NowTime = NetVideo.GetPlayedTime();
      // console.log(NowTime,VideoTime)
      window.left = parseInt(window.left)+parseInt(parseInt(NowTime)/ parseInt(VideoTime))
      // console.log(window.left)
      if (NetVideo.GetPlayedTime() == array[j + 3]) {
        NetVideo.Logout();
        NetVideo.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
        j = j + 6;
        NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[j], 0, 0);
      }
      $(".progress_btn").css("left", window.left * 10);
      $(".progress_bar").width(window.left * 10);
      $(".text").html(parseInt(window.left) + "%");
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
        window.left = parseInt(e.offsetX/1000*100)
        if (window.left <= 0) {
          window.left = 0;
        } else if (window.left > 100) {
          window.left = 100;
        }
        console.log(window.left,"151")
        $(".progress_btn").css("left", window.left * 10);
        $(".progress_bar").width(window.left * 10);
        $(".text").html(window.left+ "%");
        NowtimeVideo = parseFloat(window.left/100)* VideoTime;
        Nowtimes =  window.left;
        // var h=0;
        lists = list
        timeInit(lists)
        function timeInit(lists){
          console.log(array[lists + 3],NowtimeVideo,"12312")
          if (parseFloat(NowtimeVideo) < parseFloat(array[lists + 3])) {
            NetVideo.Logout();
            NetVideo.Login(data.data[0].ip, data.data[0].port, data.data[0].user, data.data[0].password);
            
      // NetVideo.Login("182.61.39.135", 7708, "user_viewer", "situouser2834");
            NetVideo.OpenHistoryStream(data.data[0].eqpno, aisleID, array[lists], NowtimeVideo, 0);
            // NetVideo.OpenHistoryStream("1000016", 1, array[lists], NowtimeVideo, 0);
          } else {
            NowtimeVideo = parseInt(NowtimeVideo) - parseInt(array[lists + 3]);
            lists=lists+6;
            timeInit(lists)
          }
        }
      }
    });
  })
}

$(".btnPauseRoute").click(function(){
  NetVideo.CtrlPlay(1,1)
})
$(".btnStartRoute").click(function(){
  NetVideo.CtrlPlay(1,0)
})
$(".btnFastRoute1").click(function(){
  NetVideo.CtrlPlay(0,1);
})
$(".btnFastRoute2").click(function(){
  NetVideo.CtrlPlay(0,2)
})
$(".btnFastRoute3").click(function(){
  NetVideo.CtrlPlay(0,3)
})
$(".btnFastRoute0").click(function(){
  NetVideo.CtrlPlay(0,4)
}) 
$(".btnStartRoute4").click(function(){
  NetVideo.CtrlPlay(0,0)
})
  jQuery(".search_Carlists").click(function() {
    $(".progress_btn").css("left",0);
    $(".progress_bar").width(0);
    $(".text").html(parseInt(0) + "%");
    var DevID = jQuery("#test12").val();
    var timeVideo = DevID;
    var aisleID =  jQuery("#aisleID").val();
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
    // $(".progress_btn").mousedown(function(e) {
    //   ox = e.pageX - window.left;
    //   tag = true;
    // });
    // $(document).mouseup(function() {
    //   tag = false;
    // });
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
var Widths=$("#layui-layerss1").width()-80+"px"
console.log($("#layui-layerss1").width())
$("#layui-layerss1 .layui-input-inline").width(Widths)