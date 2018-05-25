
loadrubbishList(map)

function CarDrawerManager(map, rubbish) {
    'use strict';
    let _this = this;
    _this.map = map;
    _this.rubbish=[];
    _this.overlays = [];
    _this.drawingManager = null;
    _this.mode = "f"; // f : fence ; p : path
    _this.ids = [];
    _this.overlaycomplete = function (e) {

        if (e.drawingMode == "marker") {
            _this.map.removeOverlay(e.overlay);
            return;
        }

        /**clear*/
        for (var i = 0; i < _this.overlays.length; i++) {
            _this.map.removeOverlay(_this.overlays[i]);
        }
        _this.overlays.length = 0;

        //add the last one
        _this.overlays.push(e.overlay);
    };
    _this.clearBtn = document.getElementById("btn_clear");
    _this.saveBtn = document.getElementById("btn_save");
    _this.exitBtn = document.getElementById("btn_exit");
    // _this.selectBtn = document.getElementById("btn_select");
    _this.rubbish.push(rubbish)
    _this.clearBtn.onclick = function () {
        layer.open({
            content: '<div style="padding: 20px 100px;">清除成功</div>',
            btn: '关闭',
            btnAlign: 'c' //按钮居中
                ,
            shade: 0 //不显示遮罩
                ,
            yes: function () {
                layer.closeAll();
            }
        });
        _this.clearAll();
    }
    //todo: _this.clearFenceBtn.onclick = _this.delete;有什么差别
    _this.saveBtn.onclick = function () {
        layer.open({
            content: '<div style="padding: 20px 100px;">保存成功</div>',
            btn: '关闭',
            btnAlign: 'c' //按钮居中
                ,
            shade: 0 //不显示遮罩
                ,
            yes: function () {
                layer.closeAll();
            }
        });
        _this.save();
        // var overlay = _this.overlays[0];
        // if (BMapLib.GeoUtils.isPointInPolygon(point, overlay)) {
        // } else {
        // }
    }

    //todo: _this.clearFenceBtn.onclick = _this.delete;有什么差别
}

CarDrawerManager.prototype.select = function (carId) {
    /**changed the carId*/
    _this = this;
    // _this.map.centerAndZoom(_this.rubbish.point, 17);
    //     _this.map.centerAndZoom(_this.rubbish.fence[0],17);
    // _this.map.panTo(points[0]);
}
CarDrawerManager.prototype.selectAll = function () { //多选
    /**changed the carId*/
    _this = this;
    _this.ids = [];
    var carInputList = $(".fence-checkbox");
    //set the radio
    $.each(carInputList, function (i, item) {
        if (item.checked) {
            _this.ids.push(i + 1)
        }
    });
}

CarDrawerManager.prototype.init_drawingManager = function (modes, isOpen) {
    /**changed the carId*/
    _this = this;

    //delete before reinit
    _this.close();
    //create the tool
    var styleOptions = {
        strokeColor: "#3399FF", //边线颜色。
        fillColor: "#6699FF", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }

    //实例化鼠标绘制工具
    _this.drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: isOpen, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: modes,
            drawingTypes: modes
        },

        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    _this.drawingManager.addEventListener('overlaycomplete', _this.overlaycomplete);

    //show tool
    $("#drawToolLayer").show();
}
CarDrawerManager.prototype.close = function () {
    $("#drawToolLayer").hide();

    if (this.drawingManager != null) {
        $(this.drawingManager._drawingTool.container).hide(); //hide tool

        this.drawingManager.close();
        this.drawingManager.removeEventListener("overlaycomplete");
        delete this.drawingManager;
        this.drawingManager = null;
        //this.map.clearOverlays();
        /**clear*/
        for (var i = 0; i < this.overlays.length; i++) {
            this.map.removeOverlay(this.overlays[i]);
        }
        this.overlays.length = 0;
    }
}

CarDrawerManager.prototype.save = function () {
    _this.selectAll();
    _this = this;
    var len = _this.overlays.length;
    if (len < 1) {
        var msg = "";
        if (_this.mode == 'f')
            msg = "将电子围栏设置为空";
        else
            msg = "将预设轨迹设置为空";
            var overlay = _this.overlays[0];
            if (BMapLib.GeoUtils.isPointInPolygon(point, overlay)) {
            } else {
            }
        // swal({
        //         title: "请确认?",
        //         text: msg,
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#DD6B55",
        //         confirmButtonText: "确认删除",
        //         cancelButtonText: "取消",
        //         closeOnConfirm: true,
        //         closeOnCancel: true
        //     },
        //     function (isConfirm) {
        //         if (isConfirm) {
        //             //go to save
        //             if (_this.ids.length <= 1) {
        //                 _this.ids.push(_this.rubbish.id);
        //             }
        //             if (_this.mode == 'f') {
        //                 RemoteApi.setFence(_this.ids, "", function () {
        //                     swal("酷陆科技!", "删除电子围栏成功！", "success");
        //                     updateCarFenceUI(_this.mode, _this.ids, true);
        //                 });
        //             } else {
        //                 RemoteApi.setTraits(_this.rubbish.id, "", function () {
        //                     swal("酷陆科技!", "删除预设轨迹成功！", "success");
        //                     updateCarFenceUI(_this.mode, _this.ids, true);
        //                 });
        //             }
        //         }
        //     });

    } else {
       
        if (_this.mode == 'f') {
            if (_this.ids.length <= 1) {
                _this.ids.push(_this.rubbish.id);
            }
            RemoteApi.setFence(_this.ids, overlay.so, function () {
                swal("酷陆科技!", "保存电子围栏成功！", "success");
                updateCarFenceUI(_this.mode, _this.ids, false);
            });
            _this.ids = []
        } else {
            RemoteApi.setTraits(_this.rubbish.id, overlay.so, function () {
                swal("酷陆科技!", "保存预设轨迹成功！", "success");
                updateCarFenceUI(_this.mode, _this.ids, false);
            });
            _this.ids = []
        }


    }
}

CarDrawerManager.prototype.clearAll = function () {

    for (var i = 0; i < this.overlays.length; i++) {
        this.map.removeOverlay(this.overlays[i]);
    }
    this.overlays.length = 0
}

CarDrawerManager.prototype.drawFenceOrTraits = function (mode) {

    _this = this;
    _this.mode = mode;
    var points = [];
    var data;
    var overlay = null;

    if (_this.rubbish != null) {
        RemoteApi.getCar(_this.rubbish.id, function (response) { //todo
            if (response.rubbish.preset_traits != null && response.rubbish.preset_traits.length > 1) {
                _this.rubbish.preset_traits = JSON.parse(response.rubbish.preset_traits);
            } else {
                _this.rubbish.preset_traits = [];
                _this.rubbish.preset_traits.length = 0;
            }

            if (response.rubbish.fence != null && response.rubbish.fence.length > 1) {
                _this.rubbish.fence = JSON.parse(response.rubbish.fence);
            } else {
                _this.rubbish.fence = [];
                _this.rubbish.fence.length = 0;
            }

            if (_this.mode == 'f') {
                data = _this.rubbish.fence;
            } else {
                data = _this.rubbish.preset_traits;
            }

            if (data != null && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    points.push(new BMap.Point(data[i].lng, data[i].lat));
                }
            }

            if (_this.mode == 'f') {
                //create the tool
                var styleOptions = {
                    strokeColor: "#3399FF", //边线颜色。
                    fillColor: "#6699FF", //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 3, //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid' //边线的样式，solid或dashed。
                }

                overlay = new BMap.Polygon(points, styleOptions);
                //overlay.enableEditing();
                _this.map.addOverlay(overlay);

            } else {

                overlay = new BMap.Polyline(points, {
                    strokeColor: "#3399FF",
                    strokeWeight: 5,
                    strokeOpacity: 0.5
                });
                _this.map.addOverlay(overlay);

            }
            _this.overlays.push(overlay);

            //focus to
            if (points.length > 0) {
                _this.map.setViewport(points)
                _this.map.reset();
                _this.map.centerAndZoom(points[0], 17);
                // _this.map.panTo(points[1]);
            }


        });
    }

}


window.points = [{
        lng: 112.891718,
        lat: 28.184086
    },
    {
        lng: 112.91299,
        lat: 28.182525
    },
    {
        lng: 112.913134,
        lat: 28.171699
    }, {
        lng: 112.902857,
        lat: 28.168388
    }, {
        lng: 112.8887,
        lat: 28.172718
    }
]
var color = "#6699FF"
var styleOptions = {
    strokeColor: color, //边线颜色。
    fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3, //边线的宽度，以像素为单位。
    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
window.overlay1 = new BMap.Polygon(window.points, styleOptions);
//overlay.enableEditing();
map.addOverlay(window.overlay1);

var points1 = [{
        lng: 112.891718,
        lat: 28.184086
    },
    {
        lng: 112.912415,
        lat: 28.18485
    },
    {
        lng: 112.892544,
        lat: 28.17482
    }, {
        lng: 112.880759,
        lat: 28.17552
    }, {
        lng: 112.882232,
        lat: 28.175648
    }
]
// var points2 = [{
//         lng: 112.903432,
//         lat:28.209204
//     },
//     {
//         lng: 112.927363,
//         lat: 28.206721
//     },
//     {
//         lng: 112.93225,
//         lat: 28.193414
//     }, {
//         lng: 112.924344,
//         lat: 28.188702
//     }, {
//         lng: 112.910043,
//         lat: 28.19316
//     }
// ]
// overlay3 = new BMap.Polygon(points1, styleOptions);
// //overlay.enableEditing();
// map.addOverlay(overlay3);

RemoteApi4.getrubbishUrl(function (data) {
    // Area.createNew(_map,data);
    // var rubbish = rubbish.createNew(_map,data);
    if (data.data.length > 0) {
        
        var cars = data.data;
        $.each(cars, function (i, data) {
            let rubbish = Rubbish.createNew(cars[0], map);
            let cdm = new CarDrawerManager(map, rubbish);
            cdm.init_drawingManager([BMAP_DRAWING_POLYGON], true);
            rubbish.initCar();
            // showInfoWindow4(cars[0], map, rubbish)
        })
    };
    // area.initCar()
})

$('.search_Carlists').click(function () {
    map.centerAndZoom(new BMap.Point(112.913051, 28.199459), 14);
    map.removeOverlay(overlay1);
    map.removeOverlay(overlay3);
    $("#layui-layer125").show();
    RemoteApi4.getrubbishUrl(function (data) {
        // Area.createNew(_map,data);
        // var rubbish = rubbish.createNew(_map,data);
        if (data.data.length > 0) {
            var cars = data.data;
            let rubbish = Rubbish.createNew(cars[0], map);
            rubbish.initCar();
            showInfoWindow4(cars[0], map, rubbish)
        }
        // area.initCar()
    })
})
$(".BMapLib_polygon ").click(function () {
    map.removeOverlay(overlay1);
})
$("#btn_save").click(function () {
    $(".rubbish_num")[0].innerHTML = "21";
    $(".rubbish_weight")[0].innerHTML = "578";
})
var n = parseInt($(window).width()) - 218 - 218 - 5 - 218 - 218 - 3 + "px";
$('#layui-layer125').css({
    'left': n
});
