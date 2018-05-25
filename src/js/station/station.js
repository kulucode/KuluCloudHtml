layui.use('table', function () {
    var table = layui.table;
    //监听表格复选框选择
    table.on('checkbox(demo)', function (obj) {
        console.log(obj)
    });
    //监听工具条
    table.on('tool(demo)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            let station = Station.createNew(data, map);
            showInfoWindow3(data, map, station);
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            location.href = "../../html/station/station_video.html"
        }
    });

    var $ = layui.$,
        active = {
            reload: function () {
                var demoReload = $('#demoReload');

                //执行重载
                table.reload('testReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: {
                        key: {
                            id: demoReload.val()
                        }
                    }
                });
            },
            getCheckData: function () { //获取选中数据
                var checkStatus = table.checkStatus('idTest'),
                    data = checkStatus.data;
                layer.alert(JSON.stringify(data));
            },
            getCheckLength: function () { //获取选中数目
                var checkStatus = table.checkStatus('idTest'),
                    data = checkStatus.data;
                layer.msg('选中了：' + data.length + ' 个');
            },
            isAll: function () { //验证是否全选
                var checkStatus = table.checkStatus('idTest');
                layer.msg(checkStatus.isAll ? '全选' : '未全选')
            }
        };
    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
});


window.stations = 0
var Station = {

    createNew: function (data, map) {
        'use strict';
        let station = {};
        station.id = data.id;
        station.info = {};
        station.data = data;
        station.point = null;
        station.infoWindow = null;
        station.selected = false;
        station.focused = false;
        station.isShowTrace = false;
        station.areAlerted = false;
        station.path = new Array();
        station.curTraceData = null;
        station.timer = null;
        station.routeMarker = null;
        station.routeLabel = null;
        station.curPointIndex = 0;
        station.isTimerRunning = false;
        station.isRoteRunning = false;
        station.points = [];
        station.marker = null;
        // if(data.preset_traits != null && data.preset_traits.length > 1) {
        // 	station.preset_traits = JSON.parse(data.preset_traits);
        // } else {
        // 	station.preset_traits = null;
        // }

        // if(data.fence != null && data.fence.length > 1) {
        // 	station.fence = JSON.parse(data.fence);
        // } else {
        // 	station.fence = null;
        // }detailNum
        station.initCar = function () { //地图显示图标
            station.point = new BMap.Point(station.data.cur_long, station.data.cur_lat);
            if(station.data.status=="警报"){
                var iconUrl = "../../img/car/stations_danger.svg";
            }else{
                var iconUrl = "../../img/car/stations.svg";
            }
            if (station.data.status == "警报") {
                window.stations += 1;
            }
            $(".detailNum").html(window.stations)
            let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                anchor: new BMap.Size(10, 20)
            }); //BMap.Size定义为偏移位置
            station.marker = new BMap.Marker(station.point, {
                icon: carIcon
            });

            map.addOverlay(station.marker);

            station.marker.disableMassClear();
            let labelHD = new BMap.Label(station.data.plate_number, {
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
            station.marker.addEventListener("click", function (e) {
                showInfoWindow3(data, map, station);
            });
            station.marker.addEventListener("mouseover", function (e) {

                station.marker.setLabel(labelHD);
                //颜色改变

                this.getLabel().show();
            });

            station.marker.addEventListener("mouseout", function (e) {
                this.getLabel().hide();
                station.beginCar(station);
            });

        };

        station.beginCar = function (station) {
            map.removeOverlay(station.marker);

            if(station.data.status=="警报"){
                var iconUrl = "../../img/car/stations_danger.svg";
            }else{
                var iconUrl = "../../img/car/stations.svg";
            }

            let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                anchor: new BMap.Size(10, 20)
            });
            //添加标注
            station.marker.setIcon(carIcon);
            map.addOverlay(station.marker);
        }
        station.loadTrace = function () { //轨迹的显示
            map.removeOverlay();
            RemoteApi.getPeopleHis(function (data) {
                if (data.list.length > 0) {

                    var points = new Array();
                    //clear the array
                    station.curTraceData = data.list;
                    var lastP = data.list.length - 1;
                    var firstPoint = new BMap.Point(data.list[0][2], data.list[0][3]);
                    var endPoint = new BMap.Point(data.list[lastP][2], data.list[lastP][3]);
                    //remove before add new path
                    if (station.path != null && station.path.length > 0) {
                        $.each(station.path, function (i, item) {
                            map.removeOverlay(item);
                        });
                    }

                    station.path.length = 0; //clear the array
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i][4] == 1) { //重新开始
                            var curPath = new BMap.Polyline(points, {
                                strokeColor: "blue",
                                strokeWeight: 5,
                                strokeOpacity: 0.5
                            });

                            map.addOverlay(curPath);
                            station.path.push(curPath); //save the path in array
                            points.length = 0; //start new
                        }

                        //record as start point
                        var pt = new BMap.Point(data.list[i][2], data.list[i][3]);
                        points.push(pt);
                    }

                    //the last path
                    var lastPath = new BMap.Polyline(points, {
                        strokeColor: "blue",
                        strokeWeight: 5,
                        strokeOpacity: 0.5
                    });

                    map.addOverlay(lastPath);
                    station.path.push(lastPath); //save the path in array

                    station.isShowTrace = true;

                    if (points.length > 0) {
                        map.centerAndZoom(points[0], 15);
                        map.panTo(points[0]);
                    }
                    if (station.routeMarker == null) {
                            var iconUrl = "../../img/car/stations_danger.svg";
                        var myBeginIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                            setTop: false
                        });
                        station.carBegin = new BMap.Marker(firstPoint, {
                            icon: myBeginIcon
                        });
                    } else {
                        station.carBegin.setPosition(firstPoint);
                    }
                    // map.addOverlay(station.carBegin);
                }
            });

        };

        station.showTrace = function () {
            // map.removeOverlay(station.path);
            if (station.path != null && station.path.length > 0) {
                $.each(station.path, function (i, item) {
                    item.show();
                });
            }
        };

        station.hideTrace = function () {

            //map.removeOverlay(station.path);
            if (station.path != null && station.path.length > 0) {
                $.each(station.path, function (i, item) {
                    item.hide();
                });
            }
            station.isShowTrace = false;

        };

        station.closeInfoWindow = function () {
            //map.removeOverlay(station.path);
            if (station.infoWindow != null && station.infoWindow.isOpen()) {
                map.closeInfoWindow();
            }
        };

        // 更新最新位置
        station.updatePos = function (lng, lat, areAlerted) {

            if (areAlerted == 1 && !station.areAlerted) {
                station.areAlerted = true;

                var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20)
                }); //BMap.Size定义为偏移位置
                station.marker.setIcon(carIcon);
            } else if (areAlerted == 0 && station.areAlerted) {
                station.areAlerted = false;

                var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20)
                }); //BMap.Size定义为偏移位置
                station.marker.setIcon(carIcon);
            }

            station.point = new BMap.Point(lng, lat);
            station.marker.setPosition(station.point);
            //update pos
            if (station.focused) {
                station.marker.show();
                // showInfoWindow3(station, map);
            }
        };

        // 显示车子的最新位置
        station.show = function () {
            //station.point = new BMap.Point(station.data.cur_long, station.data.cur_lat);
            station.marker.show();
        };

        // 隐藏车子，并停止实时定位
        station.hide = function () {
            station.marker.hide();
        };

        station.liveLocate = function () {

        };

        // 在地图上聚焦
        station.focus = function () {
            map.centerAndZoom(station.point, 18);

            map.panTo(station.point);
            //get the current data
            showInfoWindow3(station, map, station);
        };

        // 在地图上聚焦
        station.route = function () {
            if (station.curTraceData.length < 1)
                return;
            map.removeOverlay(station.routeMarker);
            map.removeOverlay(station.marker);
            var pts = station.curTraceData;
            var numPoints = station.curTraceData.length;
            var firstPoint = new BMap.Point(pts[0][2], pts[0][3]);
            station.curPointIndex = 0;
            //new marger if need
            if (station.routeMarker == null) {
                var myIcon = new BMap.Icon("../../img/car/stations.svg", new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20),
                    setTop: true
                });
                station.routeLabel = new BMap.Label(pts[0][0], {
                    offset: new BMap.Size(-75, -43)
                });

                station.routeLabel.setStyle({
                    minWidth: "200px",
                    color: "blue",
                    fontSize: "12px",
                    height: "40px",
                    lineHeight: "20px",
                    fontFamily: "微软雅黑"
                });
                station.routeMarker = new BMap.Marker(firstPoint, {
                    icon: myIcon
                });
                station.routeMarker.setLabel(station.routeLabel);
            } else {
                station.routeMarker.setPosition(firstPoint);
                station.routeMarker.setLabel(station.routeLabel);
            }
            map.addOverlay(station.routeMarker);
            map.centerAndZoom(firstPoint, 15);
            map.panTo(firstPoint);
            station.runnum = 300;

            station.currentCount = 0;
            station.startRoute(false, station.runnum, station.currentCount);
            $(".btnFastRoute1").click(function () {
                station.startRoute(true);
                station.runnum = 100;
                station.startRoute(false, station.runnum, station.currentCount);
            })
            $(".btnFastRoute2").click(function () {
                station.startRoute(true);
                station.runnum = 20;
                station.startRoute(false, station.runnum, station.currentCount);
            })
            $(".btnFastRoute3").click(function () {
                station.startRoute(true);
                station.runnum = 10;
                station.startRoute(false, station.runnum, station.currentCount);
            })
            $(".btnFastRoute4").click(function () {
                station.startRoute(true);
                station.runnum = 300;
                station.startRoute(false, station.runnum, station.currentCount);
            })
        };


        station.startRoute = function (isPause, runnum, currentCount) {

            var me = this;
            var pts = station.curTraceData;
            var numPoints = station.curTraceData.length;

            function resetMkPoint() {
                if (station.curPointIndex < numPoints) {

                    function effect(initPos, targetPos, currentCount, count) {
                        var b = initPos,
                            c = targetPos - initPos,
                            t = currentCount,
                            d = count;
                        return c * t / d + b;
                    };
                    var count = 30,
                        picSrc = "assets/img/carbig.png";
                    var prvePoint = new BMap.Point(pts[station.curPointIndex][2], pts[station.curPointIndex][3]); //初始坐标
                    var newPoint = new BMap.Point(pts[station.curPointIndex + 1][2], pts[station.curPointIndex + 1][3]); //获取结束点的(x,y)坐标
                    var _prvePoint = new BMap.MercatorProjection().lngLatToPoint(prvePoint);
                    var _newPoint = new BMap.MercatorProjection().lngLatToPoint(newPoint); //根据球面坐标转化为平面坐标
                    var content = " 位置：(" + pts[station.curPointIndex][0] + " : " + pts[station.curPointIndex][1] + ")" + "<br/> 时间：" + pts[station.curPointIndex][5];
                    station.routeLabel.setContent(content);
                    station.timer = setTimeout(function () {
                        if (station.currentCount >= count) {
                            station.currentCount = 0;
                            station.curPointIndex++;
                            station.routeMarker.setPosition(new BMap.Point(pts[station.curPointIndex][2], pts[station.curPointIndex][3]));
                            resetMkPoint();
                        } else {

                            station.currentCount++; //计数
                            var x = effect(_prvePoint.x, _newPoint.x, station.currentCount, count),
                                y = effect(_prvePoint.y, _newPoint.y, station.currentCount, count);
                            //根据平面坐标转化为球面坐标
                            var pos = map.getMapType().getProjection().pointToLngLat(new BMap.Pixel(x, y));
                            station.routeMarker.setPosition(pos);
                            var content = " 位置：(" + pts[station.curPointIndex][0] + " : " + pts[station.curPointIndex][1] + ")" + "<br/> 时间：" + pts[station.curPointIndex][5];
                            station.routeLabel.setContent(content);
                            resetMkPoint();
                        }
                    }, runnum);
                } else {
                    clearTimeout(station.timer);
                }
            }

            if (isPause) {
                station.isTimerRunning = false;
                station.isRoteRunning = false;
                if (station.timer != null)
                    clearTimeout(station.timer);
            } else {
                station.isTimerRunning = true;
                station.isRoteRunning = true;
                station.timer = setTimeout(function () {
                    resetMkPoint();
                }, runnum);

            }


        };

        station.resetRoute = function () {
            station.curPointIndex = 0;
            if (station.timer != null) {
                station.isTimerRunning = false;
                station.isRoteRunning = false;
                clearTimeout(station.timer);
            }
        };

        return station;
    }
}


function showInfoWindow3(data, _map, station) {
    //get the current data
    'use strict';
    var online = "情况正常";
    // if(carData.station.cur_oil_level != null && !isNaN(parseInt(carData.station.cur_oil_level))) {
    //     var ratio = (parseInt(carData.station.cur_oil_level) / parseInt(carData.station.max_oil_level)) * 100;
    //     if(ratio > 100) //TO DO
    //         ratio = 80;
    //
    //     oilLevel = Math.round(ratio * 100) / 100;
    // }
    var colors = "#66b1bd";
    var bgcolor = "white"
    if (data.status == "警报") {
        var color = "red";
        colors = "red";
        online = "警报";
        bgcolor = "yellow"
    } else {
        var color = "black";
        online = "正常";
    }

    station.initCar();
    var online 
    var infoContent = "<span style='color:" + color + ";'>中转站编号:</span>" + "<span style='color:" + color + ";'>" + data.num + "</span>" + "</span>" + "<br/>" +
    "<span style='color:" + color + ";'>责任人:</span>" + "<span style='color:" + color + ";'>" + data.name + "</span>" + "<br/>" +
    "<span style='color:" + color + ";'>当前臭气指标：</span>" + "<span style='color:" + color + ";'>" + online + "</span>" + "<br/>" ;
    var infoWin = new BMapLib.InfoBox(map, infoContent, {
        boxStyle: {
            background: bgcolor,
            width: "180px",
            height: "87px",
            borderRadius: "18px",
            lineHeight:"23px",
            padding:"10px 0px 6px 20px",
            border:"2px solid "+colors
        },
        coloseIconMargin: "1px 1px 0 0",
        enableAutoPan: true,
        offset: new BMap.Size(25, 25)
    });
    infoWin.enableAutoPan();
    infoWin.open(station.marker);
    
}

function loadstationList(map) {
    RemoteApi3.getStationUrl(function (data) {
        if (data.data.length > 0) {
            var cars = data.data;
            $.each(cars, function (i, data) {
                let station = Station.createNew(data, map);
                station.initCar();
            });
        }
        // area.initCar()
    })
}