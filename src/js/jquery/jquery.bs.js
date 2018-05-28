//-----------------变量定义----------------------//
var origin = window.location.origin == null ? window.location.protocol + "//" + window.location.host : window.location.origin;
var thisDomain = origin+ "/kulucloud";
var thisFileDomain = thisDomain;
var webHome =  origin + "/kulu";
var thisWebSocket = "ws://" + window.location.host + "/kulucloud/TTWebsocket/";
var COOKIE_NAME = "KULUCOOKIE_HAS";
var pointDownTime = 300000;
//------------------------------------------------//
var p = getParent();
var vActionRefresh = thisDomain + "/TTService?curPageOperID=refresh&curBSID=";
var vActionFile = thisFileDomain + "/TTService?curPageOperID=curFile&curBSID=";
var sessionId = getCookie(COOKIE_NAME);
bstop = true
// 检查浏览器
function getDomain() {
    return thisDomain;
}

function getWebHome() {
    return webHome;
}

function getRandomDate() {
    var date = new Date();
    var winName = date.getMonth() + 1;
    winName += date.getDate();
    winName += date.getHours();
    winName += date.getMinutes();
    winName += date.getSeconds();
    winName += date.getMilliseconds();
    return winName;
}

//清理矿框架cookie
function TTClear() {
    delCookie(COOKIE_NAME);
    sessionId = null;
}

//设置新的session
function setTTSession(_sessionId, _client) {
    sessionId = "";
    if (_client != null) {
        sessionId = getCookie(COOKIE_NAME).split("|")[0] + "|" + _client + getRandomDate();
    }
    else {
        sessionId = _sessionId + "|null";
    }
    setCookie(COOKIE_NAME, sessionId, 20);
}

//得到框架提交的完整URL
function getRefreshURL(myform, bsid, opname, _paras, _thisDomain, _session) {
    var _vActionRefresh = vActionRefresh;
    var _bs_checklogin = "";
    if (_thisDomain != undefined && _thisDomain != "" && _thisDomain != thisDomain) {
        _vActionRefresh = _vActionRefresh.replace(thisDomain, _thisDomain);
        _bs_checklogin = "&bs_checklogin=f";
    }
    var _headers = {};
    var url = _vActionRefresh + bsid + "&TTDT=json&opname=" + opname + _bs_checklogin;
    if (_session != null && _session != "") {
        url += "&TTSSID=" + _session;
    }
    else if (sessionId != null) {
        var tempSession = sessionId.split("|");
        url += "&TTSSID=" + tempSession[0];
        url += "&TTKEY=" + tempSession[1];
    }
    if (myform == "") {
        myform = "frmBusiness";
    }
    if (myform != null) {
        url += $("#" + myform).serialize();
    }
    if (_paras != null && _paras != "") {
        if (!_paras.startWith("&")) {
            url += "&";
        }
        url += _paras;
    }
    return url;
}


//提交普通表单
function doRefresh(myform, bsid, opname, _paras, callfun, _thisDomain, _session) {
    var _vActionRefresh = vActionRefresh;
    var _bs_checklogin = "";
    if (_thisDomain != undefined && _thisDomain != "" && _thisDomain != thisDomain) {
        _vActionRefresh = _vActionRefresh.replace(thisDomain, _thisDomain);
        _bs_checklogin = "&bs_checklogin=f";
    }
    var _headers = {};
    var url = _vActionRefresh + bsid + "&bs_uid=" + getRandomDate()
        + "&TTDT=json&opname=" + opname + _bs_checklogin;
    if (_session != null && _session != "") {
        url += "&TTSSID=" + _session;
    }
    else if (sessionId != null) {
        var tempSession = sessionId.split("|");
        url += "&TTSSID=" + tempSession[0];
        url += "&TTKEY=" + tempSession[1];
    }
    if (myform == "") {
        myform = "frmBusiness";
    }
    var imgID = "loading_" + getRandomDate();
    if (myform != null) {
        _paras = $("#" + myform).serialize() + _paras;
    }
    if (_paras.startWith("&")) {
        _paras = _paras.substr(1);
    }
    $
        .ajax({
            type: "POST",
            url: url,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: _paras,
            cache: false,
            datatype: "json",
            beforeSend: function (XMLHttpRequest) {
				/*此处可添加后台交互等待动画*/
                /*$("body")
                    .append(
                        "<img id=\""
                        + imgID
                        + "\" style=\"position:fixed;top:0;left:0;z-index:2000;\" src=\""
                        + webHome
                        + "/common/images/loading.gif\"/>");*/
            },
            success: function (_data) {
                if (_data.r == 3 && bstop == true) {
                    //用户失效
                    logout();
                    bstop=false;
                    return false
                }
                else if(_data.r != 3 && bstop == true){
                    if (_data != null && _data.session != null) {
                        if (sessionId == null) {
                            setTTSession(_data.session);
                        }
                        else {
                            sessionId = (_data.session + "|" + getCookie(COOKIE_NAME).split("|")[1]);
                            setCookie(COOKIE_NAME, sessionId, 20);
                        }
                    }
                    callfun(_data);
                }
                else{
                    return false
                }
            },
            error: function (XMLHttpRequest, status, e) {
                //alert("error:" + status + ";" + e);
            },
            complete: function (XMLHttpRequest, textStatus) {
				/*此处可关闭后台交互等待动画*/
                //$("#" + imgID).remove();
            },
        });
}

// 提交有带有文件的表单
function doRefreshFile(myform, bsid, opname, _paras, _pdiv, callfun, _thisDomain, _session) {
    var _vActionFile = vActionFile;
    if (_thisDomain != undefined && _thisDomain != "" && _thisDomain != thisDomain) {
        _vActionFile = _vActionFile.replace(thisDomain, _thisDomain);
    }
    var url = _vActionFile + bsid + "&bs_checklogin=f&bs_uid=" + getRandomDate()
        + "&TTDT=json&opname=" + opname + _paras;
    if (_session != null && _session != "") {
        url += "&TTSSID=" + _session;
    }
    else if (sessionId != null) {
        var tempSession = sessionId.split("|");
        url += "&TTSSID=" + tempSession[0];
        url += "&TTKEY=" + tempSession[1];
    }
    if (myform == null || myform == "") {
        myform = "frmBusiness";
    }
    var percent = $("#" + _pdiv);
    if (percent.length > 0) {
        percent.removeClass("hidden");
    }
    // 准备参数
    var fd = new FormData();
    var values = $("#" + myform).serializeArray();
    for (var i = 0; i < values.length; i++) {
        if (values[i].type == "file") {
        } else {
            fd.append(values[i].name, values[i].value);
        }
    }
    var fileObj = $("#" + myform + " input[type='file']");
    if (fileObj.length > 0) {
        for (var j = 0; j < fileObj.length; j++) {
            fd.append(fileObj[j].name, fileObj[j].files[0]);
        }
        // 准备上传对象
        var xhr = false;
        try {
            xhr = new XMLHttpRequest();// 尝试创建 XMLHttpRequest 对象，除 IE
            // 外的浏览器都支持这个方法。
        } catch (e) {
            xhr = ActiveXobject("Msxml12.XMLHTTP");// 使用较新版本的 IE 创建 IE
            // 兼容的对象（Msxml2.XMLHTTP）。
        }
        // 进度条
        xhr.upload.addEventListener("progress", function (evt) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            percent.html("<div class=\"progress-bar\" style=\"width:"
                + percentComplete + "%;\">进度：" + percentComplete
                + "%</div>");
        }, false);
        // complete
        xhr
            .addEventListener(
                "load",
                function (evt) {
                    percent
                        .html("<div class=\"progress-bar\" style=\"width:100%;\">进度：100%</div>");
                    if (percent.length > 0) {
                        percent.addClass("hidden");
                    }
                    callfun(JSON.parse(evt.target.responseText));
                }, false);
        // 失败
        xhr.addEventListener("error", function (evt) {
            alert("上传失败。");
        }, false);
        xhr.open("POST", url, true);
        xhr.send(fd);
    }
}

//提交下载文件需求表单
function doRefreshDownLoad(myform, bsid, opname, _paras) {
    var url = vActionRefresh + bsid + "&bs_uid=" + getRandomDate()
        + "&callback=?&TTDT=download&opname=" + opname;
    if (sessionId != null) {
        var tempSession = sessionId.split("|");
        url += "&TTSSID=" + tempSession[0];
        url += "&TTKEY=" + tempSession[1];
    }
    if (myform == "") {
        myform = "frmBusiness";
    }
    if (myform != null) {
        _paras = $("#" + myform).serialize() + _paras;
    }
    if (_paras != null) {
        url = url + _paras;
    }
    var iframe = $("#i_download");
    if (iframe.length <= 0) {
        var _iframe = "<iframe style=\"display:none;\" id=\"i_download\" src=\"\"></iframe>";
        $("body").append(_iframe);
    }
    else {
        $("#i_download").attr("src", "");
    }

    $("#i_download").attr("src", url);

}

// 重置验证码
function changeImgCode(_imgObj) {
    $("#" + _imgObj).attr(
        "src",
        getDomain()
        + "/common/url/checkimage.jsp?bs_checkname=InCheckCode&TTSSID=" + window.escape(sessionId) + "&r="
        + getRandomDate());

}

//得到url中的&后面带?的参数值
function getUrlValue(id) {
    var url = window.location.href;
    var reg = new RegExp("(^|&)" + id + "=([^&]*)(&|$)");
    var r = url.substr(url.indexOf("\?") + 1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return "";
}

Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d)
        d = 0;
    if (s.indexOf(".") == -1)
        s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else {
                        break;
                    }
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"),
                "$1.$2");
        }
        if (b)
            s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};

function getParent() {
    var temp_p = window.parent;
    if (temp_p != null) {
        for (var i = 0; i < 10; i++) {
            if (temp_p.parent == null) {
                break;
            } else {
                temp_p = temp_p.parent;
            }
        }
    }
    return temp_p;
}

//用户失效缺省方法
function logout() {
    alert("用户失效，请重新登录");
    p.location.href = origin;
}
function setCookie(name, value, saveTime) {
    try {
        if (saveTime == null) {
            saveTime = 60;
        }
        var exp = new Date(); // new Date("December 31, 9998");
        exp.setTime(exp.getTime() + saveTime * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires="
            + exp.toGMTString() + ";path=/";
    } catch (ex) {
    }
}

function getCookie(name) {
    try {
        var search = name + "=";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = document.cookie.indexOf(";", offset);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(offset, end));
            } else {
                return "";
            }
        }
    } catch (ex) {
        return "";
    }
}

function delCookie(name) {
    try {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires="
                + exp.toGMTString() + ";path=/";
        }
    } catch (ex) {
        return null;
    }
}
