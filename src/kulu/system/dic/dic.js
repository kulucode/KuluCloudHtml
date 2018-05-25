var editType = "new";
var thisDic = "";
jQuery(function ($) {
    // opener = null;
    // window.history.forward();
    searchDic();
});

//搜索数据字典
function searchDic() {
    var _html = "<option value=''>---请选择数据字典--</option>";
    doRefresh(
        "",
        "DCDIC",
        "searchDicList",
        "",
        function (_data) {
            clearTable("dic_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _oneTr = addTableRow("dic_tab");
                    addTableCell("dic_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div><div>["
                        + oneD.id + "]</div>");
                    addTableCell("dic_tab", _oneTr, "desc", oneD.desc);
                    addTableCell("dic_tab", _oneTr, "edit",
                        "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editDic('"
                        + oneD.id + "')\"> 编辑</button>");
                    addTableCell("dic_tab", _oneTr, "item",
                        "<button type=\"button\" class=\"button bg-main button-small icon-list\" onclick=\"toItemIni('"
                        + oneD.id + "','" + oneD.name + "')\"> (" + oneD.itemCount + ")个项目</button>");
                    _html += "<option value=\"" + oneD.id + "\">" + oneD.name + "</option>";
                }
                $("#s_pdic").html(_html);
                setPage("dic_page", _data.list.length, _data.list.length, 1, "");
                $(document).scrollTop(0);
            }
        });
}

// 编辑数据字典
function editDic(_dicid) {
    editType = "new";
    var title = "新增数据字典";
    $("#t_dicid").removeAttr("readonly");
    if (_dicid != null && _dicid != "") {
        thisDic = _dicid;
        editType = "edit";
        title = "编辑数据字典";
        $("#t_dicid").attr("readonly", "readonly");
    }
    doRefresh(null, "DCDIC", "getDicById", "&in_type=" + editType + "&dicid="
        + _dicid, function (_data) {
        showDicBase(_data, editType);
        openDialogs({
            id: "dic-base",
            title: title,
            width: "50%",
            father: "",
        }, function () {
            return true;
        });
    });
}

// 设置数据字典
function showDicBase(_data, _type) {
    $("#t_dicid").val(_data.id);
    $("#t_dicname").val(_data.name);
    $("#t_dicdesc").val(_data.desc);
    $("#s_pdic").val(_data.pid);
}

//保存数据字典
function commitDic() {
    if (checkForm("dicbase-form") && confirm("是否保存数据字典信息？")) {
        doRefresh("dicbase-form", "DCDIC", "updateDic", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("dic-base");
                searchDic();
            } else {
                alert(_data.error);
            }
        });
    }

}

//初始化树
function toItemIni(_dicid, _divName) {
    $("#t_idicid").val(_dicid);
    clearTable("dicitem_tab");
    openDialogs({
        id: "dicitem-dlg",
        title: _divName + "：字典项目",
        width: "60%",
        father: ""
    }, function () {
        return true;
    });
    searchDicItemList();

}

function searchDicItemList() {
    doRefresh(null, "DCDIC", "searchDicItemList", "&dicid="
        + $("#t_idicid").val(), function (_data) {
        clearTable("dicitem_tab");
        if (_data.r == 0) {
            for (var i = 0; i < _data.list.length; i++) {
                var oneD = _data.list[i];
                var _oneTr = addTableRow("dicitem_tab");
                addTableCell("dicitem_tab", _oneTr, "name", "<div class=\"text-strong\"><strong>" + oneD.name + "</strong></div>");
                addTableCell("dicitem_tab", _oneTr, "desc", oneD.value);
                addTableCell("dicitem_tab", _oneTr, "indxe", oneD.index);
                addTableCell("dicitem_tab", _oneTr, "edit",
                    "<button type=\"button\" class=\"button bg-main button-small icon-edit\" onclick=\"editDicItem('"
                    + oneD.id + "')\"> 编辑</button>");
                addTableCell("dicitem_tab", _oneTr, "del",
                    "<button type=\"button\" class=\"button bg-main button-small icon-list\" onclick=\"deleteDicItem('"
                    + oneD.id + "','" + oneD.name + "')\"> 删除</button>");
            }
            setPage("dicitem_page", _data.list.length, _data.list.length, 1, "");
            //
            var _html = "<option value=''>---无需配置关联信息--</option>";
            if (_data.pitemlist.length > 0) {
                _html = "<option value=''>---请选择数据字典项目--</option>";
                for (var i = 0; i < _data.pitemlist.length; i++) {
                    var oneD = _data.pitemlist[i];
                    _html += "<option value=\"" + oneD.id + "\">" + oneD.name + "</option>";
                }
            }
            $("#s_pdicitem").html(_html);
            $(document).scrollTop(0);
        }
    });
}

// 编辑数据字典
function editDicItem(_dicitemid) {
    var title = "新增数据字典项目";
    editType = "new";
    $("#l_dicitemnid").hide();
    $("#t_dicitemnid_p").show();
    if (_dicitemid != null && _dicitemid != "") {
        editType = "edit";
        title = "编辑数据字典项目";
        $("#l_dicitemnid").show();
        $("#t_dicitemnid_p").hide();
    }
    doRefresh(null, "DCDIC", "getDicItemById", "&in_type=" + editType + "&dicitemid="
        + _dicitemid, function (_data) {
        showDicItemBase(_data, editType);
        openDialogs({
            id: "dicitem-base",
            title: title,
            width: "60%",
            father: "",
            zindex: 1200
        }, function () {
            return true;
        });
    });
}

// 设置数据字典
function showDicItemBase(_data, _type) {
    $("#t_dicitemid").val(_data.id);
    $("#l_dicitemnid").html(_data.id);
    $("#t_dicitemname").val(_data.name);
    $("#t_dicitemvalue").val(_data.value);
    $("#t_dicitemvalue2").val(_data.value2);
    $("#t_dicitemindex").val(_data.index);
    $("#s_pdicitem").val(_data.pitemid);
}

//保存数据字典项目
function commitDicItem() {
    if (checkForm("dicitembase-form") && confirm("是否保存数据字典项目？")) {
        doRefresh("dicitembase-form", "DCDIC", "updateDicItem", "&in_type="
            + editType, function (_data) {
            if (_data.r == 0) {
                closeDialog("dicitem-base");
                searchDicItemList();
            } else {
                alert(_data.error);
            }
        });
    }

}

function getDicItemLD(_pid) {
    var _html = "<option value=''>---请选择数据字典项目--</option>";
    doRefresh(null, "DCDIC", "searchDicItemList", "&dicid="
        + _pid, function (_data) {
        if (_data.r == 0) {
            for (var i = 0; i < _data.list.length; i++) {
                var oneD = _data.list[i];
                _html += "<option value=\"" + oneD.id + "\">" + oneD.name + "</option>";
            }
            $("#s_pdicitem").html(_html);
        }
    });
}