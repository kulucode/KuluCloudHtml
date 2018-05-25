function tableInit(){
    layui.use('table', function () {
		var table = layui.table;
		//监听表格复选框选择
		table.on('checkbox(demo)', function (obj) {
			console.log(obj)
		});
		//监听工具条
		table.on('tool(demo)', function (obj) {
			var data = obj.data;
			if (obj.event === 'detail') {
            layer.open({
                type: 2,
                title: false,
                // closeBtn: 0, //不显示关闭按钮
                // shade: [0],
                area: ['1000px', '500px'],
                // offset: 'auto', //右下角弹出
                // time: 2000, //2秒后自动关闭
                // shift: 2,
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    //按钮【按钮一】的回调
                    return false
                  }
                  ,btn2: function(index, layero){
                    //按钮【按钮二】的回调
                    
                    //return false 开启该代码可禁止点击该按钮关闭
                  },
                content: ['../../html/setup/device/edit_device.html', 'no'], //iframe的url，no代表不显示滚动条
                success: function(layero, index){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    body.find('#name').val(data.name);
                    body.find('#grade').val(data.team);
                    body.find('#num').val(data.num);
                    body.find('#number').val(data.code);
                    body.find('#age').val(data.age);
                    body.find('#tel').val(data.phone);
                    body.find('#insured').val(data.insured);
                },
            });
			} else if (obj.event === 'del') {
				layer.confirm('真的删除行么', function (index) {
					obj.del();
					layer.close(index);
				});
			} else if (obj.event === 'edit') {
                layer.alert('编辑行：<br>'+ JSON.stringify(data))
			}
		});

		var $ = layui.$,
			active = {
				reload: function () {
					var demoReload = $('#demoReload');

					//执行重载
					table.reload('testReload', {
						page: {
							curr: 1 //重新从第 1 页开始
						},
						where: {
							key: {
								id: demoReload.val()
							}
						}
					});
				},
				getCheckData: function () { //获取选中数据
					var checkStatus = table.checkStatus('idTest'),
						data = checkStatus.data;
					layer.alert(JSON.stringify(data));
				},
				getCheckLength: function () { //获取选中数目
					var checkStatus = table.checkStatus('idTest'),
						data = checkStatus.data;
					layer.msg('选中了：' + data.length + ' 个');
				},
				isAll: function () { //验证是否全选
					var checkStatus = table.checkStatus('idTest');
					layer.msg(checkStatus.isAll ? '全选' : '未全选')
				}
			};
		$('.demoTable .layui-btn').on('click', function () {
			var type = $(this).data('type');
			active[type] ? active[type].call(this) : '';
		});
	});
}
tableInit()
$("#add_peoples").click(function(){
    layer.open({
        type: 2,
        title: false,
        // closeBtn: 0, //不显示关闭按钮
        // shade: [0],
        area: ['800px', '670px'],
        // offset: 'auto', //右下角弹出
        // time: 2000, //2秒后自动关闭
        // shift: 2,
        content: ['../../html/setup/device/add_device.html', 'no'], //iframe的url，no代表不显示滚动条
        btn: ['提交', '取消'],
        yes: function(index, layero){
            //按钮【按钮一】的回调
            // return false
          }
          ,btn2: function(index, layero){
            //按钮【按钮二】的回调
            
            //return false 开启该代码可禁止点击该按钮关闭
          }
        // success: function(layero, index){
        //     var body = layer.getChildFrame('body', index);
        //     var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
        //     console.log(body.html()) //得到iframe页的body内容
        //     body.find('input').val('Hi，我是从父页来的')
        // },
        // end: function(){ //此处用于演示
        //     layer.open({
        //         type: 2,
        //         title: '百度一下，你就知道',
        //         shadeClose: true,
        //         shade: false,
        //         maxmin: true, //开启最大化最小化按钮
        //         area: ['1150px', '650px'],
        //         content: 'http://www.baidu.com'
        //     });
        // }
    });
})