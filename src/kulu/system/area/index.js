var editType = "new";
var thisArea = "";
jQuery(function ($) {
    // opener = null;
    // window.history.forward();
    $("#t_areapid").lookup({bsid: "DCAREA", opname: "searchAreaLookUp", lname: "pg_text"});
    AreaIni();
});

function AreaIni() {
    doRefresh(
        "",
        "DCAREA",
        "AreaIni",
        "",
        function (_data) {
            var _html = "<option>---请选择---</option>";
            for (var i = 0; i < _data.areaclass.length; i++) {
                var oneD = _data.areaclass[i];
                _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
            }
            $("#s_areaclass").html(_html);
            $("#s_areaclass").val("");
            //
            _html = "<option>---请选择---</option>";
            for (var i = 0; i < _data.areatype.length; i++) {
                var oneD = _data.areatype[i];
                _html += "<option value='" + oneD.id + "'>" + oneD.name + "</option>";
            }
            $("#s_areatype").html(_html);
            $("#s_areatype").val("");
            searchArea();
        });
}

//搜索行政区域
function searchArea(_page) {
    if (_page == null) {
        _page = $("#area_page_thisp").val();
    }
    if (_page == null || _page == "" || _page == 0) {
        _page = 1;
    }
    doRefresh(
        "",
        "DCAREA",
        "searchAreaList",
        "&pg_size=50&pg_num=" + (_page - 1),
        function (_data) {
            clearTable("area_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("area_tab");
                    addTableCell("area_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.allname + "</strong></div>"
                        + "<div>编码：" + oneD.id + " [简称：" + oneD.sname + "]</div>");
                    addTableCell("area_tab", _oneTr, "desc", "<div>级别：" + oneD.areaclass + "</div>" + "<div>类别：" + oneD.areatype + "</div>");
                    addTableCell("area_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editArea('"
                        + oneD.id + "')\"> 编辑</button>");
                }
                setPage("area_page", _data.max, 50, _page, "searchArea");
                $(document).scrollTop(0);
            }
        });
}

// 编辑行政区域
function editArea(_areaid) {
    editType = "new";
    var title = "新增行政区域";
    $("#t_areaid").removeAttr("readonly");
    if (_areaid != null && _areaid != "") {
        thisArea = _areaid;
        editType = "edit";
        title = "编辑行政区域";
        $("#t_areaid").attr("readonly", "readonly");
    }
    doRefresh(null, "DCAREA", "getOneAreaById", "&in_type=" + editType + "&areaid="
        + _areaid, function (_data) {
        showAreaBase(_data, editType);
        openDialogs({
            id: "area-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置行政区域
function showAreaBase(_data, _type) {
    $("#t_areaid").val(_data.id);
    $("#t_areaname").val(_data.name);
    $("#t_areasname").val(_data.sname);
    $("#s_areaclass").val(_data.areaclass);
    $("#s_areatype").val(_data.areatype);
    $("#t_areapid_v").val(_data.pid);
    $("#t_areapid").val(_data.pname);
}

//保存行政区域
function commitArea() {
    if (checkForm("areabase-form") && confirm("是否保存行政区域信息？")) {
        doRefresh("areabase-form", "DCAREA", "updateArea", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("area-base");
                searchArea();
            } else {
                alert(_data.error);
            }
        });
    }

}