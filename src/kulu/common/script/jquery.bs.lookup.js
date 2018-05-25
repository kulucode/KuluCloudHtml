(function ($) {
    // 定义
    $.fn.lookup = function (_paras) {
        var thisId = this.attr("id");
        var obj = $("#" + thisId);
        var thisT = null;
        obj.attr("autocomplete", "off");
        obj.bind("keyup", function () {
            if (thisT != null) {
                clearTimeout(thisT);
                $(".bslookupdiv").remove();
            }
            if ($(this).attr("readonly") == "readonly") {
                return;
            }
            $(".bslookupdiv").remove();
            if ($(this).val() == "") {
                //$("#" + thisId + "_v").val("");
                return;
            }
            //$(this).attr("readonly", "readonly");
            var tempP = "";
            if (_paras.lname != null) {
                tempP = "&" + _paras.lname + "=" + $(this).val();
            } else {
                tempP = "&" + thisId + "=" + $(this).val();
            }
            thisT = setTimeout(doRefresh(
                null,
                _paras.bsid,
                _paras.opname,
                _paras.paras + tempP,
                function (_data) {
                    var obj = $("#" + thisId);
                    if (_data != null && _data.r == 0) {
                        obj.focus();
                        // 加载下拉框
                        var _html = "<ul id=\""
                            + thisId
                            + "_ul\" class=\"bslookupdiv list-group bg-white\" style=\"z-index:5001;position:absolute;top:"
                            + (obj.offset().top + obj
                                .outerHeight())
                            + "px;left:" + obj.offset().left
                            + "px;\">";
                        var le = _data.list.length;
                        if (le > 10) {
                            le = 10;
                        }
                        var regexp = new RegExp("(" + obj.val() + ")", "g");
                        for (var i = 0; i < le; i++) {
                            var label = _data.list[i].label.replace(regexp, "<span class='text-dot'><strong>$&</strong></span>");
                            _html += "<li onclick=\"$('#"
                                + thisId
                                + "_v').val('"
                                + _data.list[i].value
                                + "');$('#"
                                + thisId
                                + "').val('"
                                + _data.list[i].label
                                + "'); $('.bslookupdiv').remove();" + ((_paras.exfun != null && _paras.exfun != "") ? _paras.exfun + "();" : "") + "\"><a href=\"javascript:void(0);\">"
                                + label
                                + "</a></li>";
                        }
                        _html += "</ul>";
                        $(document.body).append(_html);
                    }
                    //$("#" + thisId).removeAttr("readonly");
                }, _paras.domain)
                ,
                1000
            )

        });
    };
})(jQuery);