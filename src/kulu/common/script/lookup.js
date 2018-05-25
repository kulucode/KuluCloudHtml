//加载组织机构选择
var orgSelTree = null;
var callBackFun = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "";

function getOrgSelectDlg(_compId, _root, _thisOrg, _thisUser, _retFun, _type) {
    orgSelTree = null;
    getParent().$('#orgselect-dlg').remove();
    var _html = "<div id=\"orgselect-dlg\"><div class=\"dialog\"><div class=\"dialog-head\">";
    _html += "<span class=\"close rotate-hover\"></span> <strong></strong></div>";
    _html += "<div class=\"dialog-body text-large\" defheight=\"0\" style=\"overflow: auto;\">";
    _html += "<div class=\"panel-body padding-little\" id=\"div_orgselecttree\"></div>";
    _html += "</div></div></div></div>";
    getParent().$("body").append(_html);
    getParent().openDialogs({
        id: "orgselect-dlg",
        title: "选择机构",
        width: "50%",
        father: "",
        zindex: 3000
    }, function () {
        return true;
    });
    iniOrgSelTree(_compId, _root, _thisOrg, _thisUser, _retFun, _type);
}

function iniOrgSelTree(_compId, _root, _thisOrg, _thisUser, _retFun, _type) {
    orgSelTree = new BSTreeView("orgSelTree", "", false, "", "div_orgselecttree");
    orgSelTree.imagePath = webHome + "/common/images/tree/";
    orgSelTree
        .addRootNode(
            "root",
            _root,
            "closeSelOrgDlg('','" + _root + "','" + _retFun + "')", "", "", true);
    orgSelTree.DrawTree(true);
    if (_compId != "") {
        getOrgSelTree(_compId, _thisOrg, _thisUser, _retFun, _type);
    }
}

function getOrgSelTree(_compId, _thisOrg, _thisUser, _retFun, _type) {
    doRefresh(
        "",
        "DCUSER",
        "getOrgTree",
        "&in_compid=" + _compId,
        function (_data) {
            if (_data.r == 0) {
                var root = orgSelTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    if (_thisOrg != oneD.id) {
                        var sub = root
                            .addNode(
                                oneD.id,
                                oneD.name,
                                "closeSelOrgDlg('" + oneD.id + "','" + oneD.name + "','" + _retFun + "')", "", "",
                                true);
                        if (oneD.cnum > 0) {
                            _setSelChildOrg(sub, oneD.children, _compId, _thisOrg, _thisUser, _retFun, _type);
                        }
                    }
                }
            }
            else {
                showErrDlg(_data);
            }
            $(document).scrollTop(0);
        });
}

function _setSelChildOrg(_pnode, _nodes, _compId, _thisOrg, _thisUser, _retFun, _type) {
    for (var j = 0; j < _nodes.length; j++) {
        var oneSubD = _nodes[j];
        if (_thisOrg != oneSubD.id) {
            var subNode = _pnode.addNode(
                oneSubD.id,
                oneSubD.name,
                "closeSelOrgDlg('" + oneSubD.id + "','" + oneSubD.name + "','" + _retFun + "')",
                "", "", true);
            if (oneSubD.cnum > 0) {
                _setSelChildOrg(subNode, oneSubD.children, _compId, _thisOrg, _thisUser, _retFun, _type);
            }
        }
    }
}

function closeSelOrgDlg(_id, _name, _retFun) {
    eval(_retFun + "('" + _id + "','" + _name + "')");
    closeDialog("orgselect-dlg");
}

/*---------用户选择---------------------*/
function getUserSelectDlg(_paras, _orgparas, _retFun) {
    callBackFun = _retFun;
    orgSelTree = null;
    getParent().$('#selectuser-base').remove();
    var _html = "<div id=\"selectuser-base\"><div class=\"dialog\"><div class=\"dialog-head\">";
    _html += "<span class=\"close rotate-hover\"></span> <strong></strong></div>";
    _html += "<div class=\"dialog-body\" defheight=\"0\" style=\"overflow-y:auto;padding: 1px;\"><div class=\"x4\"><div class=\"panel margin-small\"><div class=\"panel-head\">机构树</div><div class=\"panel-body padding-little\" id=\"div_orgseltree\"></div></div></div>";
    _html += "<div class=\"x8\"><div class=\"panel margin-small\"><div class=\"panel-head padding-little\" style=\"height:40px;\">";
    _html += "<div class=\"x5\">";
    _html += "<input type=\"hidden\" id=\"t_lookuppara\" name=\"t_lookuppara\"/>";
    _html += "<div class=\"x9 input-group\">";
    _html += "<input type=\"text\" style=\"width:500px;\" class=\"input input-auto\" name=\"pg_text\" id=\"pg_text2\" placeholder=\"关键词\" value=\"\"/><span class=\"addbtn\" style=\"vertical-align: top;\">";
    _html += "<input class=\"button bg-sub\" onclick=\"searchUser(1)\" type=\"button\" value=\"搜索\"/></span>";
    _html += "</div></div></div>";
    _html += "<table id=\"seluser_tab_h\" class=\"table table-striped table-hover table-responsive\"><tr>";
    _html += "<th style=\"width:30px;\" title=\"点击全选\"><input id=\"ch_all\" type=\"checkbox\"></th><th>员工</th><th style=\"width:18px;padding: 0px;\">&nbsp;</th></tr></table>";
    _html += "<div style=\"overflow-y:scroll;\">";
    _html += "<table id=\"seluser_tab\" head=\"seluser_tab_h\" dh=\"265\" class=\"table table-striped table-hover table-responsive\">";
    _html += "<tr><td title=\"\" colspan=\"8\">加载数据……</td></tr></table>";
    _html += "</div>";
    _html += "<div id=\"seluser_page\" class=\"panel-foot\"></div></div></div></div>";
    _html += "<div class=\"dialog-foot\">";
    _html += "<button class=\"button bg-main text-white icon-check\" onclick=\"selectCheckUser();\"> 确认</button>";
    _html += "</div></div></div>";
    getParent().$("body").append(_html);
    $("#t_lookuppara").val(_paras);
    $("#t_lookuppara").attr("orgparas", _orgparas);
    getParent().openDialogs({
        id: "selectuser-base",
        title: "选择员工",
        width: "80%",
        father: "",
        zindex: 3000
    }, function () {
        return true;
    });
    UserLookUpIni();
}

//选择用户
function UserLookUpIni() {
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
                iniSelUserOrgTree("div_orgseltree");
            }
        });
}


function iniSelUserOrgTree(_div) {
    orgSelTree = new BSTreeView("orgSelTree", "", false, "", _div);
    orgSelTree.imagePath = webHome + "/common/images/tree/";
    orgSelTree
        .addRootNode(
            "root",
            thisComp.name,
            "searchUserFromG('','全部员工')", "", "", true);
    orgSelTree.DrawTree(true);
    if (thisComp.id != "") {
        getOrgUserSelTree();
    }
}

function getOrgUserSelTree() {
    var _paras = $("#t_lookuppara").attr("orgparas");
    if (_paras == null) {
        _paras = "";
    }
    doRefresh(
        "",
        "DCUSER",
        "getOrgTree",
        "&in_compid=" + thisComp.id + _paras,
        function (_data) {
            if (_data.r == 0) {
                var root = orgSelTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name,
                            "searchUserFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
                            true);
                    if (oneD.cnum > 0) {
                        _setOrgUserSelChildOrg(sub, oneD.children);
                    }
                }
            }
            else {
                showErrDlg(_data);
            }
            $(document).scrollTop(0);
        });
}

function _setOrgUserSelChildOrg(_pnode, _nodes) {
    for (var j = 0; j < _nodes.length; j++) {
        var oneSubD = _nodes[j];
        var subNode = _pnode.addNode(
            oneSubD.id,
            oneSubD.name,
            "searchUserFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setOrgUserSelChildOrg(subNode, oneSubD.children);
        }
    }
}

function searchUserFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchUser();
}

function searchUser(_page) {
    if (_page == null) {
        _page = $("#seluser_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "DCUSER",
        "searchUser",
        $("#t_lookuppara").val() + "&pg_group=" + thisGroupId + "&pg_size=20&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("seluser_tab", 0);
            if (_data.r == 0) {
                for (var i = 0; i < _data.data.length; i++) {
                    var oneD = _data.data[i];
                    var checkStr = "<input type=\"checkbox\" id=\"ch_" + oneD.instid + "\" chtype=\"seluserid\" name=\"ch_" + oneD.id + "\" value='" + JSON.stringify(oneD) + "'";
                    if (oneD.sel == 1) {
                        //选中
                        checkStr += " checked=\"checked\"";
                    }
                    checkStr += " />";
                    var _oneTr = addTableRow("seluser_tab");
                    addTableCell("seluser_tab", _oneTr, "check", checkStr);
                    addTableCell("seluser_tab", _oneTr, "nick", oneD.name + "["
                        + oneD.id + "]；联系电话：" + oneD.link);
                }
                setPage("seluser_page", _data.max, 20, _page, "searchUser");
                $(document).scrollTop(0);
            }
        });
}

function selectCheckUser() {
    var selRoleIds = {};
    if (confirm("是否选择员工？")) {
        var selRole = $("#seluser_tab input[chtype='seluserid']:checked").each(function (i) {
            selRoleIds[$(this).attr("id")] = JSON.parse($(this).val());
        });
        if (callBackFun != null) {
            callBackFun(selRoleIds);
            searchUser();
            getParent().closeDialog("selectuser-base");

        }
    }
}

/*---------车辆选择---------------------*/
function getTruckSelectDlg(_paras, _retFun) {
    callBackFun = _retFun;
    orgSelTree = null;
    getParent().$('#selecttruck-base').remove();
    var _html = "<div id=\"selecttruck-base\"><div class=\"dialog\"><div class=\"dialog-head\">";
    _html += "<span class=\"close rotate-hover\"></span> <strong></strong></div>";
    _html += "<div class=\"dialog-body\" defheight=\"0\" style=\"overflow-y:auto;padding: 1px;\"><div class=\"x4\"><div class=\"panel margin-small\"><div class=\"panel-head\">机构树</div><div class=\"panel-body padding-little\" id=\"div_orgseltree\"></div></div></div>";
    _html += "<div class=\"x8\"><div class=\"panel margin-small\"><div class=\"panel-head padding-little\" style=\"height:40px;\">";
    _html += "<div class=\"x5\">";
    _html += "<input type=\"hidden\" id=\"t_lookuppara\" name=\"t_lookuppara\"/>";
    _html += "<div class=\"x9 input-group\">";
    _html += "<input type=\"text\" style=\"width:500px;\" class=\"input input-auto\" name=\"pg_text\" id=\"pg_text2\" placeholder=\"关键词\" value=\"\"/><span class=\"addbtn\" style=\"vertical-align: top;\">";
    _html += "<input class=\"button bg-sub\" onclick=\"searchTruck(1)\" type=\"button\" value=\"搜索\"/></span>";
    _html += "</div></div></div>";
    _html += "<table id=\"seluser_tab_h\" class=\"table table-striped table-hover table-responsive\"><tr>";
    _html += "<th style=\"width:30px;\" title=\"点击全选\"><input id=\"ch_all\" type=\"checkbox\"></th><th>车辆</th><th style=\"width:18px;padding: 0px;\">&nbsp;</th></tr></table>";
    _html += "<div style=\"overflow-y:scroll;\">";
    _html += "<table id=\"seluser_tab\" head=\"seluser_tab_h\" dh=\"265\" class=\"table table-striped table-hover table-responsive\">";
    _html += "<tr><td title=\"\" colspan=\"8\">加载数据……</td></tr></table>";
    _html += "</div>";
    _html += "<div id=\"seluser_page\" class=\"panel-foot\"></div></div></div></div>";
    _html += "<div class=\"dialog-foot\">";
    _html += "<button class=\"button bg-main text-white icon-check\" onclick=\"selectCheckTruck();\"> 确认</button>";
    _html += "</div></div></div>";
    getParent().$("body").append(_html);
    $("#t_lookuppara").val(_paras);
    getParent().openDialogs({
        id: "selecttruck-base",
        title: "选择车辆",
        width: "80%",
        father: "",
        zindex: 3000
    }, function () {
        return true;
    });
    TruckLookUpIni();
}

//选择用户
function TruckLookUpIni() {
    doRefresh(
        "",
        "DCUSER",
        "UserIni",
        "",
        function (_data) {
            if (_data.r == 0) {
                thisComp = _data.comp;
                $("#t_orgcomp").val(thisComp.id);
                searchTruck();
                iniOrgTreeByTruck("div_orgseltree");
            }
        });
}


function iniOrgTreeByTruck(_div) {
    orgSelTree = new BSTreeView("orgSelTree", "", false, "", _div);
    orgSelTree.imagePath = webHome + "/common/images/tree/";
    orgSelTree
        .addRootNode(
            "root",
            thisComp.name,
            "searchTruckFromG('','全部车辆')", "", "", true);
    orgSelTree.DrawTree(true);
    if (thisComp.id != "") {
        getOrgTreeByTruck();
    }
}

function getOrgTreeByTruck() {
    doRefresh(
        "",
        "DCUSER",
        "getOrgTree",
        "&in_compid=" + thisComp.id,
        function (_data) {
            if (_data.r == 0) {
                var root = orgSelTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name,
                            "searchTruckFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
                            true);
                    if (oneD.cnum > 0) {
                        _setChildOrgByTruck(sub, oneD.children);
                    }
                }
            }
            else {
                showErrDlg(_data);
            }
            $(document).scrollTop(0);
        });
}

function _setChildOrgByTruck(_pnode, _nodes) {
    for (var j = 0; j < _nodes.length; j++) {
        var oneSubD = _nodes[j];
        var subNode = _pnode.addNode(
            oneSubD.id,
            oneSubD.name,
            "searchTruckFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrgByTruck(subNode, oneSubD.children);
        }
    }
}

function searchTruckFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchTruck();
}

function searchTruck(_page) {
    if (_page == null) {
        _page = $("#seluser_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "TRUCK",
        "searchTruckList",
        $("#t_lookuppara").val() + "&pg_group=" + thisGroupId + "&pg_size=50&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("seluser_tab", 0);
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var checkStr = "<input type=\"checkbox\" id=\"ch_" + oneD.id + "\" chtype=\"seltruckid\" name=\"ch_" + oneD.id + "\" value='" + JSON.stringify(oneD) + "'";
                    if (oneD.sel == 1) {
                        //选中
                        checkStr += " checked=\"checked\"";
                    }
                    checkStr += " />";
                    var _oneTr = addTableRow("seluser_tab");
                    addTableCell("seluser_tab", _oneTr, "check", checkStr);
                    addTableCell("seluser_tab", _oneTr, "nick", oneD.name + "["
                        + oneD.platenum + "]");
                }
                setPage("seluser_page", _data.max, 50, _page, "searchTruck");
                $(document).scrollTop(0);
            }
        });
}

function selectCheckTruck() {
    var selRoleIds = {};
    if (confirm("是否选择车辆？")) {
        var selRole = $("#seluser_tab input[chtype='seltruckid']:checked").each(function (i) {
            selRoleIds[$(this).attr("id")] = JSON.parse($(this).val());
        });
        if (callBackFun != null) {
            callBackFun(selRoleIds);
            searchTruck();
            getParent().closeDialog("selecttruck-base");

        }
    }
}
