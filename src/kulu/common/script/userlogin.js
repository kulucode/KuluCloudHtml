opener = null;
window.history.forward();
var hasCookie = false;
var isOne = true;
var p_domain = "";
var fromtype = null;

function login(_hm) {
    if (_hm == null) {
        _hm = "";
    }

    //记录Cookie
    var _cookie = "0";
    if ($("#cookie2w")[0].checked) {
        _cookie = "1";
        hasCookie = true;
    }
    setTTSession("", $("#username").val());
    if (checkForm("frmBusiness") && $("#btn_login").hasClass("button_false")) {
        doRefresh("frmBusiness", "DCLOGIN", "checkUser", _hm + "&bs_checklogin=f&bs_type=", function (data) {
            if (data.r == 0) {
                if ($("#cookie2w")[0].checked) {
                    _cookie += ("|" + $("#username").val());
                }
                frmBusiness.target = "_self";
                if (fromtype != null && fromtype == "0") {
                    var fromHTML = parent.fromHTML;
                    if (fromHTML == null || fromHTML == ""
                        || fromHTML.indexOf("/login_register.jsp") >= 0) {
                        fromHTML = p_domain + "/console.html";
                    }
                    parent.location.href = fromHTML;
                } else {
                    location.href = webHome + "/console.html";
                }

            } else if (data.r == 4) {
                notUser();
            } else if (data.r == 6) {
                userCodeError();
            } else if (data.r == 5) {
                userKeyError();
            } else if (data.r == 996) {
                userMaxError();
            }
            else {
                userOtherError();
            }
            setCookie("co_user", _cookie, 60 * 24 * 365 * 10);

        });
        setBtn(true, true);
    }
}

function Enter() {
    if (event.keyCode == 13) {
        login();
    }
}

function EnterHM() {
    if (event.keyCode == 13) {
        login("&bs_type=hm");
    }
}

function setBtn(type, isLogIn) {
    if (isLogIn == null) {
        isLogIn = false;
    }
    if ($("#btn_login").length > 0) {
        $("#btn_login").addClass("button_" + type);
        $("#btn_login").removeClass("button_" + !type);
        if (type) {
            if (isLogIn) {
                //$("#btn_login").val("");
            } else {
                //$("#btn_login").val("");
            }
        } else {
            //$("#btn_login").val("");
        }
        //$("#btn_login")[0].disabled = type;
    }
}

// 验证码
function changeImgCode(_imgObj) {
    $("#" + _imgObj).attr(
        "src",
        getDomain()
        + "/common/url/checkimage.jsp?bs_checkname=InCheckCode&TTSSID=" + window.escape(sessionId) + "&r="
        + getRandomDate());

}

function userCodeError() {
    showErr('输入的验证码不正确！');
    $("#usercode").val("");
    $("#userkey").val("");
    $("#userkey").focus();
}

function notUser() {
    showErr('没有该用户！');
    $("#username").focus();
    $("#userkey").val("");
    $("#usercode").val("");
}

function userKeyError() {
    showErr('密码错误！');
    $("#userkey").focus();
    $("#userkey").val("");
    $("#usercode").val("");
}

function userMaxError() {
    showErr("用户超过最大数，请稍后再访问！");
    $("#username").focus();
    $("#userkey").val("");
    $("#usercode").val("");
}

function userOtherError() {
    showErr('接口异常，请重新登录！');
    $("#username").focus();
    $("#userkey").val("");
    $("#usercode").val("");
}

function clear(_imgObj) {
    this.opener = null;
    setBtn(true);
    var cook = getCookie("co_user");
    if (cook != null && cook != "") {
        var cooks = cook.split("|");
        if (cooks[0] == 1) {
            $("#cookie2w").prop("checked", true);
            hasCookie = true;
        }
        else {
            $("#cookie2w").prop("checked", false);
        }
        if (cooks.length > 1) {
            var nameandkey = cooks[1];
            if (nameandkey != null && nameandkey != "") {
                $("#username").val(nameandkey);
            }
        }
    }
    $("#err_str").html("&nbsp;");
    TTClear();
    doRefresh(null, "DCLOGIN", "clearUser", "&bs_checklogin=f",
        function (data) {
            if (data == "R") {
                isOne = false;
                userUserTwoError();
            } else {
                if (!hasCookie) {
                    $("#username").focus();
                } else {
                    $("#userkey").focus();
                }
                if (data.out) {
                    showErr(data.error);
                    $("#btn_login").attr("disabled", "disabled");
                }
            }
            $("#usercode").val("");
            changeImgCode(_imgObj);
            setBtn(false);
        });

}

function showErr(str) {
    // $("log_tab").style.display = "block";
    setBtn(false);
    $("#err_str").html(str);
    changeImgCode("InCheckCode");
}

var wait = 0;

//初始化密码

function doFirstUse() {
    wait == 0
    $("#l_sed2").hide();
    $("#bt_checkmsg2").show();
    $("#mphone2").val("");
    $("#t_useridcard2").val("");
    $("#checkcode2").val("");
    $("#oneUserKeyn").val("");
    $("#oneUserKeyn2").val("");
    openDialogs({
        id: "first-base",
        title: "首次使用",
        width: "40%",
        father: "",
        zindex: 1200
    }, function () {
        return true;
    });
}

function userFirstLogin() {
    if (checkForm("first-form") && confirm("是否初始化用户")) {
        doRefresh("first-form", "DCUSER", "userFirstLogin", "&bs_checklogin=f",
            function (data) {
                if (data.r == 0) {
                    //登录
                    alert("重置密码成功，请重新登录");
                    closeDialog("first-base");
                    closeDialog("password-base");
                }
                else {
                    $("#oneUserKeyn").val("");
                    $("#oneUserKeyn2").val("");
                    showH5Alert("userFirst", data.error, null, "bottom");
                }
            });
    }
}

function getPassWord() {
    wait == 0
    $("#l_sed").hide();
    $("#bt_checkmsg").show();
    $("#mphone").val("");
    $("#checkcode").val("");
    $("#t_useridcard").val("");
    $("#oneUserKey").val("");
    $("#oneUserKey2").val("");
    openDialogs({
        id: "password-base",
        title: "找回密码",
        width: "40%",
        father: "",
    }, function () {
        return true;
    });
}

function resetPassword() {
    if (checkForm("password-form") && confirm("是否重置密码")) {
        doRefresh("password-form", "DCUSER", "resetPassword", "&bs_checklogin=f",
            function (data) {
                if (data.r == 0) {
                    //登录
                    alert("重置密码成功，请重新登录");
                    closeDialog("password-base");
                }
                else {
                    $("#oneUserKey").val("");
                    $("#oneUserKey2").val("");
                    showH5Alert("resetPassword", data.error, null, "bottom");
                }
            });
    }
}


function setTime() {
    if (wait == 0) {
        $("#l_sed").hide();
        $("#bt_checkmsg").show();
        wait = 10;
    } else {
        $("#l_sed").html(wait + "秒");
        wait--;
        setTimeout(function () {
                setTime()
            },
            1000);
    }
}

function getSM() {
    this.opener = null;
    if (checkPhone($("#mphone").val())) {
        doRefresh("password-form", "DCLOGIN", "getUpdateKeySM", "&bs_checklogin=f",
            function (data) {
                if (data.r == 0) {
                    $("#bt_checkmsg").hide();
                    $("#l_sed").html(data.d + "秒");
                    $("#l_sed").show();
                    wait = data.d;
                    setTime();
                }
                else {
                    alert(data.error);
                }
            });
    }
}

function getSM2() {
    this.opener = null;
    if (checkPhone($("#mphone2").val())) {
        doRefresh("first-form", "DCLOGIN", "getFirstUserSM", "&bs_checklogin=f",
            function (data) {
                if (data.r == 0) {
                    $("#bt_checkmsg2").hide();
                    $("#l_sed2").html(data.d + "秒");
                    $("#l_sed2").show();
                    wait = data.d;
                    setTime();
                }
                else {
                    alert(data.error);
                }
            });
    }
}

