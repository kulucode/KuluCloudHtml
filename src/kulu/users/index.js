var editType = "new";
var orgTree = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部员工";
var userOrgTree = null;
var thisUserId = "";

jQuery(function ($) {
    $("#t_uorg").lookup({bsid: "DCUSER", opname: "searchOrgLookUp", paras: "", lname: "pg_text"});
    $("#t_birthday").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d',
    });
    $("#div_orgtree").height($(document).height() - 141);
    getLoginUser("div_user", "FUN_USER", "STAFF_MANG", function () {
        UserIni();
    });
});

function UserIni() {
    doRefresh(
        "",
        "DCUSER",
        "UserIni",
        "",
        function (_data) {
            if (_data.r == 0) {
                thisComp = _data.comp;
                $("#t_orgcomp").val(thisComp.id);
                searchUser();
                iniOrgTree("orgTree", "div_orgtree");
            }
        });
}

function iniOrgTree(_name, _div) {
    orgTree = new BSTreeView(_name, "", false, "", _div);
    orgTree.imagePath = webHome + "/common/images/tree/";
    orgTree
        .addRootNode(
            "root",
            thisComp.name,
            "searchUserFromG('','全部员工')", "", "", true);
    orgTree.DrawTree(true);
    if (thisComp.id != "") {
        getOrgTree();
    }
}

function getOrgTree() {
    doRefresh(
        "",
        "DCUSER",
        "getOrgTree",
        "&in_compid=" + thisComp.id,
        function (_data) {
            if (_data.r == 0) {
                var root = orgTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name,
                            "searchUserFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
                            true);
                    if (oneD.cnum > 0) {
                        _setChildOrg(sub, oneD.children);
                    }
                }
            }
            else {
                showErrDlg(_data);
            }
            $(document).scrollTop(0);
        });
}

function _setChildOrg(_pnode, _nodes) {
    for (var j = 0; j < _nodes.length; j++) {
        var oneSubD = _nodes[j];
        var subNode = _pnode.addNode(
            oneSubD.id,
            oneSubD.name,
            "searchUserFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

/**员工***/
function searchUserFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchUser();
}


function searchUser(_page) {
    if (_page == null) {
        _page = $("#user_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "DCUSER",
        "searchUser",
        "&pg_group=" + thisGroupId + "&pg_size=50&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("user_tab", 0);
            if (_data.r == 0) {
                for (var i = 0; i < _data.data.length; i++) {
                    var oneD = _data.data[i];
                    var _oneTr = addTableRow("user_tab");
                    var _bt = "";
                    if (oneD.state == 0) {
                        // _bt = "<button type=\"button\" class=\"button margin-left bg-dot button-little\" onclick=\"deleteOneUser('"
                        //     + oneD.instid + "','delete')\">删除</button>";
                        _bt += "<button type=\"button\" class=\"button margin-left bg-main button-little\" onclick=\"deleteOneUser('"
                            + oneD.instid + "','reset')\">还原</button>";
                    }
                    else {
                        _bt += "<button type=\"button\" class=\"button margin-left bg-yellow button-little\" onclick=\"deleteOneUser('"
                            + oneD.instid + "','state')\">无效</button>";
                    }
                    addTableCell("user_tab", _oneTr, "nick", oneD.name + "["
                        + oneD.id + "]"
                        + "<div>机构：" + oneD.orgallname + "</div>"
                        + "<div><button type=\"button\" class=\"button bg-main button-little\" onclick=\"editUser('"
                        + oneD.instid + "')\">编辑</button>" + _bt + "</div>");
                    addTableCell("user_tab", _oneTr, "sex", oneD.sex);
                    addTableCell("user_tab", _oneTr, "link", oneD.link);
                    addTableCell("user_tab", _oneTr, "point",
                        "<a type=\"button\" class=\"button button-small bg-main\" href=\"javascript:showPower('"
                        + oneD.name + "[" + oneD.id + "]" + "','" + oneD.instid + "');\">角色</a>");
                    addTableCell("user_tab", _oneTr, "money",
                        "<div><button type=\"button\" class=\"button bg-main button-small margin-little-top\" onclick=\"doUserOrg('"
                        + oneD.instid + "')\">监管</button></div>");
                    addTableCell("user_tab", _oneTr, "key",
                        "<a type=\"button\" class=\"button bg-main button-small\" href=\"javascript:changeUserKey('"
                        + oneD.instid + "')\">修改密码</a>");
                }
                setPage("user_page", _data.max, 50, _page, "searchUser");
                $(document).scrollTop(0);
            }
        });
}

// 编辑用户
function editUser(_userInstid) {
    editType = "new";
    var title = "新增用户";
    $("#t_uorg").val() == thisGroupId;
    if (_userInstid != null && _userInstid != "") {
        editType = "edit";
        title = "编辑用户";
    }
    doRefresh(null, "DCUSER", "getOneUser", "&in_type=" + editType + "&instid="
        + _userInstid, function (_data) {
        showUserBase(_data, editType);
        openDialogs({
            id: "user-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            searchUser();
            return true;
        });
    });
}

// 设置用户
function showUserBase(_data, _type) {
    $("#t_instid").val(_data.instid);
    $("#t_userid").val(_data.id);

    $("#t_uname").val(_data.name);
    $("#t_uemail").val(_data.email);
    $("#t_uphone").val(_data.phone);
    $("#t_uaddress").val(_data.desc);
    $("#t_idcard").val(_data.idcard);
    $("#t_birthday").val(_data.birthday);
    $("#t_usbflg").val(_data.sbflg);
    $("#t_uorg_v").val(_data.orgid);
    $("#t_uorg").val(_data.orgallname);

    $(".radio > .button").removeClass("active");
    $("#t_usex").val(_data.sex);
    $("#t_usex_" + _data.sex).attr("checked", "checked");
    $("#t_usex_" + _data.sex).parent().addClass("active");
}

// 保存用户信息
function commitUserBase() {
    if ($("#t_uorg_v").val() == "" && $("#t_uorg").val() != null) {
        alert("机构输入无效。")
        return;
    }
    if (checkForm("userbase-form") && confirm("是否保存用户信息？")) {
        doRefresh("userbase-form", "DCUSER", "updateUser", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("user-base");
                searchUser();
            } else {
                alert(_data.error);
            }
        });
    }

}

// 展示角色
function showPower(_userStr, _userInstId) {
    $("#t_roleuserid").val(_userInstId);
    doRefresh(null, "DCROLE", "getUserRoleList", "&in_roleuser=" + _userInstId, function (_data) {
        clearTable("user_role");
        if (_data.r == 0) {
            for (var i = 0; i < _data.data.length; i++) {
                var oneD = _data.data[i];
                var checkStr = "<input type=\"checkbox\" id=\"ch_" + oneD.id + "\" chtype=\"roleid\" name=\"ch_" + oneD.id + "\" value=\"" + oneD.id + "\"";
                if (oneD.sel == 1) {
                    //选中
                    checkStr += " checked=\"checked\"";
                }
                checkStr += " />";
                var _oneTr = addTableRow("user_role");
                addTableCell("user_role", _oneTr, "check", checkStr);
                addTableCell("user_role", _oneTr, "name", oneD.name);
                addTableCell("user_role", _oneTr, "desc", oneD.desc);
            }
            $(document).scrollTop(0);

        }
        openDialogs({
            id: "user-power",
            title: _userStr + "用户角色",
            width: "50%",
            father: "",
        }, function () {
            //searchUser();
            return true;
        });
    });
}

//保存角色
function commitRoles() {
    var selRoleIds = "";
    var selRole = $("#user_role input[chtype='roleid']:checked").each(function (i) {
        if (0 == i) {
            selRoleIds = $(this).val();
        } else {
            selRoleIds += ("," + $(this).val());
        }
    });
    $("#t_roleids").val(selRoleIds);
    doRefresh("userrole-form", "DCROLE", "updateUserRole", "", function (_data) {
        if (_data.r == 0) {
            alert("保存成功");
            closeDialog("user-power");
        }
        else {
            alert(_data.error);
        }
    });
}

//修改密码窗口
function changeUserKey(_id) {
    thisUser = _id;
    $("#t_userkey").val("");
    $("#t_userkey2").val("");
    openDialogs({
        id: "userkey-base",
        title: "修改用户密码",
        width: "40%",
        father: "",
        ini: true
    }, function () {
        return true;
    });
}

function updateUserKey() {
    if (confirm("是否更新用户密码？") && checkForm("userkey-form")) {
        doRefresh("userkey-form", "DCUSER", "changeKey", "&in_uid=" + thisUser, function (_data) {
            if (_data.r == 0) {
                closeDialog("userkey-base");
                searchUser();
            } else {
                showErrDlg(_data.error);
            }

        });
    }
}

function doUserOrg(_userInstId) {
    thisUserId = _userInstId;
    openDialogs({
        id: "dp-base",
        title: "用户机构关系",
        width: "70%",
        father: "",
        ini: true
    }, function () {
        return true;
    });
    $("#div_dorgtree,#div_dptab,#div_arr").css("height", ($("#dp-base .dialog-body").height() - 50));
    iniUserOrgTree();
    searchUserOrgList();
}

function searchUserOrgR() {

}

function iniUserOrgTree() {
    userOrgTree = null;
    $("#div_dorgtree").html("");
    userOrgTree = new BSTreeView("userOrgTree", "", false, "", "div_dorgtree");
    userOrgTree.imagePath = webHome + "/common/images/tree/";
    userOrgTree
        .addRootNode(
            "root",
            thisComp.name,
            "", "", "", true);
    userOrgTree.DrawTree(true);
    if (thisComp.id != "") {
        getUserOrgTree();
    }
}

function getUserOrgTree() {
    doRefresh(
        "",
        "DCUSER",
        "getOrgTree",
        "&in_compid=" + thisComp.id,
        function (_data) {
            if (_data.r == 0) {
                var root = userOrgTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name,
                            "selectUserOrg('" + oneD.id + "','" + oneD.name + "')", "", "",
                            true);
                    if (oneD.cnum > 0) {
                        _setUserOrgChildOrg(sub, oneD.children);
                    }
                }
            }
            else {
                showErrDlg(_data);
            }
            $(document).scrollTop(0);
        });
}

function _setUserOrgChildOrg(_pnode, _nodes) {
    for (var j = 0; j < _nodes.length; j++) {
        var oneSubD = _nodes[j];
        var subNode = _pnode.addNode(
            oneSubD.id,
            oneSubD.name,
            "selectUserOrg('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setUserOrgChildOrg(subNode, oneSubD.children);
        }
    }
}

function searchUserOrgList() {
    clearTable("dp_tab");
    doRefresh(
        "",
        "DCUSER",
        "searchUserOrgList",
        "&pg_type=1&pg_userinstid=" + thisUserId,
        function (_data) {
            if (_data.r == 0) {
                for (var i = 0; i < _data.data.length; i++) {
                    var oneD = _data.data[i];
                    var _oneTr = addTableRow("dp_tab");
                    addTableCell("dp_tab", _oneTr, "name", oneD.orgallname);
                    addTableCell("dp_tab", _oneTr, "type", oneD.type);
                    addTableCell("dp_tab", _oneTr, "edit", "<div><button type=\"button\" class=\"button button-small bg-main icon-trash-o\" onclick=\"deleteUserOrg('"
                        + oneD.userinstid + "','" + oneD.orgid + "')\"> 删除</button></div>");
                }
            }
        }
    );
}

function selectUserOrg(_orgId, _orgName) {
    doRefresh(
        "",
        "DCUSER",
        "selectUserOrg",
        "&pg_userinstid=" + thisUserId + "&pg_org=" + _orgId,
        function (_data) {
            if (_data.r == 0) {
                searchUserOrgList();
            }
        }
    );
}

function deleteUserOrg(_userInst, _orgId) {
    doRefresh(
        "",
        "DCUSER",
        "deleteUserOrg",
        "&pg_userinstid=" + _userInst + "&pg_org=" + _orgId,
        function (_data) {
            if (_data.r == 0) {
                searchUserOrgList();
            }
        }
    );

}

function deleteOneUser(_id, _type) {
    var isOk = true;
    if (_type == "delete") {
        //alert("");
        // if (confirm("彻底删除后无法还原，是否继续？")) {
        // }
    }
    doRefresh(
        "",
        "DCUSER",
        "deleteOneUser",
        "&pg_inst=" + _id + "&pg_type=" + _type,
        function (_data) {
            if (_data.r == 0) {
                searchUser();
            } else {
                alert(_data.error);
            }
        }
    );

}


