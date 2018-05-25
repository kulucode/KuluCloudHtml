function queryIni(_id, _bg) {
    var obj = $("#" + _id);
    if ($("#" + _id + "_exdiv").length > 0) {
        $("#" + _id + "_exdiv").show();
    }
    else {
        var _html = "<div class=\"ex_div\" id=\"" + _id + "_exdiv\" style=\"background-color:white;z-index:2000;position:absolute;left:" + obj.offset().left + "px;top:" + (obj.offset().top + obj.height() + 10) + "px;height:120px;width:540px;\">";
        _html += "<img onclick=\"$('#" + _id + "_exdiv').hide();\" style=\"position:absolute;right:2px;top:0px;color:red;font-weight:bold;cursor: pointer;\" title=\"关闭\" src=\"common\\images\\bswin\\close1.png\"/>";
        _html += "<div class=\"\" style=\"position:absolute;left:30px;top:-10px;width: 0px;height: 0px;border-left: 10px solid transparent;border-right: 10px solid transparent;border-bottom: 10px solid white;\"></div>";
        //加载教师课表查询
        _html += "<iframe onblur=\"closeEx();\" id=\"" + _id + "_frm\" src=\"system\\exfun\\query.html\" frameborder=\"0\" scrolling=\"no\" allowTransparency=\"true\" style=\"width:100%;height: 100%;\"></iframe>"
        _html += "</div>";
        $("#" + _bg).append(_html);
    }
    $("#" + _id + "_frm").focus();
}

function sysMangIni(_id, _bg) {
    var obj = $("#" + _id);
    if ($("#" + _id + "_exdiv").length > 0) {
        $("#" + _id + "_exdiv").show();
    }
    else {
        var _html = "<div class=\"ex_div\" id=\"" + _id + "_exdiv\" style=\"background-color:white;z-index:2000;position:absolute;left:" + obj.offset().left + "px;top:" + (obj.offset().top + obj.height() + 10) + "px;height:120px;width:540px;\">";
        _html += "<img onclick=\"$('#" + _id + "_exdiv').hide();\" style=\"position:absolute;right:2px;top:0px;color:red;font-weight:bold;cursor: pointer;\" title=\"关闭\" src=\"common\\images\\bswin\\close1.png\"/>";
        _html += "<div class=\"\" style=\"position:absolute;left:30px;top:-10px;width: 0px;height: 0px;border-left: 10px solid transparent;border-right: 10px solid transparent;border-bottom: 10px solid white;\"></div>";
        //加载教师课表查询
        _html += "<iframe onblur=\"closeEx();\" id=\"" + _id + "_frm\" src=\"system\\exfun\\system.html\" frameborder=\"0\" scrolling=\"no\" allowTransparency=\"true\" style=\"width:100%;height: 100%;\"></iframe>"
        _html += "</div>";
        $("#" + _bg).append(_html);
    }
    $("#" + _id + "_frm").focus();
}
function mobileIni(_id, _bg) {
    var obj = $("#" + _id);
    if ($("#" + _id + "_exdiv").length > 0) {
        $("#" + _id + "_exdiv").show();
    }
    else {
        var _html = "<div class=\"ex_div\" id=\"" + _id + "_exdiv\" style=\"background-color:white;z-index:2000;position:absolute;left:" + obj.offset().left + "px;top:" + (obj.offset().top + obj.height() + 10) + "px;height:120px;width:414px;\">";
        _html += "<img onclick=\"$('#" + _id + "_exdiv').hide();\" style=\"position:absolute;right:2px;top:0px;color:red;font-weight:bold;cursor: pointer;\" title=\"关闭\" src=\"common\\images\\bswin\\close1.png\"/>";
        _html += "<div class=\"\" style=\"position:absolute;left:30px;top:-10px;width: 0px;height: 0px;border-left: 10px solid transparent;border-right: 10px solid transparent;border-bottom: 10px solid white;\"></div>";
        //加载教师课表查询
        _html += "<iframe onblur=\"closeEx();\" id=\"" + _id + "_frm\" src=\"system\\exfun\\mobile.html\" frameborder=\"0\" scrolling=\"no\" allowTransparency=\"true\" style=\"width:100%;height: 100%;\"></iframe>"
        _html += "</div>";
        $("#" + _bg).append(_html);
    }
    $("#" + _id + "_frm").focus();
}
function openOtherSession(_url) {
    window.open(_url + "?session=" + sessionId);
}
function openOtherUserP(_url, _path) {
    var u = _url + "?up=" + logUser.p;
    u += "&to=" + _path;
    window.open(u);
}
function closeEx() {
    $(".ex_div").hide();
}
function toXYLPost() {

}