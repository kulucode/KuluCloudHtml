var editType = "new";
var thisTruckDef = "";
jQuery(function ($) {
    // opener = null;
    // window.history.forward();
    $("#t_defsdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    getLoginUser("div_user", "TRUCK_DEF", "TRUCK_MANG", function () {
        searchTruckDef();
    });

});

//搜索车型
function searchTruckDef() {
    doRefresh(
        "",
        "TRUCK",
        "searchTruckDefineList",
        "",
        function (_data) {
            clearTable("truckdef_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("truckdef_tab");
                    addTableCell("truckdef_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div>"
                        + "<div>开售时间:" + oneD.sdate + "</div>");
                    addTableCell("truckdef_tab", _oneTr, "desc", "<div>型号:" + oneD.no + "</div>"
                        + "<div>邮箱面积:" + oneD.oilmj + "平方毫米；百公里油耗:" + oneD.oilde + "升</div>");
                    addTableCell("truckdef_tab", _oneTr, "company", "<div>" + oneD.company + "|" + oneD.brand + "</div>"
                        + "<div>规定日工作时长:" + oneD.worktime + "小时</div>");
                    addTableCell("truckdef_tab", _oneTr, "edit",
                        "<div><button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editTruckDef('"
                        + oneD.id + "')\"> 编辑</button></div>"
                        + "<div class='margin-little-top'><button type=\"button\" class=\"icon-wrench button bg-sub button-small\" onclick=\"doInspectDef('"
                        + oneD.id + "','" + oneD.name + "')\"> 保养规程</button>");
                }
                setPage("truckdef_page", _data.list.length, _data.list.length, 1, "");
                $(document).scrollTop(0);
            }
        });
}

// 编辑车型
function editTruckDef(_defid) {
    editType = "new";
    var title = "新增车型";
    if (_defid != null && _defid != "") {
        thisTruckDef = _defid;
        editType = "edit";
        title = "编辑车型";
        $("#t_defid").attr("readonly", "readonly");
    }
    doRefresh(null, "TRUCK", "getTruckDefineById", "&in_type=" + editType + "&defid="
        + _defid, function (_data) {
        showTruckDefBase(_data, editType);
        openDialogs({
            id: "truckdef-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置车型
function showTruckDefBase(_data, _type) {
    $("#t_defid").val(_data.id);
    $("#t_defname").val(_data.name);
    $("#t_defno").val(_data.no);
    $("#t_defcomp").val(_data.company);
    $("#t_defsdate").val(_data.sdate);
    $("#t_defoilmj").val(_data.oilmj);
    $("#t_defoilde").val(_data.oilde);
    $("#t_defbrand").val(_data.brand);
    $("#t_defworktime").val(_data.worktime);
}

//保存车型
function commitTruckDef() {
    if (checkForm("truckdef-form") && confirm("是否保存车型信息？")) {
        doRefresh("truckdef-form", "TRUCK", "updateTruckDefine", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("truckdef-base");
                searchTruckDef();
            } else {
                alert(_data.error);
            }
        });
    }

}

// 编辑车型
function doInspectDef(_defId, _defName) {
    thisTruckDef = _defId;
    openDialogs({
        id: "inspectdef-base",
        title: _defName + "-保养规程",
        width: "60%",
        father: "",
    }, function () {
        return true;
    });
    searchInspectDefList();
}

function searchInspectDefList() {
    clearTable("inspect_tab");
    doRefresh("inspect-form", "INSPECT", "searchInspectDefList", "&pg_truckdef=" + thisTruckDef, function (_data) {
        if (_data.r == 0) {
            for (var i = 0; i < _data.list.length; i++) {
                var oneD = _data.list[i];
                var _oneTr = addTableRow("inspect_tab");
                addTableCell("inspect_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div>"
                    + "<div>级别:" + oneD.defclass + "</div>"
                    + "<div>状态:" + oneD.state + "</div>");
                addTableCell("inspect_tab", _oneTr, "cycle", "<div>" + oneD.cycle + "小时</div>");
                addTableCell("inspect_tab", _oneTr, "mileage", "<div>" + oneD.mileage + "公里</div>");
                addTableCell("inspect_tab", _oneTr, "sub", "<div>下级规程:" + oneD.subdef + "</div>"
                    + "<div>下级数量:" + oneD.subcount + "</div>");
                addTableCell("inspect_tab", _oneTr, "edit",
                    "<div><button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editInspectDef('"
                    + oneD.id + "')\"> 编辑</button></div>"
                    + "<div class='margin-little-top'><button type=\"button\" class=\"icon-trash-o button bg-dot button-small\" onclick=\"deleteInspectDef('"
                    + oneD.id + "')\"> 删除</button>");
            }
            setPage("inspect_page", _data.list.length, _data.list.length, 1, "");
            $(document).scrollTop(0);
        }
    });
}

// 编辑车型
function editInspectDef(_defid) {
    editType = "new";
    var title = "新增保养规程";
    if (_defid != null && _defid != "") {
        editType = "edit";
        title = "编辑保养规程";
        $("#t_defid").attr("readonly", "readonly");
    }
    doRefresh(null, "INSPECT", "getInspectDefineById", "&in_type=" + editType + "&idefid="
        + _defid, function (_data) {
        showInspectDefBase(_data, editType);
        openDialogs({
            id: "inspectdefedit-base",
            title: title,
            width: "50%",
            father: "",
            zindex: 1200
        }, function () {
            return true;
        });
    });
}

// 设置车型
function showInspectDefBase(_data, _type) {
    var _html = "";
    for (var i = 0; i < _data.CLASS_NAME.length; i++) {
        _html += "<option value='" + i + "'>" + _data.CLASS_NAME[i] + "</option>";
    }
    $("#s_idefclass").html(_html);
    //
    _html = "";
    for (var i = 0; i < _data.STATE_NAME.length; i++) {
        _html += "<option value='" + i + "'>" + _data.STATE_NAME[i] + "</option>";
    }
    $("#s_idefstate").html(_html);

    $("#t_idefid").val(_data.id);
    $("#t_idefname").val(_data.name);
    $("#t_itruckdef").val(thisTruckDef);
    $("#s_idefstate").val(_data.state);
    $("#s_idefclass").val(_data.defclass);
    $("#t_idefcycle").val(_data.cycle);
    $("#t_idefmil").val(_data.mileage);
    $("#t_idefdesc").val(_data.desc);
    //
    $("#t_idefsubcount").val(_data.subcount);
    setSubDefList(_data.subdefid);
}

//得到下级选项
function setSubDefList(_thisSubDef) {
    var _html = "<option value=''>---请选择---</option>";
    doRefresh(null, "INSPECT", "searchInspectDefList", "&pg_subclass=" + $("#s_idefclass").val() + "&pg_truckdef="
        + thisTruckDef, function (_data) {
        if (_data.r == 0) {
            for (var i = 0; i < _data.list.length; i++) {
                var oneD = _data.list[i];
                _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
            }
            $("#s_idefsubdef").html(_html);
            $("#s_idefsubdef").val(_thisSubDef);
        }
    });
}

//保存车型
function commitInspectDef() {
    if (checkForm("inspectdefedit-form") && confirm("是否保存车型信息？")) {
        doRefresh("inspectdefedit-form", "INSPECT", "updateInspectDefine", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("inspectdefedit-base");
                searchInspectDefList();
            } else {
                alert(_data.error);
            }
        });
    }
}

//保存车型
function deleteInspectDef(_defid) {
    if (confirm("是否删除该检修规程？") && confirm("注意：将一并删除车辆保养计划！是否继续？")) {
        doRefresh(null, "INSPECT", "deleteInspectDefine", "&idefid="
            + _defid, function (_data) {
            if (_data.r == 0) {
                searchInspectDefList();
            } else {
                alert(_data.error);
            }
        });
    }
}

function iniInspectPlanFromDef() {
    if (confirm("是否初始化车辆保养计划？")) {
        doRefresh(null, "INSPECT", "iniInspectPlanFromDef", "&pg_truckdef="
            + thisTruckDef, function (_data) {
            if (_data.r == 0) {
                alert("初始化成功！");
            } else {
                alert(_data.error);
            }
        });
    }
}



