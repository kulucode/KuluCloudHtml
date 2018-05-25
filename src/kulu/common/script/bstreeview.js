function BSTreeView(name, formname, showType, style, father, showCheck,
                    disabled) {
    this.name = name || "BSTreeView";
    this.formname = formname || "frmBusiness";
    this.showType = showType || false;
    this.style = style || "";
    this.nodeList = new Array();
    this.rootList = new Array();
    this.addList = new Array();// 大批量提交的节点存储列表
    this.batchFlg = false;// 是否大批量提交
    this.thisDeepNo = 0;
    this.htmlStr = "";
    this.clickID = -1;
    this.isFinish = true;
    this.rmObj = null;
    this.imagePath = "../common/images/tree/";// 缺省的路径
    this.showLine = true;// 是否显示连线
    this.showAddImg = true;// 是否显示+-
    this.showNodeImg = true;// 是否现实图片
    this.father = father || "";
    this.freshJsfun = "";
    this.thisOppNode = null;// 记录当前即点即查的节点
    this.isBinaryStar = false;
    this.showCheck = showCheck || false;// 是否显示CheckBox。true：显示；false：不显示；缺省为显示。
    this.disabled = disabled || false;// 是否可用。true：不可用；false：可用；缺省为可用。
    this.canDrag = false;
    this.inDrag = false;
    this.dragId = -1;
    this.dragX = -1;
    this.dragFun = "";// 拖拽完成后的附加方法
    this.isShow = false;
    this.checkType = 0;// checkBox的类别，0：关心上下级，1；只关心自己
    this.inDataGrid = null;

    /** ***get/set方法开始**** */
        // 设置刷新状态时的方法(限于BinaryStar框架使用)
    this.resetTree = function () {
        this.nodeList = new Array();
        this.rootList = new Array();
        this.clickID = 0;
        this.thisDeepNo = 0;
        this.dragId = -1;
        this.dragX = -1;
    }

    this.setFreshJsfun = function (inFreshJsfun) {
        this.freshJsfun = inFreshJsfun;
    };

    // 设置图片的路径
    this.setImagesPath = function (inPath) {
        this.imagePath = inPath;
    };

    // 是否显示线
    this.setShowLine = function (showFlg) {
        this.showLine = showFlg;
    };

    // 是否显示节点图片
    this.setShowNodeImg = function (showNodeImgFlg) {
        this.showNodeImg = showNodeImgFlg;
    };

    // 是否显示+-图片
    this.setShowAddImg = function (showAddImgFlg) {
        this.showAddImg = showAddImgFlg;
    };

    // 设置是否有CheckBox
    this.showCheckBox = function (flg) {
        this.showNodeCheckBox(-1, flg);
    };

    // 设置是否显示节点的CheckBox
    this.showNodeCheckBox = function (inId, flg) {
        if (this.isShow && this.isDisabled()) {
            return;
        }
        if (flg == null) {
            flg = false;
        }
        var disStr = "none";
        if (flg) {
            disStr = "";
        }
        // 非根节点
        if (inId >= 0 && inId < this.nodeList.length) {
            var pnode = this.nodeList[inId];
            if (pnode.disabled) {
                return;
            }
            pnode.showCheck = flg;
            pnode.isChecked = false;
            pnode.halfChecked = false;
            var pnodecheelm = document.getElementById(this.name + "_che_"
                + pnode.id);
            if (pnodecheelm != null) {
                pnodecheelm.style.display = disStr;
                pnodecheelm.checked = false;
                pnodecheelm.indeterminate = false;
            }
            for (var i = 0; i < pnode.childList.length; i++) {
                var node = this.nodeList[pnode.childList[i]];
                this.showNodeCheckBox(node.id, flg);
            }
        } else {
            this.showCheck = flg;
            for (var i = 0; i < this.nodeList.length; i++) {
                var node = this.nodeList[i];
                if (!node.isDelete) {
                    node.showCheck = flg;
                    node.isChecked = false;
                    node.halfChecked = false;
                    var nodecheelm = document.getElementById(this.name
                        + "_che_" + node.id);
                    if (nodecheelm != null) {
                        nodecheelm.style.display = disStr;
                        nodecheelm.checked = false;
                        nodecheelm.indeterminate = false;
                    }
                }
            }
        }
    };

    // 得到树的深度
    this.getDeep = function () {
        return this.thisDeepNo;
    };

    // 设置树可用标志
    this.setDisabled = function (inFlg) {
        this.setNodeDisabled(-1, inFlg);
    };

    // 设置树节点可用标志
    this.setNodeDisabled = function (inId, inFlg) {
        if (inFlg == null) {
            inFlg = false;
        }
        // 非根节点
        if (inId >= 0 && inId < this.nodeList.length) {
            var pnode = this.nodeList[inId];
            if (this.isShow && this.isDisabled()) {
                return null;
            } else if (!this.isShow) {
                pnode.disabled = inFlg;
                return null;
            }
            if (pnode.parent() != null && pnode.parent().disabled) {
                inFlg = true;
            }
            if (!pnode.isDelete && pnode.disabled != inFlg) {
                if (this.clickID = pnode.id) {
                    this.changeClickID(-1);
                }
                pnode.disabled = inFlg;
                var thiscb = document
                    .getElementById(this.name + "_" + pnode.id);
                if (thiscb != null) {
                    thiscb.disabled = inFlg;
                    thiscb.clssName = "tree_a";
                    var ch_thiscb = document.getElementById(this.name + "_che_"
                        + pnode.id);
                    ch_thiscb.disabled = inFlg;
                }
                for (var i = 0; i < pnode.childList.length; i++) {
                    var node = this.nodeList[pnode.childList[i]];
                    this.setNodeDisabled(node.id, inFlg)
                }
            }
        } else {
            this.changeClickID(-1);
            this.disabled = inFlg;
            for (var i = 0; i < this.nodeList.length; i++) {
                var node = this.nodeList[i];
                node.disabled = inFlg;
                if (!node.isDelete) {
                    var thiscb = document.getElementById(this.name + "_" + i);
                    if (thiscb != null) {
                        thiscb.disabled = inFlg;
                        thiscb.clssName = "tree_a";
                        var ch_thiscb = document.getElementById(this.name
                            + "_che_" + i);
                        ch_thiscb.disabled = inFlg;
                    }
                }
            }
        }
    };
    /** ***get/set方法结束**** */

    this.doError = function (inIndex, inErr, inStr, funName) {
        var node = this.nodeList[inIndex];
        if (this.showType) {
            node.isOpen = false;
            node.isDoOpen = false;
        }
        var errStr = "*^_^*恭喜你中招了!\n\r " + inErr.name + ":" + inErr.message
            + " \n\r" + inStr + "\n\r" + funName + "\n\r发生严重错误！";
        alert(errStr);
        var str = document.getElementById(this.name + "_" + inIndex);
        str.className = "tree_error";
        str.title = errStr;
        this.isFinish = false;
        node.isError = true;
        closeDialog();
    };

    /** ***节点操作方法开始**** */
        // 判断是否可用
    this.isDisabled = function () {
        return this.disabled;
    };
    // 添加跟节点
    this.addRootNode = function (name, showStr, jsfun, openjs, paras, isOpen,
                                 isDoOpen, openImg, closeImg, nodeImg) {
        return this.addNode(-1, 0, name, showStr, jsfun, openjs, paras, isOpen,
            isDoOpen, openImg, closeImg, nodeImg);
    };

    // 添加节点
    this.addNode = function (pid, deepID, name, showStr, jsfun, openjs, paras,
                             isOpen, isDoOpen, openImg, closeImg, nodeImg) {
        if ((this.isShow && this.isDisabled())
            || (this.isShow && pid > 0 && this.nodeList[pid].disabled)) {
            return null;
        }

        var inNode = new BSNode(this.nodeList.length, pid, deepID, this.name,
            name, showStr, jsfun, openjs, paras, isOpen, isDoOpen);
        if (pid > 0) {
            inNode.disabled = this.nodeList[pid].disabled;
        } else if (this.disabled) {
            inNode.disabled = true;
        }
        // 设置图片
        if (openImg != null && $.trim(openImg) != "") {
            inNode.openImg = openImg;
        }
        if (closeImg != null && $.trim(closeImg) != "") {
            inNode.closeImg = closeImg;
        }
        if (nodeImg != null && $.trim(nodeImg) != "") {
            inNode.nodeImg = nodeImg;
        }

        // 设置CheckBox
        if (this.showCheck || (pid >= 0 && this.nodeList[pid].showCheck)) {
            inNode.showCheck = true;
            // 设置选中checkbox
            if (pid >= 0 && this.nodeList[pid].isChecked && this.checkType == 0) {
                inNode.isChecked = true;
            }
        }

        if (pid >= 0) {
            // 设置兄弟结点
            if (this.nodeList.length > 0) {
                inNode.prevId = this.nodeList[pid].childList[this.nodeList[pid].childList.length - 1];
            }
            this.nodeList[pid].addChildItem(this.nodeList.length);
        } else {
            // 设置兄弟结点
            if (this.nodeList.length > 0) {
                inNode.prevId = this.rootList[this.rootList.length - 1];
            }
            this.rootList.length++;
            this.rootList[this.rootList.length - 1] = this.nodeList.length;
        }
        this.nodeList.length++;
        this.nodeList[this.nodeList.length - 1] = inNode;
        if (inNode.prevId >= 0) {
            this.nodeList[inNode.prevId].nextId = inNode.id;
        }

        if (deepID > this.thisDeepNo) {
            this.thisDeepNo = deepID;
        }
        if (this.isShow) {
            // 树已生成时动态添加
            if (this.batchFlg) {
                this.addList.length++;
                this.addList[this.addList.length - 1] = inNode.id;
            } else {
                this.showAddNode(inNode.id);
            }
            // this.setScroll(inNode.id);
        }
        return inNode;
    };

    // 添加单个节点对象(用于调度)
    this.addOneNode = function (pid, inNode) {
        if (this.isShow && this.isDisabled()) {
            return null;
        }
        if (inNode == null) {
            alert("没有可添加的节点");
            return;
        }
        if (pid >= 0) {
            if (this.nodeList[pid].disabled) {
                return null;
            }
            this.nodeList[pid].addChildItem(inNode.id);
        } else {
            this.rootList.length++;
            this.rootList[this.rootList.length - 1] = inNode.id;
        }
        inNode.pid = pid;
        inNode.isDelete = false;
        // 重设深度
        inNode.deepID = this.nodeList[pid].deepID + 1;
        if (inNode.deepID > this.thisDeepNo) {
            this.thisDeepNo = inNode.deepID;
        }
        if (document.getElementById(this.name + "_main") != null) {
            // 树已生成
            this.showAddNode(inNode.id);
        }
        // 处理CheckBox的选中
        var tempFlg = -1;
        if (inNode.isChecked) {
            tempFlg = 1;
        } else if (inNode.halfChecked) {
            tempFlg = 0;
        }
        this.doParentChecked(inNode.id, tempFlg);
        return inNode;
    };

    // 更新节点
    this.updateNode = function (id, inNode) {
        if (this.isShow && this.isDisabled()) {
            return null;
        }
        if (inNode == null) {
            alert("没有可更改的节点");
            return null;
        }
        var thisNode = this.nodeList[id];
        if (thisNode.disabled) {
            return null;
        }
        inNode.pid = thisNode.pid;
        // 重设深度
        inNode.id = thisNode.id;
        inNode.deepID = thisNode.pid.deepID;
        this.nodeList[id] = inNode;
        if (document.getElementById(this.name + "_main") != null) {
            // 树已生成
            var thisdiv = document.getElementById(this.name + "_" + inNode.id
                + "_node");
            // 重画父节点
            var strTemp = "";
            strTemp += "<nobr>";
            strTemp += this.DrawLink(inNode.id);
            strTemp += this.DrawShowStr(inNode.id);
            strTemp += "</nobr>";
            thisdiv.innerHTML = strTemp;
        }
        return inNode;
    };

    // 打开父亲节点
    this.openParent = function (id) {
        if (id >= 0) {
            var node = this.nodeList[id];
            if (node.isOpen) {
                return;
            }
            var div = document.getElementById(this.name + "_" + id + "_div");
            var thisdiv = document.getElementById(this.name + "_" + node.id
                + "_node");
            if (div != null) {
                div.style.display = "block";
            }
            node.isOpen = true;
            node.isDoOpen = true;
            // 重画父节点
            var strTemp = "";
            strTemp += "<nobr>";
            strTemp += this.DrawLink(node.id);
            strTemp += this.DrawShowStr(node.id);
            strTemp += "</nobr>";
            thisdiv.innerHTML = strTemp;
            this.openParent(node.pid);
        }
    }

    // 动态添加节点
    this.showAddNode = function (id) {
        if (this.isShow && this.isDisabled()) {
            return false;
        }
        var node = this.nodeList[id];
        if (node.disabled || (node.pid >= 0 && this.nodeList[node.pid].disabled)) {
            return null;
        }
        // 得到父节点对象
        this.openParent(node.pid);
        var p_node = this.nodeList[node.pid];
        if (p_node != null) {
            // 重画父节点的元素
            this.reDrawSelfNode(node.pid);

            if (p_node.childList.length <= 0) {
                this.reDrawAllNode(node.pid);
            } else {
                // 展现自身
                this.reDrawOneChildNode(node.pid, id);
            }

        } else {
            this.reDrawOneChildNode(node.pid, id);
        }
        if (this.isBinaryStar) {
            this.optionFrame(true);
        }

    }

    // 调度节点
    this.changeNode = function (fNode, tNode) {
        if (this.isChildNode(fNode.id, tNode.id)) {
            alert("对不起，不能调度到拖拽到孩子节点！");
        } else {
            if (fNode.disabled || tNode.disabled) {
                return tNode;
            }
            fNode.remove();
            if (tNode.childList.length > 0) {
                var l_node = this.nodeList[tNode.childList[tNode.childList.length - 1]];
                fNode.prevId = l_node.id;
                l_node.nextId = fNode.id;
            }
            tNode.addOneNode(fNode.id);
        }
        return tNode;
    }

    // 判断孩子有无指定ID
    this.isChildNode = function (inPid, inId) {
        var p_node = this.nodeList[inPid];
        if (p_node != null) {
            for (var i = 0; i < p_node.childList.length; i++) {
                var temp_node = this.nodeList[p_node.childList[i]];
                if (temp_node.id == inId
                    || this.isChildNode(temp_node.id, inId)) {
                    return true;
                }
            }
        }
        return false;
    }

    // DataGrid中树的操作
    this._doOpen = function (node, type) {
        if (this.inDataGrid != null) {
            // 找到对应的孩子的TR
            for (var i = 0; i < node.childList.length; i++) {
                var tr = document.getElementById(this.inDataGrid + "_row_"
                    + node.childList[i]);
                var child = this.nodeList[node.childList[i]];
                if (!type) {
                    tr.style.display = "block";
                    // 孩子节点还有孩子,
                    if (child.childList.length > 0 && child.isOpen) {
                        this._doOpen(child, false);
                    }
                } else {
                    tr.style.display = "none";
                    // 如果有孩子
                    if (child.childList.length > 0 && child.isOpen) {
                        this._doOpen(child, true);
                    }
                }
            }
        } else {
            var div = document.getElementById(this.name + "_" + node.id
                + "_div");
            if (div.style.display == "none") {
                div.style.display = "block";
            } else {
                div.style.display = "none";
            }
        }
    }

    // 节点打开操作
    this.doOpen = function (id) {
        if (this.showType && !this.isFinish) {
            alert("您的节点事件出现异常，或是重复提交！");
            return;
        }
        this.isFinish = false;
        var node = this.nodeList[id];
        var str = document.getElementById(this.name + "_" + id);
        var imgo = document.getElementById(this.name + "_" + id + "_o");
        var imgf = document.getElementById(this.name + "_" + id + "_f");
        try {
            var thisForm = eval(this.formname);
        } catch (e) {
            var thisForm = null;
        }
        if (this.isBinaryStar) {
            this.optionFrame(true);
            thisForm.target = "BSTree_frame";
        }

        if (node.isOpen) {
            this.setTreeNodeID(id);
            if (this.getChgFlg(id)) {
                str.focus();
                this.changeClickID(id);
            }
            if (this.showType && node.isDoOpen) {
                this.setTreeNodeID(id);
                if (this.isBinaryStar && this.freshJsfun != null
                    && $.trim(this.freshJsfun) != "") {
                    try {
                        eval(this.freshJsfun);
                    } catch (e) {
                        this.doError(id, e, "刷新节点状态的方法", this.freshJsfun);
                        return;
                    }
                }
            }

            this._doOpen(node, true);
            if (imgo != null) {
                imgo.src = imgo.src.replace("minus.png", "plus.png");
            }
            if (imgf != null) {
                imgf.src = imgf.src.replace(node.openImg, node.closeImg);
            }
            node.isOpen = false;
            this.isFinish = true;
            if (node.closejs != null && $.trim(node.closejs) != "") {
                try {
                    eval(node.closejs);
                } catch (e) {
                    this.doError(id, e, "关闭节点状态的方法", node.closejs);
                    return;
                }
            }
        } else {
            if (node.childList.length > 0) {
                this._doOpen(node, false);
                node.isOpen = true;
            }
            if (imgf != null) {
                imgf.src = imgf.src.replace(node.closeImg, node.openImg);
            }
            if (imgo != null) {
                imgo.src = imgo.src.replace("plus.png", "minus.png");
            }
            this.setTreeNodeID(id);
            // 判断是否是即点即查
            if (this.showType && !node.isDoOpen && node.childList.length == 0) {
                node.isDoOpen = true;
                if (this.isShow && this.isDisabled()) {
                    node.isOpen = false;
                    node.isDoOpen = false;
                    return false;
                }
                if (node.openjs != "") {
                    // 弹出提示框
                    try {
                        eval(node.openjs);
                    } catch (e) {
                        this.doError(id, e, "打开节点的方法", node.openjs);
                        return;
                    }
                } else if (node.childList.length == 0) {
                    if (this.isBinaryStar && this.freshJsfun != null
                        && $.trim(this.freshJsfun) != "") {
                        try {
                            eval(this.freshJsfun);
                        } catch (e) {
                            this.doError(id, e, "刷新节点状态的方法", this.freshJsfun);
                            return;
                        }
                    }
                    this.isFinish = true;
                }
                node.isDoOpen = true;
            } else if (this.showType && node.isDoOpen) {
                if (this.isBinaryStar && this.freshJsfun != null
                    && $.trim(this.freshJsfun) != "") {
                    try {
                        eval(this.freshJsfun);
                    } catch (e) {
                        this.doError(id, e, "刷新节点状态的方法", this.freshJsfun);
                        return;
                    }
                }
                this.isFinish = true;
            } else {
                this.isFinish = true;
            }
            // 调整父元素的滚动条
            if (!this.showType) {
                this.setScroll(id);
            }
        }
        if (this.inDataGrid != null) {
            var dgObj = eval(this.inDataGrid);
            dgObj.divOnScrollH(eval(this.inDataGrid + "_div"));
        }

    };

    // 调整父元素的滚动条
    this.setScroll = function (id) {
        if (this.inDataGrid != null) {
            return;
        }
        var div = document.getElementById(this.name + "_" + id + "_div");
        var str = document.getElementById(this.name + "_" + id);
        var mainDiv = document.getElementById(this.name + "_main");
        var pNode = mainDiv.parentNode;
        if (pNode != null) {
            var dif = div.offsetTop;
            var curH = dif - pNode.scrollTop;// 该节点在相对高度
            var difH = pNode.offsetHeight - curH - (str.offsetHeight);
            var addH = 0;
            if ((curH + div.offsetHeight) > pNode.offsetHeight) {
                addH = div.offsetHeight - difH;
            }
            if ((curH - addH) < 0) {
                addH = curH - (str.offsetHeight + 2);
            }
            pNode.scrollTop = pNode.scrollTop + addH;
        }
    };

    // 删除孩子节点
    this.removeAllChildren = function (inId) {
        if (this.isShow && this.isDisabled()) {
            return;
        }
        if (inId >= 0 && inId < this.nodeList.length) {
            var thisNode = this.nodeList[inId];
            thisNode.setNodeActive();
            // 父亲节点的重画
            for (var i = 0; i < thisNode.childList.length; i++) {
                this.nodeList[thisNode.childList[i]].isDelete = true;
                this.nodeList[thisNode.childList[i]].deleteOneChildNode();
            }
            thisNode.childList.length = 0;
            this.reDrawSelfNode(inId);
            thisNode.isOpen = false;
            if (thisNode.halfChecked) {
                thisNode.halfChecked = false;
                var thiscb = document
                    .getElementById(this.name + "_che_" + inId);
                if (thiscb != null) {
                    thiscb.checked = false;
                    thiscb.indeterminate = false;
                }
            }
            // 清除孩子节点
            var thisc_div = document.getElementById(this.name + "_" + inId
                + "_div");
            if (thisc_div != null) {
                thisc_div.style.display = "none";
                thisc_div.innerHTML = "";
            }
        }

    };

    // 删除节点
    this.removeNode = function (inId) {
        if (this.isShow && this.isDisabled()) {
            return;
        }
        if (inId >= 0 && inId < this.nodeList.length) {
            var thisNode = this.nodeList[inId];
            if (thisNode.disabled) {
                return;
            }
            this.changeClickID("-1");
            this.setTreeNodeID("-1");
            var ch_node = thisNode.prev();
            if (ch_node == null) {
                ch_node = thisNode.next();
                if (ch_node == null) {
                    ch_node = thisNode.parent();
                }
            }
            thisNode.isDelete = true;
            // 处理CheckBox的选中
            if (ch_node != null) {
                if (!ch_node.halfChecked && ch_node.showCheck) {
                    this.doCheckBox(ch_node.id, ch_node.isChecked);
                }
            }
            if (document.getElementById(this.name + "_" + inId + "_node") != null) {
                var pnodeElm = document.getElementById(this.name + "_" + inId
                    + "_node").parentNode;
                pnodeElm.removeChild(document.getElementById(this.name + "_"
                    + inId + "_node"));
                pnodeElm.removeChild(document.getElementById(this.name + "_"
                    + inId + "_div"));
            }
            var prevNode = thisNode.prev();
            var nextNode = thisNode.next();
            if (prevNode != null && nextNode != null) {
                nextNode.prevId = prevNode.id;
                prevNode.nextId = nextNode.id;
            } else if (prevNode == null && nextNode != null) {
                nextNode.prevId = -1;
            } else if (prevNode != null && nextNode == null) {
                prevNode.nextId = -1;
            }
            thisNode.deleteOneChildNode();

            // 父亲节点的重画
            var p_node = this.nodeList[thisNode.pid];
            var div = document.getElementById(this.name + "_" + p_node.id
                + "_div");
            this.reDrawSelfNode(p_node.id);
            // 重画兄弟和本身
            strTemp = "";
            div.style.display = "none";
            if (p_node.childList.length > 0) {
                div.style.display = "block";
                if (prevNode != null) {
                    strTemp = "";
                    this.reDrawAllNode(prevNode.id);
                }
                if (nextNode != null) {
                    strTemp = "";
                    this.reDrawAllNode(nextNode.id);
                }
            }
        }
    };

    // 删除根节点
    this.removeRoot = function () {
        if (this.isShow && this.isDisabled()) {
            return;
        }
        if ($("#" + this.name + "_main").length > 0) {
            var pnodeElm = document.getElementById(this.name + "_main").parentNode;
            pnodeElm.removeChild(document.getElementById(this.name + "_main"));
            this.nodeList = new Array();
            this.rootList = new Array()
            this.thisDeepNo = 0;
            this.htmlStr = "";
            this.clickID = -1;
            this.isFinish = true;
            this.rmObj = null;
        }
    };

    this.onDragStart = function (inObj, inId) {
        var fNode = this.getNodeById(inId);
        if (fNode != null && !fNode.disabled && this.canDrag) {
            var left = document.body.scrollLeft + window.event.clientX - 5;
            var top = document.body.scrollTop + window.event.clientY - 5;
            var jsObj = document.createElement("div");
            jsObj.id = this.name + "_drag_div";
            jsObj.style.cssText = "position:absolute;left:" + (left) + ";top:"
                + (top) + ";border:0;z-index:100;";
            var node = this.nodeList[inId];
            jsObj.innerHTML = inObj.outerHTML;
            document.body.appendChild(jsObj);
            this.inDrag = true;
            this.dragId = inId;
        }
    };

    this.onDrag = function (inObj, inId) {
        var fNode = this.getNodeById(inId);
        if (fNode != null && !fNode.disabled && this.canDrag) {
            var left = document.body.scrollLeft + window.event.clientX - 5;
            var top = document.body.scrollTop + window.event.clientY - 5;
            var dragDiv = document.getElementById(this.name + "_drag_div");
            if (dragDiv != null) {
                dragDiv.style.posLeft = left;
                dragDiv.style.posTop = top;
            }
            this.inDrag = true;
            this.dragId = inId;
        }
    };

    this.onDragEnd = function (inObj, inId) {
        // if (this.canDrag && !this.disabled){
        var dragDiv = document.getElementById(this.name + "_drag_div");
        if (dragDiv != null) {
            document.body.removeChild(dragDiv);
        }
        this.inDrag = false;
        this.dragX = event.x;
        // }
    };

    this.onDragIn = function (inObj, inId) {
        var fNode = this.getNodeById(this.dragId);
        var tNode = this.getNodeById(inId);
        if (fNode != null && !fNode.disabled && fNode != null
            && !fNode.disabled && this.canDrag && !this.inDrag
            && this.dragId > 0
            && (event.x - this.dragX <= 2 && event.x - this.dragX >= -2)) {
            if (inId != this.dragId) {
                var ret = false;
                if (tNode != null && fNode.pid != tNode.id) {
                    if (this.dragFun != null && this.dragFun != "") {
                        try {
                            ret = eval(this.dragFun + "(" + fNode.id + ", "
                                + tNode.id + ");");
                        } catch (e) {
                            this
                                .doError(this.dragId, e, "拖拽附加方法",
                                this.dragFun);
                        }
                    } else {
                        ret = true;
                    }
                    if (ret != null && ret) {
                        this.changeNode(fNode, tNode);
                    }
                }
                fNode.setNodeActive();
                this.inDrag = false;
                this.dragId = -1;
            }
        }
        if (this.canDrag && !this.disabled && this.inDrag && inObj != null) {
            inObj.className = "tree_node_onfocus";
        }
        this.dragX = -1;
    };
    /** ***节点操作方法结束**** */

    /** ***树的绘制方法开始**** */
        // 画树
    this.DrawTree = function (in_showType) {
        var type = in_showType || false;
        this.htmlStr = "<div id=\"" + this.name + "_main\">";
        this.htmlStr += this.initTree();
        for (var i = 0; i < this.rootList.length; i++) {
            if (!this.rootList[i].isDelete) {
                this.htmlStr += this.DrawNode(this.rootList[i]);
            }
        }
        // alert(this.htmlStr);
        this.htmlStr += "</div>";
        if (type) {
            if (this.father != ""
                && document.getElementById(this.father) != null) {
                var fatObj = document.getElementById(this.father);
                fatObj.innerHTML = this.htmlStr;
            } else {
                document.writeln(this.htmlStr);
            }
            this.setTreeNodeID("-1");
            // 处理CheckBox
            for (var i = 0; i < this.nodeList.length; i++) {
                var oneNode = this.nodeList[i];
                if (!oneNode.isDelete && oneNode.isChecked) {
                    var chElm = document
                        .getElementById(this.name + "_che_" + i);
                    if (chElm.checked) {
                        this.doCheckBox(i, true);
                    }
                }
                // alert(oneNode.showStr + " " + oneNode.disabled);
                if (!oneNode.isDelete && oneNode.disabled) {
                    // oneNode.setDisabled(i, true);
                }
            }
            this.isShow = true;
        } else {
            this.htmlStr = this.initTree();
            document.writeln(this.htmlStr);
            this.isShow = false;
        }
        return this.htmlStr;
    };
    // 重画本节点和孩子节点
    this.reDrawAllNode = function (inId) {
        var node = this.nodeList[inId];
        if (node.disabled) {
            return;
        }
        // 画本身
        this.reDrawSelfNode(inId);
        this.reDrawChildNode(inId);
    }

    // 重画本节点
    this.reDrawSelfNode = function (inId) {
        var node = this.nodeList[inId];
        if (node.disabled) {
            return;
        }
        // 画本身
        var thisdiv = document.getElementById(this.name + "_" + inId + "_node");
        var strTemp = "";
        strTemp += "<nobr>";
        // strTemp += this.DrawNode(p_node.id);
        strTemp += this.DrawLink(inId);
        strTemp += this.DrawShowStr(inId);
        strTemp += "</nobr>";
        thisdiv.innerHTML = strTemp;
    }

    // 重画孩子节点
    this.reDrawChildNode = function (inId) {
        var node = this.nodeList[inId];
        if (node.disabled) {
            return;
        }
        // 画孩子
        var thisc_div = document
            .getElementById(this.name + "_" + inId + "_div");
        var strTemp = "";
        if (thisc_div != null) {
            if (node.childList.length > 0) {
                for (var i = 0; i < node.childList.length; i++) {
                    if (!node.childList[i].isDelete) {
                        strTemp += this.DrawNode(node.childList[i]);
                    }
                }
            }
            thisc_div.innerHTML = strTemp;
        }
    }

    // 重画孩子节点
    this.reDrawOneChildNode = function (inPId, inId) {
        if (inPId < 0) {
            return;
        }
        var p_node = this.nodeList[inPId];
        var node = this.nodeList[inId];
        if (p_node.disabled || node.disabled) {
            return;
        }
        // 画孩子
        var thisc_div = document.getElementById(this.name + "_" + inPId
            + "_div");
        var strTemp = "";
        if (thisc_div != null) {
            if (node.prevId != null && node.prevId >= 0 && this.showLine) {
                // 修改兄弟节点图标
                this.reDrawAllNode(node.prevId);
            }
            strTemp += this.DrawNode(inId);
            thisc_div.innerHTML = (thisc_div.innerHTML + strTemp);
        }
    }

    // 显示新添加的节点(大批量的)
    this.DrawAddNode = function () {
        if (this.isShow && this.isDisabled()) {
            return false;
        }
        // 得到父节点对象
        if (this.addList.length > 0) {
            var first_node = this.nodeList[this.addList[0]];
            var p_node = this.nodeList[first_node.pid];
            this.openParent(p_node.id);
            // 得到父节点的元素
            this.reDrawSelfNode(p_node.id);
            // 展现上一节点
            if (first_node.prevId != null) {
                // 修改兄弟节点图标
                this.reDrawAllNode(first_node.prevId);
            }
            // 展现本身
            var t_htmlStr = "";
            for (var i = 0; i < this.addList.length; i++) {
                t_htmlStr += this.DrawNode(this.addList[i], true);
            }
            // 画孩子
            var thisc_div = document.getElementById(this.name + "_" + p_node.id
                + "_div");
            thisc_div.innerHTML = (thisc_div.innerHTML + t_htmlStr);
            if (this.isBinaryStar) {
                this.optionFrame(true);
            }
        }
    }

    // 画节点
    this.DrawNode = function (id, showType) {
        var strTemp = "";
        var node = this.nodeList[id];
        // 判断该节点是否添加过
        if (showType != null && showType) {
            if (node.isshow != null) {
                return "";
            } else {
                node.isshow = true;
            }
        }
        // alert(node);
        var display = "none";
        if (node.isOpen) {
            display = "block";
        }
        // Draw this node
        var nodeH = "";
        nodeH = "<div class=\"tree_node\" id=\""
            + (this.name + "_" + id + "_node") + "\"  onmouseover=\""
            + this.name + ".onDragIn(this, " + id + ")\"><nobr>";
        nodeH += this.DrawLink(id);
        nodeH += this.DrawShowStr(id);
        nodeH += "</nobr></div>";
        // 本身节点
        strTemp += nodeH;
        // Draw children
        strTemp += "<div id=\"" + (this.name + "_" + id + "_div")
            + "\" style=\"display:" + display + "\">";
        if (node.childList.length > 0) {
            for (var i = 0; i < node.childList.length; i++) {
                if (!node.childList[i].isDelete) {
                    strTemp += this.DrawNode(node.childList[i], showType);
                }
            }
        }
        strTemp += "</div>";
        return strTemp;
    }

    // 画线
    this.DrawLink = function (id) {
        var strTemp = "";
        var node = this.nodeList[id];
        var oi = "Lplus.png";
        var of = "close.png";
        var mclick = "";

        if (!this.showAddImg) {
            this.showLine = false;
        }
        // 递归画上一层的图片
        if (node.pid >= 0) {
            strTemp += this.DrawPLink(node.pid);
        }

        // 设置有孩子节点的图片设置;
        if (node.childList.length > 0
            || (this.showType && node.isDoOpen == false && node.openjs != "")) {
            if (node.isOpen) {
                of = "open.png";
                oi = "minus.png";
                if (node.openImg != null && node.openImg != "") {
                    of = node.openImg;
                }
            } else {
                of = "close.png";
                oi = "plus.png";
                if (node.closeImg != null && node.closeImg != "") {
                    of = node.closeImg;
                }
            }
            if (node.pid < 0) {// root
                if (this.rootList[this.rootList.length - 1] != id) {
                    oi = ("T" + oi);
                } else {
                    oi = ("L" + oi);
                }
            } else {
                if (this.nodeList[node.pid].childList[this.nodeList[node.pid].childList.length - 1] != id) {
                    oi = ("T" + oi);
                } else {
                    oi = ("L" + oi);
                }
            }
        } else {
            // 设置无孩子节点的图片
            if (node.pid >= 0) {
                if (this.showLine) {
                    if (this.nodeList[node.pid].childList[this.nodeList[node.pid].childList.length - 1] != id) {
                        oi = "T.png";
                    } else {
                        oi = "L.png";
                    }
                } else {
                    oi = "empty.png";
                }
            } else {
                if (this.showLine) {
                    if (this.rootList[this.rootList.length - 1] == id) {
                        oi = "L.png";
                    } else if (this.rootList[0] == id) {
                        oi = "P.png";
                    } else {
                        oi = "T.png";
                    }
                } else {
                    oi = "empty.png";
                }
            }
            of = "jsdoc.png";
            if (node.nodeImg != null && node.nodeImg != "") {
                of = node.nodeImg;
            }
        }
        // 画+-图片
        if (this.showAddImg) {
            strTemp += "<img class=\"node_img\" style=\"cursor:hand;\" onclick=\""
                + this.name
                + ".doOpen("
                + id
                + ")\" id=\""
                + this.name
                + "_"
                + id
                + "_o\" align=\"absmiddle\" alt=\"\" src=\""
                + this.imagePath + oi + "\" border=\"0\"/>";
        }
        // 画节点图片
        if (this.showNodeImg) {
            strTemp += "<img align=\"absmiddle\" style=\"cursor:hand;\" id=\""
                + this.name + "_" + id + "_f\" alt=\"\" onclick=\""
                + this.name + ".doOpen(" + id + ")\" src=\""
                + this.imagePath + of + "\" border=\"0\"/>";
        }
        // 画checkbox
        strTemp += "<input type=\"checkbox\" id=\"" + this.name + "_che_" + id
            + "\" name=\"" + this.name + "_che_" + id
            + "\" class=\"tree_check\" onclick=\"" + this.name
            + ".doCheckBox(" + id + ", null,true)\"";
        if (!this.nodeList[id].showCheck) {
            strTemp += " style=\"display:none;\"";
        }
        if (this.nodeList[id].isChecked) {
            strTemp += " checked";
        } else if (this.nodeList[id].halfChecked) {
            strTemp += " indeterminate=-1";
        }
        if (this.disabled || node.disabled) {
            strTemp += " disabled=\'disabled\'";
        }
        strTemp += " onFocus=\"this.blur();\"/>";
        // alert(strTemp);
        return strTemp;
    }

    // 画父节点的线
    this.DrawPLink = function (id) {
        var strTemp = "";
        var node = this.nodeList[id];
        var img_id = this.name + "_" + id + "_p";
        // Draw pid
        if (node.pid >= 0) {
            strTemp += this.DrawPLink(node.pid);
        }
        if (!this.showLine) {
            strTemp += "<img id=\"" + img_id + "\" name=\"" + img_id
                + "\" align=\"absmiddle\" alt=\"\" src=\"" + this.imagePath
                + "empty.png\" border=\"0\"/>";
        } else {
            if (node.pid < 0) {
                if (this.rootList[this.rootList.length - 1] != id) {
                    strTemp += "<img id=\"" + img_id + "\" name=\"" + img_id
                        + "\" align=\"absmiddle\" alt=\"\" src=\""
                        + this.imagePath + "I.png\" border=\"0\"/>";
                } else {
                    strTemp += "<img id=\"" + img_id + "\" name=\"" + img_id
                        + "\" align=\"absmiddle\" alt=\"\" src=\""
                        + this.imagePath + "empty.png\" border=\"0\"/>";
                }
            } else {
                if (this.nodeList[node.pid].childList[this.nodeList[node.pid].childList.length - 1] != id) {
                    strTemp += "<img id=\"" + img_id + "\" name=\"" + img_id
                        + "\" align=\"absmiddle\" alt=\"\" src=\""
                        + this.imagePath + "I.png\" border=\"0\"/>";
                } else {
                    strTemp += "<img id=\"" + img_id + "\" name=\"" + img_id
                        + "\" align=\"absmiddle\" alt=\"\" src=\""
                        + this.imagePath + "empty.png\" bswebrder=\"0\"/>";
                }
            }
        }
        return strTemp;
    }

    // 输出文字
    this.DrawShowStr = function (id) {
        var node = this.nodeList[id];
        var tclass = "tree_a";
        var disab = "";
        if (this.disabled) {
            disab = " disabled=\'disabled\'";
        } else {
            if (node.isError) {
                tclass = "tree_error";
            } else if (node.id == this.clickID) {
                tclass = "tree_node_onfocus";
            }
        }
        var strTemp = "&nbsp;<a title=\"" + node.getTitle() + "\" id=\""
            + (this.name + "_" + id)
            + "\"  href=\"javascript:void(0);\" class=\"" + tclass
            + "\" onfocus=\"this.blur();\"" + disab + " ";
        strTemp += "onmousedown=\"" + this.name + ".doJSFun(" + id + ")\" ";
        strTemp += "onclick=\"window.event.returnValue=false;\" onDragstart=\""
            + this.name + ".onDragStart(this, " + id + ")\" ondrag=\""
            + this.name + ".onDrag(this, " + id + ")\"  ondragend=\""
            + this.name + ".onDragEnd(this, " + id + ")\"";
        if (this.rmObj != null) {
            strTemp += "onmouseup=\"" + this.name + ".showRM(" + id + ")\"";
        }
        if (node.disabled) {
            strTemp += "  disabled=\'disabled\'";
        }
        strTemp += ">" + node.showStr + "</a>";
        //alert(strTemp);
        return strTemp;
    }
    /** ***树的绘制方法结束**** */

    /** ***设置树节点状态方法开始**** */
        // 设置当前激活的节点
    this.changeClickID = function (id) {
        if (!(this.clickID < 0 || this.clickID == id)) {
            var c_node = this.nodeList[this.clickID];
            if (!c_node.isError) {
                var str = document.getElementById(this.name + "_"
                    + this.clickID);
                if (str != null) {
                    str.className = "tree_node_onblur";
                }
            }
        }
        if (id >= 0 && id < this.nodeList.length) {
            var this_node = this.nodeList[id];
            if (!this_node.isError) {
                var str = document.getElementById(this.name + "_" + id);
                if (str != null) {
                    str.className = "tree_node_onfocus";
                }
            }
        }
        this.clickID = id;
    }

    // 节点收起时，判断是否存在激活状态的孩子节点
    this.getChgFlg = function (id) {
        var node = this.nodeList[id];
        for (var i = 0; i < node.childList.length; i++) {
            var cnode_id = node.childList[i];
            if (this.getChgFlg(cnode_id)) {
                return true;
            } else if (this.clickID == cnode_id) {
                return true;
            }
        }
        return false;
    }

    // 点击CheckBox的操作
    this.doCheckBox = function (inId, flg, isDoJSFun) {
        if (this.isShow && this.isDisabled()) {
            return;
        }
        if (inId == null || (inId < 0 && inId >= this.nodeList.length)) {
            alert("请输入正确的节点索引！");
        }
        var node = this.nodeList[inId];
        if (node.disabled) {
            return;
        }
        if (this.showCheck && !node.showCheck) {
            alert("该节点不拥有CheckBox控件，无法操作！");
            return;
        }
        var thiscb = document.getElementById(this.name + "_che_" + inId);
        if (flg != null) {
            node.isChecked = flg;
            thiscb.checked = flg;
            thiscb.indeterminate = false;
            node.halfChecked = false
        } else {
            if (node.halfChecked) {
                thiscb.indeterminate = false;
                node.halfChecked = false;
                flg = true;
                thiscb.checked = true;
            }
            node.isChecked = thiscb.checked;
            flg = thiscb.checked;
        }

        var tempFlg = -1;
        if (node.isChecked) {
            tempFlg = 1;
        } else if (node.halfChecked) {
            tempFlg = 0;
        }
        this.doSetChecked(inId, node.isChecked);
        // 处理父亲节点的选中
        this.doParentChecked(inId, tempFlg);
        // 执行选中后的操作
        if (isDoJSFun && node.checkJSFun != "") {
            try {
                eval(node.checkJSFun);
            } catch (e) {
                this.doError(node.id, e, "点击节点CheckBox的方法", node.checkJSFun);
                return;
            }
        }
    }

    // 得到选择中的节点列表。
    this.getCheckedNodes = function (isAll) {
        var checkedNodes = new Array();
        var listStr = "";
        for (var i = 0; i < this.nodeList.length; i++) {
            var node = this.nodeList[i];
            if (node.showCheck
                && (node.isChecked || (isAll && node.halfChecked))
                && !node.isDelete) {
                listStr += (node.id + ",");
                checkedNodes.length++;
                checkedNodes[checkedNodes.length - 1] = node;
            }
        }
        document.getElementById(this.name + "_checkedNodes").value = listStr;
        return checkedNodes;
    }

    // 得到不确定选项的状态
    this.getHalfCheckedNodes = function () {
        var checkedNodes = new Array();
        var listStr = "";
        for (var i = 0; i < this.nodeList.length; i++) {
            var node = this.nodeList[i];
            if (node.showCheck && node.halfChecked && !node.isDelete) {
                listStr += (node.id + ",");
                checkedNodes.length++;
                checkedNodes[checkedNodes.length - 1] = node;
            }
        }
        document.getElementById(this.name + "_halfCheckedNodes").value = listStr;
        return checkedNodes;
    }

    // 设置父节点的选中状态
    this.doParentChecked = function (id, flg) {
        var node = this.nodeList[id];
        if (!node.showCheck || node.pid < 0) {
            return;
        }
        var ch_thiscb = document.getElementById(this.name + "_che_" + node.pid);
        if (this.checkType == 0) {
            if (flg > 0) {
                // 选中
                // 只要一个兄弟节点没选中，父亲节点变为半选
                if (!this.getAllChildNodeChecked(node.pid, true)
                    || !this.getAllChildNodeHalfChecked(node.pid)) {
                    ch_thiscb.checked = false;
                    this.nodeList[node.pid].isChecked = false;
                    ch_thiscb.indeterminate = true;
                    this.nodeList[node.pid].halfChecked = true;
                } else {
                    ch_thiscb.checked = true;
                    this.nodeList[node.pid].isChecked = true;
                    ch_thiscb.indeterminate = false;
                    this.nodeList[node.pid].halfChecked = false;
                }
                this.doParentChecked(node.pid, flg);
            } else if (flg < 0) {
                // 不选中
                ch_thiscb.checked = false;
                this.nodeList[node.pid].isChecked = false;
                ch_thiscb.indeterminate = false;
                // 所有兄弟节点有一个不选中，父节点半选
                this.nodeList[node.pid].halfChecked = false;
                if (!this.getAllChildNodeChecked(node.pid, false)
                    || !this.getAllChildNodeHalfChecked(node.pid)) {
                    ch_thiscb.indeterminate = true;
                    this.nodeList[node.pid].halfChecked = true;
                }
                this.doParentChecked(node.pid, flg);
            } else {
                // 半选
                ch_thiscb.checked = false;
                this.nodeList[node.pid].isChecked = false;
                ch_thiscb.indeterminate = true;
                this.nodeList[node.pid].halfChecked = true;
                this.doParentChecked(node.pid, flg);
            }
        } else if (this.checkType == 1) {
            if (flg > 0) {
                // 选中
                if (!ch_thiscb.checked) {
                    ch_thiscb.checked = false;
                    this.nodeList[node.pid].isChecked = false;
                    ch_thiscb.indeterminate = true;
                    this.nodeList[node.pid].halfChecked = true;
                    this.doParentChecked(node.pid, flg);
                }
            } else if (flg < 0) {
                // 不选中
                if (!ch_thiscb.checked) {
                    ch_thiscb.checked = false;
                    this.nodeList[node.pid].isChecked = false;
                    ch_thiscb.indeterminate = false;
                    // 所有兄弟节点有一个不选中，父节点半选
                    this.nodeList[node.pid].halfChecked = false;
                    if (!this.getAllChildNodeChecked(node.pid, false)
                        || !this.getAllChildNodeHalfChecked(node.pid)) {
                        ch_thiscb.indeterminate = true;
                        this.nodeList[node.pid].halfChecked = true;
                    }
                    this.doParentChecked(node.pid, flg);
                }
            }
        }
    }

    this.doSetChecked = function (id, flg) {
        var node = this.nodeList[id];
        node.halfChecked = false;
        // 处理孩子节点的选中
        for (var i = 0; i < node.childList.length; i++) {
            var ch_node = this.nodeList[node.childList[i]];
            if (!ch_node.isDelete) {
                if (this.checkType == 0) {
                    var ch_thiscb = document.getElementById(this.name + "_che_"
                        + node.childList[i]);
                    ch_thiscb.indeterminate = false;
                    ch_thiscb.checked = flg;
                    ch_node.isChecked = flg;
                    ch_node.halfChecked = false;
                    this.doSetChecked(node.childList[i], flg);
                } else if (this.checkType == 1) {
                    var p_thiscb = document.getElementById(this.name + "_che_"
                        + node.id);
                    if (!p_thiscb.checked) {
                        if (!this.getAllChildNodeChecked(node.id, false)
                            || !this.getAllChildNodeHalfChecked(node.id)) {
                            p_thiscb.indeterminate = true;
                            this.nodeList[node.id].halfChecked = true;
                        }
                    }
                }
            }
        }
    }

    // 判断孩子是否都选中了
    this.getAllChildNodeChecked = function (id, type) {
        var node = this.nodeList[id];
        for (var i = 0; i < node.childList.length; i++) {
            var ch_node = this.nodeList[node.childList[i]];
            if (!ch_node.isDelete) {
                if (type == null || type) {
                    if (!ch_node.isChecked) {
                        return false;
                    }
                } else if (!type) {
                    if (ch_node.isChecked) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // 判断孩子是否有半选中
    this.getAllChildNodeHalfChecked = function (id) {
        var node = this.nodeList[id];
        for (var i = 0; i < node.childList.length; i++) {
            var ch_node = this.nodeList[node.childList[i]];
            if (!ch_node.isDelete) {
                if (ch_node.halfChecked) {
                    return false;
                }
            }
        }
        return true;
    }

    /** ***设置树节点状态方法结束**** */

    /** ***树的附加动作开始**** */
        // 执行点击节点的JS方法。
    this.doJSFun = function (id) {
        window.event.cancelBubble = true;
        if (window.event.button != 2) {
            this.doActivedById(id);
        }
    }

    this.doActivedById = function (id) {
        this.setNodeActiveById(id);
        if (this.isShow && this.isDisabled()) {
            return;
        }
        var node = this.nodeList[id];
        if (node.disabled) {
            return;
        }
        if (!this.isFinish && this.showType) {
            alert("您的节点事件出现异常，或是重复提交！");
            return;
        }
        this.changeClickID(id);
        this.setTreeNodeID(id);
        if (node.jsfun != "") {
            try {
                eval(node.jsfun);
            } catch (e) {
                this.doError(id, e, "点击节点的方法", node.jsfun);
                return;
            }
        }
        return node;
    }

    this.doActivedByName = function (inName) {
        if (this.isShow && this.isDisabled()) {
            return null;
        }
        if (inName == null || inName == "") {
            alert("请输入正确的节点名！");
            return;
        }
        var node = this.getNodeByName(inName);
        if (node != null) {
            this.doActivedById(node.id);
        }
        return node;
    }

    // 初始化树
    this.initTree = function () {
        var strTemp = "";
        if (document.getElementById(this.name + "_thisTreeNodeID") == null) {
            strTemp += "<input type=\"hidden\" id=\"" + this.name
                + "_thisTreeNodeID\" name=\"" + this.name
                + "_thisTreeNodeID\" value=\"\">";
            strTemp += "<input type=\"hidden\" id=\"thisTreeName\" name=\"thisTreeName\" value=\"\">";
            strTemp += "<input type=\"hidden\" id=\"" + this.name
                + "_checkedNodes\"  name=\"" + this.name
                + "_checkedNodes\" value=\"\">";
            strTemp += "<input type=\"hidden\" id=\"" + this.name
                + "_halfCheckedNodes\" name=\"" + this.name
                + "_halfCheckedNodes\" value=\"\">";
        }
        return strTemp;
    };

    // 创建或删除内部桢(用于BinaryStar的即点即查树)
    this.optionFrame = function (optionType) {
        if (this.isShow && this.isDisabled()) {
            return false;
        }
        var frame = document.getElementById("BSTree_frame_tab");
        var tree = document.getElementById(this.name + "_main");
        if (tree == null) {
            return false;
        }
        if (optionType) {
            if (frame == null) {
                // 创建
                var tree_tab = document.createElement("table");
                tree_tab.id = "BSTree_frame_tab";
                tree_tab.style.cssText = "width:1px;height:1px;";
                var row = tree_tab.insertRow(0);
                var sell = row.insertCell(0);
                sell.style.cssText = "width:1px;height:1px";
                sell.innerHTML = "<iframe name=\"BSTree_frame\" id=\"BSTree_frame\" src=\"\" style=\"margin:0px\" height=\"1px\" width=\"1px\" scrolling=\"no\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\"></iframe>";
                tree.appendChild(tree_tab);
            }
        } else {
            if (frame != null) {
                // 删除
                tree.removeChild(frame);
            }
        }
        return true;
    };

    // 设置选中的操作
    this.doTreeNodeRef = function () {
        if (this.isShow && this.isDisabled()) {
            return;
        }
        var node = this.nodeList[this.clickID];
        // 刷新
        //node.childList = new Array();
        eval(node.openjs);
    };
    /** ***树的附加动作结束**** */

    /** ***用户使用JS函数开始**** */
        // 设置指定节点的选中状态
    this.setNodeActiveById = function (inId) {
        if (this.isShow && this.isDisabled()) {
            return null;
        }
        if (inId == null) {
            alert("请输入一个数字！");
            return;
        }
        if (inId >= 0 && inId < this.nodeList.length) {
            var node = this.nodeList[inId];
            if (node.disabled) {
                return;
            }
            this.openParent(node.pid);
            this.changeClickID(inId);
            this.setTreeNodeID(inId);
            return this.nodeList[inId];
        }
        return null;
    };
    this.setNodeActiveByName = function (inName) {
        if (this.isShow && this.isDisabled()) {
            return null;
        }
        if (inName == null || inName == "") {
            alert("请输入正确的节点名！");
            return;
        }
        var node = this.getNodeByName(inName);
        if (node != null && !node.disabled) {
            this.openParent(node.id);
            this.changeClickID(node.id);
            this.setTreeNodeID(node.id);
        }
        return node;
    };

    // 打开/关闭指定节点
    this.expandById = function (inId) {
        if (inId == null) {
            alert("请输入一个数字！");
            return;
        }
        if (inId >= 0 && inId < this.nodeList.length) {
            this.openParent(this.nodeList[inId].pid);
            this.doOpen(inId);
            return this.nodeList[inId];
        }
        return null;
    };
    this.expandByName = function (inName) {
        if (inName == null || inName == "") {
            alert("请输入正确的节点名！");
            return;
        }
        var node = this.getNodeByName(inName);
        if (node != null) {
            this.expandById(node.id);
        }
        return node;
    };

    // 打开指定节点
    this.openById = function (inId) {
        if (inId == null) {
            alert("请输入一个数字！");
            return;
        }
        if (inId >= 0 && inId < this.nodeList.length) {
            if (!this.nodeList[inId].openFlag()) {
                this.openParent(this.nodeList[inId].pid);
                this.doOpen(inId);
            }
            return this.nodeList[inId];
        }
        return null;
    };
    this.openByName = function (inName) {
        if (inName == null || inName == "") {
            alert("请输入正确的节点名！");
            return;
        }
        var node = this.getNodeByName(inName);
        if (node != null) {
            this.openById(node.id);
        }
        return node;
    };

    // 关闭指定节点
    this.closeById = function (inId) {
        if (inId == null) {
            alert("请输入一个数字！");
            return;
        }
        if (inId >= 0 && inId < this.nodeList.length) {
            if (this.nodeList[inId].openFlag()) {
                this.doOpen(inId);
            }
            return this.nodeList[inId];
        }
        return null;
    };
    this.closeByName = function (inName) {
        if (inName == null || inName == "") {
            alert("请输入正确的节点名！");
            return;
        }
        var node = this.getNodeByName(inName);
        if (node != null) {
            this.closeById(node.id);
        }
        return node;
    };

    // 设置重复点击判断(用户即点即查)
    this.setFinish = function (flg, batchFlg) {
        if (flg == null || flg == "false" || !flg) {
            this.isFinish = false;
            // 是否批量
            if (batchFlg != null && (batchFlg == "true" || batchFlg)) {
                this.batchFlg = true;
            }

            if (this.showType) {
                this.thisOppNode = this.getSelectNode();
                if (this.thisOppNode == null) {
                    this.thisOppNode = this.getNodeById(0);
                }
            }
        } else {
            this.isFinish = true;
            if (this.showType && this.thisOppNode != null && this.thisOppNode.childList.length <= 0) {
                this.thisOppNode.updateNode(this.thisOppNode);
            }
            // 展现添加的节点
            if (this.batchFlg) {
                this.DrawAddNode();
            }
            if (this.thisOppNode != null) {
                this.setScroll(this.thisOppNode.id);
            }
            this.batchFlg = false;
            this.thisOppNode = null;
            this.addList.length = 0;
        }
    };
    this.getFinish = function () {
        return this.isFinish;
    };

    // 根据节点显示的内容模糊查询
    this.searcNodesByText = function (inText) {
        if (inText == null || inText == "") {
            alert("请输入要匹配的字符串！");
            return;
        }
        var resNodes = new Array();
        for (var i = 0; i < this.nodeList.length; i++) {
            if ($.trim(this.nodeList[i].showStr).indexOf(inText) >= 0) {
                resNodes.length++;
                resNodes[resNodes.length - 1] = this.nodeList[i];
            }
        }
        if (resNodes.length <= 0) {
            alert("没有找到匹配的节点！");
        }
        return resNodes;
    };

    // 根据节点关键字模糊查询
    this.searcNodesByName = function (inName) {
        if (inName == null || inName == "") {
            alert("请输入要匹配的字符串！");
            return;
        }
        var resNodes = new Array();
        for (var i = 0; i < this.nodeList.length; i++) {
            if ($.trim(this.nodeList[i].name).indexOf(inName) >= 0) {
                resNodes.length++;
                resNodes[resNodes.length - 1] = this.nodeList[i];
            }
        }
        if (resNodes.length <= 0) {
            alert("没有找到匹配的节点！");
        }
        return resNodes;
    };

    // 根据节点关键字检索节点
    this.getNodeByName = function (inName) {
        for (var i = 0; i < this.nodeList.length; i++) {
            if (this.nodeList[i].getName() == inName
                && !this.nodeList[i].isDelete) {
                return this.nodeList[i];
            }
        }
        return null;
    };

    // 根据节点索引检索节点
    this.getNodeById = function (inId) {
        if (inId >= 0 && inId < this.nodeList.length) {
            return this.nodeList[inId];
        }
        return null;
    };

    // 设置当前选中树节点
    this.setTreeNodeID = function (in_id) {
        if (this.disabled) {
            return;
        }
        document.getElementById(this.name + "_thisTreeNodeID").value = in_id;
        document.getElementById("thisTreeName").value = this.name;
    };

    this.getSelectNode = function () {
        if (this.getTreeNodeID() >= 0
            && this.getTreeNodeID() < this.nodeList.length) {
            return this.nodeList[this.getTreeNodeID()];
        } else {
            // alert("没有选中的节点！");
            return null;
        }
    };

    this.getTreeNodeID = function () {
        return document.getElementById(this.name + "_thisTreeNodeID").value;
    };

    // 得到当前选中的树节点ID
    this.getTreeNodePid = function () {
        var reStr = this.nodeList[this.getTreeNodeID()].pid;
        return reStr;
    }

    // 得到当前选中的树节点的附属参数
    this.getTreeNodePara = function () {
        var reStr = this.nodeList[this.getTreeNodeID()].paras;
        return reStr;
    }

    // 得到当前选中的树节点的名称
    this.getTreeNodeName = function () {
        var reStr = this.nodeList[this.getTreeNodeID()].name;
        return reStr;
    }

    // 得到当前选中的树节点的显示内容
    this.getTreeNodeShowStr = function () {
        var reStr = this.nodeList[this.getTreeNodeID()].showStr;
        return reStr;
    }

    // 得到当前选中的树节点的JS动作名
    this.getTreeNodeJsFun = function () {
        var reStr = this.nodeList[this.getTreeNodeID()].jsfun;
        return reStr;
    }

    // 根据附属参数名得到当前选中的树节点的对应附属参数值
    this.getTreeOneParaByName = function (in_paraName) {
        var reStr = this.getTreeNodePara();
        if (reStr != null && reStr != "") {
            var temp1 = reStr;
            var a = temp1.split("&");
            for (var i = 0; i < a.length; i++) {
                var t = a[i].split("=");
                if (t[0] == in_paraName) {
                    return t[1];
                }
            }
        }
    }
    /** ***用户使用JS函数结束**** */
}

function BSNode(id, pid, deepID, treeName, name, showStr, jsfun, openjs, paras,
                isOpen, isDoOpen) {
    this.id = id;// 节点索引。
    this.pid = pid;// 父节点索引,为-1表示是根。
    this.deepID = deepID;// 节点深度。
    this.showStr = showStr || "BSNode_" + this.id;// 节点显示的文字内容
    this.jsfun = jsfun || ""// 该节点点击的JS操作
    this.closejs = ""// 收缩该节点的方法
    this.openjs = openjs || ""// 即点即查，该节点点击展开的JS操作。
    this.treeName = treeName || "BSTreeView";// 树对象实例名。
    this.name = name ? name : "BSNode";// 节点名。
    this.paras = paras || "";// 节点其他参数。
    this.childList = new Array();
    this.isOpen = isOpen || false;
    this.isDoOpen = isDoOpen || false;
    this.openImg = "open.png";
    this.closeImg = "close.png";
    this.nodeImg = "jsdoc.png";
    this.body = null;
    this.isDelete = false;
    this.title = "";// 节点的title
    this.showCheck = false;
    this.isChecked = false;
    this.checkJSFun = "";// 点击checkbox的附加方法
    this.halfChecked = false;
    this.isError = false;
    this.disabled = false;// 是否可用。true：不可用；false：可用；缺省为可用。
    this.prevId = -1;
    this.nextId = -1;

    /** ***get/set方法开始**** */
    this.getId = function () {
        return this.id;
    };
    this.setId = function (inId) {
        this.id = inId;
    };

    this.getName = function () {
        return this.name;
    };
    this.setName = function (inName) {
        this.name = inName;
    };

    this.setBody = function (inBody) {
        this.body = inBody;
    };
    this.getBody = function () {
        return this.body;
    };

    // 更新节点显示的文字
    this.setShowStr = function (inStr) {
        var tempTree = eval(this.treeName);
        if (tempTree.isDisabled()) {
            return false;
        }
        this.showStr = inStr;
        if ($("#" + this.treeName + "_" + this.id).length > 0) {
            $("#" + this.treeName + "_" + this.id).children().remove();
            $("#" + this.treeName + "_" + this.id).html(this.showStr);
        }
    };
    this.getShowStr = function () {
        return this.showStr;
    };

    this.setTitle = function (inTitle) {
        var tempTree = eval(this.treeName);
        if (tempTree.isDisabled()) {
            return false;
        }
        this.title = inTitle;
        var str = document.getElementById(this.treeName + "_" + this.id);
        if (str != null) {
            str.title = inTitle;
        }
    };
    this.getTitle = function () {
        return this.title;
    };

    this.openFlag = function () {
        return this.isOpen;
    };

    this.getDeep = function () {
        return this.deepID;
    };

    /** ***get/set方法结束**** */

    /** ***节点操作方法开始**** */
    this.addChildItem = function (id) {
        var tempTree = eval(this.treeName);
        if (tempTree.isDisabled()) {
            return false;
        }
        this.childList.length++;
        this.childList[this.childList.length - 1] = id;
    };

    // 更新一个节点
    this.updateNode = function (inNode) {
        if (this.disabled) {
            return null;
        }
        var tempTree = eval(this.treeName);
        return tempTree.updateNode(this.id, inNode);
    };

    // 添加子节点
    this.addNode = function (name, showStr, jsfun, openjs, paras, isOpen,
                             isDoOpen, openImg, closeImg, nodeImg) {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        return tempTree.addNode(this.id, (this.deepID + 1), name, showStr,
            jsfun, openjs, paras, isOpen, isDoOpen, openImg, closeImg,
            nodeImg);
    };

    this.addOneNode = function (inId) {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        return tempTree.addOneNode(this.id, tempTree.getNodeById(inId));
    };

    this.deleteOneChildNode = function () {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        var p = -1;
        if (this.pid < 0) {
            // 单个根节点（暂不提供）
        } else {
            var p_node = tempTree.nodeList[this.pid];
            for (var i = 0; i < p_node.childList.length; i++) {
                // 得到孩子位置
                if (p_node.childList[i] == this.id) {
                    p = i;
                }
                if (p >= 0 && i <= p_node.childList.length - 2) {
                    p_node.childList[i] = p_node.childList[i + 1];
                }
            }
            if (p >= 0) {
                p_node.childList.length--;
            }
        }
    }

    // 删除本节点
    this.remove = function () {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        tempTree.removeNode(this.id);
    }

    // 激活该节点
    this.setNodeActive = function () {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        tempTree.setNodeActiveById(this.id);
    }

    // 激活该节点并执行操作
    this.doActived = function () {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        tempTree.doActivedById(this.id);
    }

    // 打开/关闭本节点
    this.expand = function () {
        var tempTree = eval(this.treeName);
        tempTree.expandById(this.id);
    }

    // 打开本节点
    this.open = function () {
        if (!this.isOpen) {
            var tempTree = eval(this.treeName);
            tempTree.openById(this.id);
        }
    }
    // 关闭本节点
    this.close = function () {
        if (this.isOpen) {
            var tempTree = eval(this.treeName);
            tempTree.closeById(this.id);
        }
    }

    // 删除本节点的所有孩子节点
    this.removeAllChildren = function () {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        tempTree.removeAllChildren(this.id);
        this.setNodeActive();
    }
    /** ***节点操作方法开始**** */

    /** ***亲属节点开始**** */
        // 得到上一个兄弟
    this.prev = function () {
        var tempTree = eval(this.treeName);
        if (this.prevId != null || this.prevId >= 0) {
            return tempTree.nodeList[this.prevId];
        }
        return null;
    }

    // 得到下一个兄弟
    this.next = function () {
        var tempTree = eval(this.treeName);
        if (this.nextId != null && this.nextId >= 0) {
            return tempTree.nodeList[this.nextId];
        }
        return null;
    }

    // 得到第一个兄弟
    this.first = function () {
        var tempTree = eval(this.treeName);
        var p_node = tempTree.nodeList[this.pid];
        return tempTree.nodeList[p_node.childList[0]];
    }

    // 得到最后一个兄弟
    this.last = function () {
        var tempTree = eval(this.treeName);
        var p_node = tempTree.nodeList[this.pid];
        return tempTree.nodeList[p_node.childList[p_node.childList.length - 1]];
    }

    // 得到父亲
    this.parent = function () {
        var tempTree = eval(this.treeName);
        if (this.pid >= 0) {
            return tempTree.nodeList[this.pid];
        }
        return null;
    }

    // 得到孩子节点集合
    this.children = function () {
        var tempTree = eval(this.treeName);
        var tempList = new Array(this.childList.length);
        for (var i = 0; i < this.childList.length; i++) {
            tempList[i] = tempTree.nodeList[this.childList[i]];
        }
        return tempList;
    }
    /** ***亲属节点结束**** */

    /** ***用户使用JS函数开始**** */
        // 根据附属参数名得到本节点的对应附属参数值
    this.getTreeOneParaByName = function (paraName) {
        if (this.paras != null && this.paras != "") {
            var temp1 = this.paras;
            var a = temp1.split("&");
            for (var i = 0; i < a.length; i++) {
                var t = a[i].split("=");
                if (t[0] == paraName) {
                    return t[1];
                }
            }
        }
    }

    // 根据节点显示的内容模糊查询子节点
    this.searcNodesByText = function (inText) {
        if (inText == null || inText == "") {
            alert("请输入要匹配的字符串！");
            return;
        }
        var tempTree = eval(this.treeName);
        var resNodes = new Array();
        this.searchChildrenNodeByText(resNodes, inText);
        if (resNodes.length <= 0) {
            alert("没有找到匹配的节点！");
        }
        return resNodes;
    }

    // 根据节点的关键字模糊查询
    this.searcNodesByName = function (inName) {
        if (inName == null || inName == "") {
            alert("请输入要匹配的字符串！");
            return;
        }
        var tempTree = eval(this.treeName);
        var resNodes = new Array();
        this.searchChildrenNodeByName(resNodes, inName);
        if (resNodes.length <= 0) {
            alert("没有找到匹配的节点！");
        }
        return resNodes;
    }
    /** ***用户使用JS函数结束**** */

        // 查找匹配的孩子节点(私有)
    this.searchChildrenNodeByName = function (resNodes, inName) {
        var tempTree = eval(this.treeName);
        for (var i = 0; i < this.childList.length; i++) {
            var thisNode = tempTree.nodeList[this.childList[i]];
            if ($.trim(thisNode.name).indexOf(inName) >= 0) {
                resNodes.length++;
                resNodes[resNodes.length - 1] = thisNode;
            }
            // 查找孩子的孩子
            if (thisNode.childList.length > 0) {
                thisNode.searchChildrenNodeByName(resNodes, inName);
            }
        }
    }

    // 查找匹配的孩子节点(私有)
    this.searchChildrenNodeByText = function (resNodes, inText) {
        var tempTree = eval(this.treeName);
        for (var i = 0; i < this.childList.length; i++) {
            var thisNode = tempTree.nodeList[this.childList[i]];
            if ($.trim(thisNode.showStr).indexOf(inText) >= 0) {
                resNodes.length++;
                resNodes[resNodes.length - 1] = thisNode;
            }
            // 查找孩子的孩子
            if (thisNode.childList.length > 0) {
                thisNode.searchChildrenNodeByText(resNodes, inText);
            }
        }
    }

    // checbox的操作
    this.doCheckBox = function (flg) {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        tempTree.doCheckBox(this.id, flg);
    }

    // 设置是否有CheckBox
    this.showCheckBox = function (flg) {
        var tempTree = eval(this.treeName);
        if (tempTree.isShow && this.disabled) {
            return null;
        }
        tempTree.showNodeCheckBox(this.id, flg);
    }

    // 得到该节点是否可用
    this.isDisabled = function () {
        return this.disabled;
    }
    // 设置该节点孩子节点是否可用
    this.setDisabled = function (inFlg) {
        var tempTree = eval(this.treeName);
        tempTree.setNodeDisabled(this.id, inFlg);
    }
}
