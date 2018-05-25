var editType = "new";
var thisInspect = "";
var orgTree = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部车辆";
jQuery(function ($) {
    $("#t_planopuser").lookup({bsid: "DCUSER", opname: "searchUserLookUp", lname: "pg_text"});
    $(".wsdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    $("#div_orgtree").height($(document).height() - 141);
    getLoginUser("div_user", "TRUCK_INSPECT", "TRUCK_MANG", function () {
        InspectIni();
        searchInspect();
    });

});

function InspectIni() {
    doRefresh(
        "",
        "TRUCK",
        "TruckIni",
        "", function (_data) {
            if (_data.r == 0) {
                thisComp = _data.comp;
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
            "searchInspectFromG('','全部员工')", "", "", true);
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
        "&pg_type=1,2&in_compid=" + thisComp.id,
        function (_data) {
            if (_data.r == 0) {
                var root = orgTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name,
                            "searchInspectFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
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
            "searchInspectFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

function searchInspectFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchInspect();
}

//搜索车辆
function searchInspect(_page) {
    if (_page == null) {
        _page = $("#inspect_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "INSPECT",
        "searchInspectPlanList",
        "&pg_size=50&pg_num=" + (_page - 1) + "&pg_state=0&pg_group=" + thisGroupId,
        function (_data) {
            clearTable("inspect_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("inspect_tab");
                    addTableCell("inspect_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.truckname + "</strong></div>"
                        + "<div>车型：" + oneD.truckdef + "</div>"
                        + "<div>车牌：" + oneD.platenum + "</div>");
                    addTableCell("inspect_tab", _oneTr, "pdate", "<div><strong>计划日期:" + oneD.plandate + "</strong></div>"
                        + "<div>保养规程:" + oneD.defname + "</div>"
                        + "<div>创建日期:" + oneD.cdate + "</div>");
                    addTableCell("inspect_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small icon-check\" onclick=\"doCheckInspectPlan('"
                        + oneD.id + "')\"> 确认</button>"
                        + "<div class='margin-little-top'><button type=\"button\" class=\"icon-paw button bg-sub button-small\" onclick=\"doResetInspectPlan('"
                        + oneD.id + "','" + oneD.name + "')\"> 手工触发</button>");
                }
                setPage("inspect_page", _data.max, 50, _page, "searchInspect");
                $(document).scrollTop(0);
            }
        });
}

function doCheckInspectPlan(_planId) {
    $("#t_planid").val(_planId);
    $("#t_planopuser_v").val(thisLogUser.instid);
    $("#t_planopuser").val(thisLogUser.name + "[" + thisLogUser.id + "]");
    openDialogs({
        id: "inspect-base",
        title: "确认车辆保养计划",
        width: "50%",
        father: ""
    }, function () {
        return true;
    });
}

function commitInspectPlanOP() {
    if (checkForm("inspect-form") && confirm("是否确认该次保养，并开启下一次计划？")) {
        doRefresh("inspect-form", "INSPECT", "updateInspectPlanOP", "",
            function (_data) {
                if (_data.r == 0) {
                    closeDialog("inspect-base");
                    searchInspect();
                } else {
                    alert(_data.error);
                }
            }
        );
    }
}

function doResetInspectPlan(_planId) {
    $("#t_plan2id").val(_planId);
    $("#t_planop2date").val("");
    openDialogs({
        id: "inspect2-base",
        title: "手工触发车辆保养计划",
        width: "50%",
        father: ""
    }, function () {
        return true;
    });
}

function resetInspectPlan(_planId) {
    if (checkForm("inspect2-form") && confirm("是否手工触发下次保养？")) {
        doRefresh("inspect2-form", "INSPECT", "resetInspectPlan", "",
            function (_data) {
                if (_data.r == 0) {
                    closeDialog("inspect2-base");
                    searchInspect();
                } else {
                    alert(_data.error);
                }
            }
        );
    }
}

