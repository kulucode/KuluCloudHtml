$(".layui-logo").click(function(){
	location.href="../../index.html"
})
$("#lastYear").click(function() {
  getlastFormatDates();
  loadCartableList(datas);
});
$("#nowYear").click(function() {
  getnowYearFormatDates();
  loadCartableList(datas);
});
$("#lastMonth").click(function() {
  getlastMonthFormatDates();
  loadCartableList(datas);
});
$("#nowMonth").click(function() {
  getnowMonthFormatDates();
  loadCartableList(datas);
});
$("#lastweek").click(function() {
  $("#test5").val(getTime(7));
  $("#test6").val(getTime(1));
  loadCartableList(datas);
});
$("#nowweek").click(function() {
  getTimes(0);
  loadCartableList(datas);
});
$("#lastDay").click(function() {
  getlastDayFormatDates();
  loadCartableList(datas);
});
$("#nowDay").click(function() {
  getnowDayFormatDates();
  loadCartableList(datas);
});
$("#PeoplelastYear").click(function() {
  getlastFormatDates();
  loadPeopletableList(datas);
});
$("#PeoplenowYear").click(function() {
  getnowYearFormatDates();
  loadPeopletableList(datas);
});
$("#PeoplelastMonth").click(function() {
  getlastMonthFormatDates();
  loadPeopletableList(datas);
});
$("#PeoplenowMonth").click(function() {
  getnowMonthFormatDates();
  loadPeopletableList(datas);
});
$("#Peoplelastweek").click(function() {
  $("#test5").val(getTime(7));
  $("#test6").val(getTime(1));
  loadPeopletableList(datas);
});
$("#Peoplenowweek").click(function() {
  getTimes(0);
  loadPeopletableList(datas);
});
$("#PeoplelastDay").click(function() {
  getlastDayFormatDates();
  loadPeopletableList(datas);
});
$("#PeoplenowDay").click(function() {
  getnowDayFormatDates();
  loadPeopletableList(datas);
});
function getnowDayFormatDates() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let nowTime=date.getFullYear()+ "-"+month+"-"+strDate;
  let endTime=date.getFullYear()+'-'+month+'-'+ strDate
  $("#test5").val(nowTime)
  $("#test6").val(endTime)
}
function getlastDayFormatDates() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate()-1;
  
  var strDates = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strDates >= 0 && strDates <= 9) {
    strDates = "0" + strDates;
  }
  let nowTime=date.getFullYear()+ "-"+month+"-"+strDate;
  let endTime=date.getFullYear()+'-'+month+'-'+ strDates;
  $("#test5").val(nowTime)
  $("#test6").val(endTime)
}
function getTimes(n) {
  var now = new Date();
  var year = now.getFullYear();
  //因为月份是从0开始的,所以获取这个月的月份数要加1才行
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var day = now.getDay();
  var dates = now.getDate();
  var Minutes = now.getMinutes();
  //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
  if (day !== 0) {
    n = n + (day - 1);
  } else {
    n = n + day;
  }
  if (day) {
    //这个判断是为了解决跨年的问题
    if (month > 1) {
      month = month;
    } else {
      //这个判断是为了解决跨年的问题,月份是从0开始的
      year = year - 1;
      month = 12;
    }
  }
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (date >= 0 && date <= 9) {
    date = "0" + date;
  }
  if (dates >= 0 && dates <= 9) {
    dates = "0" + dates;
  }
  now.setDate(now.getDate() - n);
  year = now.getFullYear();
  month = now.getMonth() + 1;
  date = now.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (date >= 0 && date <= 9) {
    date = "0" + date;
  }
  let nowTime = year + "-" + month + "-" + date;
  let endTime = year + "-" + month + "-" + dates;
  $("#test5").val(nowTime);
  $("#test6").val(endTime);
}
// console.log(getTime(7),getTime(8))
function getTime(n) {
  var now = new Date();
  var year = now.getFullYear();
  //因为月份是从0开始的,所以获取这个月的月份数要加1才行
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var day = now.getDay();
  //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
  if (day !== 0) {
    n = n + (day - 1);
  } else {
    n = n + day;
  }
  if (day) {
    //这个判断是为了解决跨年的问题
    if (month > 1) {
      month = month;
    } else {
      //这个判断是为了解决跨年的问题,月份是从0开始的
      year = year - 1;
      month = 12;
    }
  }

  now.setDate(now.getDate() - n);
  year = now.getFullYear();
  month = now.getMonth() + 1;
  date = now.getDate();
  dates = date + 7;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (date >= 0 && date <= 9) {
    date = "0" + date;
  }
  if (dates >= 0 && dates <= 9) {
    dates = "0" + dates;
  }
  let nowTime = year + "-" + month + "-" + date;
  return nowTime
}
function getnowMonthFormatDates() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let nowTime = date.getFullYear() + "-" + month + "-01";
  let endTime = date.getFullYear() + "-" + month + "-" + strDate;
  $("#test5").val(nowTime);
  $("#test6").val(endTime);
}
function getlastMonthFormatDates() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var year = date.getFullYear();
  var month = date.getMonth();
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (month == 0) {
    month = 12;
  }
  if (month == 2) {
    var days = year % 4 == 0 ? 29 : 28;
  } else if (
    month == 1 ||
    month == 3 ||
    month == 5 ||
    month == 7 ||
    month == 8 ||
    month == 10 ||
    month == 12
  ) {
    //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
    var days = 31;
  } else {
    //其他月份，天数为：30.
    var days = 30;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let nowTime = date.getFullYear() + "-" + month + "-01";
  let endTime = date.getFullYear() + "-" + month + "-" + days;
  $("#test5").val(nowTime);
  $("#test6").val(endTime);
}
function getnowYearFormatDates() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let nowTime = date.getFullYear() + "-01-01";
  let endTime = date.getFullYear() + "-" + month + "-" + strDate;
  $("#test5").val(nowTime);
  $("#test6").val(endTime);
}
function getlastFormatDates() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let nowTime = date.getFullYear() - 1 + "-01" + "-01";
  let endTime = date.getFullYear() - 1 + "-12-31";
  $("#test5").val(nowTime);
  $("#test6").val(endTime);
  var currentdate =
    date.getFullYear() -
    1 +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
}
doRefresh(null, "KULUINTERFACE", "getOrgTree", "", function (data) {
  if (data.code == 0) {
    //执行正确动作
    datas = data.session;
    
$("#search_carOil").click(function(){
  loadCartableList(datas);
})
$("#search_peopleOil").click(function(){
  loadPeopletableList(datas);
})
  } else {
    console.log("err");
  }
});
function loadCartableList(datas){
  layui.use("table", function() {
    var table = layui.table;
    pg_sdate = $("#test5").val();
    pg_edate = $("#test6").val();
	
	var url = "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=296&TTDT=json&opname=searchTruckReportList&TTSSID=" + datas + "&TTKEY=null&&pg_sdate=" + pg_sdate + "&pg_edate=" + pg_edate;
	$.get(url, function(data) {
		if (data.code != 0) {
			return;
		}
		
		////////////////////////////////////////////////
		var res = data.data;
		for (var i = 0; i < res.length; i++) {
			var obj = res[i];
			obj.oil = parseFloat(obj.oil);
			obj.distance = parseFloat(obj.distance);
			obj.worktimes = parseFloat(obj.worktimes);
			obj.useff = parseFloat(obj.useff);
		}
		
		table.render({
		  elem: "#table_list",
		  height:"full-280",
		  /*url:
			"/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=296&TTDT=json&opname=searchTruckReportList&TTSSID="+
			datas +
			"&TTKEY=null&&pg_sdate=" +
			pg_sdate +
			"&pg_edate=" +
			pg_edate, //数据接口*/
		  page: false, //开启分页
		  limit: data.count,
		  limits: [data.count],
		  cols: [
			[
			  //表头
			  {field: "tbindex", title: "ID", sort: true },
			  { field: "truckorg",width: 200, title: "项目组" },
			  { field: "trucktype", width: 207,title: "设备类型" },
			  { field: "truckno", title: "资产编号" },
			  { field: "platenum", title: "车牌号" },
			  { field: "username", title: "负责人" },
			  { field: "userphone", title: "联系方式" },
			  { field: "oil", title: "油耗统计(L)", sort: true, templet:function(d) {
				  return d.oil.toFixed(2);
			  }},
			  { field: "distance", title: "工作里程(km)", sort: true, templet:function(d) {
				  return d.distance.toFixed(2);
			  }},
			  { field: "worktimes", title: "工作时长(H)", sort: true, templet:function(d) {
				  return d.worktimes.toFixed(2);
			  }},
			  { field: "useff", title: "设备使用率(%)", sort: true, templet:function(d) {
				  return d.useff.toFixed(2) + "%";
			  }}
			]
		  ],
		  data:res
		});
	});
    
  });
}
function loadPeopletableList(datas){
  layui.use("table", function() {
    var table = layui.table;
    pg_sdate = $("#test5").val();
    pg_edate = $("#test6").val();
	
	var url = "/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=296&TTDT=json&opname=searchUserReportList&TTSSID=" + datas + "&TTKEY=null&&pg_sdate=" + pg_sdate + "&pg_edate=" + pg_edate;
    $.get(url, function(data) {
		if (data.code != 0) {
			return;
		}
		
		////////////////////////////////////////////////
		var res = data.data;
		for (var i = 0; i < res.length; i++) {
			var obj = res[i];
			obj.distance = parseFloat(obj.distance);
			obj.abs = parseFloat(obj.abs);
			obj.late = parseFloat(obj.late);
		}
		
		table.render({
		  elem: "#people_list",
		  height:"full-280",
		  /*url:
			"/kulucloud/TTService?curPageOperID=refresh&curBSID=KULUINTERFACE&bs_uid=296&TTDT=json&opname=searchUserReportList&TTSSID="+
			datas +
			"&TTKEY=null&&pg_sdate=" +
			pg_sdate +
			"&pg_edate=" +
			pg_edate, //数据接口*/
		  page: false, //开启分页
		  limit: data.count,
		  limits: [data.count],
		  cols: [
			[
			  //表头
			  {field: "tbindex", title: "ID", sort: true },
			  { field: "org",width: 200, title: "项目组" },
			  { field: "id", width: 207,title: "员工编号" },
			  { field: "name", title: "姓名" },
			  { field: "age", title: "年龄" },
			  { field: "phone", title: "联系方式" },
			  { field: "step", title: "累计行走步数" },
			  { field: "distance", title: "累计里程(km)", sort: true, templet:function(d) {
				  return d.distance.toFixed(2);
			  }},
			  { field: "sbflg", title: "是否参保", sort: true },
			  { field: "abs", title: "缺勤记录", sort: true },
			  { field: "late", title: "迟到次数", sort: true }
			]
		  ],
		  data: res
		});
	});
	
  });
}
window.onload=function(){
  var heights =  $("tr").height()*17
  $(".layui-table-view").height(heights)
  $(".layui-table-main").height(heights)
}
$("#car_lists").click(function(){
  doRefreshDownLoad("downloadCar", "KULUINTERFACE", "exportTruckReportList", "");
})
$("#people_lists").click(function(){
  doRefreshDownLoad("downloadPeople", "KULUINTERFACE", "exportUserReportList", "");
})