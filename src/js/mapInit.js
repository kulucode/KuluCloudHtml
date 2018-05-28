var map = new BMap.Map("allmap");
window.map = map;
//    添加地图大小等控件
map.addControl(new BMap.NavigationControl()); //地图平移缩放控件
map.addControl(new BMap.ScaleControl()); //比例尺控件
// map.addControl(new BMap.MapTypeControl()); //创建地图类型控件
doRefresh(null, "KULUINTERFACE", "getLoginMsg", "", function(data) {

    if (data.code == 0) {
        map.centerAndZoom(new BMap.Point(data.company.bdlon,data.company.bdlat), 13);
    }
  
})
// map.centerAndZoom(new BMap.Point(112.891287,28.213501), 15);
map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
// map.centerAndZoom("长沙"); //初始化地图，center为point ，zoom必须赋值。若center为字符串，则地图自适应。
map.disableDoubleClickZoom(true); //禁用双击放大
// map.setMapStyle({style:'midnight'});
// function showInfo(e){
//     alert(e.point.lng + ", " + e.point.lat);
// }
// map.addEventListener("click", showInfo);
$("#layui-layer_bottom").click(function(){
    $(".layui-body").animate({
        height: 93+"vh"
    });
    $(".layui-footer").animate({
        bottom:-100+"%"
    });
    $("#allmap").animate({
        height: 93+"vh"
    });
    $("#layui-layer_top").show();
    $("#layui-layer_bottom").hide();
    $(".layuiSelect").animate({
        top:-520+"%"
    });
    $(".layuiSelects").animate({
        top:-382+"%"
    })
})
$("#layui-layer_top").click(function(){
    $(".layui-body").animate({
        height: 65+"vh"
    });
    $(".layui-footer").animate({
        bottom:0
    });
    $("#allmap").animate({
        height: 65+"vh"
    });
    $("#layui-layer_top").hide();
    $("#layui-layer_bottom").show();
    $(".layuiSelect").animate({
        top:-175+"%"
    })
    $(".layuiSelects").animate({
        top:-115+"%"
    })
})