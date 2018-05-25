var funTree = null;
var editType = "new";
var ptFun = null;
var webFun = null;
jQuery(function ($) {
    // opener = null;
    // window.history.forward();
    getLoginUser("div_user", "FUNC_MANG", "SYSTEM", function () {
        iniTree("funTree", "div_functree");
    });
});

function iniTree(_name, _div) {
    funTree = new BSTreeView(_name, "", false, "", _div);
    funTree.imagePath = webHome + "/common/images/tree/";
    var root = funTree
        .addRootNode(
            "root",
            "系统功能&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createFunIni('root','无')\"> 新增</a>",
            "", "", "", true);
    ptFun = root.addNode(
        "plateroot",
        "后台管理功能&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createFunIni('plateroot','无','0')\"> 新增</a>",
        "", "", "",
        true);
    webFun = root.addNode(
        "webroot",
        "前端管理功能&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createFunIni('webroot','无','1')\"> 新增</a>",
        "", "", "",
        true);
    funTree.DrawTree(true);
    getMenuTree(0);
    getMenuTree(1);
}

function getMenuTree(_style) {
    doRefresh(
        "",
        "DCFUNC",
        "searchFuncs",
        "&pg_style=" + _style,
        function (_data) {
            for (var i = 0; i < _data.data.length; i++) {
                var oneD = _data.data[i];
                // 添加菜单
                var rootN = _style == 0 ? ptFun : webFun
                var sub = rootN
                    .addNode(
                        oneD.id,
                        oneD.name
                        + "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createFunIni('"
                        + oneD.id
                        + "','"
                        + oneD.name
                        + "'," + _style + ")\"> 新增</a>"
                        + "&nbsp;<a class=\"badge bg-red icon-times\" href=\"javascript:delete('"
                        + oneD.id + "')\">删除</a>",
                        "editFuc(\"" + oneD.id + "\"," + _style + ")", "", "",
                        true);
                if (oneD.sub != null && oneD.sub.length > 0) {
                    for (var j = 0; j < oneD.sub.length; j++) {
                        var oneSubD = oneD.sub[j];
                        sub
                            .addNode(
                                oneSubD.id,
                                oneSubD.name
                                + "&nbsp;<a class=\"badge bg-red icon-times\" href=\"javascript:delete('"
                                + oneD.id + "')\">删除</a>",
                                "editFuc(\"" + oneSubD.id + "\")",
                                "", "", true);
                    }
                }
            }
            $(document).scrollTop(0);
        });
}

function createFunIni(_pfunId, _pfunName, _style) {
    funTree.getNodeByName(_pfunId).setNodeActive();
    editFuc("", {
        id: _pfunId,
        name: _pfunName
    }, _style);
}

// 编辑菜单
function editFuc(_funid, _pObj, _style) {
    var type = "new";
    if (_funid != null && _funid != "") {
        type = "edit";
        $("#div_head").html(
            "应用详情&nbsp;<span class=\"badge bg-green icon-pencil-square-o\"> 编辑</span>");
        editType = "edit";
    } else {
        _funid = "";
        editType = "new";
        $("#div_head").html("应用详情&nbsp;<span class=\"badge bg-red icon-plus\"> 新增</span>");
    }
    doRefresh(null, "DCFUNC", "getOneFun", "&in_type=" + type + "&funid="
        + _funid, function (_data) {
        if (_pObj != null) {
            _data.pmenu = _pObj.id;
            _data.pmenuname = _pObj.name;
        }
        setFunBase(_data, _style);
        $(document).scrollTop(0);
    });
}

function setFunBase(_data, _style) {
    $("#t_funid").val(_data.id);
    $("#t_pfunid").val(_data.pmenu);
    $("#l_pfun").html(_data.pmenuname);
    $("#t_funname").val(_data.name);
    $("#t_funseq").val(_data.seq);
    $("#t_funjs").val(_data.jsfun);
    $("#t_funicon").val(_data.img);
    $("#t_funpage").val(_data.url);
    $("#t_fundesc").val(_data.desc);

    // 下拉框
    // 级别
    if ($("#s_funclass option").length <= 0) {
        var _selHtml = "";
        for (var i = 0; i < _data.fclasssel.length; i++) {
            _selHtml += ("<option value=\"" + i + "\">" + _data.fclasssel[i] + "</option>");
        }
        $("#s_funclass").html(_selHtml);
    }
    $("#s_funclass").val(_data.fclass);
    // 类型
    if ($("#s_funstyle option").length <= 0) {
        var _selHtml = "";
        for (var i = 0; i < _data.styleobj.length; i++) {
            _selHtml += ("<option value=\"" + i + "\">" + _data.styleobj[i] + "</option>");
        }
        $("#s_funstyle").html(_selHtml);
    }
    if (editType == "new") {
        $("#s_funstyle").val(_style);
    }
    else {
        $("#s_funstyle").val(_data.style);
    }

    // 状态
    $(".radio > .button").removeClass("active");
    $("#s_funstate").val(_data.state);
    $("#s_funstate_" + _data.state).attr("checked", "checked");
    $("#s_funstate_" + _data.state).parent().addClass("active");
}

function commitFun() {
    if (checkForm("funbase-form") && confirm("是否保存应用")) {
        doRefresh(
            "funbase-form",
            "DCFUNC",
            "updateOneFunc",
            "&in_type=" + editType,
            function (_data) {
                if (_data.r == 0) {
                    var oneD = _data.data;
                    if (editType == "new") {
                        // 添加到对应的树节点上
                        var fun = "";
                        if (oneD.fclass == 0) {
                            fun = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createFunIni('"
                                + oneD.id
                                + "','"
                                + oneD.name
                                + "')\"> 新增</a>";
                        }
                        fun += "&nbsp;<a class=\"badge bg-red icon-times\" href=\"javascript:delete('"
                            + oneD.id + "')\">删除</a>";
                        funTree.getNodeByName($("#t_pfunid").val())
                            .addNode(oneD.id, oneD.name + fun,
                                "editFuc(\"" + oneD.id + "\")", "",
                                "", true);
                    } else {
                        var editNode = funTree.getNodeByName(oneD.id);
                        editNode.setShowStr(oneD.name);
                    }
                } else {
                    alert(_data.error);
                }
            });
    }

}
