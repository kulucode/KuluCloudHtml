$("#lock_people").click(function(){
    $("input").css("cursor","not-allowed");
    $("input").attr("disabled","disabled");
    $("#test1").attr("disabled","disabled");
    $("#test1").css("cursor","not-allowed");
})
$("#edit_people").click(function(){
    $("input").attr("disabled",false);
    $("input").css("cursor","auto");
    $("#test1").attr("disabled",false);
    $("#test1").css("cursor","auto");
})