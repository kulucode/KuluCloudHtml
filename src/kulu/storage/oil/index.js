var editType = "new";
var oilFunTree = null;
var thisInst = "";
jQuery(function ($) {
    $("#t_eqppdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    getLoginUser("div_user", "OIL_EQP", "EQP_MANG", function () {
        EqpInstIni();
        searchOil();
    });
});

function EqpInstIni() {
    doRefresh(
        "",
        "EQUIPMENT",
        "searchEqpDefineList",
        "&pg_type=EQUIPMENT_DEFTYPE_2", function (_data) {
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
                $("#s_eqpdef").html(_html);
                $("#s_eqpdef").val(_defId);
            }
        });
}

//搜索液面传感器
function searchOil(_page) {
    if (_page == null) {
        _page = $("#oil_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "EQUIPMENT",
        "searchEqpInstList",
        "&pg_eqptye=EQUIPMENT_DEFTYPE_2&pg_size=20&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("oil_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("oil_tab");
                    addTableCell("oil_tab", _oneTr, "ma", "<div>关联车辆:" + oneD.mtruckname + "</div>");
                    addTableCell("oil_tab", _oneTr, "pdate", oneD.pdate);
                    addTableCell("oil_tab", _oneTr, "state", oneD.style + "<div>" + oneD.online + "</div>");
                    addTableCell("oil_tab", _oneTr, "name", oneD.name
                        + "<div class='text-gray'>设备ID:" + oneD.wycode + "</div>"
                        + "<div>条码:" + oneD.qr + "</div>");
                    addTableCell("oil_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small\" onclick=\"editEqpInst('"
                        + oneD.id + "')\">编辑</button>");
                }
                setPage("oil_page", _data.max, 20, _page, "");
                $(document).scrollTop(0);
            }
        });
}

// 编辑液面传感器
function editEqpInst(_instid) {
    editType = "new";
    var title = "新增液面传感器";
    if (_instid != null && _instid != "") {
        thisInst = _instid;
        editType = "edit";
        title = "编辑液面传感器";
    }
    doRefresh(null, "EQUIPMENT", "getOneEqpInst", "&in_type=" + editType + "&eqpid="
        + _instid, function (_data) {
        showEqpInstBase(_data, editType);
        openDialogs({
            id: "oil-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            searchOil();
            return true;
        });
    });
}

// 设置液面传感器
function showEqpInstBase(_data, _type) {
    $("#t_eqpid").val(_data.id);
    $("#t_eqpwycode").val(_data.wycode);
    $("#t_eqpname").val(_data.name);
    $("#s_eqpdef").val(_data.def);
    $("#t_eqpqr").val(_data.qr);
    $("#t_eqpphone").val(_data.phone);
    $("#t_eqppdate").val(_data.pdate);
    $("#l_oilmj").html(_data.defpara1 + "(参见设备基础数据)");
}

//保存液面传感器
function commitEqpInst() {
    if (checkForm("oilbase-form") && confirm("是否保存液面传感器信息？")) {
        doRefresh("oilbase-form", "EQUIPMENT", "updateEqpInst", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("oil-base");
                searchOil();
            } else {
                alert(_data.error);
            }
        });
    }

}
