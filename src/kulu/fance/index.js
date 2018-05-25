var editType = "new";
var thisFance = "";
var mapLayers, lineLayers = null;
var drawSource = null;
var draw, snap; // global so we can remove them later
var map = null;
var drawVector = null;
var defaultLayer = [];
var newLayers = {};
var FancePoints = null;
var FanceUsers = {};
var FanceTrucks = {};
jQuery(function ($) {
    getLoginUser("div_user", "FANCE_INST", "FANCE_MANG", function () {
        FanceIni();
        searchFance();
    });

});

function FanceIni() {
    doRefresh(
        "",
        "FANCE ",
        "FanceIni",
        "", function (_data) {
            if (_data.r == 0) {
                var _html = "<option value=''>---请选择---</option>";
                for (var i = 0; i < _data.type.length; i++) {
                    _html += "<option value='" + i + "'>" + _data.type[i] + "</option>";
                }
                $("#s_fancetype").html(_html);
                $("#s_fancetype").val("");
            }
        });
}

//搜索围栏
function searchFance() {
    doRefresh(
        "",
        "FANCE",
        "searchFanceList",
        "",
        function (_data) {
            clearTable("fance_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("fance_tab");
                    addTableCell("fance_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div>"
                        + "<div class=\"text-gray\">所属机构：" + oneD.org + "</div>");
                    addTableCell("fance_tab", _oneTr, "type", "<div>" + oneD.type + "</div>");
                    addTableCell("fance_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editFance('"
                        + oneD.id + "')\"> 编辑</button>"
                        + "&nbsp;<button type=\"button\" class=\"button bg-dot button-small icon-trash-o\" onclick=\"deleteFance('"
                        + oneD.id + "')\"> 删除</button>");
                }
                setPage("fance_page", _data.list.length, _data.list.length, 1, "");
                $(document).scrollTop(0);
            }
        });
}

// 编辑围栏
function editFance(_defid) {
    editType = "new";
    var title = "新增围栏";
    if (_defid != null && _defid != "") {
        thisFance = _defid;
        editType = "edit";
        title = "编辑围栏";
    }
    doRefresh(null, "FANCE", "getFanceById", "&in_type=" + editType + "&fanceid="
        + _defid, function (_data) {
        openDialogs({
            id: "fance-base",
            title: title,
            width: "90%",
            father: "",
        }, function () {
            return true;
        });
        showFanceBase(_data, editType);
        var _center = [112.9380, 28.1711];
        if (_data.cenlon != null) {
            _center = [parseFloat(_data.cenlon), parseFloat(_data.cenlat)];
        }
        mapIni(_data.points, _center);
    });
}

// 设置围栏
function showFanceBase(_data) {
    $("#t_fanceid").val(_data.id);
    $("#t_fancename").val(_data.name);
    $("#s_fancetype").val(_data.type);
    $("#t_fancepoints").val(JSON.stringify(_data.points));
    FanceUsers = {};
    FanceTrucks = {};
    $("#t_fanceusers").val("");
    $("#t_fancetrucks").val("");
    $("#l_fance_user").html("");
    $("#l_fance_truck").html("");
    resetFanceRelDiv();
    $("#t_area").val("430000");
    if (_data.users != null) {
        for (var i = 0; i < _data.users.length; i++) {
            _data.users[i].instid = _data.users[i].instId;
            FanceUsers["ch_" + _data.users[i].instId] = _data.users[i];
            $("#l_fance_user").append("<div id='div_" + _data.users[i].instId + "' class='margin-small-top padding-small border border-blue'>" + _data.users[i].name + " [" + _data.users[i].mPhone + "]| <span onclick=\"resetSelUser('" + _data.users[i].instId + "')\" style='cursor:pointer;' title='移除' class='float-right text-dot icon-times'></span></div>");
        }
        resetSelUser();
    }
    if (_data.trucks != null) {
        for (var i = 0; i < _data.trucks.length; i++) {
            FanceTrucks["ch_" + _data.trucks[i].id] = _data.trucks[i];
            $("#l_fance_truck").append("<div id='div_" + _data.trucks[i].id + "' class='margin-small-top padding-small border border-blue'>" + _data.trucks[i].name + "[" + _data.trucks[i].plateNum + "]| <span onclick=\"resetSelTruck('" + _data.trucks[i].id + "')\" style='cursor:pointer;' title='移除' class='float-right text-dot icon-times'></span></div>");
        }
        resetSelTruck();
    }

}

function resetFanceRelDiv() {
    var _type = $("#s_fancetype").val();
    $("#div_userf").hide();
    $("#div_truckf").hide();
    if (_type == 0) {
        $("#l_fance_user,#l_fance_truck").height(($("#fance-dlg-body").height() - 180) / 2);
        $("#div_userf").show();
        $("#div_truckf").show();
    }
    else if (_type == 1) {
        //车用
        $("#div_truckf").show();
        $("#l_fance_truck").height(($("#fance-dlg-body").height() - 135));
    }
    else if (_type == 2) {
        //人用
        $("#div_userf").show();
        $("#l_fance_user").height(($("#fance-dlg-body").height() - 135));
    }
}

//保存围栏
function commitFance() {
    var isOK = true;
    if (FancePoints == null || FancePoints.length <= 0) {
        isOK = confirm("未设置围栏，是否继续保存？")
    }
    if (isOK) {
        $("#t_fancepoints").val(JSON.stringify(FancePoints));
        if (checkForm("fance-form") && confirm("是否保存围栏信息？")) {
            doRefresh("fance-form", "FANCE", "updateFance", "&in_type="
                + editType, function (_data) {
                if (_data.r == 0) {
                    closeDialog("fance-base");
                    searchFance();
                } else {
                    alert(_data.error);
                }
            });
        }
    }

}

function mapIni(_points, _center) {
    $("#container").html("");
    $("#container").height($("#fance-dlg-body").height());
    $("#div_mapcond").width($("#p_form").width() - 54);
    var onePF = null;
    if (_points != null) {
        FancePoints = _points;
        var _cos = new Array();
        for (var i = 0; i < _points.length; i++) {
            _cos[_cos.length] = [_points[i].lon, _points[i].lat];
        }
        onePF = new ol.Feature({
            geometry: new ol.geom.Polygon([_cos])
        });
    }
    else {
        FancePoints = null;
    }
    if (_center == null) {
        _center = [112.9380, 28.1711];
    }
    if (onePF != null) {
        drawSource = new ol.source.Vector({
                features: [onePF]
            }
        );
    }
    else {
        drawSource = new ol.source.Vector();
    }

    drawVector = new ol.layer.Vector({
        source: drawSource,
        style: new ol.style.Style({
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
        })
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

    function addInteractions() {
        draw = new ol.interaction.Draw({
            source: drawSource,
            type: "Polygon"
        });
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: drawSource});
        map.addInteraction(snap);
    }

    addInteractions();
    draw.on('drawstart',
        function (evt) {
            drawSource.clear();
            FancePoints = new Array();
        }, this);
    draw.on('drawend',
        function (evt) {
            // set sketch
            var geom = evt.feature.getGeometry().getCoordinates()[0];
            for (var k = 0; k < geom.length; k++) {
                FancePoints[FancePoints.length] = {lon: geom[k][0], lat: geom[k][1]};
            }
        }, this);
}

function clearDraw() {
    drawSource.clear();
    FancePoints = new Array();
}

function doSelectUser() {
    getUserSelectDlg("&pg_role=OUTDOORS_STAFF", "&pg_type=1,2", function (_data) {
        $.each(_data, function (n, value) {
            if (FanceUsers[n] == null) {
                FanceUsers[n] = value;
                $("#l_fance_user").append("<div id='div_" + n + "' class='margin-small-top padding-small border border-blue'>" + value.name + "[" + value.phone + "]| <span onclick=\"resetSelUser('" + n + "')\" style='cursor:pointer;' title='移除' class='float-right text-dot icon-times'></span></div>");
            }
        });
        var _sel = "";
        resetSelUser();
    });

}

function resetSelUser(_n) {
    if (_n != null && _n != "") {
        delete FanceUsers["ch_" + _n];
        $("#div_" + _n).remove();
    }
    var _sel = "";
    $.each(FanceUsers, function (n, value) {
        _sel += ("," + value.instid);
    });
    $("#t_fanceusers").val(_sel);
}

function doSelectTruck() {
    getTruckSelectDlg("", function (_data) {
        $.each(_data, function (n, value) {
            if (FanceTrucks[n] == null) {
                FanceTrucks[n] = value;
                $("#l_fance_truck").append("<div id='div_" + n + "' class='margin-small-top padding-small border border-blue'>" + value.name + "[" + value.platenum + "]| <span onclick=\"resetSelTruck('" + n + "')\" style='cursor:pointer;' title='移除' class='float-right text-dot icon-times'></span></div>");
            }
        });
        var _sel = "";
        resetSelTruck();
    });

}

function resetSelTruck(_n) {
    if (_n != null && _n != "") {
        delete FanceTrucks["ch_" + _n];
        $("#div_" + _n).remove();
    }
    var _sel = "";
    $.each(FanceTrucks, function (n, value) {
        _sel += ("," + value.id);
    });
    $("#t_fancetrucks").val(_sel);
}



