$(document).ready(function () {
    $(".btn2").hide()
    $(".btn1").click(function () {
        var n= parseInt($("#layui-layer11").width())
        ns = -n+200;
        $("#layui-layer11").animate({
            left: ns+"px"
        });
        $("#layui-layers").animate({
            left: "-140px"
        });
        $(".layuiSelect").animate({
            left: "-20%"
        });
        $("#layui-layers1").animate({
            left: "-140px"
        });
        
        $("#CarOil").animate({
            left: "-300px"
        });
        $(".find_carlist").animate({
            left: "-300px"
        });
        $("#layui-layerss1").animate({
            left: "-140px"
        });
        $(".layuiId").animate({
            left: "-140px"
        });
        $(".btn2").show()
    });
    $(".btn2").click(function () {
        $("#layui-layer11").animate({
            left: "200px"
        });
        $("#layui-layers").animate({
            left: "243px"
        });
        $(".layuiSelect").animate({
            left: "2.5%"
        });
        $("#CarOil").animate({
            left: "2.7%"
        });
        $(".find_carlist").animate({
            left:"2.5%"
        });
        $("#layui-layers1").animate({
            left: "243px"
        });
        $(".layuiId").animate({
            left: "243px"
        });
        $("#layui-layerss1").animate({
            left: "243px"
        });
        $(".btn2").hide()
    });
    
var Width = parseFloat($("#layui-layers1").width());
var widths = Width - 36 + "px";
var Timewidths = Width - 53 + "px";

$("#layui-layers .layui-input-inline").width(widths);
$(".layuiSelect .layui-input-inline").width(widths);
$("#layui-layerss1 .select_date .layui-input-inline").width(Timewidths);
});