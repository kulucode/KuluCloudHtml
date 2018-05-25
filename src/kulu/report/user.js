var editType = "new";
var reportFunTree = null;
var thisInst = "";
jQuery(function ($) {
    $(".wsedate").datetimepicker({
        lang: 'ch',
        format: 'Y-m-d',
    });
    getLoginUser("div_user", "USER_WORK", "WORK_LOGS", function () {
        //ReportIni();
        searchUserReport();
    });
});

function ReportIni() {
    doRefresh(
        "",
        "STATS",
        "ReportIni",
        "", function (_data) {
            if (_data.r == 0) {
            }
        });
}

//搜索车辆
function searchUserReport() {
    doRefresh(
        "frmBusiness",
        "STATS",
        "searchUserReportList",
        "",
        function (_data) {
            clearTable("report_tab");
            if (_data.r == 0) {
                for (var i = 0; i < _data.data.length; i++) {
                    var oneD = _data.data[i];
                    var _oneTr = addTableRow("report_tab");
                    var _user = "<div><strong>" + oneD.name + "[" + oneD.id + "]</strong> 年龄：" + oneD.age + "</div>";
                    _user += "<div>联系电话：" + oneD.phone + "</div>";
                    _user += "<div>项目组：" + oneD.org + "</div>";
                    addTableCell("report_tab", _oneTr, "name", _user);
                    addTableCell("report_tab", _oneTr, "step", oneD.step);
                    addTableCell("report_tab", _oneTr, "dis", oneD.distance);
                    addTableCell("report_tab", _oneTr, "sb", oneD.sbflg);
                    addTableCell("report_tab", _oneTr, "abs", oneD.abs);
                    addTableCell("report_tab", _oneTr, "late", oneD.late);
                }
                setPage("report_page", _data.data.length, _data.data.length, 1, "");
                $(document).scrollTop(0);
            }
        });
}

function exportUserReport() {
    doRefreshDownLoad("frmBusiness", "KULUINTERFACE", "exportUserReportList", "");
}