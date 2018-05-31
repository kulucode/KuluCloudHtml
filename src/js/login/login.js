$(function() {
  TTClear();
  layui.use("layer", function() {
    //独立版的layer无需执行这一句
    var $ = layui.jquery,
      layer = layui.layer; //独立版的layer无需执行这一句
    //触发事件
    $("#layerDemo .layui-btn").on("click", function() {
      var othis = $(this),
        method = othis.data("method");
      active[method] ? active[method].call(this, othis) : "";
    });
  });
  function notUser() {
    layer.msg("没有该用户！");
    $("#username").focus();
    $("#userkey").val("");
    $("#usercode").val("");
  }
  function userKeyError() {
    layer.msg("密码错误！");
    $("#userkey").focus();
    $("#userkey").val("");
    $("#usercode").val("");
  }
  function userMaxError() {
    layer.msg("用户超过最大数，请稍后再访问！");
    $("#username").focus();
    $("#userkey").val("");
    $("#usercode").val("");
  }

  function userOtherError() {
    layer.msg("接口异常，请重新登录！");
    $("#username").focus();
    $("#userkey").val("");
    $("#usercode").val("");
  }
  $("#btn_login").click(function() {
    init();
  });
  document.onkeydown = function(e) {
    var ev = document.all ? window.event : e;
    if (ev.keyCode == 13) {
      init();
      $("#btn_login").click()
      console.log(123)
    }
  };
  function init() {
    var _cookie = "1",
      _cookies = "0";
    doRefresh(
      "loginForm",
      "KULUINTERFACE",
      "checkUser",
      "&bs_checklogin=f&usertype=0",
      function(data) {
        if (data.r == 0) {
          _cookie += "|" + $("#username").val();
          _cookies += "|" + data.session;
          //执行正确动作
          //init();
          location.href = "html/index/index.html";
        } else if (data.r == 4) {
          notUser();
        } else if (data.r == 5) {
          userKeyError();
        } else if (data.r == 996) {
          userMaxError();
        } else {
          userOtherError();
        }
        setCookie("co_user", _cookie, 60 * 24 * 365 * 10);
        setCookie("session", _cookies, 60 * 24 * 365 * 10);
      }
    );
  }
});
