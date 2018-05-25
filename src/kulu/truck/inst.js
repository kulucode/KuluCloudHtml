var editType = "new";
var thisTruck = "";
var orgTree = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部车辆";
jQuery(function ($) {
    $("#t_truckmuser").lookup({bsid: "DCUSER", opname: "searchUserLookUp", lname: "pg_text"});
    $("#t_truckorg").lookup({bsid: "DCUSER", opname: "searchOrgLookUp", paras: "", lname: "pg_text"});
    $(".wsdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    $("#div_orgtree").height($(document).height() - 141);
    getLoginUser("div_user", "TRUCK_INST", "TRUCK_MANG", function () {
        TruckIni();
        searchTruck();
    });

});

function TruckIni() {
    doRefresh(
        "",
        "TRUCK",
        "TruckIni",
        "", function (_data) {
            if (_data.r == 0) {
                var _html = "<option value=''>---请选择---</option>";
                var _defId = "";
                for (var i = 0; i < _data.truckdef.length; i++) {
                    var oneD = _data.truckdef[i];
                    if (_defId != "") {
                        _defId = oneD.id;
                    }
                    _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
                }
                $("#s_truckdef").html(_html);
                $("#s_truckdef").val("");
                //车牌颜色
                _html = "<option value=''>---请选择---</option>";
                for (var i = 0; i < _data.paltecolor.length; i++) {
                    var oneD = _data.paltecolor[i];
                    _html += "<option value='" + i + "'>" + _data.paltecolor[i] + "</option>";
                }
                $("#s_truckpcolor").html(_html);
                $("#s_truckpcolor").val("");
                //项目组列表
                // _html = "<option value=''>---请选择---</option>";
                // for (var i = 0; i < _data.groups.length; i++) {
                //     var oneD = _data.groups[i];
                //     _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
                // }
                // $("#t_truckorg").html(_html);
                // $("#t_truckorg").val("");
                //
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
            "searchTruckFromG('','全部员工')", "", "", true);
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
                            "searchTruckFromG('" + oneD.id + "','" + oneD.name + "')", "", "",
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
            "searchTruckFromG('" + oneSubD.id + "','" + oneSubD.name + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

function searchTruckFromG(_gid, _gname) {
    thisGroupId = _gid;
    thisGroupName = _gname;
    searchTruck();
}

//搜索车辆
function searchTruck(_page) {
    if (_page == null) {
        _page = $("#truck_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "TRUCK",
        "searchTruckList",
        "&pg_size=50&pg_num=" + (_page - 1) + "&pg_group=" + thisGroupId,
        function (_data) {
            clearTable("truck_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("truck_tab");
                    addTableCell("truck_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div>"
                        + "<div>车型：" + oneD.def + "</div>"
                        + "<div>车牌：" + oneD.platenum + "[" + oneD.platecolor + "]</div>"
                        + "<div>车架号：" + oneD.cjno + "</div>");
                    addTableCell("truck_tab", _oneTr, "no", "<div>入场日期:" + oneD.indate + "</div>" + "<div>生产日期:" + oneD.pdate + "</div>");
                    addTableCell("truck_tab", _oneTr, "muser", "<div>责任人:" + oneD.musername + "[" + oneD.muserid + "] " + oneD.muserphone + "</div>"
                        + "<div>机构:" + oneD.morgname + "</div>");
                    addTableCell("truck_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-little icon-edit\" onclick=\"editTruck('"
                        + oneD.id + "')\"> 编辑</button><div class='margin-little-top'>"
                        + (oneD.state == 0 ? "<button type=\"button\" class=\"icon-trash-o button bg-yellow button-little\" onclick=\"deleteOneTruck('"
                        + oneD.id + "','state')\"> 无效</button>" : "<button type=\"button\" class=\"icon-undo button bg-main button-little\" onclick=\"deleteOneTruck('"
                        + oneD.id + "','reset')\"> 还原</button><button type=\"button\" class=\"margin-little-left icon-times button bg-dot button-little\" onclick=\"deleteOneTruck('"
                        + oneD.id + "','delete')\"> 删除</button>")
                        + "</div><div class='margin-little-top'><button type=\"button\" class=\"icon-video-camera button bg-sub button-little\" onclick=\"doTruckVideo('"
                        + oneD.id + "','" + oneD.name + "')\"> 配置视频</button></div>");
                }
                setPage("truck_page", _data.max, 50, _page, "searchTruck");
                $(document).scrollTop(0);
            }
        });
}

// 编辑车辆
function editTruck(_defid) {
    editType = "new";
    var title = "新增车辆";
    if (_defid != null && _defid != "") {
        thisTruck = _defid;
        editType = "edit";
        title = "编辑车辆";
    }
    doRefresh(null, "TRUCK", "getTruckById", "&in_type=" + editType + "&truckid="
        + _defid, function (_data) {
        showTruckBase(_data, editType);
        openDialogs({
            id: "truck-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置车辆
function showTruckBase(_data, _type) {
    $("#t_truckid").val(_data.id);
    $("#t_truckname").val(_data.name);
    $("#t_truckinname").val(_data.inname);
    $("#t_truckno").val(_data.no);
    $("#t_truckcjno").val(_data.cjno);
    $("#s_truckdef").val(_data.def);
    $("#t_truckpnum").val(_data.platenum);
    $("#s_truckpcolor").val(_data.platecolor);
    $("#t_truckupno").val(_data.upno);
    $("#t_truckupdate").val(_data.uodate);
    $("#t_truckindate").val(_data.indate);
    $("#t_truckpdate").val(_data.pdate);
    $("#t_truckmuser_v").val(_data.muser);
    $("#t_truckmuser").val(_data.muserid == "" ? "" : _data.musername + "[" + _data.muserid + "]");
    $("#t_truckorg_v").val(_data.morg);
    $("#t_truckorg").val(_data.morgname);
    $("#t_area").val("430000");
}

//保存车辆
function commitTruck() {
    if ($("#t_truckorg_v").val() == "") {
        alert("机构输入无效。")
        return;
    }
    if (checkForm("truck-form") && confirm("是否保存车辆信息？")) {
        doRefresh("truck-form", "TRUCK", "updateTruck", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("truck-base");
                searchTruck();
            } else {
                alert(_data.error);
            }
        });
    }
}

function doTruckVideo(_id, _name) {
    thisTruck = _id;
    openDialogs({
        id: "video-dlg",
        title: "为车辆【" + _name + "】配置视频",
        width: "60%",
        father: ""
    }, function () {
        return true;
    });
    searchTruckVideo();
}

function searchTruckVideo() {
    doRefresh(null, "TRUCK", "searchTruckVideoList", "&truckid="
        + thisTruck, function (_data) {
        clearTable("video_tab");
        if (_data.r == 0) {
            for (var i = 0; i < _data.list.length; i++) {
                var oneD = _data.list[i];
                var _oneTr = addTableRow("video_tab");
                addTableCell("video_tab", _oneTr, "voide", "<div class=\"text-strong\">IP端口：" + oneD.ip + ":" + oneD.port + "</strong>"
                    + "<div>用户名：" + oneD.user + ";密码：" + oneD.key + "</div>"
                    + (oneD.url != "" ? "<div>访问地址：" + oneD.url + "</div>" : ""));
                addTableCell("video_tab", _oneTr, "del",
                    "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editTruckVideo('"
                    + oneD.id + "')\"> 编辑</button>"
                    + "<div class='margin-little-top'><button type=\"button\" class=\"button bg-dot button-small icon-trash-o\" onclick=\"deleteTruckVideo('"
                    + oneD.id + "')\"> 删除</button></div>");
            }
            setPage("video_page", _data.list.length, _data.list.length, 1, "");
            $(document).scrollTop(0);
        }
    });
}

function deleteTruckVideo(_id) {
    if (confirm("删除该视频服务，是否确认？")) {
        doRefresh("video-form", "TRUCK", "deleteTruckVideo", "&videoid=" + _id, function (_data) {
            if (_data.r == 0) {
                searchTruckVideo();
            } else {
                alert(_data.error);
            }
        });
    }
}

// 编辑数据字典
function editTruckVideo(_vid) {
    var title = "新增视频服务";
    editType = "new";
    $("#p_dicitemnid").hide();
    if (_vid != null && _vid != "") {
        editType = "edit";
        title = "编辑数视频服务";
        $("#p_dicitemnid").show();
    }
    doRefresh(null, "TRUCK", "getTruckVideoById", "&in_type=" + editType + "&videoid="
        + _vid, function (_data) {
        showTruckVideoBase(_data, editType);
        openDialogs({
            id: "videoedit-base",
            title: title,
            width: "50%",
            father: "",
            zindex: 1200
        }, function () {
            return true;
        });
    });
}

// 设置数据字典
function showTruckVideoBase(_data, _type) {
    $("#t_videoid").val(_data.id);
    $("#t_struckid").val(thisTruck);
    $("#t_videoip").val(_data.ip);
    $("#t_videoport").val(_data.port);
    $("#t_videouser").val(_data.user);
    $("#t_videokey").val(_data.key);
    $("#t_videourl").val(_data.url);
}

//保存数据字典项目
function commitTruckVideo() {
    if (checkForm("videoedit-form") && confirm("是否保存视频服务器？")) {
        doRefresh("videoedit-form", "TRUCK", "updateTruckVideo", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("videoedit-base");
                searchTruckVideo();
            } else {
                alert(_data.error);
            }
        });
    }
}

function deleteOneTruck(_id, _type) {
    var isOk = true;
    if (_type == "delete") {
        isOk = confirm("彻底删除后无法还原，是否继续？");
    }
    if (isOk) {
        doRefresh(
            "",
            "TRUCK",
            "deleteOneTruck",
            "&pg_inst=" + _id + "&pg_type=" + _type,
            function (_data) {
                if (_data.r == 0) {
                    searchTruck();
                } else {
                    alert(_data.error);
                }
            }
        );
    }
}


