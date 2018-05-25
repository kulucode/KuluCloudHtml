var editType = "new";
var roleFunTree = null;
var thisRole = "";
jQuery(function ($) {
    getLoginUser("div_user", "ROLE_MANG", "SYSTEM");
    searchRole();
});

//搜索角色
function searchRole() {
    doRefresh(
        "",
        "DCROLE",
        "searchRoleList",
        "",
        function (_data) {
            clearTable("role_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.data.length; i++) {
                    var oneD = _data.data[i];
                    var _oneTr = addTableRow("role_tab");
                    addTableCell("role_tab", _oneTr, "name", oneD.name + "<br/>["
                        + oneD.id + "]");
                    addTableCell("role_tab", _oneTr, "desc", oneD.desc);
                    addTableCell("role_tab", _oneTr, "state", oneD.statev == 0 ? "<div class='text-dot'>" + oneD.state + "</div>" : oneD.state);
                    addTableCell("role_tab", _oneTr, "edit",
                        "<a type=\"button\" class=\"button bg-main button-small\" href=\"javascript:editRole('"
                        + oneD.id + "')\">编辑</a>");
                    addTableCell("role_tab", _oneTr, "power",
                        oneD.statev == 1 ? "<a type=\"button\" class=\"button bg-main button-small icon-key\" href=\"javascript:toPower('"
                            + oneD.id + "','" + oneD.name + "')\"> 权限</a>" : "<a type=\"button\" class=\"button bg-dot button-small icon-trash-o\" href=\"javascript:deleteRole('"
                            + oneD.id + "','" + oneD.name + "')\"> 删除</a>");

                }
                $(document).scrollTop(0);
            }
        });
}

// 编辑角色
function editRole(_roleid) {
    editType = "new";
    var title = "新增角色";
    if (_roleid != null && _roleid != "") {
        thisRole = _roleid;
        editType = "edit";
        title = "编辑角色";
    }
    doRefresh(null, "DCROLE", "getRoleById", "&in_type=" + editType + "&roleid="
        + _roleid, function (_data) {
        showRoleBase(_data, editType);
        openDialogs({
            id: "role-base",
            title: title,
            width: "40%",
            father: "",
        }, function () {
            searchRole();
            return true;
        });
    });
}

// 设置角色
function showRoleBase(_data, _type) {
    $("#t_roleid").val(_data.id);
    $("#t_rolename").val(_data.name);
    $("#t_roledesc").val(_data.desc);

    $(".radio > .button").removeClass("active");
    $("#t_rolestate").val(_data.state);
    $("#t_rolestate_" + _data.state).attr("checked", "checked");
    $("#t_rolestate_" + _data.state).parent().addClass("active");
}

//保存角色
function commitRole() {
    if (confirm("是否保存角色信息？")) {
        doRefresh("rolebase-form", "DCROLE", "updateRole", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("role-base");
                searchRole();
            } else {
                alert(_data.error);
            }
        });
    }
}

function deleteRole(_id, _name) {
    if (confirm("是否删除该无效的角色【" + _name + "】？") && confirm("删除后不可恢复，是否继续？")) {
        doRefresh("", "DCROLE", "deleteRole", "&roleid="
            + _id, function (_data) {
            if (_data.r == 0) {
                searchRole();
            } else {
                alert(_data.error);
            }
        });
    }
}

//初始化树
function iniTree(_name, _div) {
    $("#" + _div).html("");
    roleFunTree = new BSTreeView(_name, "", false, "", _div);
    roleFunTree.imagePath = webHome + "/common/images/tree/";
    var root = roleFunTree
        .addRootNode(
            "root",
            "平台应用&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:void(0);\"></a>",
            "", "", "", true);
    ptFun = root.addNode(
        "plateroot",
        "后台管理功能",
        "", "", "",
        true);
    webFun = root.addNode(
        "webroot",
        "前端管理功能",
        "", "", "",
        true);
    roleFunTree.DrawTree(true);
}

//得到功能权限树
function toPower(_roleid, _roleName) {
    thisRole = _roleid;
    openDialogs({
        id: "rolefunc-base",
        title: "角色：" + _roleName + " 功能权限",
        width: "40%",
        father: "",
    });
    iniTree("roleFunTree", "div_rolefunctree");
    doRefresh(
        "",
        "DCROLE",
        "getRoleFunTree",
        "&pg_style=0&roleid=" + _roleid,
        function (_data) {
            if (_data.r == 0) {
                _getTreeNodes(ptFun, _data.data);
            }
            else {
                alert(_data.error);
            }
        });
    doRefresh(
        "",
        "DCROLE",
        "getRoleFunTree",
        "&pg_style=1&roleid=" + _roleid,
        function (_data) {
            if (_data.r == 0) {
                _getTreeNodes(webFun, _data.data);

            }
            else {
                alert(_data.error);
            }
        });
}

//递归展示下级
function _getTreeNodes(_pNode, _list) {
    for (var i = 0; i < _list.length; i++) {
        var oneD = _list[i];
        // 添加菜单
        var nameStr = oneD.text;
        var nameEx = "<span class=\"badge bg-green icon-plus\" onclick=\"changeFunPower('"
            + oneD.id
            + "','" + oneD.text + "',1)\"> 赋权</span>";
        if (oneD.sel == 1) {
            //选中
            nameStr = "<font style='color:green;' >" + nameStr + "[已赋权]</font>";
            nameEx = "<span class=\"badge bg-red icon-plus\"  onclick=\"changeFunPower('"
                + oneD.id
                + "','" + oneD.text + "',0)\"> 取消</span>";
        }
        var sub = _pNode
            .addNode(
                oneD.id,
                nameStr
                + "&nbsp;" + nameEx, "", "",
                true);
        if (oneD.sub != null && oneD.sub.length > 0) {
            _getTreeNodes(sub, oneD.sub);
        }
    }
}

//赋权/取消
function changeFunPower(_funcid, _funcname, _type) {
    doRefresh(
        "",
        "DCROLE",
        "updateRoleFunc",
        "&roleid=" + thisRole + "&funcid=" + _funcid + "&in_type=" + _type,
        function (_data) {
            if (_data.r == 0) {
                var nameStr = _funcname;
                var nameEx = "<span class=\"badge bg-green icon-plus\" onclick=\"changeFunPower('"
                    + _funcid
                    + "','" + _funcname + "',1)\"> 赋权</span>";
                if (_data.type == 1) {
                    //选中
                    nameStr = "<font style='color:green;' >" + nameStr + "[已赋权]</font>";
                    nameEx = "<span class=\"badge bg-red icon-plus\" onclick=\"changeFunPower('"
                        + _funcid
                        + "','" + _funcname + "',0)\"> 取消</span>";
                }
                //修改状态
                var node = roleFunTree.getNodeByName(_funcid);
                node.setShowStr(nameStr + "&nbsp;" + nameEx);
            }
            else {
                alert(_data.error);
            }
        });
}