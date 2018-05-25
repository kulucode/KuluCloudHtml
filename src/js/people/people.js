$("#researchPeople").click(function() {
  layuiTable(datas);
});
function layuiTable(datas) {
  layui.use("table", function() {
    var table = layui.table;
    pg_keyword = $("#demoReload").val();
    if(pg_keyword==undefined){
      pg_keyword=""
    }
    //第一个实例
    table.render({
      elem: "#demo",
      height: "full-750",
      cellMinWidth: 100,
      url:
        "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=250&TTDT=json&opname=searchUserWordDayList&TTSSID=" +
        datas +
        "&TTKEY=null&pg_keyword=" +
        pg_keyword +
        "&pg_num=0&pg_size=1000", //数据接口
      page: false, //开启分页
      cols: [
        [
          //表头
          {field: "tbindex", title: "ID", sort: true },
          { field: "userorg", title: "项目组", width: 200 },
          { field: "userid", title: "员工编号" },
          { field: "username", title: "姓名" },
          { field: "state", title: "人员状况", sort: true },
          { field: "userphone", title: "联系方式", sort: true },
          {
            field: "indate",
            title: "到岗时间",
            width: 200,
            templet: "#sexTpl"
          },
          {
            field: "outdate",
            title: "离岗时间",
            width: 200,
            templet: "#OutTpl"
          },
          { field: "step", title: "行走步数", sort: true },

          { field: "distance", sort: true, title: "今日里程" },

          { toolbar: "#barDemo", title: "实时定位", align: "center" }
        ]
      ],
      done: function(res, curr, count) {
        console.log(res,curr, count)
        //如果是异步请求数据方式，res即为你接口返回的信息。
        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].state == "报警") {
            $(".layui-table-body tr:eq(" + i + ") td").css(
              "background",
              "#ffc000"
            );
            n = i + 1;
            $(".layui-table-fixed tr:eq(" + n + ") td").css(
              "background",
              "#ffc000"
            );
          }
        }
      }
    });
    table.on("tool(test)", function(obj) {
      var data = obj.data;
      if (obj.event === "detail") {
        doRefresh(
          null,
          "KULUINTERFACE",
          "searchUserWordParasList",
          "",
          function(data) {
            if (data.code == 0) {
              //执行正确动作
              console.log(data, obj);
              var a;
              for (i = 0; i < data.data.length; i++) {
                if (data.data[i].userinst == obj.data.userinst) {
                  a = i;
                }
              }
              var people = People.createNew(data.data[a], map);
              people.initCar();
              showInfoWindow1(data.data[a], map, people);
              console.log(data.data[a])
           map.centerAndZoom(new BMap.Point(data.data[a].bdlon,data.data[a].bdlat), 15);
              // obj.data.userinst=data.data[a].userinst;
            } else {
              alert(data.msg);
            }
          }
        );
      } else if (obj.event === "edit") {
        location.href = "../../html/people/car_video.html";
      }
    });
  });
}

window.peoples = 0;
var People = {
  createNew: function(data, map) {
    "use strict";
    var people = {};
    people.info = {};
    people.data = data;
    people.point = null;
    people.infoWindow = null;
    people.selected = false;
    people.focused = false;
    people.isShowTrace = false;
    people.areAlerted = false;
    people.path = new Array();
    people.curTraceData = null;
    people.timer = null;
    people.routeMarker = null;
    people.routeLabel = null;
    people.curPointIndex = 0;
    people.isTimerRunning = false;
    people.isRoteRunning = false;
    people.points = [];
    people.marker = null;
    people.initCar = function() {
      //地图显示图标
      people.point = new BMap.Point(people.data.bdlon, people.data.bdlat);
      if (people.data.onlinev == 0) {
        var iconUrl = "../../img/peoples_danger.svg";
        if(people.data.state == "报警"){
          iconUrl = "../../img/peoples_bug.svg";
        }
        if(people.data.statev == 2){
          iconUrl = "../../img/peoples_bug.svg";
        }
      }
       else {
        var iconUrl = "../../img/peoples.svg";
        if(people.data.state == "报警"){
          iconUrl = "../../img/peoples_bug.svg";
        }
        if(people.data.statev == 2){
          iconUrl = "../../img/peoples_bug.svg";
        }
      }
      
      let carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
        anchor: new BMap.Size(10, 20)
      }); //BMap.Size定义为偏移位置
      people.marker = new BMap.Marker(people.point, {
        icon: carIcon
      });

      map.addOverlay(people.marker);

      people.marker.disableMassClear();
      let labelHD = new BMap.Label(people.data.username, {
        offset: new BMap.Size(20, -25)
      });
      labelHD.setStyle({
        minWidth: "70px",
        backgroundColor: "#3399FF",
        color: "white",
        border: 0,
        height: "25px",
        textAlign: "center",
        lineHeight: "25px"
      });
      people.marker.addEventListener("click", function(e) {
        showInfoWindow1(data, map, people);
      });
      people.marker.addEventListener("mouseover", function(e) {
        people.marker.setLabel(labelHD);
        // 颜色改变

        this.getLabel().show();
      });

      people.marker.addEventListener("mouseout", function(e) {
        this.getLabel().hide();
        people.beginCar(people);
      });
    };

    people.beginCar = function(people) {
      map.removeOverlay(people.marker);

      if (people.data.onlinev == 0) {
        var iconUrl = "../../img/peoples_danger.svg";
        if(people.data.state == "报警"){
          iconUrl = "../../img/peoples_bug.svg";
        }
        if(people.data.statev == 2){
          iconUrl = "../../img/peoples_bug.svg";
        }
      }
       else {
        var iconUrl = "../../img/peoples.svg";
        if(people.data.state == "报警"){
          iconUrl = "../../img/peoples_bug.svg";
        }
        if(people.data.statev == 2){
          iconUrl = "../../img/peoples_bug.svg";
        }
      }

      let carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
        anchor: new BMap.Size(10, 20)
      });
      //添加标注
      people.marker.setIcon(carIcon);
      map.addOverlay(people.marker);
    };
    people.loadTrace = function() {
      //轨迹的显示
      map.removeOverlay();
      doRefresh("peoplePaths", "KULUINTERFACE", "getUserTraceList", "", function(data) {
        if (data.code == 0) {
          
          map.removeOverlay();
          var points = new Array();
          //clear the array
          people.curTraceData = data.data;
          var lastP = data.data.length - 1;
          var firstPoint = new BMap.Point(
            data.data[0].bdlon,
            data.data[0].bdlat
          );
          var endPoint = new BMap.Point(
            data.data[lastP].bdlon,
            data.data[lastP].bdlat
          );
          //remove before add new path
          if (people.path != null && people.path.length > 0) {
            $.each(people.path, function(i, item) {
              map.removeOverlay(item);
            });
          }

          people.path.length = 0; //clear the array
          for (var i = 0; i < data.data.length; i++) {
            //record as start point
            var pt = new BMap.Point(data.data[i].bdlon, data.data[i].bdlat);
            points.push(pt);
          }

          //the last path
          var lastPath = new BMap.Polyline(points, {
            strokeColor: "blue",
            strokeWeight: 5,
            strokeOpacity: 0.5
          });

          map.addOverlay(lastPath);
          people.path.push(lastPath); //save the path in array

          people.isShowTrace = true;

          if (points.length > 0) {
            map.centerAndZoom(points[0], 15);
            map.panTo(points[0]);
          }
          if (people.routeMarker == null) {
            if (people.data.onlinev == 0) {
              var iconUrl = "../../img/peoples_danger.svg";
              if(people.data.state == "报警"){
                iconUrl = "../../img/peoples_bug.svg";
              }
              if(people.data.statev == 2){
                iconUrl = "../../img/peoples_bug.svg";
              }
            }
             else {
              var iconUrl = "../../img/peoples.svg";
              if(people.data.state == "报警"){
                iconUrl = "../../img/peoples_bug.svg";
              }
              if(people.data.statev == 2){
                iconUrl = "../../img/peoples_bug.svg";
              }
            }
            var myBeginIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
              setTop: false
            });
            people.carBegin = new BMap.Marker(firstPoint, {
              icon: myBeginIcon
            });
          } else {
            people.carBegin.setPosition(firstPoint);
          }
          // map.addOverlay(people.carBegin);
        }
      });
    };

    people.showTrace = function() {
      // map.removeOverlay(people.path);
      if (people.path != null && people.path.length > 0) {
        $.each(people.path, function(i, item) {
          item.show();
        });
      }
    };

    people.hideTrace = function() {
      //map.removeOverlay(people.path);
      if (people.path != null && people.path.length > 0) {
        $.each(people.path, function(i, item) {
          item.hide();
        });
      }
      people.isShowTrace = false;
    };

    people.closeInfoWindow = function() {
      //map.removeOverlay(people.path);
      if (people.infoWindow != null && people.infoWindow.isOpen()) {
        map.closeInfoWindow();
      }
    };

    // 更新最新位置
    people.updatePos = function(lng, lat, areAlerted) {
      if (areAlerted == 1 && !people.areAlerted) {
        people.areAlerted = true;

        var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
          anchor: new BMap.Size(10, 20)
        }); //BMap.Size定义为偏移位置
        people.marker.setIcon(carIcon);
      } else if (areAlerted == 0 && people.areAlerted) {
        people.areAlerted = false;

        var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
          anchor: new BMap.Size(10, 20)
        }); //BMap.Size定义为偏移位置
        people.marker.setIcon(carIcon);
      }

      people.point = new BMap.Point(lng, lat);
      people.marker.setPosition(people.point);
      //update pos
      if (people.focused) {
        people.marker.show();
        // showInfoWindow(people, map);
      }
    };

    // 显示车子的最新位置
    people.show = function() {
      //people.point = new BMap.Point(people.data.cur_long, people.data.cur_lat);
      people.marker.show();
    };

    // 隐藏车子，并停止实时定位
    people.hide = function() {
      people.marker.hide();
    };

    people.liveLocate = function() {};

    // 在地图上聚焦
    people.focus = function() {
      map.centerAndZoom(people.point, 18);

      map.panTo(people.point);
      //get the current data
      showInfoWindow1(people, map, people);
    };

    // 在地图上聚焦
    people.route = function() {
      if (people.curTraceData.length < 1) return;
      map.removeOverlay(people.routeMarker);
      map.removeOverlay(people.marker);
      var pts = people.curTraceData;
      var numPoints = people.curTraceData.length;
      var firstPoint = new BMap.Point(pts[0].bdlon, pts[0].bdlat);
      people.curPointIndex = 0;
      //new marger if need
      if (people.routeMarker == null) {
        if (people.data.onlinev == 0) {
          var iconUrl = "../../img/peoples_danger.svg";
          if(people.data.state == "报警"){
            iconUrl = "../../img/peoples_bug.svg";
          }
          if(people.data.statev == 2){
            iconUrl = "../../img/peoples_bug.svg";
          }
        }
         else {
          var iconUrl = "../../img/peoples.svg";
          if(people.data.state == "报警"){
            iconUrl = "../../img/peoples_bug.svg";
          }
          if(people.data.statev == 2){
            iconUrl = "../../img/peoples_bug.svg";
          }
        }
        var myIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
          anchor: new BMap.Size(10, 20),
          setTop: true
        });
        people.routeLabel = new BMap.Label(pts[0].bdlon, {
          offset: new BMap.Size(-158, -105)
        });

        people.routeLabel.setStyle({
          minWidth: "200px",
          color: "#52858e",
          fontSize: "12px",
          height: "85px",
          lineHeight: "20px",
          fontFamily: "微软雅黑",
          border:" 1px solid #52858e",
          padding:"10px",
          borderRadius:"20px",
        });
        people.routeMarker = new BMap.Marker(firstPoint, {
          icon: myIcon
        });
        people.routeMarker.setLabel(people.routeLabel);
      } else {
        people.routeMarker.setPosition(firstPoint);
        people.routeMarker.setLabel(people.routeLabel);
      }
      map.addOverlay(people.routeMarker);
      map.centerAndZoom(firstPoint, 15);
      map.panTo(firstPoint);
      people.runnum = 300;

      people.currentCount = 0;
      people.startRoute(false, people.runnum, people.currentCount);
      $(".btnFastRoute1").click(function() {
        people.startRoute(true);
        people.runnum = 100;
        people.startRoute(false, people.runnum, people.currentCount);
      });
      $(".btnFastRoute2").click(function() {
        people.startRoute(true);
        people.runnum = 50;
        people.startRoute(false, people.runnum, people.currentCount);
      });
      $(".btnFastRoute3").click(function() {
        people.startRoute(true);
        people.runnum = 20;
        people.startRoute(false, people.runnum, people.currentCount);
      });
      $(".btnFastRoute0").click(function() {
        people.startRoute(true);
        people.runnum = 10;
        people.startRoute(false, people.runnum, people.currentCount);
      });
      $(".btnFastRoute4").click(function() {
        people.startRoute(true);
        people.runnum = 300;
        people.startRoute(false, people.runnum, people.currentCount);
      });
    };

    people.startRoute = function(isPause, runnum, currentCount) {
      var me = this;
      var pts = people.curTraceData;
      var numPoints = people.curTraceData.length;

      function resetMkPoint() {
        if (people.curPointIndex < numPoints) {
          function effect(initPos, targetPos, currentCount, count) {
            var b = initPos,
              c = targetPos - initPos,
              t = currentCount,
              d = count;
            return c * t / d + b;
          }
          var count = 30,
            picSrc = "assets/img/carbig.png";
          var prvePoint = new BMap.Point(
            pts[people.curPointIndex].bdlon,
            pts[people.curPointIndex].bdlat
          ); //初始坐标
          var newPoint = new BMap.Point(
            pts[people.curPointIndex + 1].bdlon,
            pts[people.curPointIndex + 1].bdlat
          ); //获取结束点的(x,y)坐标
          var _prvePoint = new BMap.MercatorProjection().lngLatToPoint(
            prvePoint
          );
          var _newPoint = new BMap.MercatorProjection().lngLatToPoint(newPoint); //根据球面坐标转化为平面坐标
          console.log( pts[people.curPointIndex])
          var content =
          "姓名："+pts[people.curPointIndex].username+
          "<br/>员工编号："+pts[people.curPointIndex].userid+
            " <br/>位置：(" +
            pts[people.curPointIndex].bdlon +
            " ," +
            pts[people.curPointIndex].bdlat +
            ")" +
            "<br/> 时间：" +
            pts[people.curPointIndex].cdate;
          people.routeLabel.setContent(content);
          people.timer = setTimeout(function() {
            if (people.currentCount >= count) {
              people.currentCount = 0;
              people.curPointIndex++;
              people.routeMarker.setPosition(
                new BMap.Point(
                  pts[people.curPointIndex].bdlon,
                  pts[people.curPointIndex].bdlat
                )
              );
              resetMkPoint();
            } else {
              people.currentCount++; //计数
              var x = effect(
                  _prvePoint.x,
                  _newPoint.x,
                  people.currentCount,
                  count
                ),
                y = effect(
                  _prvePoint.y,
                  _newPoint.y,
                  people.currentCount,
                  count
                );
              //根据平面坐标转化为球面坐标
              var pos = map
                .getMapType()
                .getProjection()
                .pointToLngLat(new BMap.Pixel(x, y));
              people.routeMarker.setPosition(pos);
              var content =
              "姓名："+pts[people.curPointIndex].username+
          "<br/>员工编号："+pts[people.curPointIndex].userid+
            " <br/>位置：(" +
            pts[people.curPointIndex].bdlon +
            " ," +
            pts[people.curPointIndex].bdlat +
            ")" +
            "<br/> 时间：" +
            pts[people.curPointIndex].cdate;
              people.routeLabel.setContent(content);
              resetMkPoint();
            }
          }, runnum);
        } else {
          clearTimeout(people.timer);
        }
      }

      if (isPause) {
        people.isTimerRunning = false;
        people.isRoteRunning = false;
        if (people.timer != null) clearTimeout(people.timer);
      } else {
        people.isTimerRunning = true;
        people.isRoteRunning = true;
        people.timer = setTimeout(function() {
          resetMkPoint();
        }, runnum);
      }
    };

    people.resetRoute = function() {
      people.curPointIndex = 0;
      if (people.timer != null) {
        people.isTimerRunning = false;
        people.isRoteRunning = false;
        clearTimeout(people.timer);
      }
    };

    return people;
  }
};
var infoBoxTemp=null;
function showInfoWindow1(data, _map, people) {
  //get the current data
  "use strict";
  var online = "情况正常";
  var colors = "#66b1bd";
  var bgcolor = "white";
  if (data.state == "报警") {
    var color = "red";
    colors = "red";
    online = "需要救助";
    bgcolor = "yellow";
    if(data.fanceflg==1){
         online = "人员已超出围栏";
    }
  } else {
    var color = "black";
    online = "情况正常";
  }
  var infoContent =
    "<span style='color:" +
    color +
    ";'>姓名：</span>" +
    "<span style='color:" +
    color +
    ";'>" +
    data.username +
    "</span>" +
    "</span>" +
    "<br/>" +
    "<span style='color:" +
    color +
    ";'>员工编号：</span>" +
    "<span style='color:" +
    color +
    ";'>" +
    data.userid +
    "</span>" +
    "<br/>" +
    "<span style='color:" +
    color +
    ";'>项目组：</span>" +
    "<span style='color:" +
    color +
    ";'>" +
    data.userorg +
    "</span>" +
    "<br/>" +
    "<span style='color:" +
    color +
    ";'>行走步数：</span>" +
    "<span style='color:" +
    color +
    ";'>" +
    data.step +
    "</span>" +
    "<br/>" +
    "<span style='color:" +
    color +
    ";'>心率：</span>" +
    "<span style='color:" +
    color +
    ";'>" +
    data.hr +
    "&nbsp;次/分" +
    "</span>" +
    "<br/>" +
    "<span style='color:" +
    color +
    ";'>" +
    online +
    "</span>";
  var infoWin = new BMapLib.InfoBox(map, infoContent, {
    boxStyle: {
      background: bgcolor,
      width: "140px",
      height: "157px",
      borderRadius: "35px",
      lineHeight: "23px",
      padding: "10px 0px 6px 20px",
      border: "2px solid " + colors
    },
    coloseIconMargin: "1px 1px 0 0",
    enableAutoPan: false,
    offset: new BMap.Size(25, 25)
  });
  if(infoBoxTemp){
    infoBoxTemp.close();
    }
    infoBoxTemp = infoWin;
  infoWin.open(people.marker)
}

function loadpeopleList(map) {
  doRefresh(null, "KULUINTERFACE", "searchUserWordParasList", "", function(data) {
    if (data.code == 0) {
      if (data.data.length > 0) {
        var cars = data.data;
        $.each(cars, function(i, data) {
          people = People.createNew(data, map);
          people.initCar();
         
      if (people.data.state == "报警") {
        window.peoples += 1;
      }
        });
        $(".search_Carlist").click(function() {
          map.removeOverlay(people.routeMarker);
          map.removeOverlay(people.routeLabel);
          map.removeOverlay();
          people.hide();
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
    
    $(".detailNum").html(window.peoples);
      }
    } else {
      alert(data.msg);
    }
  });
}
