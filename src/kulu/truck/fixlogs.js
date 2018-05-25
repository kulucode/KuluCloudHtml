var editType = "new";
var thisInspect = "";
var orgTree = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部车辆";
jQuery(function ($) {
    $("#t_fluser").lookup({bsid: "DCUSER", opname: "searchUserLookUp", lname: "pg_text"});
    $("#t_fltruck").lookup({bsid: "TRUCK", opname: "searchTruckLookUp", lname: "pg_text"});
    $(".wsdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    $("#div_orgtree").height($(document).height() - 141);
    getLoginUser("div_user", "TRUCK_FIXLOGS", "TRUCK_MANG", function () {
        FixLogsIni();
        searchTruckFixLogs();
    });

});

function FixLogsIni() {
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
            "searchFixLogsFromG('','全部员工')", "", "", true);
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
                            "searchFixLogsFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
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
            "searchFixLogsFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

function searchFixLogsFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchTruckFixLogs();
}

//搜索车辆
function searchTruckFixLogs(_page) {
    if (_page == null) {
        _page = $("#fixlogs_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "TRUCK",
        "searchTruckFixLogsList",
        "&pg_size=50&pg_num=" + (_page - 1) + "&pg_group=" + thisGroupId,
        function (_data) {
            clearTable("fixlogs_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("fixlogs_tab");
                    addTableCell("fixlogs_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.truckname + "</strong></div>"
                        + "<div>车型：" + oneD.truckdef + "</div>"
                        + "<div>车牌：" + oneD.platenum + "</div>");
                    addTableCell("fixlogs_tab", _oneTr, "pdate", "<div><strong>" + oneD.name + "[" + oneD.type + "]</strong></div>"
                        + "<div>时间:" + oneD.date + "</div>"
                        + "<div>操作人:" + oneD.musername + "[" + oneD.muserid + "] " + oneD.muserphone + "</div>");
                    addTableCell("fixlogs_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editTruckFixLogs('"
                        + oneD.id + "')\"> 编辑</button>");
                }
                setPage("fixlogs_page", _data.max, 50, _page, "searchTruckFixLogs");
                $(document).scrollTop(0);
            }
        });
}

// 编辑维修记录
function editTruckFixLogs(_instid) {
    editType = "new";
    var title = "新增维修记录";
    if (_instid != null && _instid != "") {
        thisInst = _instid;
        editType = "edit";
        title = "编辑维修记录";
    }
    doRefresh(null, "TRUCK", "getTruckFixLogsById", "&in_type=" + editType + "&fixlogsid="
        + _instid, function (_data) {
        showFixLogsBase(_data, editType);
        openDialogs({
            id: "fixlogs-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置维修记录
function showFixLogsBase(_data, _type) {
    $("#t_flid").val(_data.id);
    $("#t_flname").val(_data.name);
    $("#t_fldate").val(_data.date);
    $("#t_fltext").val(_data.content);
    $("#t_flmoney").val(_data.money);
    //关联用户
    $("#t_fluser_v").val(_data.userinst);
    $("#t_fluser").val(_data.user);
    //关联车辆
    $("#t_fltruck_v").val(_data.truckid);
    $("#t_fltruck").val(_data.truckname);

    //
    var _html = "<option value='' >---请选择---</option>";
    for (var i = 0; i < _data.TYPE_LIST.length; i++) {
        var oneD = _data.TYPE_LIST[i];
        _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
    }
    $("#s_fltype").html(_html);
    $("#s_fltype").val(_data.type);

    //文件
    $('#i_flimgf').html("");
    for (var i = 0; i < _data.files.length; i++) {
        var oneD = _data.files[i];
        var _html = "";
        _html += "<div style='float: left;' class=\"margin-left margin-little-top\" title=\"\">";
        _html += "<div class=\"media clearfix img-border radius-little\" style=\"line-height:140px;cursor:pointer;vertical-align: middle;height:150px;width: 150px;\">";
        _html += "<img onload=\"resetImgSizeObj($(this),140,140);\" src=\"" + oneD.url + "\" class=\"\" style=\"display:block;\"/>";
        _html += "</div></div>";
        $('#i_flimgf').append(_html);
    }
}

//保存维修记录
function commitTruckFixLogs() {
    if (checkForm("fixlogs-form") && confirm("是否保存维修记录信息？")) {
        doRefreshFile("fixlogs-form", "TRUCK", "updateTruckFixlogs", "&in_type="
            + editType, "f_cfile_p", function (_data) {
            if (_data.r == 0) {
                resetFile("f_flfimg");
                closeDialog("fixlogs-base");
                searchTruckFixLogs();
            } else {
                alert(_data.error);
            }
        });
    }

}


