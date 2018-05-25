var editType = "new";
var orgTree = null;
var thisComp = null;
var thisGroupId = "";
var thisGroupName = "全部员工";

var drawSource = null;
var FancePoints = null;

jQuery(function ($) {
    $("#t_areaid").lookup({bsid: "DCAREA", opname: "searchAreaLookUp", lname: "pg_text"});
    getLoginUser("div_user", "GROUP_MANG", "SYSTEM", function () {
        UserIni();
    });
});

function UserIni() {
    doRefresh(
        "",
        "DCUSER",
        "UserIni",
        "",
        function (_data) {
            if (_data.r == 0) {
                thisComp = _data.comp;
                $("#t_orgcomp").val(thisComp.id);
                iniOrgTree("orgTree", "div_orgtree");
            }
        });
}

function iniOrgTree(_name, _div) {
    orgTree = new BSTreeView(_name, "", false, "", _div);
    orgTree.imagePath = webHome + "/common/images/tree/";
    orgTree
        .addRootNode(
            "root",
            thisComp.name + (thisComp.id != "" ? "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('root','无',0)\"> 新增机构</a>" : ""),
            "", "", "", true);
    orgTree.DrawTree(true);
    if (thisComp.id != "") {
        getOrgTree();
    }
}

function getOrgTree() {
    doRefresh(
        "",
        "DCUSER",
        "getOrgTree",
        "&in_compid=" + thisComp.id,
        function (_data) {
            if (_data.r == 0) {
                var root = orgTree.getNodeById(0);
                for (var i = 0; i < _data.list.length; i++) {
                    var oneD = _data.list[i];
                    var _bt = "";
                    if (oneD.type != 1) {
                        _bt = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "'," + oneD.type + ")\"> " + (oneD.type == 2 ? "新增项目组" : "新增机构") + "</a>";
                    }
                    if (oneD.cnum == 0) {
                        _bt += "&nbsp;<a class=\"badge bg-dot icon-trash-o\" href=\"javascript:deleteOrg('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "')\"> 删除</a>";
                    }
                    // 添加菜单
                    var sub = root
                        .addNode(
                            oneD.id,
                            oneD.name + _bt,
                            "editOrg('" + oneD.id + "')", "", "",
                            true);
                    if (oneD.cnum > 0) {
                        _setChildOrg(sub, oneD.children);
                    }
                }
            }
            else {
                showErrDlg(_data);
            }
            $(document).scrollTop(0);
        });
}

function _setChildOrg(_pnode, _nodes) {
    for (var j = 0; j < _nodes.length; j++) {
        var oneSubD = _nodes[j];
        var _bt = "";
        if (oneSubD.type != 1) {
            _bt = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('"
                + oneSubD.id
                + "','"
                + oneSubD.name
                + "',oneSubD.type)\"> " + (oneSubD.type == 2 ? "新增项目组" : "新增机构") + "</a>";
        }
        if (oneSubD.cnum == 0) {
            _bt += "&nbsp;<a class=\"badge bg-dot icon-trash-o\" href=\"javascript:deleteOrg('"
                + oneSubD.id
                + "','"
                + oneSubD.name
                + "')\"> 删除</a>";
        }
        var subNode = _pnode.addNode(
            oneSubD.id,
            oneSubD.name + _bt,
            "editOrg('" + oneSubD.id + "')",
            "", "", true);
        if (oneSubD.cnum > 0) {
            _setChildOrg(subNode, oneSubD.children);
        }
    }
}

function createOrgIni(_porgid, _pfunName, _type) {
    orgTree.getNodeByName(_porgid).setNodeActive();
    editOrg("", {
        id: _porgid,
        name: _pfunName,
        type: _type
    });
}


// 编辑菜单
function editOrg(_orgid, _pObj) {
    var type = "new";
    var _title = "";
    if (_orgid != null && _orgid != "") {
        type = "edit";
        _title = "编辑项目组";
        editType = "edit";
        thisGroupId = _orgid;
    } else {
        _orgid = "";
        editType = "new";
        _title = "新增项目组";
    }
    doRefresh(null, "DCUSER", "getOneOrg", "&in_type=" + type + "&orgid="
        + _orgid, function (_data) {
        if (_pObj != null) {
            _data.pid = _pObj.id;
            _data.pname = _pObj.name;
        }
        setOrgBase(_data);
        if (_pObj != null) {
            if (_pObj.type == 0) {
                $("#s_orgtype").val(0);
            }
            else if (_pObj.type == 2) {
                $("#s_orgtype").val(1);
            }
            else if (_pObj.type == -1) {
                $("#s_orgtype").val(1);
            }
        }
        $(document).scrollTop(0);
    });
}

function setOrgBase(_data) {
    // 上级
    $("#t_porgid").val(_data.pid);
    $("#l_porg").html(_data.pname);
    $("#l_orgallname").html("机构完整名：" + _data.allname);
    //
    $("#t_orgid").val(_data.id);
    $("#t_orgname").val(_data.name);
    $("#s_orgtype").val(_data.type);
    $("#t_orglat").val(_data.lat);
    $("#t_orglon").val(_data.lon);
    $("#l_orggeo").html("经度:" + _data.lon + ";纬度:" + _data.lat);
    $("#t_orgdesc").val(_data.desc);
    //
    $("#t_areaid_v").val(_data.areaid);
    $("#t_areaid").val(_data.areaname);

}

function commitOrg() {
    if (checkForm("orgbase-form") && confirm("是否保存？")) {
        doRefresh(
            "orgbase-form",
            "DCUSER",
            "updateOneOrg",
            "&in_type=" + editType,
            function (_data) {
                if (_data.r == 0) {
                    var oneD = _data.data;
                    var _bt = "";
                    if (oneD.type != 1) {
                        _bt = "&nbsp;<a class=\"badge bg-blue icon-plus\" href=\"javascript:createOrgIni('"
                            + oneD.id
                            + "','"
                            + oneD.name
                            + "'," + oneD.type + ")\"> " + (oneD.type == 2 ? "新增项目组" : "新增机构") + "</a>";
                    }
                    if (editType == "new") {
                        orgTree.getNodeByName($("#t_porgid").val())
                            .addNode(oneD.id, oneD.name + _bt,
                                "editOrg(\"" + oneD.id + "\",\"" + oneD.name + "\")", "",
                                "", true);
                    } else {
                        var editNode = orgTree.getNodeByName(oneD.id);
                        editNode.setShowStr(oneD.name);
                    }
                } else {
                    showErrDlg(_data);
                }
            });
    }

}

function deleteOrg(_id, _name) {
    if (_id != "") {
        if (confirm("是否删除该项目组[" + _name + "]？") && confirm("基础数据删除将可能影响部分数据的正常显示，是否继续？")) {
            doRefresh(null, "DCUSER", "delOneOrg", "&orgid="
                + _id, function (_data) {
                if (_data.r == 0) {
                    location.reload();
                } else {
                    alert(_data.error);
                }
            });
        }
    }
    else {
        alert("没有可删除的工位！");
    }
}

function doSelOrgByOrg(_type) {
    getOrgSelectDlg(thisComp.id, thisComp.name, thisGroupId, "", "doSelOrgByOrgRet", 0);
}

function doSelOrgByOrgRet(_selId, _selOrg) {
    $("#t_porgid").val(_selId);
    $("#l_porg").html(_selOrg);
}

function setGroupCenter() {
    openDialogs({
        id: "center-dlg",
        title: "选择中心位置",
        width: "90%",
        father: ""
    }, function () {
        return true;
    });
    var _center = null;
    if ($("#t_orglat").val() != "" && $("#t_orglon").val() != "") {
        _center = [parseFloat($("#t_orglon").val()), parseFloat($("#t_orglat").val())]
    }
    mapIni(_center, _center);
}

function getCenterPoint() {
    $("#t_orglat").val(FancePoints.lat);
    $("#t_orglon").val(FancePoints.lon);
    $("#l_orggeo").html("经度:" + FancePoints.lon + ";纬度:" + FancePoints.lat);
    closeDialog("center-dlg");
}

function mapIni(_points, _center) {
    $("#container").html("");
    $("#container").height($("#center-dlg-body").height());
    $("#div_mapcond").width($("#p_form").width() - 54);
    var onePF = null;
    if (_points != null) {
        FancePoints = _points;
        onePF = new ol.Feature({
            geometry: new ol.geom.Point(_points)
        });
    }
    else {
        FancePoints = null;
    }
    if (_center == null) {
        _center = [112.9380, 28.1711];
    }
    if (onePF != null) {
        drawSource = new ol.source.Vector({
                features: [onePF]
            }
        );
    }
    else {
        drawSource = new ol.source.Vector();
    }

    drawVector = new ol.layer.Vector({
        source: drawSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0000',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ff0000'
                })
            })
        })
    });

    defaultLayer = [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }), drawVector];
    $("#mouse-position").html("");
    map = new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        }).extend([
            new ol.control.ScaleLine({
                units: 'degrees'
            })
            , new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                // comment the following two lines to have the mouse position
                // be placed within the map.
                className: 'custom-mouse-position',
                target: document.getElementById("mouse-position"),
                undefinedHTML: '鼠标移动显示经纬度'
            })]),
        layers: defaultLayer,
        target: 'container',
        view: new ol.View({
            projection: 'EPSG:4326',
            center: _center,
            zoom: 13
        })
    });

    function addInteractions() {
        draw = new ol.interaction.Draw({
            source: drawSource,
            type: "Point"
        });
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: drawSource});
        map.addInteraction(snap);
    }

    addInteractions();
    draw.on('drawstart',
        function (evt) {
            drawSource.clear();
            FancePoints = {};
        }, this);
    draw.on('drawend',
        function (evt) {
            // set sketch
            var geom = evt.feature.getGeometry().getCoordinates();
            FancePoints = {lon: geom[0], lat: geom[1]};
        }, this);
}




