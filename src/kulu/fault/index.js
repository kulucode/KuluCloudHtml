var editType = "new";
var faultFunTree = null;
var thisInst = "";
var FaultTypeList = null;
jQuery(function ($) {
    $("#t_faultfruser").lookup({bsid: "DCUSER", opname: "searchUserLookUp", lname: "pg_text"});
    $("#t_faultopuser").lookup({bsid: "DCUSER", opname: "searchUserLookUp", lname: "pg_text"});
    $("#t_faulteqp").lookup({bsid: "EQUIPMENT", opname: "searchEqpInstLookUp", lname: "pg_text"});
    $("#t_faulttruck").lookup({bsid: "TRUCK", opname: "searchTruckLookUp", lname: "pg_text"});
    $(".wsdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    getLoginUser("div_user", "FAULT_MANG", "", function () {
        FaultIni();
    });
});

function FaultIni() {
    doRefresh(
        "",
        "FAULT",
        "FaultIni",
        "", function (_data) {
            if (_data.r == 0) {
                FaultTypeList = _data.frtype;
                var _html = "<option value=''>---请选择---</option>";
                $.each(_data.frtype, function (name, value) {
                    var oneD = value;
                    _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
                });
                $("#s_frtype").html(_html);
                $("#s_frtype").val("");
                //
                _html = "<option value=''>---请选择---</option>";
                $("#s_frfault").html(_html);
                $("#s_frfault").val("");
                //
                var _html = "<option value=''>---请选择---</option>";
                for (var i = 0; i < _data.opstate.length; i++) {
                    _html += "<option value='" + i + "'>" + _data.opstate[i] + "</option>";
                }
                $("#s_faultopstate").html(_html);
                $("#s_faultopstate").val("");
                //
                var _html = "";
                for (var i = 0; i < _data.opstate.length; i++) {
                    _html += "<option value='" + i + "'>" + _data.opstate[i] + "</option>";
                }
                $("#pg_state").html(_html);
                $("#pg_state").val("0");
                searchFault();
            }
        });
}

//搜索报警
function searchFault(_page) {
    if (_page == null) {
        _page = $("#fault_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "frmBusiness",
        "FAULT",
        "searchFaultReportList",
        "&pg_size=20&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("fault_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("fault_tab");
                    addTableCell("fault_tab", _oneTr, "name", "<div>" + oneD.name + "[" + oneD.id + "]</div>"
                        + "<div>发生时间:" + oneD.hdate + "</div>"
                        + "<div class='text-gray'>定义:" + oneD.faule + "；来源" + oneD.from + "</div>"
                        + "<div>类别:" + oneD.type + "</div>");
                    addTableCell("fault_tab", _oneTr, "msg", "<div>提交人：" + oneD.cuser + "</div>"
                        + "<div>关联人：" + oneD.fruser + "</div>"
                        + "<div>关联车：" + oneD.frtruck + "</div>"
                        + "<div>关联设备：" + oneD.freqp + "</div>");
                    addTableCell("fault_tab", _oneTr, "op", "<div>处理状态：" + oneD.opstate + "</div>"
                        + "<div>处理人：" + oneD.opuser + "</div>"
                        + "<div>处理人：" + oneD.opdate + "</div>");
                    addTableCell("fault_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small\" onclick=\"editFault('"
                        + oneD.id + "')\">编辑</button>"
                        + (oneD.opstatev != 1 ? "<div><button type=\"button\" class=\"button bg-main button-small margin-little-top\" onclick=\"doFaultOP('"
                        + oneD.id + "')\">处理</button></div>" : ""));
                }
                setPage("fault_page", _data.max, 20, _page, "searchFault");
                $(document).scrollTop(0);
            }
        });
}

// 编辑报警
function editFault(_instid) {
    editType = "new";
    var title = "新增报警";
    if (_instid != null && _instid != "") {
        thisInst = _instid;
        editType = "edit";
        title = "编辑报警";
    }
    doRefresh(null, "FAULT", "getFaultReportById", "&in_type=" + editType + "&faultid="
        + _instid, function (_data) {
        showFaultBase(_data, editType);
        openDialogs({
            id: "fault-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置报警
function showFaultBase(_data, _type) {
    resetFile("f_faultfimg");
    resetFile("f_faultopfimg");
    $("#t_faultid").val(_data.id);
    $("#t_faultname").val(_data.name);
    $("#t_faulthdate").val(_data.hdate);
    $("#t_faultedate").val(_data.edate);
    $("#s_frtype").val(_data.type);
    if (_data.from == "") {
        $("#s_faultfrom").val("56292F72534CE416A551A21EE17298B7");
    }
    else {
        $("#s_faultfrom").val(_data.from);
    }
    selectFaultType();
    $("#s_frfault").val(_data.faule);
    $("#t_faulttext").val(_data.content);
    //关联设备
    $("#t_faulteqp_v").val(_data.freqpinst);
    $("#t_faulteqp").val(_data.freqp);
    //关联用户
    $("#t_faultfruser_v").val(_data.fruserinst);
    $("#t_faultfruser").val(_data.fruser);
    //关联车辆
    $("#t_faulttruck_v").val(_data.frtruckid);
    $("#t_faulttruck").val(_data.frtruck);

    //处理用户
    $("#t_faultopuser_v").val(_data.opuserinst);
    $("#t_faultopuser").val(_data.opuser);
    $("#s_faultopstate").val(_data.opstate);
    $("#t_faultopdate").val(_data.opdate);
    $("#t_faultoptext").val(_data.optext);
    //文件
    $('#i_faultimgf').html("");
    for (var i = 0; i < _data.ffiles.length; i++) {
        var oneD = _data.ffiles[i];
        var _html = "";
        _html += "<div style='float: left;' class=\"margin-left margin-little-top\" title=\"\">";
        _html += "<div class=\"media clearfix img-border radius-little\" style=\"line-height:140px;cursor:pointer;vertical-align: middle;height:150px;width: 150px;\">";
        _html += "<img onload=\"resetImgSizeObj($(this),140,140);\" src=\"" + oneD.url + "\" class=\"\" style=\"display:block;\"/>";
        _html += "</div></div>";
        $('#i_faultimgf').append(_html);
    }
    $('#i_faultimgopf').html("");
    for (var i = 0; i < _data.opfiles.length; i++) {
        var oneD = _data.opfiles[i];
        var _html = "";
        _html += "<div style='float: left;' class=\"margin-left margin-little-top\" title=\"\">";
        _html += "<div class=\"media clearfix img-border radius-little\" style=\"line-height:140px;cursor:pointer;vertical-align: middle;height:150px;width: 150px;\">";
        _html += "<img onload=\"resetImgSizeObj($(this),140,140);\" src=\"" + oneD.url + "\" class=\"\" style=\"display:block;\"/>";
        _html += "</div></div>";
        $('#i_faultimgopf').append(_html);
    }
}

//保存报警
function commitFaultReport() {
    if (checkForm("faultbase-form") && confirm("是否保存报警信息？")) {
        doRefreshFile("faultbase-form", "FAULT", "updateFaultReport", "&in_type="
            + editType, "f_cfile_p", function (_data) {
            if (_data.r == 0) {
                resetFile("f_faultfimg");
                closeDialog("fault-base");
                searchFault();
            } else {
                alert(_data.error);
            }
        });
    }

}

function setUserOrg(_org) {
    var _html = "<option value=''>---请选择---</option>";
    if ($("#t_eqpmuser_v").val() != "") {
        doRefresh(null, "DCUSER", "getOrgList", "&pg_user="
            + $("#t_eqpmuser_v").val(), function (_data) {
            if (_data.r == 0) {
                var _defId = "";
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    if (_defId != "") {
                        _defId = oneD.id;
                    }
                    _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
                }
                $("#s_eqpmorg").html(_html);
                if (_org != null && _org != "") {
                    $("#s_eqpmorg").val(_org);
                }

            } else {
                alert(_data.error);
            }
        });
    }
}

function getFaultParas(_vehickeId, _name) {
    doRefresh(null, "VEHICLE", "getFaultParas", "&vehickeid=" + _vehickeId, function (_data) {
        if (_data.r == 0) {
            $("#t_dicitem_0").val(_data.gps_date);
            $("#t_dicitem_1").val(_data.oil_date);

        } else {
            alert(_data.error);
        }
    });
    openDialogs({
        id: "faultparas-base",
        title: "【" + _name + "】参数设置",
        width: "50%",
        father: "",
    }, function () {
        searchFault();
        return true;
    });
}

function commitFaultParas() {
    if (checkForm("faultparas-form") && confirm("是否保存报警参数信息？")) {
        doRefresh("faultparas-form", "WATCH", "updateFaultParas", "", function (_data) {
            if (_data.r != 0) {
                alert(_data.error);
            }
            else {
                closeDialog("faultparas-base");
            }
        });
    }
}

function selectFaultType() {
    $(".div_sel").hide();
    var _t = $("#s_frtype").val();
    if (_t == "12D24119E79CFA25144A19EDDEA53A94" || _t == "A93012F52325FBCA228CB09A89FF408E") {
        //设备
        $("#div_freqp").show();
    }
    else if (_t == "1AA40EFE45EE2BA75E1C4ADE20F796C2") {
        //车辆
        $("#div_frtruck").show();
    }
    else if (_t == "2B27A3287D25F3EA18C8FDAFA1EEB25F") {
        //人员
        $("#div_fruser").show();
    }
    setFaultId();
}

function setFaultId() {
    var _t = $("#s_frtype").val();
    var _html = "<option value=''>---请选择---</option>";
    var frid = FaultTypeList[_t];
    if (frid != null) {
        for (var i = 0; i < frid.frfault.length; i++) {
            var oneD = frid.frfault[i];
            _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
        }
    }
    $("#s_frfault").html(_html);
    $("#s_frfault").val("");

}