$(".layui-logo").click(function() {
  location.href = "../../index.html";
});
//数据请求
var RemoteApi = (function() {
  return {
    getCarUrl: function(callback) {
      $.ajax({
        url: "../../json/car.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    },
    getCarHis: function(callback) {
      $.ajax({
        url: "../../json/car_path_detail.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    },
    getPeopleUrl: function(callback) {
      $.ajax({
        url: "../../json/people.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    },
    getPeopleHis: function(callback) {
      $.ajax({
        url: "../../json/people_path.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    },
  };
})();
var RemoteApi1 = (function() {
  return {
    getPeopleUrl: function(callback) {
      $.ajax({
        url: "../../json/people.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    },
    getPeopleHis: function(callback) {
      $.ajax({
        url: "../../json/people_path.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    }
  };
})();
var RemoteApi2 = (function() {
  return {
    gettoiletUrl: function(callback) {
      $.ajax({
        url: "../../json/toilet.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    }
  };
})();
var RemoteApi3 = (function() {
  return {
    getStationUrl: function(callback) {
      $.ajax({
        url: "../../json/station.json",
        method: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
          callback(response);
        }
      });
    }
  };
})();
function carlist(){

  doRefresh(null, "KULUINTERFACE", "searchTruckWordParasList", "", function(data) {
    //车辆列表和车辆选择框
    console.log(data)
    if (data.code == 0) {
      //执行正确动作
      var cars = data.data;
      $.each(cars, function(i, Cardata) {
      if (i == 0) {
        $(".selectCarplate").append(
        "<option value=" +
          Cardata.truckid +
          " selected>" +
          Cardata.paltenum +
          "</option>"
        );
        layui.use('form', function () {
          form = layui.form;
          form.on('select(filter)', function (data) {
            console.log(data)
          });
          form.render("select");
        });
       
      } else {
        $(".selectCarplate").append(
        "<option value=" +
          Cardata.truckid +
          ">" +
          Cardata.paltenum +
          "</option>"
        );
        layui.use('form', function () {
          form = layui.form;
          form.on('select(filter)', function (data) {
            console.log(data)
          });
          form.render("select");
        });
      }
      $(".layui-input-block").append("<input type='radio' name='pg_truck' value='"+Cardata.truckid+"' title='"+Cardata.paltenum+"' checked=''>");
      });
      layui.use('form', function () {
        form = layui.form;
        form.on('select(filter)', function (data) {
                 
          console.log(data)
        });
        form.on('radio()', function(data){
          console.log(data.elem); //得到radio原始DOM对象
          console.log(data.value); //被点击的radio的value值
        }); 
        form.render();
      });
    } else {
      alert(data.msg);
    }
    });
}
function peoplelist(){
	doRefresh(null, "KULUINTERFACE", "searchUserWordDayList", "", function(data) {
    //人员选择和人员列表
    if (data.code == 0) {
      //执行正确动作
      var cars = data.data;
      $.each(cars, function(i, Cardata) {
      if (i == 0) {
        $(".searchPeople").append(
        "<option value=" +
          Cardata.userinst +
          " selected>" +
          Cardata.username +
          "</option>"
        );
        layui.use('form', function () {
          var form = layui.form;
          form.render();
        });
      } else {
        $(".searchPeople").append(
        "<option value=" +
          Cardata.userinst +
          ">" +
          Cardata.username +
          "</option>"
        );
        layui.use('form', function () {
          var form = layui.form;
          form.render();
        });
      }
      if (Cardata.userorg == "某某项目公司01-项目组01") {
        $(".people_contents1").append("<p>" + Cardata.username + "</p>");
      } else if (Cardata.userorg == "某某项目公司02-项目组01") {
        $(".people_contents2").append("<p>" + Cardata.username + "</p>");
      } else {
        $(".people_contents3").append("<p>" + Cardata.username + "</p>");
      }
      });
    } else {
      alert(data.msg);
    }
    });
}

doRefresh(null, "KULUINTERFACE", "getLoginMsg", "", function (data) {
  if (data.code == 0) {
      //执行正确动作
      console.log(data)
      for (let i=data.menus.length-1;i>=0;i--){
        $(".layui-index").after("<li class='layui-nav-item'><a href='"+data.menus[i].url+"' class='home' id='"+data.menus[i].id+"'>"+data.menus[i].name+"</a></li>");
      }
      layui.use('element', function () {
        var element = layui.element;
        element.init();
        element.render('nav');
    });
  }
  else {
      alert(data.msg);
  }
});
