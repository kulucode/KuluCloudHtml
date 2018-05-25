var this_city = "";
var map = null;
var drawVector = null;
var defaultLayer = [];
var newLayers = {};
var map = null;
var popup = null;
var UserList = {};
var thisArea = [];
var FancePoints = null;

var tempMap = {};
jQuery(function ($) {
    $('#pg_sdate,#pg_edate').datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s'
    });
    getLoginUser("div_user", "", "", function () {
        $("#container").height($(window).height() - 93);
        $("#p_container").width($(".maindiv").width());
        $("#div_mapcond").width($("#container").width() - 40);
        getPlateMsg();
    });
});

function getPlateMsg() {
    doRefresh(
        null,
        "STATS",
        "searchSysBaseStats",
        "",
        function (_data) {
            if (_data.r == 0) {
                $("#l_ucount").html("平台员工：<button onclick=\"window.location.href='" + webHome + "/users/index.html'\" type='button' class='button button-little bg-main icon-user'> " + _data.user_count + "</button>");
                $("#l_tcount").html("平台车辆：<button onclick=\"window.location.href='" + webHome + "/truck/inst.html'\" type='button' class='button button-little bg-main icon-truck'> " + _data.truck_count + "</button>");
                $("#l_ocount").html("未完成工单：<button onclick=\"window.location.href='" + webHome + "/truck/inspect.html'\" type='button' class='button button-little bg-dot icon-warning'> " + _data.order_count + "</button>");
                $("#l_fcount").html("未处理报警：<button onclick=\"window.location.href='" + webHome + "/fault/index.html'\" type='button' class='button button-little bg-dot icon-warning'> " + _data.fault_count + "</button>");
                $("#pg_sdate").val(_data.thisdate.substring(0, 10) + " 00:00:00");
                $("#pg_edate").val(_data.thisdate);
                //searchItemList();
                var _center = null;
                if (_data.company.lat != "" && _data.company.lon != "") {
                    _center = [parseFloat(_data.company.lon), parseFloat(_data.company.lat)];
                }
                mapIni(_center);
                searchItemList();
            }
        });
}

function mapIni(_center) {
    if (_center == null) {
        _center = [112.8903, 28.1904];
    }
    var drawSource = new ol.source.Vector();
    drawVector = new ol.layer.Vector({
        source: drawSource
    });
    defaultLayer = [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }), drawVector];
    $("#mouse-position").html("");
    map = new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        }).extend([
            new ol.control.ScaleLine({
                units: 'degrees'
            })
            , new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                // comment the following two lines to have the mouse position
                // be placed within the map.
                className: 'custom-mouse-position',
                target: document.getElementById("mouse-position"),
                undefinedHTML: '鼠标移动显示经纬度'
            })]),
        layers: defaultLayer,
        target: 'container',
        view: new ol.View({
            projection: 'EPSG:4326',
            center: _center,
            zoom: 13
        })
    });
    var pDiv = $("#popup");
    if (pDiv.length == 0) {
        $("body").append("<div id=\"popup\" style=\"width:250px;\"></div>");
        pDiv = $("#popup");
    }
    pDiv.popover('destroy');
    popup = new ol.Overlay({
        element: pDiv[0],
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -50]
    });
    map.addOverlay(popup);
    //pointermove
    map.on('pointermove', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
                var coordinates = feature.getGeometry().getCoordinates();
                if (coordinates.length == 2) {
                    return feature;
                }
            });
        if (feature) {
            var coordinates = feature.getGeometry().getCoordinates();
            popup.setPosition(coordinates);
            pDiv.popover({
                'placement': 'top',
                'html': true,
                'top': 80,
                'content': feature.get('desc')
            });
            pDiv.popover('show');
        } else {
            pDiv.popover('destroy');
        }
    });
    map.on('moveend', function (evt) {
        thisArea = evt.frameState.extent;
        //searchItemList();
    });
}

function mapRest() {
    //清除layer
    if (map != null) {
        map.getOverlays().clear();
        map.addOverlay(popup);
        $.each(newLayers, function (n, value) {
            map.removeLayer(value);
        });
    }
    newLayers = {};
}

function searchItemList() {
    mapRest();
    //$("#pg_geoarea").val(thisArea);
    $("#pg_geoarea").val("");
    var _type = $("#s_itemlist").val();
    if (_type == "" || _type == 0) {
        //用户
        getUserFance();
        getUserMaps();
    }
    if (_type == "" || _type == 1) {
        //车辆
        getTruckFance();
        getTruckMaps();
    }
}

function getUserMaps() {
    isGJ = false;
    UserList = {};
    doRefresh("", "WATCH", "searchWatchWordParasList", "&pg_size=500&pg_num=0",
        function (data) {
            if (data.r == 0) {
                //成功后发送登录成功消息
                var _html = "<option value=''>---请选择---</option>";
                for (var i = 0; i < data.list.length; i++) {
                    var _oneP = data.list[i];
                    _oneP.type = "6";
                    _oneP.opfun = "gps";
                    UserList["u_" + _oneP.eqpid] = _oneP;
                    addUserMapPoint(_oneP);
                    _html += "<option value='" + _oneP.eqpid + "'>" + _oneP.username + "</option>";
                }
                $("#s_userlist").html(_html);
            }
        });
}

function addUserMapPoint(_data) {
    var _oneD = _data;
    if (newLayers["d_" + _oneD.eqpid] != null) {
        _oneD = UserList["u_" + _oneD.eqpid];
        if (_data.opfun == "gps") {
            _oneD.lat = _data.lat;
            _oneD.lon = _data.lon;
            _oneD.date = _data.geodate;
        }
        else if (_data.opfun == "hr") {
            _oneD.hr = _data.hr;
            _oneD.ele = _data.ele;
            _oneD.date = _data.hrdate;
        }
        else if (_data.opfun == "bpo") {
            _oneD.bpoh = _data.bpoh;
            _oneD.bpol = _data.bpol;
            _oneD.date = _data.bpodate;
        }
        else if (_data.opfun == "step") {
            _oneD.step = _data.step;
            _oneD.date = _data.stepdate;
        }

        UserList["u_" + _oneD.eqpid] = _oneD;
        //移动
        $(".p_" + _oneD.eqpid).remove();
    }
    if (_oneD.lat == null || _data.lon == null || _data.lat == "" || _data.lon == "") {
        return;
    }

    var _desc = "<div><strong>用户：" + _oneD.musername + "[" + (_oneD.fanceflg == 1 ? "在围栏内" : "在围栏外") + "]</strong></div>";
    _desc += "<div><strong>当天步数：" + _oneD.step + "</strong></div>";
    _desc += "<div><strong>心率：每分钟" + _oneD.hr + "次</strong></div>";
    _desc += "<div><strong>剩余电量：" + _oneD.ele + "%</strong></div>";
    _desc += "<div><strong>心率电量时间：" + _oneD.hrdate + "</strong></div>";
    _desc += "<div><strong>经度：" + _oneD.lon + "</strong></div>";
    _desc += "<div><strong>纬度：" + _oneD.lat + "</strong></div>";
    _desc += "<div><strong>位置时间：" + _oneD.geodate + "</strong></div>";
    var oneP = new ol.Feature({
        geometry: new ol.geom.Point([parseFloat(_oneD.lon), parseFloat(_oneD.lat)])
    });
    oneP.set("desc", _desc);
    oneP.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            color: '#8959A8',
            crossOrigin: 'anonymous',
            src: webHome + '/common/images/staff_map.png'
        }))
    }));
    // UserFeature["d_" + _data.eqpid] = oneP;
    var mapLayers = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [oneP]
        }),
        zIndex: 100
    });
    map.removeLayer(newLayers["d_" + _oneD.eqpid]);
    newLayers["d_" + _oneD.eqpid] = mapLayers;
    //map.getView().setCenter([parseFloat(_oneD.lon), parseFloat(_oneD.lat)]);
    map.addLayer(mapLayers);
}

function getUserFance() {
    doRefresh("", "KULUINTERFACE", "searchFanceList", "&pg_type=2",
        function (_data) {
            if (_data.code == 0) {
                //成功后发送登录成功消息
                for (var i = 0; i < _data.data.length; i++) {
                    var _oneP = _data.data[i];
                    addUserFancePoint(_oneP.id, _oneP.points);
                }
            }
        });
}

function addUserFancePoint(_id, _points) {
    if (_points != null) {
        var _cos = new Array();
        for (var i = 0; i < _points.length; i++) {
            _cos[_cos.length] = [_points[i].lon, _points[i].lat];
        }
        var oneP = new ol.Feature({
            geometry: new ol.geom.Polygon([_cos])
        });
        oneP.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        }));
        // UserFeature["d_" + _data.eqpid] = oneP;
        var mapLayers = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [oneP]
            }),
            zIndex: 0
        });
        map.removeLayer(newLayers["f_" + _id]);
        newLayers["f_" + _id] = mapLayers;
        //map.getView().setCenter([parseFloat(_oneD.lon), parseFloat(_oneD.lat)]);
        map.addLayer(mapLayers);
    }
}

function getTruckMaps() {
    isGJ = false;
    TruckList = {};
    doRefresh("", "VEHICLE", "searchVehicleWordParasList", "",
        function (_data) {
            if (_data.r == 0) {
                //成功后发送登录成功消息
                for (var i = 0; i < _data.list.length; i++) {
                    var _oneP = _data.list[i];
                    _oneP.type = "6";
                    _oneP.date = _oneP.oildate;
                    TruckList["u_" + _oneP.eqpid] = _oneP;
                    addTruckPoint(_oneP);
                }
            }
        });
}

function addTruckPoint(_data) {
    var _oneD = _data;
    if (newLayers["d_" + _oneD.eqpid] != null) {
        _oneD = TruckList["u_" + _oneD.eqpid];
        if (_data.opfun == "gps") {
            _oneD.lat = _data.lat;
            _oneD.lon = _data.lon;
            _oneD.oil = _data.oil;
            _oneD.oildiff = _data.oildiff;
            _oneD.speed = _data.speed;
            _oneD.date = _data.geodate;
        }
        TruckList["u_" + _oneD.eqpid] = _oneD;
        //移动
        $(".p_" + _oneD.eqpid).remove();
    }
    if (_oneD.lat == null || _data.lon == null || _data.lat == "" || _data.lon == "") {
        return;
    }

    var _desc = "<div><strong>车辆：" + _oneD.truckname + "[" + (_oneD.fanceflg == 1 ? "在围栏内" : "在围栏外") + "]</strong></div>";
    _desc += "<div><strong>油箱液面高度：" + _oneD.oil + "</strong></div>";
    _desc += "<div><strong>油箱高度：" + _oneD.oildiff + "</strong></div>";
    _desc += "<div><strong>车速：" + _oneD.speed + "</strong></div>";
    _desc += "<div><strong>经度：" + _oneD.lon + "</strong></div>";
    _desc += "<div><strong>纬度：" + _oneD.lat + "</strong></div>";
    _desc += "<div><strong>位置时间：" + _oneD.geodate + "</strong></div>";
    var oneP = new ol.Feature({
        geometry: new ol.geom.Point([parseFloat(_oneD.lon), parseFloat(_oneD.lat)])
    });
    oneP.set("desc", _desc);
    oneP.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            color: '#8959A8',
            crossOrigin: 'anonymous',
            src: webHome + '/common/images/truck_map.png'
        }))
    }));
    // UserFeature["d_" + _data.eqpid] = oneP;
    var mapLayers = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [oneP]
        }),
        zindex: 20
    });
    map.removeLayer(newLayers["d_" + _oneD.eqpid]);
    newLayers["d_" + _oneD.eqpid] = mapLayers;
    //map.getView().setCenter([parseFloat(_oneD.lon), parseFloat(_oneD.lat)]);
    map.addLayer(mapLayers);
}

function getTruckFance() {
    doRefresh("", "KULUINTERFACE", "searchFanceList", "&pg_type=1",
        function (_data) {
            if (_data.code == 0) {
                //成功后发送登录成功消息
                for (var i = 0; i < _data.data.length; i++) {
                    var _oneP = _data.data[i];
                    addTruckFancePoint(_oneP.id, _oneP.points);
                }
            }
        });
}

function addTruckFancePoint(_id, _points) {
    if (_points != null) {
        var _cos = new Array();
        for (var i = 0; i < _points.length; i++) {
            _cos[_cos.length] = [_points[i].lon, _points[i].lat];
        }
        var oneP = new ol.Feature({
            geometry: new ol.geom.Polygon([_cos])
        });
        oneP.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 100, 100, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        }));
        // UserFeature["d_" + _data.eqpid] = oneP;
        var mapLayers = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [oneP]
            }),
            zIndex: 10
        });
        map.removeLayer(newLayers["f_" + _id]);
        newLayers["f_" + _id] = mapLayers;
        //map.getView().setCenter([parseFloat(_oneD.lon), parseFloat(_oneD.lat)]);
        map.addLayer(mapLayers);
    }
}
