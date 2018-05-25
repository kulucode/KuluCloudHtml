
layui.use('table', function () {
    var table = layui.table;

    //第一个实例
    table.render({
        elem: '#demo',
        height: 'full-750',
        url: '../../json/rubbish.json', //数据接口
   
        page: false,//开启分页
        cols: [
            [ //表头
                {
                    field: 'id',
                    title: '序号',
                    sort: true,
                    fixed: 'left'
                }, {
                    field: 'team',
                    title: '项目组'
                }, {
                    field: 'num',
                    title: '垃圾桶编号',
                    sort: true
                }, {
                    field: 'status',
                    title: '垃圾桶状况'
                }, {
                    field: 'name',
                    title: '负责人'
                }, {
                    field: 'phone',
                    title: '联系方式',
                    sort: true
                }, {
                    field: 'capacity',
                    title: '当前剩余容量(%)',
                    sort: true
                }, {
                    field: 'weight',
                    title: '当前垃圾重量(kg)'
                }, {
                    field: 'nums',
                    title: '今日清理次数',
                }, {
                    title: '实时定位',
                    toolbar: '#barDemo'
                }
            ]
        ],
        done: function (res, curr, count) {
            //如果是异步请求数据方式，res即为你接口返回的信息。
            //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
            for (var i = 0; i < res.data.length; i++) {

                if (res.data[i].status == "需要清理") {
                    $(".layui-table-body tr:eq(" + i + ") td").css("background", "#ffc000")
                    n = i + 1;
                    $(".layui-table-fixed tr:eq(" + n + ") td").css("background", "#ffc000")
                }
            }

            //得到当前页码
        }
    });
    table.on('tool(test)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') { //查看
            //do somehing
            let rubbish = Rubbish.createNew(data, map);
            showInfoWindow4(data, map, rubbish)
        } else if (layEvent === 'del') { //删除
            layer.confirm('真的删除行么', function (index) {
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            //同步更新缓存对应的值
            obj.update({
                username: '123',
                title: 'xxx'
            });
        }
    });
});

var Rubbish = {

    createNew: function (data, map) {
        'use strict';
        let rubbish = {};
        rubbish.id = data.id;
        rubbish.info = {};
        rubbish.data = data;
        rubbish.point = null;
        rubbish.infoWindow = null;
        rubbish.selected = false;
        rubbish.focused = false;
        rubbish.isShowTrace = false;
        rubbish.areAlerted = false;
        rubbish.path = new Array();
        rubbish.curTraceData = null;
        rubbish.timer = null;
        rubbish.routeMarker = null;
        rubbish.routeLabel = null;
        rubbish.curPointIndex = 0;
        rubbish.isTimerRunning = false;
        rubbish.isRoteRunning = false;
        rubbish.points = [];
        rubbish.marker = null;

        rubbish.initCar = function () { //地图显示图标
            rubbish.point = new BMap.Point(rubbish.data.cur_long, rubbish.data.cur_lat);
            if (rubbish.data.status == "需要清理") {
                var iconUrl = "/src/img/rubbish_danger.svg";
            } else {
                var iconUrl = "/src/img/rubbishs.svg";
            }

            let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                anchor: new BMap.Size(10, 20)
            }); //BMap.Size定义为偏移位置
            rubbish.marker = new BMap.Marker(rubbish.point, {
                icon: carIcon
            });

            map.addOverlay(rubbish.marker);

            rubbish.marker.disableMassClear();
            let labelHD = new BMap.Label(rubbish.data.num, {
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
            rubbish.marker.addEventListener("click", function (e) {
                showInfoWindow4(data, map, rubbish);
            });
            rubbish.marker.addEventListener("mouseover", function (e) {

                rubbish.marker.setLabel(labelHD);
                //颜色改变

                this.getLabel().show();
            });

            rubbish.marker.addEventListener("mouseout", function (e) {
                this.getLabel().hide();
                rubbish.beginCar(rubbish);
            });

        };

        rubbish.beginCar = function (rubbish) {
            map.removeOverlay(rubbish.marker);

            if (rubbish.data.status == "需要清理") {
                var iconUrl = "/src/img/rubbish_danger.svg";
            } else {
                var iconUrl = "/src/img/rubbishs.svg";
            }

            let carIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                anchor: new BMap.Size(10, 20)
            });
            //添加标注
            rubbish.marker.setIcon(carIcon);
            map.addOverlay(rubbish.marker);
        }
        rubbish.loadTrace = function () { //轨迹的显示
            map.removeOverlay();
            RemoteApi.getPeopleHis(function (data) {
                if (data.list.length > 0) {

                    var points = new Array();
                    //clear the array
                    rubbish.curTraceData = data.list;
                    var lastP = data.list.length - 1;
                    var firstPoint = new BMap.Point(data.list[0][2], data.list[0][3]);
                    var endPoint = new BMap.Point(data.list[lastP][2], data.list[lastP][3]);
                    //remove before add new path
                    if (rubbish.path != null && rubbish.path.length > 0) {
                        $.each(rubbish.path, function (i, item) {
                            map.removeOverlay(item);
                        });
                    }

                    rubbish.path.length = 0; //clear the array
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i][4] == 1) { //重新开始
                            var curPath = new BMap.Polyline(points, {
                                strokeColor: "blue",
                                strokeWeight: 5,
                                strokeOpacity: 0.5
                            });

                            map.addOverlay(curPath);
                            rubbish.path.push(curPath); //save the path in array
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
                    rubbish.path.push(lastPath); //save the path in array

                    rubbish.isShowTrace = true;

                    if (points.length > 0) {
                        map.centerAndZoom(points[0], 15);
                        map.panTo(points[0]);
                    }
                    if (rubbish.routeMarker == null) {
                        var iconUrl = "/src/img/rubbishs.svg";
                        var myBeginIcon = new BMap.Icon(iconUrl, new BMap.Size(30, 30), {
                            setTop: false
                        });
                        rubbish.carBegin = new BMap.Marker(firstPoint, {
                            icon: myBeginIcon
                        });
                    } else {
                        rubbish.carBegin.setPosition(firstPoint);
                    }
                    // map.addOverlay(rubbish.carBegin);
                }
            });

        };

        rubbish.showTrace = function () {
            // map.removeOverlay(rubbish.path);
            if (rubbish.path != null && rubbish.path.length > 0) {
                $.each(rubbish.path, function (i, item) {
                    item.show();
                });
            }
        };

        rubbish.hideTrace = function () {

            //map.removeOverlay(rubbish.path);
            if (rubbish.path != null && rubbish.path.length > 0) {
                $.each(rubbish.path, function (i, item) {
                    item.hide();
                });
            }
            rubbish.isShowTrace = false;

        };

        rubbish.closeInfoWindow = function () {
            //map.removeOverlay(rubbish.path);
            if (rubbish.infoWindow != null && rubbish.infoWindow.isOpen()) {
                map.closeInfoWindow();
            }
        };

        // 更新最新位置
        rubbish.updatePos = function (lng, lat, areAlerted) {

            if (areAlerted == 1 && !rubbish.areAlerted) {
                rubbish.areAlerted = true;

                var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20)
                }); //BMap.Size定义为偏移位置
                rubbish.marker.setIcon(carIcon);
            } else if (areAlerted == 0 && rubbish.areAlerted) {
                rubbish.areAlerted = false;

                var carIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20)
                }); //BMap.Size定义为偏移位置
                rubbish.marker.setIcon(carIcon);
            }

            rubbish.point = new BMap.Point(lng, lat);
            rubbish.marker.setPosition(rubbish.point);
            //update pos
            if (rubbish.focused) {
                rubbish.marker.show();
                // showInfoWindow4(rubbish, map);
            }
        };

        // 显示车子的最新位置
        rubbish.show = function () {
            //rubbish.point = new BMap.Point(rubbish.data.cur_long, rubbish.data.cur_lat);
            rubbish.marker.show();
        };

        // 隐藏车子，并停止实时定位
        rubbish.hide = function () {
            rubbish.marker.hide();
        };

        rubbish.liveLocate = function () {

        };

        // 在地图上聚焦
        rubbish.focus = function () {
            map.centerAndZoom(rubbish.point, 18);

            map.panTo(rubbish.point);
            //get the current data
            showInfoWindow4(rubbish, map, rubbish);
        };

        // 在地图上聚焦
        rubbish.route = function () {
            if (rubbish.curTraceData.length < 1)
                return;
            map.removeOverlay(rubbish.routeMarker);
            map.removeOverlay(rubbish.marker);
            var pts = rubbish.curTraceData;
            var numPoints = rubbish.curTraceData.length;
            var firstPoint = new BMap.Point(pts[0][2], pts[0][3]);
            rubbish.curPointIndex = 0;
            //new marger if need
            if (rubbish.routeMarker == null) {
                var myIcon = new BMap.Icon("/src/img/stations.png", new BMap.Size(25, 25), {
                    anchor: new BMap.Size(10, 20),
                    setTop: true
                });
                rubbish.routeLabel = new BMap.Label(pts[0][0], {
                    offset: new BMap.Size(-75, -43)
                });

                rubbish.routeLabel.setStyle({
                    minWidth: "200px",
                    color: "blue",
                    fontSize: "12px",
                    height: "40px",
                    lineHeight: "20px",
                    fontFamily: "微软雅黑"
                });
                rubbish.routeMarker = new BMap.Marker(firstPoint, {
                    icon: myIcon
                });
                rubbish.routeMarker.setLabel(rubbish.routeLabel);
            } else {
                rubbish.routeMarker.setPosition(firstPoint);
                rubbish.routeMarker.setLabel(rubbish.routeLabel);
            }
            map.addOverlay(rubbish.routeMarker);
            map.centerAndZoom(firstPoint, 15);
            map.panTo(firstPoint);
            rubbish.runnum = 300;

            rubbish.currentCount = 0;
            rubbish.startRoute(false, rubbish.runnum, rubbish.currentCount);
            $(".btnFastRoute1").click(function () {
                rubbish.startRoute(true);
                rubbish.runnum = 100;
                rubbish.startRoute(false, rubbish.runnum, rubbish.currentCount);
            })
            $(".btnFastRoute2").click(function () {
                rubbish.startRoute(true);
                rubbish.runnum = 20;
                rubbish.startRoute(false, rubbish.runnum, rubbish.currentCount);
            })
            $(".btnFastRoute3").click(function () {
                rubbish.startRoute(true);
                rubbish.runnum = 10;
                rubbish.startRoute(false, rubbish.runnum, rubbish.currentCount);
            })
            $(".btnFastRoute4").click(function () {
                rubbish.startRoute(true);
                rubbish.runnum = 300;
                rubbish.startRoute(false, rubbish.runnum, rubbish.currentCount);
            })
        };


        rubbish.startRoute = function (isPause, runnum, currentCount) {

            var me = this;
            var pts = rubbish.curTraceData;
            var numPoints = rubbish.curTraceData.length;

            function resetMkPoint() {
                if (rubbish.curPointIndex < numPoints) {

                    function effect(initPos, targetPos, currentCount, count) {
                        var b = initPos,
                            c = targetPos - initPos,
                            t = currentCount,
                            d = count;
                        return c * t / d + b;
                    };
                    var count = 30;
                    var prvePoint = new BMap.Point(pts[rubbish.curPointIndex][2], pts[rubbish.curPointIndex][3]); //初始坐标
                    var newPoint = new BMap.Point(pts[rubbish.curPointIndex + 1][2], pts[rubbish.curPointIndex + 1][3]); //获取结束点的(x,y)坐标
                    var _prvePoint = new BMap.MercatorProjection().lngLatToPoint(prvePoint);
                    var _newPoint = new BMap.MercatorProjection().lngLatToPoint(newPoint); //根据球面坐标转化为平面坐标
                    var content = " 位置：(" + pts[rubbish.curPointIndex][0] + " : " + pts[rubbish.curPointIndex][1] + ")" + "<br/> 时间：" + pts[rubbish.curPointIndex][5];
                    rubbish.routeLabel.setContent(content);
                    rubbish.timer = setTimeout(function () {
                        if (rubbish.currentCount >= count) {
                            rubbish.currentCount = 0;
                            rubbish.curPointIndex++;
                            rubbish.routeMarker.setPosition(new BMap.Point(pts[rubbish.curPointIndex][2], pts[rubbish.curPointIndex][3]));
                            resetMkPoint();
                        } else {

                            rubbish.currentCount++; //计数
                            var x = effect(_prvePoint.x, _newPoint.x, rubbish.currentCount, count),
                                y = effect(_prvePoint.y, _newPoint.y, rubbish.currentCount, count);
                            //根据平面坐标转化为球面坐标
                            var pos = map.getMapType().getProjection().pointToLngLat(new BMap.Pixel(x, y));
                            rubbish.routeMarker.setPosition(pos);
                            var content = " 位置：(" + pts[rubbish.curPointIndex][0] + " : " + pts[rubbish.curPointIndex][1] + ")" + "<br/> 时间：" + pts[rubbish.curPointIndex][5];
                            rubbish.routeLabel.setContent(content);
                            resetMkPoint();
                        }
                    }, runnum);
                } else {
                    clearTimeout(rubbish.timer);
                }
            }

            if (isPause) {
                rubbish.isTimerRunning = false;
                rubbish.isRoteRunning = false;
                if (rubbish.timer != null)
                    clearTimeout(rubbish.timer);
            } else {
                rubbish.isTimerRunning = true;
                rubbish.isRoteRunning = true;
                rubbish.timer = setTimeout(function () {
                    resetMkPoint();
                }, runnum);

            }


        };

        rubbish.resetRoute = function () {
            rubbish.curPointIndex = 0;
            if (rubbish.timer != null) {
                rubbish.isTimerRunning = false;
                rubbish.isRoteRunning = false;
                clearTimeout(rubbish.timer);
            }
        };

        return rubbish;
    }
}
var RemoteApi4 = function () {
    return {
        getrubbishUrl: function (callback) {
            $.ajax({
                url: "/src/json/rubbish.json",
                method: "GET",
                dataType: "json",
                async: false,
                contentType: "application/json",
                data: JSON.stringify({}),
                success: function (response) {
                    callback(response)
                }
            });
        }

    }
}();

function showInfoWindow4(data, _map, rubbish) {
    //get the current data
    'use strict';
    var online = "情况正常";
    var colors = "#66b1bd";
    var bgcolor = "white"
    if (data.status == "需要清理") {
        var color = "red";
        colors = "red";
        online = "需要清理";
        bgcolor = "yellow"
    } else {
        var color = "black";
        online = "状态正常";
    }

    rubbish.initCar();
    var online
    var infoContent = "<span style='color:" + color + ";'>垃圾桶编号：</span>" + "<span style='color:" + color + ";'>" + data.num + "</span>" + "</span>" + "<br/>" +
        "<span style='color:" + color + ";'>项目组：</span>" + "<span style='color:" + color + ";'>" + data.name + "</span>" + "<br/>" +
        "<span style='color:" + color + ";'>当前剩余容量：</span>" + "<span style='color:" + color + ";'>" + data.capacity+"&nbsp;kg" + "</span>" + "<br/>" +
        "<span style='color:" + color + ";'>当前垃圾重量：</span>" + "<span style='color:" + color + ";'>" + data.weight +"&nbsp;kg"+ "</span>" + "<br/>" +
        "<span style='color:" + color + ";'></span>" + "<span style='color:" + color + ";'>" + online + "</span>" + "<br/>";
    var infoWin = new BMapLib.InfoBox(map, infoContent, {
        boxStyle: {
            background: bgcolor,
            width: "180px",
            height: "120px",
            borderRadius: "18px",
            lineHeight: "23px",
            padding: "10px 0px 6px 20px",
            border: "2px solid " + colors
        },
        coloseIconMargin: "1px 1px 0 0",
        enableAutoPan: true,
        offset: new BMap.Size(25, 25)
    });
    infoWin.enableAutoPan();
    infoWin.open(rubbish.marker);

}

function loadrubbishList(map) {
    RemoteApi4.getrubbishUrl(function (data) {
        // Area.createNew(_map,data);
        // var rubbish = rubbish.createNew(_map,data);
        if (data.data.length > 0) {
            var cars = data.data;
            $.each(cars, function (i, data) {
                let rubbish = Rubbish.createNew(data, map);
                rubbish.initCar();

            });
        }
        // area.initCar()
    })
}