window.n = 0;
var Car = {
  createNew: function(data, map) {
    "use strict";
    let car = {};
    // car.id = data.id;
    car.info = {};
    car.data = data;
    car.point = null;
    car.infoWindow = null;
    car.selected = false;
    car.focused = false;
    car.isShowTrace = false;
    car.areAlerted = false;
    car.path = new Array();
    car.curTraceData = null;
    car.timer = null;
    car.routeMarker = null;
    car.routeLabel = null;
    car.curPointIndex = 0;
    car.isTimerRunning = false;
    car.isRoteRunning = false;
    car.marker = null;
    car.initCar = function() {
      //地图显示图标
      car.point = new BMap.Point(car.data.bdlon, car.data.bdlat);
      var iconUrl = "../../img/car/QX_status_work.svg";
      if (car.data.onlinev == 0) {
        iconUrl = "../../img/car/QX_status_park.svg";
      }
      let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
        anchor: new BMap.Size(10, 20)
      }); //BMap.Size定义为偏移位置
      car.marker = new BMap.Marker(car.point, {
        icon: carIcon
      });
      map.addOverlay(car.marker);
      let labelHD = new BMap.Label(car.data.truckname, {
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
      car.marker.addEventListener("click", function(e) {
        showInfoWindow(car.data, map, car);
      });
      car.marker.addEventListener("mouseover", function(e) {
        car.marker.setLabel(labelHD);
        this.getLabel().show();
      });

      car.marker.addEventListener("mouseout", function(e) {
        this.getLabel().hide();
      });
    };
    car.loadTrace = function() {
      //轨迹的显示
      doRefresh(
        "carForm",
        "KULUINTERFACE",
        "getTruckTracePointList",
        "",
        function(data) {
          map.removeOverlay();
          console.log(data)
          if (data.data.length == 0) {
            layer.msg("暂无车辆行驶记录");
          }
          if (data.data.length > 0) {
            var points = new Array();
            //clear the array
            car.curTraceData = data.data;
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
            if (car.path != null && car.path.length > 0) {
              $.each(car.path, function(i, item) {
                map.removeOverlay(item);
              });
            }

            car.path.length = 0; //clear the array
            for (var i = 0; i < data.data.length; i++) {
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
            car.path.push(lastPath); //save the path in array
            car.isShowTrace = true;
            if (points.length > 0) {
              map.centerAndZoom(points[0], 13);
              map.panTo(points[0]);
            }
            if (car.routeMarker == null) {
              var iconUrl = "../../img/car/QX_status_work.svg";
              if (car.data.onlinev == 0) {
                iconUrl = "../../img/car/QX_status_park.svg";
              }
              var myBeginIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                setTop: false
              });
              car.carBegin = new BMap.Marker(firstPoint, {
                icon: myBeginIcon
              });
            } else {
              car.carBegin.setPosition(firstPoint);
            }
          }
        }
      );
    };

    car.showTrace = function() {
      // map.removeOverlay(car.path);
      if (car.path != null && car.path.length > 0) {
        $.each(car.path, function(i, item) {
          item.show();
        });
      }
    };

    car.hideTrace = function() {
      //map.removeOverlay(car.path);
      if (car.path != null && car.path.length > 0) {
        $.each(car.path, function(i, item) {
          item.hide();
        });
      }
      car.isShowTrace = false;
    };

    car.closeInfoWindow = function() {
      //map.removeOverlay(car.path);
      if (car.infoWindow != null && car.infoWindow.isOpen()) {
        map.closeInfoWindow();
      }
    };

    // 更新最新位置
    car.updatePos = function(lng, lat, areAlerted) {
      if (areAlerted == 1 && !car.areAlerted) {
        car.areAlerted = true;
        var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
          anchor: new BMap.Size(10, 20)
        }); //BMap.Size定义为偏移位置
        car.marker.setIcon(carIcon);
      } else if (areAlerted == 0 && car.areAlerted) {
        car.areAlerted = false;

        var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
          anchor: new BMap.Size(10, 20)
        }); //BMap.Size定义为偏移位置
        car.marker.setIcon(carIcon);
      }
      car.point = new BMap.Point(lng, lat);
      console.log(123);
      car.marker.setPosition(car.point);
      //update pos
      if (car.focused) {
        car.marker.show();
        // showInfoWindow(car, map);
      }
    };

    // 显示车子的最新位置
    car.show = function() {
      //car.point = new BMap.Point(car.data.cur_long, car.data.cur_lat);
      car.marker.show();
    };

    // 隐藏车子，并停止实时定位
    car.hide = function() {
      car.marker.hide();
    };

    car.liveLocate = function() {};

    // 在地图上聚焦
    car.focus = function() {
      map.centerAndZoom(car.point, 18);

      map.panTo(car.point);
      //get the current data
      showInfoWindow(car, map, car);
    };

    // 在地图上聚焦
    car.route = function() {
      if (car.curTraceData.length < 1) return;
      map.removeOverlay(car.routeMarker);
      var pts = car.curTraceData;
      var numPoints = car.curTraceData.length;
      var firstPoint = new BMap.Point(pts[0].bdlon, pts[0].bdlat);
      car.curPointIndex = 0;
      //new marger if need
      if (car.routeMarker == null) {
        var myIcon = new BMap.Icon(
          "../../img/car/QX_status_work.svg",
          new BMap.Size(25, 25),
          {
            anchor: new BMap.Size(10, 20),
            setTop: true
          }
        );
        car.routeLabel = new BMap.Label(pts[0].bdlon, {
          offset: new BMap.Size(-158, -105)
        });

        car.routeLabel.setStyle({
          minWidth: "200px",
          color: "#52858e",
          fontSize: "12px",
          height: "85px",
          lineHeight: "20px",
          fontFamily: "微软雅黑",
          border: " 1px solid #52858e",
          padding: "10px",
          borderRadius: "20px"
        });
        car.routeMarker = new BMap.Marker(firstPoint, {
          icon: myIcon
        });
        car.routeMarker.setLabel(car.routeLabel);
      } else {
        car.routeMarker.setPosition(firstPoint);
        car.routeMarker.setLabel(car.routeLabel);
      }
      map.addOverlay(car.routeMarker);
      map.centerAndZoom(firstPoint, 15);
      map.panTo(firstPoint);
      car.runnum = 300;
      car.currentCount = 0;
      car.startRoute(false, car.runnum, car.currentCount);
      $(".btnFastRoute1").click(function() {
        car.startRoute(true);
        car.runnum = 100;
        car.startRoute(false, car.runnum, car.currentCount);
      });
      $(".btnFastRoute2").click(function() {
        car.startRoute(true);
        car.runnum = 50;
        car.startRoute(false, car.runnum, car.currentCount);
      });
      $(".btnFastRoute3").click(function() {
        car.startRoute(true);
        car.runnum = 20;
        car.startRoute(false, car.runnum, car.currentCount);
      });
      $(".btnFastRoute0").click(function() {
        car.startRoute(true);
        car.runnum = 10;
        car.startRoute(false, car.runnum, car.currentCount);
      });
      $(".btnFastRoute4").click(function() {
        car.startRoute(true);
        car.runnum = 300;
        car.startRoute(false, car.runnum, car.currentCount);
      });
    };

    car.startRoute = function(isPause, runnum, currentCount) {
      var me = this;
      var pts = car.curTraceData;
      var numPoints = car.curTraceData.length;

      function resetMkPoint() {
        if (car.curPointIndex < numPoints) {
          function effect(initPos, targetPos, currentCount, count) {
            var b = initPos,
              c = targetPos - initPos,
              t = currentCount,
              d = count;
            return c * t / d + b;
          }
          var count = 30;
          var prvePoint = new BMap.Point(
            pts[car.curPointIndex].bdlon,
            pts[car.curPointIndex].bdlat
          ); //初始坐标
          var newPoint = new BMap.Point(
            pts[car.curPointIndex + 1].bdlon,
            pts[car.curPointIndex + 1].bdlat
          ); //获取结束点的(x,y)坐标
          var _prvePoint = new BMap.MercatorProjection().lngLatToPoint(
            prvePoint
          );
          var _newPoint = new BMap.MercatorProjection().lngLatToPoint(newPoint); //根据球面坐标转化为平面坐标
          var content =
            " 车牌号：" +
            pts[car.curPointIndex].platenum +
            " <br/>项目组：" +
            pts[car.curPointIndex].truckorg +
            " <br/>位置：(" +
            pts[car.curPointIndex].bdlon +
            " : " +
            pts[car.curPointIndex].bdlat +
            ")" +
            "<br/> 时间：" +
            pts[car.curPointIndex].date;
          car.routeLabel.setContent(content);
          car.timer = setTimeout(function() {
            if (car.currentCount >= count) {
              car.currentCount = 0;
              car.curPointIndex++;
              window.left = parseInt(
                parseInt(car.curPointIndex) /
                  parseInt(car.curTraceData.length) *
                  100
              );

              let Width = $(".progress_bg").width();
              $(".progress_btn").css("left", window.left * Width / 100);
              $(".progress_bar").width(window.left * Width / 100);
              $(".text").html(parseInt(window.left) + "%");
              car.routeMarker.setPosition(
                new BMap.Point(
                  pts[car.curPointIndex].bdlon,
                  pts[car.curPointIndex].bdlat
                )
              );
              resetMkPoint();
            } else {
              car.currentCount++; //计数

              var x = effect(
                  _prvePoint.x,
                  _newPoint.x,
                  car.currentCount,
                  count
                ),
                y = effect(_prvePoint.y, _newPoint.y, car.currentCount, count);
              //根据平面坐标转化为球面坐标
              var pos = map
                .getMapType()
                .getProjection()
                .pointToLngLat(new BMap.Pixel(x, y));
              car.routeMarker.setPosition(pos);
              var content =
                " 车牌号：" +
                pts[car.curPointIndex].platenum +
                " <br/>项目组：" +
                pts[car.curPointIndex].truckorg +
                " <br/>位置：(" +
                pts[car.curPointIndex].bdlon +
                " : " +
                pts[car.curPointIndex].bdlat +
                ")" +
                "<br/> 时间：" +
                pts[car.curPointIndex].date;
              car.routeLabel.setContent(content);

              let Width = $(".progress_bg").width();
              $(".progress_btn").css("left", window.left * Width / 100);
              $(".progress_bar").width(window.left * Width / 100);
              $(".text").html(parseInt(window.left) + "%");
              resetMkPoint();
            }
          }, runnum);
        } else {
          clearTimeout(car.timer);
        }
      }
      $(".progress_bg").click(function() {
        clearTimeout(car.timer);
        window.left = parseInt(window.left / $(".progress_bg").width() * 100);
        if (window.left <= 0) {
          window.left = 0;
        } else if (window.left > 1100) {
          window.left = 1100;
        }

        car.curPointIndex = parseInt(
          window.left / 100 * car.curTraceData.length
        );
        resetMkPoint();
      });
      if (isPause) {
        car.isTimerRunning = false;
        car.isRoteRunning = false;
        if (car.timer != null) clearTimeout(car.timer);
      } else {
        car.isTimerRunning = true;
        car.isRoteRunning = true;
        car.timer = setTimeout(function() {
          resetMkPoint();
        }, runnum);
      }
    };

    car.resetRoute = function() {
      car.curPointIndex = 0;
      if (car.timer != null) {
        car.isTimerRunning = false;
        car.isRoteRunning = false;
        clearTimeout(car.timer);
      }
    };

    return car;
  }
};

var CarManager = {
  createNew: function(map) {
    let cm = {};
    cm.cars = [];
    cm.curCar = null;
    //加载小车的所有信息并加入cm.cars列表中
    cm.loadCar = function(carId) {
      doRefresh(
        null,
        "KULUINTERFACE",
        "searchTruckWordParasList",
        "&pg_truck=" + carId,
        function(data) {
          if (data.code == 0) {
            //执行正确动作
            console.log(data)
            let car = Car.createNew(data.data, map);
            console.log(cm);
          } else {
            alert(data.msg);
          }
        }
      );
      // RemoteApi.getCar(carId, function(carData) {
      //     let car = Car.createNew(carData.car, map);
      //     cm.cars.push(car);
      //     callback(car);
      // });
    };
    cm.getCar = function(carId) {
      var result = cm.cars.filter(function(c) {
          return c.data.eqpid === carId;
      });
      console.log(result)
      return result[0];
  };
    return cm;
  }
};

var infoBoxTemp = null;
function showInfoWindow(data, _map, car) {
  //get the current data
  "use strict";
  let content = "";
  var online = "正常";
  var CarState = "离线";
  var colors = "#66b1bd";
  if (data.status == "故障") {
    var color = "red";
    colors = "red";
    online =
      "<a style='color:" +
      color +
      ";' href='../../html/car/car_state.html'>设备故障</a>";
  } else {
    var color = "#66b1bd";
    online = "设备正常";
  }
  if (data.onlinev == 1) {
    CarState = "在线";
  } else {
    CarState = "离线";
  }
  var infoContent =
    "<span>车牌号：</span>" +
    "<span>" +
    data.paltenum +
    "</span>" +
    "<br/>" +
    "<span>项目组：</span>" +
    "<span>" +
    data.truckorg +
    "</span>" +
    "<br/>" +
    "<span>物料编号：</span>" +
    "<span>" +
    data.trucknno +
    "</span>" +
    "<br/>" +
    "<span>当前时速：</span>" +
    "<span>" +
    data.speed +
    "&nbsp;km/h" +
    "</span>" +
    "<br/>" +
    "<span>剩余油量：</span>" +
    "<span>" +
    data.oil +
    "&nbsp;%" +
    "</span>" +
    "<br/>" +
    "<span style='color:" +
    color +
    ";'>" +
    online +
    "(" +
    CarState +
    ")" +
    "</span>";
  var infoWin = new BMapLib.InfoBox(map, infoContent, {
    boxStyle: {
      background: "#fff",
      width: "140px",
      height: "178px",
      borderRadius: "35px",
      lineHeight: "23px",
      padding: "10px 10px 6px 20px",
      border: "2px solid " + color
    },
    coloseIconMargin: "1px 1px 0 0",
    enableAutoPan: false,
    offset: new BMap.Size(25, 25)
  });
  if (infoBoxTemp) {
    infoBoxTemp.close();
  }
  infoBoxTemp = infoWin;
  infoWin.open(car.marker);
}
//小车
function loadcarList(map, cm) {
  doRefresh(null, "KULUINTERFACE", "searchTruckWordParasList", "", function(
    data
  ) {
    if (data.code == 0) {
      //执行正确动作
      if (data.data.length > 0) {
        var cars = data.data;
        $.each(cars, function(i, data) {
          car = Car.createNew(data, map);
          car.initCar();
          cm.cars.push(car)
          if (car.data.onlinev == 2) {
            window.n += 1;
          }
          $(".detailNum").html(window.n);

          $(".search_Carlist").click(function() {
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
            map.removeOverlay(car.marker);
          });
        });
      }
    } else {
      alert(data.msg);
    }
  });
}
function WebSocketInit(map,cm){
  if ("WebSocket" in window) {
    url =
      "ws://hanshan.vip.coollu.com.cn:80/kulucloud/TTWebsocket/" +
      getTTSession() +
      "?dataid=01";
    // this.url = url;
    // this.cm = cm;
    let sock = new MyWebSocket(url, function(event) {
      var carInfo = JSON.parse(event.data);
      sock.send("hoooooooooo");
      console.log(carInfo)
      if (car != undefined) {
        for(let j=0;j<cm.cars.length;j++){
          if (carInfo.eqpid == cm.cars[j].data.eqpid) {
            var car123 = cm.getCar(carInfo.eqpid);
            car123.updatePos(carInfo.bdlon,carInfo.bdlat);
          }
        }
      }
    });
  } else {
    alert("Not support websocket");
  }
}
$("#researchCars").click(function() {
  loadCarlsitTable(datas);
});

//加载表格
function loadCarlsitTable(datas) {
  layui.use("table", function() {
    var table = layui.table;
    pg_keyword = $("#demoReload").val();
    //第一个实例
    table.render({
      elem: "#demo",
      height: "full-750",
      cellMinWidth: 100,
      url:
        "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=250&TTDT=json&opname=searchTruckList&TTSSID=" +
        datas +
        "&TTKEY=null&pg_keyword=" +
        pg_keyword +
        "&pg_num=0&pg_size=1000", //数据接口
      page: false, //开启分页
      cols: [
        [
          //表头
          {
            field: "tbindex",
            title: "ID",
            sort: true
          },
          {
            field: "truckorg",
            title: "项目组",
            width: 200
          },
          {
            field: "trucktype",
            title: "设备类型",
            width: 200
          },
          {
            field: "trucknno",
            title: "物料编号",
            width: 200
          },
          {
            field: "paltenum",
            title: "车牌号",
            sort: true
          },
          {
            field: "online",
            title: "车辆状况",
            sort: true
          },
          {
            field: "speed",
            title: "当前时速(km/h)"
          },
          {
            field: "oil",
            title: "剩余油量(%)",
            sort: true
          },

          {
            toolbar: "#barDemo",
            title: "实时定位",
            align: "center"
          },

          {
            toolbar: "#barDemos",
            title: "直播",
            align: "center"
          }
        ]
      ],
      done: function(res, curr, count) {
        //如果是异步请求数据方式，res即为你接口返回的信息。
        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].online == "报警") {
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

        //得到当前页码
      }
    });
    table.on("tool(test)", function(obj) {
      var data = obj.data;
      if (obj.event === "detail") {
        doRefresh(
          null,
          "KULUINTERFACE",
          "searchTruckWordParasList",
          "",
          function(data) {
            if (data.code == 0) {
              //执行正确动作
              var a;
              for (i = 0; i < data.data.length; i++) {
                if (data.data[i].truckid == obj.data.truckid) {
                  a = i;
                }
              }
              console.log(data.data[a], obj);
              let car = Car.createNew(data.data[a], map);
              car.initCar();
              showInfoWindow(data.data[a], map, car);
              map.centerAndZoom(
                new BMap.Point(data.data[a].bdlon, data.data[a].bdlat),
                15
              );
              // obj.data.userinst=data.data[a].userinst;
            } else {
              alert(data.msg);
            }
          }
        );
      } else if (obj.event === "edit") {
        console.log(obj.data);
        location.href = "car_video.html?" + obj.data.paltenum;
      }
    });
  });
}
var MonitorMap = (function() {
  return {
    init: function() {
      var cm = CarManager.createNew(map);
      cm.loadCar();
      loadcarList(map,cm);
      WebSocketInit(map,cm)
    }
  };
})();
