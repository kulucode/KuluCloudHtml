var editType = "new";
var orgTree = null;
var thisInst = "";
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部手表";
jQuery(function ($) {
    $("#t_eqpmuser").lookup({bsid: "DCUSER", opname: "searchUserLookUp", lname: "pg_text", exfun: "setUserOrg"});
    $("#t_eqpmorg").lookup({bsid: "DCUSER", opname: "searchOrgLookUp", lname: "pg_text"});
    $("#t_eqppdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    $("#t_dicitem_9,#t_dicitem_10").datetimepicker({
        lang: 'ch',
        format: 'H:i',
        datepicker: false
    });
    getLoginUser("div_user", "WATCH_EQP", "EQP_MANG", function () {
        EqpInstIni();
        UserIni();
        searchWatch();
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
                iniOrgTree("orgTree", "div_orgtree");
            }
        });
}

function EqpInstIni() {
    doRefresh(
        "",
        "EQUIPMENT",
        "searchEqpDefineList",
        "&pg_type=EQUIPMENT_DEFTYPE_1", function (_data) {
            if (_data.r == 0) {
                var _html = "<option value=''>---请选择---</option>";
                var _defId = "";
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    if (_defId != "") {
                        _defId = oneD.id;
                    }
                    _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
                }
                thisComp = _data.comp;
                $("#s_eqpdef").html(_html);
                $("#s_eqpdef").val(_defId);
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
            "searchWatchFromG('','全部手表')", "", "", true);
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
                            "searchWatchFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
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
            "searchWatchFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

/**手表***/
function searchWatchFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchWatch();
}

//搜索手表
function searchWatch(_page) {
    if (_page == null) {
        _page = $("#watch_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "WATCH",
        "searchWatchWordParasList",
        "&pg_group=" + thisGroupId + "&pg_size=50&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("watch_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("watch_tab");
                    var _im = oneD.wycode.split("|");
                    addTableCell("watch_tab", _oneTr, "ma", "<div class='text-big'>责任人:" + oneD.musername + "[" + oneD.muserid + "] " + oneD.muserphone + "</div>"
                        + "<div>机构:" + oneD.morgname + "</div>");
                    addTableCell("watch_tab", _oneTr, "state", oneD.statename + "<div>" + oneD.online + "</div>");
                    addTableCell("watch_tab", _oneTr, "name", "<div>" + oneD.name + " [剩余电量:" + oneD.ele + "%]</div>"
                        + "<div>IMEI:" + _im[0] + "，IMSI:" + _im[1] + "</div>"
                        + "<div>物联网号码:" + oneD.phone + "</div>"
                        + "<div class='text-gray'>条码:" + oneD.qr + "</div>");
                    addTableCell("watch_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-little\" onclick=\"editEqpInst('"
                        + oneD.eqpid + "')\">编辑</button><div class='margin-little-top'>"
                        + (oneD.state == 0 ? "<button type=\"button\" class=\"icon-trash-o button bg-yellow button-little\" onclick=\"deleteOneWatch('"
                        + oneD.eqpid + "','state')\"> 无效</button>" : "<button type=\"button\" class=\"icon-undo button bg-main button-little\" onclick=\"deleteOneWatch('"
                        + oneD.eqpid + "','reset')\"> 还原</button><button type=\"button\" class=\"margin-little-left icon-times button bg-dot button-little\" onclick=\"deleteOneWatch('"
                        + oneD.eqpid + "','delete')\"> 删除</button>")
                        + "</div><div><button type=\"button\" class=\"button bg-main button-little margin-little-top\" onclick=\"showWatchMsg('"
                        + oneD.eqpid + "')\">实时状态</button></div>");
                }
                setPage("watch_page", _data.max, 50, _page, "searchWatch");
                $(document).scrollTop(0);
            }
        });
}

// 编辑手表
function editEqpInst(_instid) {
    editType = "new";
    var title = "新增手表";
    if (_instid != null && _instid != "") {
        thisInst = _instid;
        editType = "edit";
        title = "编辑手表";
    }
    doRefresh(null, "EQUIPMENT", "getOneEqpInst", "&in_type=" + editType + "&eqpid="
        + _instid, function (_data) {
        showEqpInstBase(_data, editType);
        openDialogs({
            id: "watch-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置手表
function showEqpInstBase(_data, _type) {
    $("#t_eqpid").val(_data.id);
    $("#t_eqpwycode").val(_data.wycode);
    $("#t_eqptoken").val(_data.token);
    var _im = _data.wycode.split("|");
    $("#t_eqpname").val(_data.name);
    $("#t_eqpimei").val(_im[0]);
    $("#t_eqpimsi").val(_im[1]);
    $("#s_eqpdef").val(_data.def);
    $("#t_eqpqr").val(_data.qr);
    $("#t_eqpphone").val(_data.phone);
    $("#t_eqppdate").val(_data.pdate);
    $("#t_eqpmuser_v").val(_data.muser);
    $("#t_eqpmuser").val(_data.muserid == "" ? "" : _data.musername + "[" + _data.muserid + "]");
    $("#t_eqpmorg_v").val(_data.morg);
    $("#t_eqpmorg").val(_data.morgallname);

}

//保存手表
function commitEqpInst() {
    $("#t_eqpwycode").val($("#t_eqpimei").val() + "|" + $("#t_eqpimsi").val());
    $("#t_eqptoken").val($("#t_eqpwycode").val());
    if (checkForm("watchbase-form") && confirm("是否保存手表信息？")) {
        doRefresh("watchbase-form", "EQUIPMENT", "updateEqpInst", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("watch-base");
                searchWatch();
            } else {
                alert(_data.error);
            }
        });
    }

}

function setUserOrg(_org) {
    if ($("#t_eqpmuser_v").val() != "") {
        doRefresh(null, "DCUSER", "getOneOrgByUser", "&pg_user="
            + $("#t_eqpmuser_v").val(), function (_data) {
            if (_data.r == 0) {
                $("#t_eqpmorg_v").val(_data.id);
                $("#t_eqpmorg").val(_data.allname);
            } else {
                alert(_data.error);
            }
        });
    }
}

function getWatchParas(_dicId, _name) {
    doRefresh(null, "WATCH", "getWatchParas", "&dicid=" + _dicId, function (_data) {
        if (_data.r == 0) {
            $("#t_dicitem_0").val(_data.hr_max);
            $("#t_dicitem_1").val(_data.hr_min);
            $("#t_dicitem_2").val(_data.hr_date);
            $("#t_dicitem_3").val(_data.bpo_h);
            $("#t_dicitem_4").val(_data.bpo_l);
            $("#t_dicitem_6").val(_data.bpo_date);
            $("#t_dicitem_7").val(_data.step_date);
            $("#t_dicitem_8").val(_data.gps_date);
            $("#t_dicitem_9").val(_data.gps_workondate);
            $("#t_dicitem_10").val(_data.gps_workoutdate);
        } else {
            alert(_data.error);
        }
    });
    openDialogs({
        id: "watchparas-base",
        title: "【" + _name + "】参数设置",
        width: "50%",
        father: "",
    }, function () {
        searchWatch();
        return true;
    });
}

function commitWatchParas() {
    if (checkForm("watchparas-form") && confirm("是否保存手表参数信息？")) {
        doRefresh("watchparas-form", "WATCH", "updateWatchParas", "", function (_data) {
            if (_data.r != 0) {
                alert(_data.error);
            }
            else {
                closeDialog("watchparas-base");
            }
        });
    }
}

function showWatchMsg() {
    window.open(webHome + "/storage/equipment/watchtest.html", "dlg_watch");
}

function deleteOneWatch(_id, _type) {
    var isOk = true;
    if (_type == "delete") {
        isOk = confirm("彻底删除后无法还原，是否继续？");
    }
    if (isOk) {
        doRefresh(
            "",
            "WATCH",
            "deleteOneWatch",
            "&pg_inst=" + _id + "&pg_type=" + _type,
            function (_data) {
                if (_data.r == 0) {
                    searchWatch();
                }
                else {
                    alert(_data.error);
                }
            }
        );
    }
}