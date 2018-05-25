
function echartsInits(dataTime,dataTimes,dataTimeTwo,dataTimesTwo,dataTimeThree,dataTimesThree,PlateData){
    var myChart3 = echarts.init(document.getElementById('main3'));
    let dataTimeX=dataTimes-dataTime;
    let dataTimeY=dataTimesTwo-dataTimeTwo;
    let dataTimeZ=dataTimesThree-dataTimeThree
    option3 = {
        title: {
            text: '一级保养',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: ['已使用时间', '剩余时间']
        },
        series: [{
            name: PlateData,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#ff0000', '#a8b97f'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: dataTime,
                    name: '已使用时间'
                },
                {
                    value: dataTimeX,
                    name: '剩余时间'
                }
            ]
        }]
    };
    
    // 使用刚指定的配置项和数据显示图表。
    myChart3.setOption(option3);
    
    var myChart4 = echarts.init(document.getElementById('main4'));
    option4 = {
        title: {
            text: '二级保养',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: ['已使用时间', '剩余时间']
        },
        series: [{
            name: PlateData,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#ff0000', '#a8b97f'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: dataTimeTwo,
                    name: '已使用时间'
                },
                {
                    value: dataTimeY,
                    name: '剩余时间'
                }
            ]
        }]
    };
    
    // 使用刚指定的配置项和数据显示图表。
    myChart4.setOption(option4);
    
    var myChart5 = echarts.init(document.getElementById('main5'));
    option5= {
        title: {
            text: '三级保养',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: ['已使用时间', '剩余时间']
        },
        series: [{
            name: PlateData,
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ['#ff0000', '#a8b97f'],
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: dataTimeThree,
                    name: '已使用时间'
                },
                {
                    value: dataTimeZ,
                    name: '剩余时间'
                }
            ]
        }]
        
    };
    
myChart5.setOption(option5);
}
dataInits()
function dataInits(PlateData,PlateDatas){
    $("#Cartitle").html(PlateData)
    doRefresh("Carstate", "KULUINTERFACE", "searchInpectPlanList", "&pg_truck="+PlateDatas, function (data) {
        if (data.code == 0) {
            //执行正确动作
            var dataTime,dataTimes,dataTimeTwo,dataTimesTwo,dataTimeThree,dataTimesThree
            for(var i=0;i<data.data.length;i++){
                if(data.data[i].name=="一级保养"){
                     dataTime=data.data[i].usertime;
                     dataTimes=data.data[i].alltime;
                }
                if(data.data[i].name=="二级保养"){
                    dataTimeTwo=data.data[i].usertime;
                     dataTimesTwo=data.data[i].alltime;
                }
                if(data.data[i].name=="三级保养"){
                     dataTimeThree=data.data[i].usertime;
                     dataTimesThree=data.data[i].alltime;
                }
            }
            echartsInits(dataTime,dataTimes,dataTimeTwo,dataTimesTwo,dataTimeThree,dataTimesThree,PlateData)
        } else {
            alert(data.msg);
        }
    });
}
// 使用刚指定的配置项和数据显示图表。
$(".search_Carlist").click(function(){
    var PlateData=$(".selectCarplate option:selected").text()
    $("#Cartitle").html(PlateData)
    dataInits(PlateData)
})
    new Promise(function(resolve,reject) {
      setTimeout(function() {
        var aplate = $(".selectCarplate option:first").text();
        var aplates = $(".selectCarplate option:first").val();
        var CarArray=[];
        CarArray.push(aplate,aplates)
        if (CarArray[0] == null &&CarArray[1]==""){
             resolve(CarArray);
        } else {
            reject(CarArray);
        }
      }, 500);
    }).then(function(result) {
        console.log(result)
        dataInits(result[0],result[1]);

      }).catch(function(reason) {
        console.log(reason)
          dataInits(reason[0],reason[1]);
      });