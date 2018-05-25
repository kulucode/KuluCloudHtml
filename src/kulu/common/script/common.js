var WDEDU_ENTER = 13;
var xq = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
opener = null;
var thisWin = {};
var thisWinData = {};
var scrollTop = 0;

try {
    var _winname = this.name.substr(0, this.name.length - 2);
    thisWin = p.$("#" + _winname);
    thisWinData = p.$("#" + _winname).data("paras");
} catch (e) {

}
$(document).ready(function () {
    opener = null;
    window.history.forward();
    $("body").bind("contextmenu", function () {
        window.event.returnValue = false;
    });
});

function getPageScroll(type) {
    var yScroll = 0;
    if (type != null && type == 0) {
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
        } else if (document.documentElement
            && document.documentElement.scrollHeight > 0) { // Explorer 6
            // Strict
            yScroll = document.documentElement.scrollHeight;
        }
        if (document.body) {// all other Explorers
            yScroll += document.body.scrollHeight;
        }
    } else {
        yScroll = document.body.scrollHeight;
    }
    return yScroll;
}

function returnFSWin(R_retObj, R_inObj) {
    if (R_retObj != null) {
        var wh = 160;
        $(R_inObj.objId + "_img").src = $(R_inObj.objId + "_server").value
            + R_retObj.url;
        $(R_inObj.objId + "_file").value = R_retObj.url;
        changeImgSizeObj($(R_inObj.objId + "_img"), 158, 158);
    }
}

function getImgCss(tempImg, wh) {
    var css = "";
    var img = new Image();
    img.src = tempImg;
    if (img.height > img.width && img.height > wh) {
        css = "height:" + wh + ";";
    } else if (img.width > wh) {
        css = "width:" + wh + ";";
    }
    return css;
}

function resetImgSize(imgName, height, width) {
    var imgall = $("#" + imgName);
    if (imgall.length > 0) {
        // alert(imgall);
        var img = new Image();
        img.src = imgall.attr("src");
        if (img.height > img.width && img.height > height) {
            imgall.style.height = height;
        } else if (img.width > width) {
            imgall.style.width = width;
        }
        imgall.style.display = "block";
    }
}

function resetImgSizeObj(imgall, height, width) {
    //var imgall = $("#" + imgName);
    imgall.hide();
    if (imgall != null) {
        // alert(imgall);
        var img = new Image();
        img.src = imgall.attr("src");
        if (img.height > img.width && img.height > height) {
            imgall.height(height);
        } else if (img.width > width) {
            imgall.width(width);
        }
        if (imgall.width() < width) {
            imgall.css("margin-left", (width - imgall.width()) / 2 + "px");
        }
        imgall.css("vertical-align", "middle");
        imgall.show();
    }
}

function changeImgSizeObj(imgObj, width, height) {
    var img = new Image();
    img.src = imgObj.src;
    var h_ratio = (img.height / height);
    var w_ratio = (img.width / width);
    var tempratio = h_ratio > w_ratio ? h_ratio : w_ratio;
    if (tempratio > 1) {
        if (h_ratio > w_ratio) {
            imgObj.height = height;
        } else {
            imgObj.width = width;
            //imgObj.marginTop = Math.floor((height - Math.floor((img.height * imgObj.width) / img.width)) / 2);
            //alert(imgObj.marginTop);
        }
    }
    else {
        //imgObj.style.marginLeft = ((width - img.width) / 2) + "px";
    }
    imgObj.style.display = "block";

}

function commonRet(_inObj, _data) {
    $("#s_div").hide();
    if (_data == "T") {
        thisWin.winclose({
            ret: _data
        });
    } else {
        alert(_data);
    }
}

function commonRet2(_inObj, _data) {
    $("#s_div").hide();
    $("#t_search").clear;
    if (_data == null || _data == "" || _data == "T") {
    } else {
        alert(_data);
    }
}

function openWindowClose(dtIndex, bsid, bsfun, bsparas, paras, cWinName) {
    thisWin.winclose({
        ret: "T"
    });
    p.openWindow(dtIndex, bsid, bsfun, bsparas, paras, p);
}

function DefEnter(key, jsFun) {
    if (event.keyCode == key) {
        eval(jsFun);
    }
    return false;
}

function fs_update(tObj, retFun) {
    p.openWindow(-1, "PHOTO", "UserPhotoPathListIni", "&in_staffid="
        + tObj.staffid, {
        id: "NRFS_EDIT",
        width: 850,
        height: 600,
        text: "我的文件夹",
        img: "common/images/win/yggl.png",
        modal: true,
        addTask: false,
        afterclose: retFun,
        inObj: tObj
    }, this);
}

function groupTreeLookUp(_objId, _title, _single, _type, _where, _retFun) {
    var tObj = {};
    tObj.objId = _objId;
    tObj.single = _single;
    tObj.type = _type;
    tObj.where = _where;
    if (_retFun == null || _retFun == "") {
        _retFun = "groupTreeLookUpRet";
    }
    p.openWindow(-1, "DCGROUP", "GroupTreeLoopUpIni", "&in_single="
        + tObj.single + "&in_type=" + tObj.type, {
        id: "GROUPTREE_LOOKUP",
        width: 400,
        height: 520,
        text: _title,
        img: "common/images/win/jggl.png",
        modal: true,
        addTask: false,
        afterclose: _retFun,
        inObj: tObj
    }, this);

}

function groupTreeLookUpRet(_retObj) {
    if (_retObj != null) {
        $("#" + _retObj.inObj.objId + "_value").val(_retObj.selids);
        $("#" + _retObj.inObj.objId + "_text").val(_retObj.seltexts);
    }

}

function logout() {
    alert("用户失效，请重新登录");
    p.location.href = getWebHome() + "/login.html";
}

// 加载表格
function clearTable(tableId, _index) {
    if (_index == null || _index < 0) {
        //全部删除
        _index = 0;
    }
    var i = 0;
    var isTitle = true;
    $("#" + tableId + " tr").each(function () {
        if (i >= _index) {
            $(this).remove();
        }
        i++;
    });
    //设置表格高度
    var dpH = $("#" + tableId).attr("dh");
    var fat = $("#" + tableId).attr("father");

    var _height = $(window).height();
    if (fat != null) {
        _height = fat;
    }
    if (dpH != null && dpH > 0) {
        $("#" + tableId).parent().css("height", _height - dpH);
    }

    //alert($("#" + tableId).pareht);
}

// 加载表格
function clearImgsTable(tableId, _index) {
    if (_index == null || _index < 0) {
        //全部删除
        _index = 0;
    }
    var i = 0;
    var isTitle = true;
    //设置表格高度
    var dpH = $("#" + tableId).attr("dh");
    var _height = $(window).height();
    if (dpH != null && dpH > 0) {
        $("#" + tableId).parent().css("height", _height - dpH);
    }
    //alert($("#" + tableId).pareht);
}

// 加载表格
function addTableRow(tableId, _trid) {
    if (_trid == null) {
        var _table = $("#" + tableId).append(
            "<tr></tr>");
        var _tr = _table.find("tr:last");
    }
    return _tr;
}

// 加载表格
function addTableRowEx(tableId, _ptdid, _rowId) {
    var _table = $("#" + tableId);
    var _ptr = _ptdid.parent();
    var _tr = null;
    if (_ptr.length > 0) {
        if ($("tr[exid='" + tableId + "_" + _rowId + "_ex']").length > 0) {
            _ptr = _table.find("tr[exid='" + tableId + "_" + _rowId + "_ex']:last");
        }
        _tr = _ptr.after("<tr isex='1' exid='" + tableId + "_" + _rowId + "_ex'></tr>");
        _tr = _table.find("tr[exid='" + tableId + "_" + _rowId + "_ex']:last");
    }
    return _tr;
}

// 加载表格
function removeTableRow() {
    getTDTarget($(event.target), "TR").remove();
}

function getTableRowNum(tableId) {
    return $("#" + tableId).find("tr").length;
}

// 加载表格
function addTableCell(tableId, _tr, tdId, _tdHtml, _title, _showAll, _valign) {
    var table = $("#" + tableId);
    table.css({"table-layout": "fixed"});
    var tableHead = null;
    var tdWith = "";
    var title = (_title != null && _title != "") ? "title=\"" + _title + "\"" : "";
    _valign = _valign == null ? "middle" : _valign;
    if (tableId.length > 0) {
        tableHead = $("#" + table.attr("head"));
        //得到对应的td的宽度
        var tdLenth = _tr.find("td").length;
        var th = tableHead.find("tr:first").find("th:eq(" + tdLenth + ")");
        tdWith = th.css("width");
        var tdWI = th.outerWidth();
        if (tdWI == 0) {
            var style = th.attr("style");
            if (style == undefined || style.indexOf("width") == -1) {
                tdWith = th.width();
            }

        }
        tdWith = "width:" + tdWith + ";";
    }
    if (_showAll == undefined) {
        _showAll = true;
    }
    var _style = "";
    if (_showAll) {
        _style = "white-space:nowrap;overflow:hidden; text-overflow:ellipsis;-o-text-overflow:ellipsis;vertical-align:middle;";
    }
    if (_tr.length > 0) {
        _tr.append("<td id=\"" + tableId + "_" + tdId + "_" + getTableRowNum(tableId) + "\" " + title + " style=\"" + _style + tdWith + ";vertical-align:" + _valign + "\">" + _tdHtml + "</td>");
    }
}

// 翻页控件
function setPage(pageDiv, rowsLength, onePageRowsLength, thisPage, clickFun) {
    // 最大页数
    onePageRowsLength = onePageRowsLength == 0 ? 1 : onePageRowsLength;
    var max = (rowsLength % onePageRowsLength) == 0 ? (rowsLength / onePageRowsLength)
        : Math.ceil(rowsLength / onePageRowsLength);
    if (thisPage < 1) {
        thisPage = 1;
    } else if (thisPage > max) {
        thisPage = max;
    }
    thisPage = parseInt(thisPage);
    var _html = "";
    // 首页
    _html += "<a href=\"javascript:void(0);\" onclick=\""
        + clickFun
        + "(0,0);\">首页</a>&nbsp;&nbsp;<a href=\"javascript:void(0);\" onclick=\""
        + clickFun + "(" + (thisPage - 1) + ",0);\">上一页</a>";
    // 当前
    _html += "&nbsp;&nbsp;" + thisPage + "/" + max + "页&nbsp;&nbsp;";
    _html += "<a href=\"javascript:void(0);\" onclick=\""
        + clickFun
        + "("
        + (thisPage == max ? thisPage : thisPage + 1)
        + ",0);\">下一页</a>&nbsp;&nbsp;<a  href=\"javascript:void(0);\" onclick=\""
        + clickFun + "(" + (max) + ");\">末页</a>&nbsp;&nbsp;";
    _html += "第 <input id=\""
        + pageDiv
        + "_thisp\" name=\""
        + pageDiv
        + "_thisp\" maxlength=\"6\" style=\"width:40px;height:20px;\" value=\""
        + thisPage + "\" type=\"text\" />页&nbsp;&nbsp;";
    _html += "<input type=\"button\" class=\"button button-little bg-main\" style=\"height:30px;\" onclick=\""
        + clickFun
        + "($('#"
        + pageDiv
        + "_thisp').val(),0);\" value=\"确定\" />&nbsp;&nbsp;共"
        + rowsLength
        + "条记录";
    $("#" + pageDiv).html(_html);
}

function checkAll(_this, _table, _checkId) {
    $("#" + _table + " input[chtype='" + _checkId + "']").prop("checked", _this.prop("checked"));
}

function openDialogs(_paras, closeFun, afterCloseFun) {
    var defaults = {
        id: "",
        title: "",
        width: "80%",
        father: "",
        lock: true,
        mask: true
    };
    var zIndex = 1000;
    var _opts = $.extend(defaults, _paras);
    _opts.getid = "#" + _opts.id;
    var dlgObj = $(_opts.getid).find(".dialog-body");
    if (dlgObj.attr("defheight") == 0) {
        dlgObj.css("height", ($(document).height() - 120) + "px");
    }
    if (_opts.zindex != null) {
        zIndex = _opts.zindex;
    }
    if (_opts.father != "") {
        zIndex = parseInt($("#" + _opts.father).parent().css("z-index")) + 2;
    }
    if (_opts.title != "") {
        $(_opts.getid + " .dialog-head strong").html(_opts.title);
    }

    if (_opts.mask && $("#" + _opts.id
            + "_mask").length == 0) {
        $("body").append(
            "<div id=\"" + _opts.id
            + "_mask\" class=\"dialog-mask\" style=\"z-index:"
            + (zIndex - 1) + "\"></div>");
    }
    if (!$(_opts.getid).parent().hasClass("dialog-win")) {
        $(_opts.getid).wrap(
            '<div class="dialog-win" style="position:fixed;width:'
            + _opts.width + ';z-index:' + zIndex + ';"></div>');
    }
    var win = $(_opts.getid).parent();
    win.find(".dialog").addClass("open");
    // $("body").append(win);
    var x = parseInt($(window).width() - win.outerWidth()) / 2;
    var y = parseInt($(window).height() - win.outerHeight()) / 2;
    if (y <= 10) {
        y = 10;
    }
    if (win.outerHeight() >= $(document).height()) {
        dlgObj.css("height", ($(document).height() - 120) + "px");
    }
    win.css({
        "left": x,
        "top": y
    });
    if ($(_opts.getid).attr("isini") == null) {
        $(_opts.getid).attr("isini", false);
        win.find(".dialog-close,.close").each(function () {
            $(this).click(function () {
                var isOk = true;
                if (isOk) {
                    if (afterCloseFun != null) {
                        isOk = afterCloseFun();
                    }
                    if (isOk) {
                        win.find(".dialog").removeClass("open");
                        $("#" + _opts.id + "_mask").remove();
                    }
                }
                if (closeFun != null) {
                    isOk = closeFun();
                }
            });
        });
        $("#" + _paras.getid + "_mask").click(function () {
            if (!lock) {
                if (closeFun == null || okFun) {
                    win.find(".dialog").removeClass("open");
                    $("#" + _opts.id + "_mask").remove();
                }
            }
        });
    }
    dlgObj.scrollTop(0);
};


// 关闭对话框
function closeDialog(getid) {
    var win = $("#" + getid).parent();
    if (win.length > 0) {
        win.children().children(".dialog").removeClass("open");
        $("#" + getid + "_mask").remove();
    }

};

function getTDTarget(_tag, _name) {
    if (_tag[0].tagName != _name) {
        _tag = getTDTarget(_tag.parent(), _name);
    }
    return _tag;
}

var closeAObj = null;

// 弹出提示框
function showH5Alert(_id, _text, _alt, _type, _setY) {
    closeTime(_id);
    var cssO = {};
    var alClass = "alert-red";
    if (_alt != null && _alt == 1) {
        //错误
        alClass = "alert-yellow";
    }
    if (_setY == null) {
        _setY = -70;
    }
    if (_type != null) {
        //缺省在地步
        cssO = {
            bottom: 10
        };
        _type = "bottom";
    } else {
        cssO = {
            top: 50
        };
        _type = "top";
    }
    var html = "<div id=\"al_ttalt\" class=\"x12 padding text-center\" style=\"z-index:1000;position:fixed;"
        + _type
        + ":"
        + _setY
        + "px;\"><div class=\"alert "
        + alClass
        + " text-center\" style=\"opacity:0.9;width:50%;margin:auto;\" role=\"alert\"><span class=\"close\" onclick=\"closeH5Alert('" + _id + "', " + _type + ", " + _setY + ");\"></span><strong>"
        + _text
        + "</strong></div></div>";
    $("body").append(html);
    $("#al_ttalt").animate(cssO, 400, function () {
        closeAObj = setTimeout(function () {
            closeH5Alert(_id, _type, _setY);
        }, 5000);
    });
}

function closeH5Alert(_id, _type, _setY) {
    var cssO = {};
    if (_type == "bottom") {
        cssO = {
            bottom: _setY
        };
    } else {
        cssO = {
            top: _setY
        };
    }

    $("#al_ttalt").animate(cssO, 400, function () {
        $("#al_ttalt").remove();
    });
}

function closeTime(_id) {
    if (closeAObj != null) {
        clearTimeout(closeAObj);
        closeAObj = null;
    }
    $("#al_ttalt").remove();
}

//发送短信
function toSMS(_phones, _text) {
    var fromObj = {};
    fromObj.phones = _phones;
    fromObj.text = _text;
    p.openWindow(-1, "/system/message/index.html", {
        id: "SMS_LOOKUP",
        width: 1000,
        height: 410,
        text: '信息推送',
        img: "/common/images/bswin/xxts.png",
        modal: true,
        addTask: false,
        afterclose: "toSMSRet",
        inObj: fromObj
    }, this);
}

function toSMSRet(_data) {

}

function timeFormatAll(_time) {
    var showTime = "";

    var min = format_number(_time % 60);
    var hour = format_number(Math.floor(_time / 60));

    showTime = hour + ":" + min;
    return showTime;

}

function timeToNum(_time) {
    var timeN = 0;
    var tims = _time.split(":");
    if (tims.length == 2) {
        timeN = parseInt(tims[0]) * 60 + parseInt(tims[1]);
    }
    return timeN;
}

function format_number(number) {
    return number < 10 ? '0' + number : number;
}

//仿真参数
// **********************************************

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}

// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
}

// 减法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accSub(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    // last modify by deeka
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
    return accSub(arg, this);
}

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

// 给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
}

// 乘法函数，用来得到精确的乘法结果
// 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
// 调用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
        / Math.pow(10, m)
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
}

// **********************************************
function getFZWeekObject(list) {// 得到交流列表的周期
    var _list = [];
    if (list.length > 0) {
        var start = 0;
        var end = 0;
        var value = list[0] >= 0;
        var findNum = 0;
        for (var i = 1; i < list.length; i++) {
            var _value = list[i] >= 0;
            if (value != _value) {// 找到了另一部分
                value = _value;
                findNum++;
                if (findNum % 2 == 0) {
                    end = i - 1;
                    _list.push({
                        start: start,
                        end: end
                    });
                    start = i;
                    end = i;
                }
            }
        }
        if (end != list.length - 1) {
            _list.push({
                start: start,
                end: list.length - 1,
            });
        }
    }
    return _list;
}

function getFZWeekValue(objList, list, index) {// 得到电流表的值
    var value = 0;
    var obj = null;
    for (var i = 0; i < objList.length; i++) {
        var _obj = objList[i];
        if (index >= _obj.start && index < _obj.end) {
            obj = _obj;
            break;
        }
    }
    if (obj) {
        if (obj.value == undefined) {
            for (var i = obj.start; i < obj.end && i < list.length; i++) {
                value += accMul(list[i], list[i]);
            }
            value = accDiv(value, obj.end - obj.start + 1);
            value = Math.sqrt(value);
            obj.value = value;
        } else {
            value = obj.value;
        }
    }
    return value;
}

function getFZWeekValue2(objList, list, list2, index) {// 得到电压表的值
    var value = 0;
    var obj = null;
    for (var i = 0; i < objList.length; i++) {
        var _obj = objList[i];
        if (index >= _obj.start && index < _obj.end) {
            obj = _obj;
            break;
        }
    }
    if (obj) {
        if (obj.value == undefined) {
            for (var i = obj.start; i < obj.end && i < list.length; i++) {
                var v = list[i];
                if (i < list2.length) {
                    v -= list2[i];
                }
                value += accMul(v, v);// 平方
            }
            value = accDiv(value, obj.end - obj.start + 1);
            value = Math.sqrt(value);
            obj.value = value;
        } else {
            value = obj.value;
        }
    }
    return value;
}

function toAppMessage(_type, _bissid, _title, _text) {
    var fromObj = {};
    fromObj.type = _type;//0:用户，1：教学计划；2：实验班；3：全部计划学生
    fromObj.bissid = _bissid;
    fromObj.label = _title;
    fromObj.text = _text;
    p.openWindow(-1, "/system/message/app/index.html", {
        id: "APPMESSAGE_LOOKUP",
        width: 800,
        height: 468,
        text: _title,
        img: "/common/images/bswin/jxjh.png",
        modal: true,
        addTask: false,
        afterclose: null,
        inObj: fromObj
    }, this);
}

function stopBubble(e) {
    if (e && e.stopPropagation)
        e.stopPropagation();
    else
        window.event.cancelBubble = true;
}

function getMyImgList(_imgid, _cuser, _afterclose) {
    var fromObj = {};
    fromObj.imgid = _imgid;//0:用户，1：教学计划；2：实验班；3：全部计划学生
    fromObj.cuser = _cuser;//0:用户，1：教学计划；2：实验班；3：全部计划学生
    p.openWindow(-1, "/system/user/myimgs.html", {
        id: "MYIMGS_LOOKUP",
        width: 800,
        height: 522,
        text: "相册",
        img: "/common/images/bswin/jxjh.png",
        modal: true,
        addTask: false,
        afterclose: _afterclose,
        inObj: fromObj
    }, this);
}

// 加载媒体表格
function addTableCellForImg(tableId, imgId, _imgUrl, _descHtml, selectFun) {
    var _html = "";
    _html += "<div class=\"x2 text-center\" title=\"\">";
    _html += "<div class=\"media clearfix\">";
    _html += "<img id=\""
        + imgId
        + "\" src=\""
        + _imgUrl
        + "\" width=\"90\" height=\"90\" class=\"img-border radius-little\" style=\"cursor:pointer;\"\>";
    _html += "<div class=\"media-body\" style=\"width:90px;white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;\">";
    _html += _descHtml;
    _html += "</div></div></div>";
    $("#" + tableId).append(_html);
    if (selectFun != null) {
        $("#" + imgId).bind("click", function () {
            selectFun(_imgUrl, imgId);
        });
    }
}

function resetFile(_obj) {
    try {
        if (ie) {    // 此处判断是否是IE
            $('#' + _obj).replaceWith($('#' + _obj).clone(true));
        } else {
            $('#' + _obj).val('');
        }
    } catch (e) {
        $('#' + _obj).val('');
    }
}

function checkPhone(_phone) {
    var _tphone = _phone.replace(/(^\s*)|(\s*$)/g, "");
    return /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}?$|15[0-9]\d{8}?$|17[0-9]\d{8}?$|14[0-9]\d{8}?$|18[0-9]\d{8}?$/.test(_tphone);
}

function previewImage(file, preview) {
    var MAXWIDTH = 100;
    var MAXHEIGHT = 100;
    var div = $('#' + preview).parent();
    if (file.files && file.files[0]) {
        //div.html($('#' + preview)[0].outerHTML);
        var img = $('#' + preview)[0];

        var reader = new FileReader();
        reader.onload = function (evt) {
            img.src = evt.target.result;
        }
        reader.readAsDataURL(file.files[0]);
    }
    else {
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        //div.html($('#' + preview)[0].outerHTML);
        var img = $('#' + preview)[0];
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
        div.html("<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;margin-left:" + rect.left + "px;" + sFilter + src + "\"'></div>");
    }
}

function previewAllImage(file, preview) {
    var MAXWIDTH = 100;
    var MAXHEIGHT = 100;
    var div = $('#' + preview).parent();
    $('#' + preview).html("");
    if (file.files && file.files.length > 0) {
        for (var i = 0; i < file.files.length; i++) {
            var oneF = file.files[i];
            var reader = new FileReader();
            reader.onload = (function (oneF) {
                return function (ev) {
                    var _html = "";
                    _html += "<div style='float: left;' class=\"margin-left margin-little-top\" title=\"\">";
                    _html += "<div class=\"media clearfix img-border radius-little\" style=\"line-height:140px;cursor:pointer;vertical-align: middle;height:150px;width: 150px;\">";
                    _html += "<img onload=\"resetImgSizeObj($(this),140,140);\" src=\"" + ev.target.result + "\" class=\"\" style=\"display:block;\"/>";
                    _html += "</div></div>";
                    $('#' + preview).append(_html);
                };
            })(oneF);
            reader.readAsDataURL(oneF);
        }

    }
    else {
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        //div.html($('#' + preview)[0].outerHTML);
        var img = $('#' + preview)[0];
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
        div.html("<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;margin-left:" + rect.left + "px;" + sFilter + src + "\"'></div>");
    }
}

function previewFile(file, preview) {
    var fileName = file.files[0].name.toLowerCase();
    var tempE = fileName.split(".");
    $('#' + preview).html(fileName);
    return tempE[tempE.length - 1];
}

function addScript(_path, callback) {
    $(".tempscript").remove();
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.className = "tempscript";
    script.onreadystatechange = function () {
        if (callback != null && this.readyState == 'complete')
            callback();
    }
    script.onload = function () {
        if (callback != null) {
            callback();
        }
    }
    script.src = _path;
    head.appendChild(script);
}

function showSourceIni(_id) {
    doRefresh(null, "SOURCE", "getSourceShowUrl", "&sourceid="
        + _id, function (_data) {
        if (_data.r == 0) {
            if (_data.type == 0 || _data.type == 2 || _data.type == 3) {
                //弹开展示
                window.open(_data.url);
            }
            else if (_data.type == 1) {
                //视频" + webHome + "/source/play.html?fid=" + oneD.id + "
                window.open(_data.url);
            }
            else if (_data.type == 6) {
                //视频" + webHome + "/source/play.html?fid=" + oneD.id + "
                window.open(_data.url);
            }
            else {
                //文件下载
                doRefreshDownLoad("SOURCE", "downloadSource", "&sourceid=" + _id);
            }
        }
        else {
            alert(_data.error);
        }

    });
}

function showVideo(_id) {
    var fromObj = {};
    fromObj.fileid = _id;
    p.openWindow(-1, "/source/play.html", {
        id: "VIDEO_PLAY",
        width: 0,
        height: 600,
        text: '视频播放',
        img: "/common/images/bswin/yhgl.png",
        modal: true,
        addTask: false,
        afterclose: "returnCWin",
        inObj: fromObj
    }, this);
}

// 加载媒体表格
function addTableCellForFile(tableId, _fileObj, _descHtml, selectFun) {
    var _html = "";
    _html += "<div class=\"margin-little-top padding-little\" style=\"float:left;cursor: pointer;\" title=\"" + _fileObj.name + "\">";
    _html += "<div class=\"media clearfix img-border radius-small\" style=\"display:table-cell;text-align:center;vertical-align:middle;height:150px;width:150px;\">";
    _html += "<img id=\""
        + _fileObj.fid
        + "\" onload=\"changeImgSizeObj(this,140,140);\" src=\""
        + _fileObj.pic
        + "\" style=\"display:none;vertical-align:middle;margin:auto;\"/>";
    _html += "</div><div class=\"media-body\" style=\"width:140px;white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;\">";
    _html += _descHtml;
    _html += "</div></div>";
    $("#" + tableId).append(_html);
    if (selectFun != null) {
        $("#" + _fileObj.fid).parent().bind("click", function () {
            selectFun(_fileObj);
        });
    }
}

function showErrDlg(_date, _title) {
    var _func = "$('#bserror-dlg').remove()";
    if (_date.r == 3) {
        _func = "backToLogin()";
        getParent().$(document).keydown(function (e) {
            if (e.which == 13) {
                backToLogin();
                return false;
            }
        });
    }
    if (_title == null || _title == "") {
        _title = "错误";
    }
    if (getParent().$("#bserror-dlg").length <= 0) {
        var _html = "<div id=\"bserror-dlg\"><div class=\"dialog\"><div class=\"dialog-head\">";
        _html += "<strong></strong></div>";
        _html += "<div class=\"dialog-body text-large\" style=\"overflow: auto;\">" + _date.error + "</div>";
        _html += "<div class=\"dialog-foot\"><button class=\"errbt button bg-main\" onclick=\"closeDialog('bserror-dlg');" + _func + ";\"> 确定</button>";
        _html += "</div></div></div>";
        getParent().$("body").append(_html);
        getParent().$(".errbt").focus();
        getParent().openDialogs({
            id: "bserror-dlg",
            title: _title,
            width: "450px",
            father: "",
            zindex: 2800
        }, function () {
            return true;
        });
    }
}

//从身份证中得到日期
function getBirthdayFromIdCard(idCard) {
    var birthday = "";
    if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
            birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
        }

        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }

    return birthday;
}


function doImport(_fileid, _bissid, _paras, closeFun) {
    if ($("#import-dlg").length <= 0) {
        //页面加载窗口
        var _html = "<div id=\"import-dlg\"><div class=\"dialog\">";
        _html += "<div class=\"dialog-head\"><span class=\"close rotate-hover\"></span> <strong></strong></div>";
        _html += "<div class=\"dialog-body\" style=\"height:300px;overflow-y:auto;\">";
        _html += "<form id=\"form-file\" method=\"post\" enctype=\"multipart/form-data\" class=\"form\">";
        _html += "<input type=\"hidden\" id=\"pg_filetype\"/>";
        _html += "<input type=\"hidden\" id=\"pg_bissid\"/>";
        _html += "<a class=\"button bg-main input-file icon-file-excel-o\" href=\"javascript:void(0);\"> 上传XLS文件<input onchange=\"$('#l_filename').html($('#t_file').val())\" id=\"t_file\" name=\"t_file\" type=\"file\" accept=\"application/vnd.ms-excel\"/></a>";
        _html += "<div id=\"l_filename\"></div>";
        _html += "<div id=\"t_file_p\" class=\"progress progress hidden\"></div>";
        _html += "</form>";
        _html += "<img id=\"pg_tempimg\" style=\"width: 100%;\" src=\"\"/>";
        _html += "</div><div class=\"dialog-foot\">";
        _html += "<a target='_blank' id='pg_temppath' type=\"button\" class=\"float-left button bg-main text-white icon-download\" href=\"\"> 模板下载</a>";
        _html += "<button type=\"button\" class=\"button bg-main text-white icon-check\" onclick=\"ImportFile()\"> 导入</button>";
        _html += "</div></div></div>";
        $("body").append(_html);
    }
    $("#pg_filetype").val(_fileid);
    $("#pg_bissid").val(_bissid);
    if (_paras != null) {
        $("#pg_temppath").attr("href", webHome + "/files/import/" + _paras.temppath);
        $("#pg_tempimg").attr("src", webHome + "/files/import/" + _paras.tempimg);
    }
    openDialogs({
        id: "import-dlg",
        title: "文件导入",
        width: "80%",
        father: "",
        zindex: 2500
    }, function () {
        closeFun();
        return true;
    });
}

function ImportFile() {
    if ($("#t_file").val() != "" && confirm("是否上传文件？")) {
        doRefreshFile("form-file", "DCFILE", "ImportFile",
            "&filetype=" + $("#pg_filetype").val() + "&bissid=" + $("#pg_bissid").val() + "&cuid=" + p.thisLogUser.instid, "t_file_p", function (_data) {
                resetFile("t_file");
                if (_data.r == 0) {
                    alert("导入成功！");
                }
                else {
                    showErrDlg(_data);
                }

                $('#l_filename').html("");
            });
    }
}
