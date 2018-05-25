var thisMenuId = "";
var tempMenuId = "";
var thisLogUser = null;

// 注销
function loginOut() {
    doRefresh(null, "DCLOGIN", "clearUser", "", function (_data) {
        location.href = webHome + "/login.html";
    });
}

// 得到登录用户信息
function getLoginUser(userDiv, selMenu, pDiv, _fun) {
    var h = "";
    //设置主页去向
    $("#l_syslogo_f").css("background-color", "#2a3235");
    $("#l_syslogo").html("<span class=\"margin-left\"><a target='_self' href='" + window.location.protocol + "//" + window.location.host + "/html/index/index.html'><img style=\"height:40px; \" src=\"" + webHome + "/common/images/lg.png\"/></a></span>");
    $("#div_home").html("&nbsp;<a class='text-white' target='_home' href='" + webHome + "/index.html'>酷陆智慧环境云</a>");
    document.title = "酷陆智慧环境云";
    $(".maindiv").width($(window).width() - $(".menudiv").width());
    $(".maindiv").css("left", $(".menudiv").width());
    $(".maindiv").show();
    doRefresh(
        null,
        "DCLOGIN",
        "getLoginMsg",
        "",
        function (_data) {
            if (_data.r == 0) {
                thisLogUser = _data.user;
                $("#l_login").html(
                    "你好，[" + thisLogUser.name + "] 欢迎您&nbsp;登录时间："
                    + _data.ldate);
                $("#l_userid").html("<span class=\"icon-user\"></span>&nbsp;用户id：" + thisLogUser.id);
                $("#l_usernick").html("<span class=\"icon-user\"></span>&nbsp;用户姓名：" + thisLogUser.name);
                $("#l_ulink").html("<span class=\"icon-user\"></span>&nbsp;联系方式：" + thisLogUser.phone);
                // 成功
                h = "<li class=\"bg-blue bg-inverse text-big\" style=\"width: 170px;height: 47px;cursor:pointer;\">";
                h += "<img id=\"i_mhead\" src=\"" + webHome + "/common/images/user.png\" class=\"padding-little img-border radius-circle margin-small\" style=\"float:left;height:37px;\" />";
                h += "<span style=\"float:left;line-height:37px;width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;position:relative;\" class=\"margin-small\">"
                    + thisLogUser.name + "</span>";
                h += "<span class=\"arrow\" style=\"\"></span>";
                // 下拉菜单
                h += "<ul class=\"drop-menu\" style='z-index: 2300;'>";
                h += "<li style=\"width:170px\"><a href=\"#\"> <span class=\"icon-key\"></span> 修改密码</a></li>";
                h += "<li style=\"width:170px\"><a href=\"javascript:void(0);\" onclick=\"loginOut();\"><span class=\"icon-power-off\"></span> 注销</a></li>";
                h += "</ul></li>";
                // 设置应用列表
                setMenuBar(selMenu, pDiv, _data.menus);
                if (_fun != null) {
                    _fun(_data);
                }
                if (pDiv == "") {
                    $("#m_CONSOLE_USER").click();
                }
                if ($("#" + userDiv).length > 0) {
                    $("#" + userDiv).html(h);
                }
            }
            if (_data.r != 0) {
                alert(_data.error);
                location.href = webHome + "/login.html#ts";
            }
        });
}

// 设置菜单
function setMenuBar(selMenu, pDiv, menuList) {
    var barDiv = "div_menu";
    var h = "";
    if (menuList != null) {
        // 顶层
        h += "<li id=\"m_index\"><a target=\"_self\" href=\""
            + webHome
            + "/console.html\"> <i class=\"icon-user\"></i> <span class=\"menu-text\"> 个人中心 </span></a></li>";
        for (var i = 0; i < menuList.length; i++) {
            var oneFM = menuList[i];
            h += "<li id=\"m_" + oneFM.id + "\"><a target=\"_self\" href=\""
                + (oneFM.url == "" ? "#" : (webHome + oneFM.url))
                + "\" class=\"dropdown-toggle\"> <i class=\"" + oneFM.img
                + "\"></i> <span class=\"menu-text\"> " + oneFM.name + (oneFM.sub.length > 0 ? " [" + oneFM.sub.length + "]" : "")
                + " </span>" + (oneFM.sub.length > 0 ? "<b class=\"myarrow icon-angle-down\"></b>" : "") + " </a>";
            if (oneFM.sub.length > 0) {
                h += "<ul class=\"submenu\">";
                for (var j = 0; j < oneFM.sub.length; j++) {
                    var oneSM = oneFM.sub[j];
                    h += "<li id=\"m_" + oneSM.id
                        + "\"><a target=\"_self\" href=\""
                        + (oneSM.url == "" ? "#" : (webHome + oneSM.url))
                        + "\"> <i class=\"" + oneSM.img + "\"></i> "
                        + oneSM.name + "</a></li>";

                }
                h += "</ul>";
            }
        }
    }
    $("#" + barDiv).html(h);

    // 处理当前的
    thisMenuId = "m_" + selMenu;
    if (selMenu != null && selMenu != "") {
        $("#m_" + selMenu).addClass("active");
    } else {
        $("#m_index").addClass("active");

    }
    if (pDiv != null && pDiv != "") {
        $("#m_" + pDiv).addClass("active open");
        $("#m_" + pDiv + " ul").addClass("show");
        thisMenuId = "m_" + pDiv;
    }
    tempMenuId = thisMenuId;
    iniMenu();
}

function iniMenu() {
    $(".open ul").addClass("show");
    $(".dropdown-toggle").parent().bind("click", function () {
        var thisId = $(this).attr("id");
        if (thisId != tempMenuId) {
            // 关闭当前的
            $("#" + tempMenuId).removeClass("open");
            $("#" + tempMenuId + " ul").removeClass("show");
            $("#" + tempMenuId + " ul").addClass("hidden");
        }
        tempMenuId = thisId;
        if ($("ul", this).hasClass("show")) {
            $(this).removeClass("open");
            $("ul", this).removeClass("show");
            $("ul", this).addClass("hidden");
        } else {
            // 关闭的状态
            $(this).addClass("open");
            $("ul", this).addClass("show");
            $("ul", this).removeClass("hidden");
        }
    });
}