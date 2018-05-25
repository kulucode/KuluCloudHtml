var editType = "new";
var orgTree = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部员工";
var userOrgTree = null;
var thisUserId = "";

jQuery(function ($) {
    $("#t_birthday").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d',
    });
    getLoginUser("div_user", "FUN_USER", "SYSTEM", function () {
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
            thisComp.name + (thisComp.id != "" ? "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('root','无')\"> 新增</a>" : ""),
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
                    // 添加菜单
                    var _bt = "";
                    if (oneD.id != "deleteorg") {
                        var _bt = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "')\"> 新增</a>";
                        _bt += "&nbsp;<a class=\"badge bg-blue icon-edit\" href=\"javascript:editOrg('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "')\"> 编辑</a>";
                        if (oneD.cnum <= 0) {
                            _bt += "&nbsp;<a class=\"badge bg-red icon-times\" href=\"javascript:delOrgDef('"
                                + oneD.id + "','" + oneD.name + "')\">删除</a>";
                        }
                    }
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name + _bt,
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
        var _bt = "";
        if (oneSubD.id != "deleteorg") {
            _bt = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('"
                + oneSubD.id
                + "','"
                + oneSubD.name
                + "')\"> 新增</a>";
            _bt += "&nbsp;<a class=\"badge bg-blue icon-edit\" href=\"javascript:editOrg('"
                + oneSubD.id
                + "','"
                + oneSubD.name
                + "')\"> 编辑</a>";
            if (oneSubD.cnum <= 0) {
                _bt += "&nbsp;<a class=\"badge bg-red icon-times\" href=\"javascript:delOrgDef('"
                    + oneSubD.id + "','" + oneSubD.name + "')\">删除</a>";
            }
        }
        var subNode = _pnode.addNode(
            oneSubD.id,
            oneSubD.name
            + _bt,
            "searchUserFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

function createOrgIni(_porgid, _pfunName) {
    orgTree.getNodeByName(_porgid).setNodeActive();
    editOrg("", {
        id: _porgid,
        name: _pfunName
    });
}


// 编辑菜单
function editOrg(_orgid, _pObj) {
    var type = "new";
    var _title = "";
    if (_orgid != null && _orgid != "") {
        type = "edit";
        _title = "编辑机构";
        editType = "edit";
        thisGroupId = _orgid;
    } else {
        _orgid = "";
        editType = "new";
        _title = "新增机构";
    }
    doRefresh(null, "DCUSER", "getOneOrg", "&in_type=" + type + "&orgid="
        + _orgid, function (_data) {
        if (_pObj != null) {
            _data.pid = _pObj.id;
            _data.pname = _pObj.name;
        }
        openDialogs({
            id: "org-base",
            title: _title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
        setOrgBase(_data);
        $(document).scrollTop(0);
    });
}

function setOrgBase(_data) {
    // 上级
    $("#t_porgid").val(_data.pid);
    $("#t_porgname").val(_data.pname);
    $("#l_porg").html(_data.pname);
    //
    $("#t_orgid").val(_data.id);
    $("#t_orgname").val(_data.name);
    $("#l_orgallname").html("机构完整名：" + _data.allname);
    $("#t_orgdesc").val(_data.desc);
}

function commitOrg() {
    if (checkForm("orgbase-form") && confirm("是否保存机构")) {
        doRefresh(
            "orgbase-form",
            "DCUSER",
            "updateOneOrg",
            "&in_type=" + editType,
            function (_data) {
                if (_data.r == 0) {
                    closeDialog("org-base");
                    var oneD = _data.data;
                    if (editType == "new") {
                        // 添加到对应的树节点上
                        var fun = "";
                        fun = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "')\"> 新增</a>";
                        fun += "&nbsp;<a class=\"badge bg-blue icon-edit\" href=\"javascript:editOrg('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "')\"> 编辑</a>";
                        fun += "&nbsp;<a class=\"badge bg-red icon-times\" href=\"javascript:delete('"
                            + oneD.id + "')\">删除</a>";
                        orgTree.getNodeByName($("#t_porgid").val())
                            .addNode(oneD.id, oneD.name + fun,
                                "editOrg(\"" + oneD.id + "\")", "",
                                "", true);
                    } else {
                        var editNode = orgTree.getNodeByName(oneD.id);
                        editNode.setShowStr(oneD.name);
                    }
                } else {
                    showErrDlg(_data);
                }
            });
    }

}

function delOrgDef(_id, _name) {
    if (_id != "") {
        if (confirm("是否删除该机构[" + _name + "]？") && confirm("基础数据删除将可能影响部分数据的正常显示，是否继续？")) {
            doRefresh(null, "DCUSER", "delOneOrg", "&orgid="
                + _id, function (_data) {
                if (_data.r == 0) {
                    location.reload();
                } else {
                    alert(_data.error);
                }
            });
        }
    }
    else {
        alert("没有可删除的工位！");
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
        "&pg_group=" + thisGroupId + "&pg_size=20&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("user_tab", 0);
            if (_data.r == 0) {
                for (var i = 0; i < _data.data.length; i++) {
                    var oneD = _data.data[i];
                    var _oneTr = addTableRow("user_tab");
                    addTableCell("user_tab", _oneTr, "nick", oneD.name + "["
                        + oneD.id + "]"
                        + "<div><button type=\"button\" class=\"button bg-main button-small\" onclick=\"editUser('"
                        + oneD.instid + "')\">编辑</button></div>");
                    addTableCell("user_tab", _oneTr, "sex", oneD.sex);
                    addTableCell("user_tab", _oneTr, "link", oneD.link);
                    addTableCell("user_tab", _oneTr, "point",
                        "<a type=\"button\" class=\"button button-small bg-main\" href=\"javascript:showPower('"
                        + oneD.name + "[" + oneD.id + "]" + "','" + oneD.instid + "');\">权限</a>");
                    addTableCell("user_tab", _oneTr, "money",
                        "<div><button type=\"button\" class=\"button bg-main button-small margin-little-top\" onclick=\"doUserOrg('"
                        + oneD.instid + "')\">机构</button></div>");
                    addTableCell("user_tab", _oneTr, "key",
                        "<a type=\"button\" class=\"button bg-main button-small\" href=\"javascript:changeUserKey('"
                        + oneD.instid + "')\">修改密码</a>");
                }
                setPage("user_page", _data.max, 20, _page, "searchUser");
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
    $(".radio > .button").removeClass("active");
    $("#t_usex").val(_data.sex);
    $("#t_usex_" + _data.sex).attr("checked", "checked");
    $("#t_usex_" + _data.sex).parent().addClass("active");
}

// 保存用户信息
function commitUserBase() {
    if (confirm("是否保存用户信息？")) {
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

function doSelOrgByOrg(_type) {
    getOrgSelectDlg(thisComp.id, thisComp.name, thisGroupId, "", "doSelOrgByOrgRet", 0);
}

function doSelOrgByOrgRet(_selId, _selOrg) {
    $("#t_porgid").val(_selId);
    $("#l_t_porgid").html(_selOrg);
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
                    addTableCell("dp_tab", _oneTr, "name", oneD.orgname);
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


