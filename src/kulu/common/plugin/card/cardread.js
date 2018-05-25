function cardIni(_name, _tagOnJsFun, _tagOffJsFun) {
    _html = "";
    if (_tagOnJsFun != "") {
        _html += "<script for=\""
            + _name
            + "\" event=\"OnTagOn(sn)\" language=\"jscript\" type=\"text/javascript\">" +
            "{eval(\"" + _tagOnJsFun + "(sn)\");}</script>";
    }
    if (_tagOffJsFun != "") {
        _html += "<script for=\""
            + _name
            + "\" event=\"OnTagOff\" language=\"jscript\" type=\"text/javascript\">{eval(\""
            + _tagOffJsFun + "()\");}</script>";
    }
    _html += "<object id=\""
        + _name
        + "\" classid=\"clsid:414B84F7-D29B-494D-9497-F85673909B43\" width=\"100%\" height=\"0px\" codebase=\"" + webHome + "/common/plugin/card/rrfid.CAB#version=1,1\">" +
        "<span style= \"color:red \"> ActiveX   控件装入失败! 请降低IE安全级别或者直接<a href=\"" + webHome + "/common/plugin/card/rfid_setup.exe\">下载控件</a>安装。</span></object>";

    _html += "<script type=\"text/javascript\">r = " + _name
        + ".StartRF();" + "</script>";
    alert(_html);

    $("#card").html(_html);
}