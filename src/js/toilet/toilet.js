
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
            let toilet = Toilet.createNew(data, map);
            showInfoWindow2(data, map, toilet);
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            location.href = "../../html/toilet/car_video.html"
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


window.toilets = 0
var Toilet = {

    createNew: function (data, map) {
        'use strict';
        let toilet = {};
        toilet.id = data.id;
        toilet.info = {};
        toilet.data = data;
        toilet.point = null;
        toilet.infoWindow = null;
        toilet.selected = false;
        toilet.focused = false;
        toilet.isShowTrace = false;
        toilet.areAlerted = false;
        toilet.path = new Array();
        toilet.curTraceData = null;
        toilet.timer = null;
        toilet.routeMarker = null;
        toilet.routeLabel = null;
        toilet.curPointIndex = 0;
        toilet.isTimerRunning = false;
        toilet.isRoteRunning = false;
        toilet.points = [];
        toilet.marker = null;
        // if(data.preset_traits != null && data.preset_traits.length > 1) {
        // 	toilet.preset_traits = JSON.parse(data.preset_traits);
        // } else {
        // 	toilet.preset_traits = null;
        // }

        // if(data.fence != null && data.fence.length > 1) {
        // 	toilet.fence = JSON.parse(data.fence);
        // } else {
        // 	toilet.fence = null;
        // }detailNum
        toilet.initCar = function () { //地图显示图标
            toilet.point = new BMap.Point(toilet.data.cur_long, toilet.data.cur_lat);
            if(toilet.data.status=="警报"){
                var iconUrl = "../../img/car/toilets_danger.svg";
            }else{
                var iconUrl = "../../img/car/toilets.svg";
            }
            if (toilet.data.status == "警报") {
                window.toilets += 1;
            }
            
            $(".detailNum").html(window.toilets)
            let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                anchor: new BMap.Size(10, 20)
            }); //BMap.Size定义为偏移位置
            toilet.marker = new BMap.Marker(toilet.point, {
                icon: carIcon
            });

            map.addOverlay(toilet.marker);

            toilet.marker.disableMassClear();
            let labelHD = new BMap.Label(toilet.data.num, {
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
            toilet.marker.addEventListener("click", function (e) {
                showInfoWindow2(data, map, toilet);
            });
            toilet.marker.addEventListener("mouseover", function (e) {

                toilet.marker.setLabel(labelHD);
                //颜色改变

                this.getLabel().show();
            });

            toilet.marker.addEventListener("mouseout", function (e) {
                this.getLabel().hide();
                toilet.beginCar(toilet);
            });

        };

        toilet.beginCar = function (toilet) {
            map.removeOverlay(toilet.marker);

            if(toilet.data.status=="警报"){
                var iconUrl = "../../img/car/toilets_danger.svg";
            }else{
                var iconUrl = "../../img/car/toilets.svg";
            }

            let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                anchor: new BMap.Size(10, 20)
            });
            //添加标注
            toilet.marker.setIcon(carIcon);
            map.addOverlay(toilet.marker);
        }
        toilet.loadTrace = function () { //轨迹的显示
            map.removeOverlay();
            RemoteApi2.getPeopleHis(function (data) {
                if (data.list.length > 0) {

                    var points = new Array();
                    //clear the array
                    toilet.curTraceData = data.list;
                    var lastP = data.list.length - 1;
                    var firstPoint = new BMap.Point(data.list[0][2], data.list[0][3]);
                    var endPoint = new BMap.Point(data.list[lastP][2], data.list[lastP][3]);
                    //remove before add new path
                    if (toilet.path != null && toilet.path.length > 0) {
                        $.each(toilet.path, function (i, item) {
                            map.removeOverlay(item);
                        });
                    }

                    toilet.path.length = 0; //clear the array
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i][4] == 1) { //重新开始
                            var curPath = new BMap.Polyline(points, {
                                strokeColor: "blue",
                                strokeWeight: 5,
                                strokeOpacity: 0.5
                            });

                            map.addOverlay(curPath);
                            toilet.path.push(curPath); //save the path in array
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
                    toilet.path.push(lastPath); //save the path in array

                    toilet.isShowTrace = true;

                    if (points.length > 0) {
                        map.centerAndZoom(points[0], 15);
                        map.panTo(points[0]);
                    }
                    if (toilet.routeMarker == null) {
                        if(toilet.data.status=="警报"){
                            var iconUrl = "../../img/car/toilets_danger.svg";
                        }else{
                            var iconUrl = "../../img/car/toilets.svg";
                        }
                        var myBeginIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                            setTop: false
                        });
                        toilet.carBegin = new BMap.Marker(firstPoint, {
                            icon: myBeginIcon
                        });
                    } else {
                        toilet.carBegin.setPosition(firstPoint);
                    }
                    // map.addOverlay(toilet.carBegin);
                }
            });

        };

        toilet.showTrace = function () {
            // map.removeOverlay(toilet.path);
            if (toilet.path != null && toilet.path.length > 0) {
                $.each(toilet.path, function (i, item) {
                    item.show();
                });
            }
        };

        toilet.hideTrace = function () {

            //map.removeOverlay(toilet.path);
            if (toilet.path != null && toilet.path.length > 0) {
                $.each(toilet.path, function (i, item) {
                    item.hide();
                });
            }
            toilet.isShowTrace = false;

        };

        toilet.closeInfoWindow = function () {
            //map.removeOverlay(toilet.path);
            if (toilet.infoWindow != null && toilet.infoWindow.isOpen()) {
                map.closeInfoWindow();
            }
        };

        // 更新最新位置
        toilet.updatePos = function (lng, lat, areAlerted) {

            if (areAlerted == 1 && !toilet.areAlerted) {
                toilet.areAlerted = true;

                var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20)
                }); //BMap.Size定义为偏移位置
                toilet.marker.setIcon(carIcon);
            } else if (areAlerted == 0 && toilet.areAlerted) {
                toilet.areAlerted = false;

                var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20)
                }); //BMap.Size定义为偏移位置
                toilet.marker.setIcon(carIcon);
            }

            toilet.point = new BMap.Point(lng, lat);
            toilet.marker.setPosition(toilet.point);
            //update pos
            if (toilet.focused) {
                toilet.marker.show();
                // showInfoWindow2(toilet, map);
            }
        };

        // 显示车子的最新位置
        toilet.show = function () {
            //toilet.point = new BMap.Point(toilet.data.cur_long, toilet.data.cur_lat);
            toilet.marker.show();
        };

        // 隐藏车子，并停止实时定位
        toilet.hide = function () {
            toilet.marker.hide();
        };

        toilet.liveLocate = function () {

        };

        // 在地图上聚焦
        toilet.focus = function () {
            map.centerAndZoom(toilet.point, 18);

            map.panTo(toilet.point);
            //get the current data
            showInfoWindow2(toilet, map, toilet);
        };

        // 在地图上聚焦
        toilet.route = function () {
            if (toilet.curTraceData.length < 1)
                return;
            map.removeOverlay(toilet.routeMarker);
            map.removeOverlay(toilet.marker);
            var pts = toilet.curTraceData;
            var numPoints = toilet.curTraceData.length;
            var firstPoint = new BMap.Point(pts[0][2], pts[0][3]);
            toilet.curPointIndex = 0;
            //new marger if need
            if (toilet.routeMarker == null) {
                if(toilet.data.status=="警报"){
                    var iconUrl = "../../img/car/toilets_danger.svg";
                }else{
                    var iconUrl = "../../img/car/toilets.svg";
                }
                var myIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20),
                    setTop: true
                });
                toilet.routeLabel = new BMap.Label(pts[0][0], {
                    offset: new BMap.Size(-75, -43)
                });

                toilet.routeLabel.setStyle({
                    minWidth: "200px",
                    color: "blue",
                    fontSize: "12px",
                    height: "40px",
                    lineHeight: "20px",
                    fontFamily: "微软雅黑"
                });
                toilet.routeMarker = new BMap.Marker(firstPoint, {
                    icon: myIcon
                });
                toilet.routeMarker.setLabel(toilet.routeLabel);
            } else {
                toilet.routeMarker.setPosition(firstPoint);
                toilet.routeMarker.setLabel(toilet.routeLabel);
            }
            map.addOverlay(toilet.routeMarker);
            map.centerAndZoom(firstPoint, 15);
            map.panTo(firstPoint);
            toilet.runnum = 300;

            toilet.currentCount = 0;
            toilet.startRoute(false, toilet.runnum, toilet.currentCount);
            $(".btnFastRoute1").click(function () {
                toilet.startRoute(true);
                toilet.runnum = 100;
                toilet.startRoute(false, toilet.runnum, toilet.currentCount);
            })
            $(".btnFastRoute2").click(function () {
                toilet.startRoute(true);
                toilet.runnum = 20;
                toilet.startRoute(false, toilet.runnum, toilet.currentCount);
            })
            $(".btnFastRoute3").click(function () {
                toilet.startRoute(true);
                toilet.runnum = 10;
                toilet.startRoute(false, toilet.runnum, toilet.currentCount);
            })
            $(".btnFastRoute4").click(function () {
                toilet.startRoute(true);
                toilet.runnum = 300;
                toilet.startRoute(false, toilet.runnum, toilet.currentCount);
            })
        };


        toilet.startRoute = function (isPause, runnum, currentCount) {

            var me = this;
            var pts = toilet.curTraceData;
            var numPoints = toilet.curTraceData.length;

            function resetMkPoint() {
                if (toilet.curPointIndex < numPoints) {

                    function effect(initPos, targetPos, currentCount, count) {
                        var b = initPos,
                            c = targetPos - initPos,
                            t = currentCount,
                            d = count;
                        return c * t / d + b;
                    };
                    var count = 30,
                        picSrc = "assets/img/carbig.png";
                    var prvePoint = new BMap.Point(pts[toilet.curPointIndex][2], pts[toilet.curPointIndex][3]); //初始坐标
                    var newPoint = new BMap.Point(pts[toilet.curPointIndex + 1][2], pts[toilet.curPointIndex + 1][3]); //获取结束点的(x,y)坐标
                    var _prvePoint = new BMap.MercatorProjection().lngLatToPoint(prvePoint);
                    var _newPoint = new BMap.MercatorProjection().lngLatToPoint(newPoint); //根据球面坐标转化为平面坐标
                    var content = " 位置：(" + pts[toilet.curPointIndex][0] + " : " + pts[toilet.curPointIndex][1] + ")" + "<br/> 时间：" + pts[toilet.curPointIndex][5];
                    toilet.routeLabel.setContent(content);
                    toilet.timer = setTimeout(function () {
                        if (toilet.currentCount >= count) {
                            toilet.currentCount = 0;
                            toilet.curPointIndex++;
                            toilet.routeMarker.setPosition(new BMap.Point(pts[toilet.curPointIndex][2], pts[toilet.curPointIndex][3]));
                            resetMkPoint();
                        } else {

                            toilet.currentCount++; //计数
                            var x = effect(_prvePoint.x, _newPoint.x, toilet.currentCount, count),
                                y = effect(_prvePoint.y, _newPoint.y, toilet.currentCount, count);
                            //根据平面坐标转化为球面坐标
                            var pos = map.getMapType().getProjection().pointToLngLat(new BMap.Pixel(x, y));
                            toilet.routeMarker.setPosition(pos);
                            var content = " 位置：(" + pts[toilet.curPointIndex][0] + " : " + pts[toilet.curPointIndex][1] + ")" + "<br/> 时间：" + pts[toilet.curPointIndex][5];
                            toilet.routeLabel.setContent(content);
                            resetMkPoint();
                        }
                    }, runnum);
                } else {
                    clearTimeout(toilet.timer);
                }
            }

            if (isPause) {
                toilet.isTimerRunning = false;
                toilet.isRoteRunning = false;
                if (toilet.timer != null)
                    clearTimeout(toilet.timer);
            } else {
                toilet.isTimerRunning = true;
                toilet.isRoteRunning = true;
                toilet.timer = setTimeout(function () {
                    resetMkPoint();
                }, runnum);

            }


        };

        toilet.resetRoute = function () {
            toilet.curPointIndex = 0;
            if (toilet.timer != null) {
                toilet.isTimerRunning = false;
                toilet.isRoteRunning = false;
                clearTimeout(toilet.timer);
            }
        };

        return toilet;
    }
}

function showInfoWindow2(data, _map, toilet) {
    //get the current data
    'use strict';
    var online = "情况正常";
    // if(carData.toilet.cur_oil_level != null && !isNaN(parseInt(carData.toilet.cur_oil_level))) {
    //     var ratio = (parseInt(carData.toilet.cur_oil_level) / parseInt(carData.toilet.max_oil_level)) * 100;
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
        online = "紧急处理";
        bgcolor = "yellow"
    } else {
        var color = "black";
        online = "情况正常";
    }

    toilet.initCar();
    var online 
    var infoContent = "<span style='color:" + color + ";'>公厕编号:</span>" + "<span style='color:" + color + ";'>" + data.num + "</span>" + "</span>" + "<br/>" +
    "<span style='color:" + color + ";'>责任人:</span>" + "<span style='color:" + color + ";'>" + data.name + "</span>" + "<br/>" +
    "<span style='color:" + color + ";'>当前臭气指标：</span>" + "<span style='color:" + color + ";'>" + online + "</span>" + "<br/>" ;
    var infoWin = new BMapLib.InfoBox(map, infoContent, {
        boxStyle: {
            background: "url(http://api0.map.bdimg.com/images/iw3.png)",
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
    infoWin.open(toilet.marker);
    
}

function loadtoiletList(map) {
    RemoteApi2.gettoiletUrl(function (data) {
        // Area.createNew(_map,data);
        // var toilet = toilet.createNew(_map,data);
        if (data.data.length > 0) {
            var cars = data.data;
            $.each(cars, function (i, data) {
                let toilet = Toilet.createNew(data, map);
                toilet.initCar();
            });
        }
        // area.initCar()
    })
}