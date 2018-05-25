var ThisStep = 0;
jQuery(function ($) {
    $("#bt_dhbar").hide();
    $("#bt_over").hide();
    $("#bt_start").show();
    $("#pg_userpath").attr("href", webHome + "/files/import/user_templet.xls");
    $("#pg_userimg").attr("src", webHome + "/files/import/user_templet.png");
    $("#pg_watchpath").attr("href", webHome + "/files/import/yunhuan_templet.xls");
    $("#pg_watchimg").attr("src", webHome + "/files/import/yunhuan_templet.png");
    $("#pg_truckpath").attr("href", webHome + "/files/import/yunhe_templet.xls");
    $("#pg_truckimg").attr("src", webHome + "/files/import/yunhe_templet.png");
});

function doSysIni() {
    //doStep(1);
    //return;
    if (checkForm("sysini-form") && confirm("系统初始化将清除一切业务数据，是否继续进行？！")) {
        doRefresh(
            "sysini-form",
            "DCLOGIN",
            "SysBaseIni",
            "",
            function (_data) {
                if (_data.r == 0) {
                    $("#t_compid").val(_data.id);
                    $("#t_compname").val(_data.name);
                    $("#t_compdesc").val(_data.desc);
                    $("#t_complink").val(_data.linkman);
                    $("#t_compphone").val(_data.linkphone);
                    $("#t_complat").val(_data.lat);
                    $("#t_complon").val(_data.lon);
                    $("#l_compgeo").html("经度:" + _data.lon + ";纬度:" + _data.lat);

                    $("#t_areaid_v").val(_data.areaid);
                    $("#t_areaid").val(_data.areaname);

                    doStep(1);
                }
                else {
                    alert(_data.error);
                }
            });
    }
}

function doStep(_type) {
    $("#bt_dhbar").hide();
    $("#bt_start").hide();
    $("#bt_over").hide();
    if (_type == -1) {
        //prve
        ThisStep--;
    } else if (_type == 1) {
        //next
        ThisStep++;
    }
    else if (_type == 0) {
        //第一页
        ThisStep = 0;
    }
    if (ThisStep < 0) {
        ThisStep = 0;
    }
    if (ThisStep > 4) {
        ThisStep = 4;
    }
    $(".div_step").hide();
    if (ThisStep == 0) {
        $("#bt_start").show();
    }
    else if (ThisStep == 4) {
        $("#bt_over").show();
    }
    else {
        $("#bt_dhbar").show();
    }
    $("#div_step" + ThisStep).show();
}

//保存数据字典
function commitThisCompany() {
    if (checkForm("comp-form") && confirm("是否保存当前运营商信息？")) {
        doRefresh("comp-form", "COMPANY", "updateThisCompany", "", function (_data) {
            if (_data.r == 0) {
                alert("保存成功");
            } else {
                alert(_data.error);
            }
        });
    }

}

function ImportUserFile() {
    if ($("#t_ufile").val() != "" && confirm("是否上传文件？")) {
        doRefreshFile("form-ufile", "DCFILE", "ImportFile",
            "&filetype=USER&bissid=&cuid=" + p.thisLogUser.instid, "t_ufile_p", function (_data) {
                resetFile("t_ufile");
                $("#l_ufilename").html("");
                if (_data.r == 0) {
                    alert("导入成功！");
                }
                else {
                    showErrDlg(_data);
                }

                $('#l_ufilename').html("");
            });
    }
}


function ImportWatchFile() {
    if ($("#t_wfile").val() != "" && confirm("是否上传文件？")) {
        doRefreshFile("form-wfile", "DCFILE", "ImportFile",
            "&filetype=WATCH&bissid=&cuid=" + p.thisLogUser.instid, "t_wfile_p", function (_data) {
                resetFile("t_wfile");
                $("#l_wfilename").html("");
                if (_data.r == 0) {
                    alert("导入成功！");
                }
                else {
                    showErrDlg(_data);
                }

                $('#l_wfilename').html("");
            });
    }
}

function ImportTruckFile() {
    if ($("#t_tfile").val() != "" && confirm("是否上传文件？")) {
        doRefreshFile("form-tfile", "DCFILE", "ImportFile",
            "&filetype=TRUCK&bissid=&cuid=" + p.thisLogUser.instid, "t_tfile_p", function (_data) {
                resetFile("t_tfile");
                $("#l_tfilename").html("");
                if (_data.r == 0) {
                    alert("导入成功！");
                }
                else {
                    showErrDlg(_data);
                }

                $('#l_ufilename').html("");
            });
    }
}

function doSysIniOver() {
    parent.closeDialog("sysini-dlg");
}
