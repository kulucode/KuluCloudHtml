var editType = "new";
var thisEqpDefine = "";
jQuery(function ($) {
    // opener = null;
    // window.history.forward();
    $("#t_defsdate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d H:i:s',
    });
    getLoginUser("div_user", "EQP_DEF", "EQP_MANG", function () {
        EqpDefineIni();
    });

});

function EqpDefineIni() {
    doRefresh(
        null,
        "EQUIPMENT",
        "EqpDefineIni",
        "",
        function (_data) {
            if (_data.r == 0) {
                var _html = "<option value=''>---全部类别---</option>";
                for (var i = 0; i < _data.type.length; i++) {
                    var oneD = _data.type[i];
                    _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
                }
                $("#s_deftype").html(_html);
                $("#s_deftype").val("");
                searchEqpDefine();
            }
        });
}

//搜索设备定义
function searchEqpDefine() {
    doRefresh(
        "",
        "EQUIPMENT",
        "searchEqpDefineList",
        "",
        function (_data) {
            clearTable("eqpdef_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("eqpdef_tab");
                    addTableCell("eqpdef_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div>"
                        + "<div>型号:" + oneD.no + "</div>"
                        + "<div>品牌:" + oneD.brand + "</div>");
                    addTableCell("eqpdef_tab", _oneTr, "type", oneD.type + "/" + oneD.style);
                    addTableCell("eqpdef_tab", _oneTr, "company", oneD.company);
                    addTableCell("eqpdef_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editEqpDefine('"
                        + oneD.id + "')\"> 编辑</button>");
                }
                setPage("eqpdef_page", _data.list.length, _data.list.length, 1, "");
                $(document).scrollTop(0);
            }
        });
}

// 编辑设备定义
function editEqpDefine(_defid) {
    editType = "new";
    var title = "新增设备定义";
    if (_defid != null && _defid != "") {
        thisEqpDefine = _defid;
        editType = "edit";
        title = "编辑设备定义";
        $("#t_defid").attr("readonly", "readonly");
    }
    doRefresh(null, "EQUIPMENT", "getEqpDefineById", "&in_type=" + editType + "&defid="
        + _defid, function (_data) {
        showEqpDefineBase(_data, editType);
        openDialogs({
            id: "eqpdef-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置设备定义
function showEqpDefineBase(_data, _type) {
    $("#t_defid").val(_data.id);
    $("#t_defno").val(_data.no);
    $("#t_defname").val(_data.name);
    $("#s_deftype").val(_data.type);
    $("#s_defstyle").val(_data.style);
    $("#t_defcomp").val(_data.company);
    $("#t_defbrand").val(_data.brand);
    $("#t_defpara1").val(_data.para1);
    $("#t_defpara2").val(_data.para2);
    $("#t_defpara3").val(_data.para3);
}

//保存设备定义
function commitEqpDef() {
    if (checkForm("eqpdef-form") && confirm("是否保存设备定义信息？")) {
        doRefresh("eqpdef-form", "EQUIPMENT", "updateEqpDefine", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("eqpdef-base");
                searchEqpDefine();
            } else {
                alert(_data.error);
            }
        });
    }

}


