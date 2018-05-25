var editType = "new";
var roleFunTree = null;
var thisRole = "";

var drawSource = null;
var FancePoints = null;

jQuery(function ($) {
    $("#t_areaid").lookup({bsid: "DCAREA", opname: "searchAreaLookUp", lname: "pg_text"});
    getLoginUser("div_user", "BASE_MANG", "SYSTEM", function () {
        $("#f_basediv").css("height", ($(window).height() - 128));
        //得到往前运营商信息
        getThisCompany()
    });
});

//得到往前运营商信息
function getThisCompany() {
    $(document).scrollTop(0);
    doRefresh(
        null,
        "COMPANY",
        "getThisCompany",
        "",
        function (_data) {
            if (_data.r == 0) {
                $("#t_compid").val(_data.id);
                $("#t_compname").val(_data.name);
                $("#t_compdesc").val(_data.desc);
                $("#t_complink").val(_data.linkman);
                $("#t_compphone").val(_data.linkphone);
                $("#t_complat").val(_data.lat);
                $("#t_complon").val(_data.lon);
                $("#l_compgeo").html("经度:" + _data.lon + ";纬度:" + _data.lat);

                $("#t_areaid_v").val(_data.areaid);
                $("#t_areaid").val(_data.areaname);
            }
        });
}

//保存数据字典
function commitThisCompany() {
    if (checkForm("comp-form") && confirm("是否保存当前运营商信息？")) {
        doRefresh("comp-form", "COMPANY", "updateThisCompany", "", function (_data) {
            if (_data.r == 0) {
                getThisCompany();
            } else {
                alert(_data.error);
            }
        });
    }

}

function clearRedis() {
    doRefresh("", "DCLOGIN", "clearRedisData", "", function (_data) {
        if (_data.r == 0) {
            alert("清理成功！");
        } else {
            alert(_data.error);
        }
    });
}

function doSysIni() {
    openDialogs({
        id: "sysini-dlg",
        title: "系统初始化",
        width: "80%",
        father: ""
    }, function () {
        return true;
    });
    $("#if_sysini").css("height", ($("#if_dlg").height()));
}

function setCompanyCenter() {
    openDialogs({
        id: "center-dlg",
        title: "选择中心位置",
        width: "90%",
        father: ""
    }, function () {
        return true;
    });
    var _center = null;
    if ($("#t_complat").val() != "" && $("#t_complon").val() != "") {
        _center = [parseFloat($("#t_complon").val()), parseFloat($("#t_complat").val())]
    }
    mapIni(_center, _center);
}

function getCenterPoint() {
    $("#t_complat").val(FancePoints.lat);
    $("#t_complon").val(FancePoints.lon);
    $("#l_compgeo").html("经度:" + FancePoints.lon + ";纬度:" + FancePoints.lat);
    closeDialog("center-dlg");
}

function mapIni(_points, _center) {
    $("#container").html("");
    $("#container").height($("#center-dlg-body").height());
    $("#div_mapcond").width($("#p_form").width() - 54);
    var onePF = null;
    if (_points != null) {
        FancePoints = _points;
        onePF = new ol.Feature({
            geometry: new ol.geom.Point(_points)
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
                color: '#ff0000',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ff0000'
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
            type: "Point"
        });
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: drawSource});
        map.addInteraction(snap);
    }

    addInteractions();
    draw.on('drawstart',
        function (evt) {
            drawSource.clear();
            FancePoints = {};
        }, this);
    draw.on('drawend',
        function (evt) {
            // set sketch
            var geom = evt.feature.getGeometry().getCoordinates();
            FancePoints = {lon: geom[0], lat: geom[1]};
        }, this);
}

function toDic() {
    $("#f_basediv").attr("src", webHome + "/system/dic/index.html");
}

function toArea() {
    $("#f_basediv").attr("src", webHome + "/system/area/index.html");
}


