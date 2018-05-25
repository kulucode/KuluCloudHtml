
function CarDrawerManager(map) {
    'use strict';
    let _this = this;

    _this.map = map;
    _this.people = null;
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
    }

    //todo: _this.clearFenceBtn.onclick = _this.delete;有什么差别
}

CarDrawerManager.prototype.select = function (carId) {
    /**changed the carId*/
    _this = this;
    // _this.map.centerAndZoom(_this.people.point, 17);
    //     _this.map.centerAndZoom(_this.people.fence[0],17);
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
        swal({
                title: "请确认?",
                text: msg,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认删除",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    //go to save
                    if (_this.ids.length <= 1) {
                        _this.ids.push(_this.people.id);
                    }
                    if (_this.mode == 'f') {
                        RemoteApi.setFence(_this.ids, "", function () {
                            swal("酷陆科技!", "删除电子围栏成功！", "success");
                            updateCarFenceUI(_this.mode, _this.ids, true);
                        });
                    } else {
                        RemoteApi.setTraits(_this.people.id, "", function () {
                            swal("酷陆科技!", "删除预设轨迹成功！", "success");
                            updateCarFenceUI(_this.mode, _this.ids, true);
                        });
                    }
                }
            });

    } else {
        var overlay = _this.overlays[0];
        if (_this.mode == 'f') {
            if (_this.ids.length <= 1) {
                _this.ids.push(_this.people.id);
            }
            RemoteApi.setFence(_this.ids, overlay.so, function () {
                swal("酷陆科技!", "保存电子围栏成功！", "success");
                updateCarFenceUI(_this.mode, _this.ids, false);
            });
            _this.ids = []
        } else {
            RemoteApi.setTraits(_this.people.id, overlay.so, function () {
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

    if (_this.people != null) {
        RemoteApi.getCar(_this.people.id, function (response) { //todo
            if (response.people.preset_traits != null && response.people.preset_traits.length > 1) {
                _this.people.preset_traits = JSON.parse(response.people.preset_traits);
            } else {
                _this.people.preset_traits = [];
                _this.people.preset_traits.length = 0;
            }

            if (response.people.fence != null && response.people.fence.length > 1) {
                _this.people.fence = JSON.parse(response.people.fence);
            } else {
                _this.people.fence = [];
                _this.people.fence.length = 0;
            }

            if (_this.mode == 'f') {
                data = _this.people.fence;
            } else {
                data = _this.people.preset_traits;
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

function echartsInit() {
    map.centerAndZoom(new BMap.Point(112.891287,28.213501), 14);
    console.log(this,map)
    var overlay=[];
    overlays=[];
    map.removeOverlay();
    overlay.length = 0;
  doRefresh("peopleSelect", "KULUINTERFACE", "searchFanceList", "&pg_type=2", function(data) {
    if (data.code == 0) {
      //执行正确动作
      for (var j = 0; j < data.data.length; j++) {
        var point = [];
        for (var i = 0; i < data.data[j].points.length; i++) {
          var a = {};
          a.lng = data.data[j].points[i].bdlon;
          a.lat = data.data[j].points[i].bdlat;

          point.push(a);
        }
        var color = ["#eceb3d","#37e2f1","#cc235f","#49b82b","#20f0a9"];
        var styleOptions = {
          strokeColor: color[j], //边线颜色。
          fillColor: color[j], //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3, //边线的宽度，以像素为单位。
          strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
          strokeStyle: "solid" //边线的样式，solid或dashed。
        };
        overlay = new BMap.Polygon(point, styleOptions)
        overlays.push(overlay)
        console.log(overlays)
        // map.removeOverlay();
        map.addOverlay(overlay);
      }
    } else {8
      alert(data.msg);
    }
  });
}
$(".search_Carlists").click(function(){
    for(var i=0;i<overlays.length;i++){
      map.removeOverlay(overlays[i]);
    }
    echartsInit();
    doRefresh("peopleSelect", "KULUINTERFACE", "searchUserWordParasList", "", function(
        data
      ) {
        if (data.code == 0) {
          let people = People.createNew(data.data[0], map);
          people.initCar();
          console.log(people)
          console.log(data)
          showInfoWindow1(data.data[0],map,people);
          map.centerAndZoom(new BMap.Point(data.data[0].bdlon,data.data[0].bdlat), 15);
        //   people.focus()
          // obj.data.userinst=data.data[a].userinst;
        } else {
          alert(data.msg);
        }
      });
  })
  echartsInit();
var n =parseInt($(window).width())-218-218-5-218-218-6+"px";
$('#layui-layer125').css({'left':n});