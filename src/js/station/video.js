(function (window, document) {
    // 获取要操作的元素
    var video = document.getElementById("video");
    var videoControls = document.getElementById("videoControls");
    var playBtn = document.getElementById("playBtn");
    var progressWrap = document.getElementById("progressWrap");
    var showProgress = document.getElementById("showProgress");
    var playProgress = document.getElementById("playProgress");
    var fullScreenFlag = false;
    var progressFlag;
    console.log(videoControls)
  
    // 创建我们的操作对象，我们的所有操作都在这个对象上。
    var videoPlayer = {
        init: function () {
            console.log("init")
            var that = this;
            video.removeAttribute("controls");
            bindEvent(video, "loadeddata", videoPlayer.initControls);
            videoPlayer.operateControls();
        },
        initControls: function () {
            videoPlayer.showHideControls();
        },
        showHideControls: function () {
            bindEvent(video, "mouseover", showControls);
            bindEvent(video, "mouseout", hideControls);
            bindEvent(videoControls, "mouseout", hideControls);
            bindEvent(videoControls, "mouseover", showControls);
        },
        operateControls: function () {
            bindEvent(playBtn, "click", play);
            bindEvent(video, "click", play);
            bindEvent(progressWrap, "mousedown", videoSeek);
        }
    }
    videoPlayer.init();
  
    // 原生的JavaScript事件绑定函数
    function bindEvent(ele, eventName, func) {
        if (window.addEventListener) {
            ele.addEventListener(eventName, func);
        } else {
            ele.attachEvent('on' + eventName, func);
        }
    }
    // 显示video的控制面板
    function showControls() {
        videoControls.style.opacity = 1;
    }
    // 隐藏video的控制面板
    function hideControls() {
        // 为了让控制面板一直出现，我把videoControls.style.opacity的值改为1
        videoControls.style.opacity = 1;
  
    }
    // 控制video的播放
    function play() {
        if (video.paused || video.ended) {
            if (video.ended) {
                video.currentTime = 0;
            }
            video.play();
            // playBtn.innerHTML = "暂停"; 
            progressFlag = setInterval(getProgress, 60);
        } else {
            video.pause();
            // playBtn.innerHTML = "播放";
            clearInterval(progressFlag);
        }
  
    }
    // video的播放条
    function getProgress() {
        var percent = video.currentTime / video.duration;
        playProgress.style.width = percent * (progressWrap.offsetWidth) - 2 + "px";
        showProgress.innerHTML = (percent * 100).toFixed(1) + "%";
  
    }
    // 鼠标在播放条上点击时进行捕获并进行处理
    function videoSeek(e) {
        if (video.paused || video.ended) {
            play();
            enhanceVideoSeek(e);
        } else {
            enhanceVideoSeek(e);
        }
  
  
    }
  
    function enhanceVideoSeek(e) {
        clearInterval(progressFlag);
        var length = e.pageX - progressWrap.offsetLeft-200;
        console.log(length)
        var percent = length / progressWrap.offsetWidth;
        playProgress.style.width = percent * (progressWrap.offsetWidth) - 2 + "px";
        video.currentTime = percent * video.duration;
        progressFlag = setInterval(getProgress, 60);
  
  
    }
  
    var oVideo = document.getElementsByTagName('video')[0];
    var oVideo1 = document.getElementsByTagName('video')[1];
    var oVideo2 = document.getElementsByTagName('video')[2];
    var oVideo3 = document.getElementsByTagName('video')[3];
  
    console.log(oVideo)
    $(".btnStartRoute").click(function () {
        oVideo.play();
        oVideo1.play();
        oVideo2.play();
        oVideo3.play();
        $("#video1").click();
        $("#video").click();
        $("#video").click();
        $("#video2").click();
        $("#video3").click();
    })
    $(".btnPauseRoute").click(function () {
        oVideo.pause();
        oVideo1.pause();
        oVideo2.pause();
        oVideo3.pause();
    })
    $(".btnFastRoute1").click(function () {
        oVideo.currentTime += 1;
        oVideo2.currentTime += 1;
        oVideo1.currentTime += 1;
        oVideo3.currentTime += 1;
    })
    $(".btnFastRoute2").click(function () {
        oVideo.currentTime += 2;
        oVideo1.currentTime += 2;
        oVideo2.currentTime += 2;
        oVideo3.currentTime += 2;
    })
    $(".btnFastRoute3").click(function () {
        oVideo.currentTime += 3;
        oVideo1.currentTime += 3;
        oVideo2.currentTime += 3;
        oVideo3.currentTime += 3;
    })
    $(".btnFastRoute0").click(function () {
        oVideo.currentTime += 4;
        oVideo1.currentTime += 4;
        oVideo2.currentTime += 4;
        oVideo3.currentTime += 4;
    })
    $(".btnStartRoute4").click(function () {
        oVideo.currentTime -= 1;
        oVideo1.currentTime -= 1;
        oVideo2.currentTime -= 1;
        oVideo3.currentTime -= 1;
  
    })
    // $(function(){//进度条
    //     var tag = false,ox = 0,left = 0,bgleft = 0;
    //     $('.progress_btn').mousedown(function(e) {
    //      ox = e.pageX - left;
    //      tag = true;
    //     });
    //     $(document).mouseup(function() {
    //      tag = false;
    //     });
    //     $('.progress').mousemove(function(e) {//鼠标移动
    //      if (tag) {
    //       left = e.pageX - ox;
    //       if (left <= 0) {
    //        left = 0;
    //       }else if (left > 300) {
    //        left = 300;
    //       }
    //       $('.progress_btn').css('left', left);
    //       $('.progress_bar').width(left);
    //       $('.text').html(parseInt((left/300)*100) + '%');
    //      }
    //     });
    //     $('.progress_bg').click(function(e) {//鼠标点击
    //      if (!tag) {
    //       bgleft = $('.progress_bg').offset().left;
    //       left = e.pageX - bgleft;
    //       if (left <= 0) {
    //        left = 0;
    //       }else if (left > 300) {
    //        left = 300;
    //       }
    //       $('.progress_btn').css('left', left);
    //       $('.progress_bar').animate({width:left},300);
    //       $('.text').html(parseInt((left/300)*100) + '%');
    //      }
    //     });
    //     var _this = this
    //     $(".search_Carlist").click(function(){
    //       loadpathTable();
    //       RemoteApi.getCarHis(function (data){
    //         let car = Car.createNew(data.data[0], map);
    //         car.loadTrace()
    //         $('.btnStartRoute').click(function(e) {//鼠标点击
    //           map.removeOverlay(car.routeMarker);
    //           car.resetRoute();
    //          car.route();
    //       })
    //       $(".btnPauseRoute").click(function(e,runnum) {
  
    //             var btn = $(".btnPauseRoute")[0];
  
    //             if(car.isRoteRunning) {
    //                 e.stopPropagation();
    //                 e.preventDefault();
    //                 car.startRoute(true);
    //                 car.isTimerRunning=true;
    //             } else {
    //                 e.stopPropagation();
    //                 e.preventDefault();
    //                 car.startRoute(false,car.runnum,car.currentCount);
    //             }
    //     });
    //       })
  
    //     })
    //    });
    // 获取要操作的元素
    var video1 = document.getElementById("video1");
    var videoControls1 = document.getElementById("videoControls1");
    var playBtn = document.getElementById("playBtn");
    var progressWrap1 = document.getElementById("progressWrap1");
    var playProgress1 = document.getElementById("playProgress1");
    var showProgress1 = document.getElementById("showProgress1");
  
    var fullScreenFlag = false;
    var progressFlag1;
  
    // 创建我们的操作对象，我们的所有操作都在这个对象上。
    var videoPlayer1 = {
        init: function () {
            var that = this;
            video1.removeAttribute("controls");
            bindEvent(video1, "loadeddata", videoPlayer1.initControls);
            videoPlayer1.operateControls();
        },
        initControls: function () {
            videoPlayer1.showHideControls();
        },
        showHideControls: function () {
            bindEvent(video1, "mouseover", showControls1);
            bindEvent(videoControls1, "mouseover", showControls1);
            bindEvent(video1, "mouseout", hideControls1);
            bindEvent(videoControls1, "mouseout", hideControls1);
        },
        operateControls: function () {
            bindEvent(playBtn, "click", play1);
            bindEvent(video1, "click", play1);
            bindEvent(progressWrap1, "mousedown", videoSeek1);
        }
    }
  
    videoPlayer1.init();
  
    // 原生的JavaScript事件绑定函数
    function bindEvent(ele, eventName, func) {
        if (window.addEventListener) {
            ele.addEventListener(eventName, func);
        } else {
            ele.attachEvent('on' + eventName, func);
        }
    }
    // 显示video的控制面板
    function showControls1() {
        videoControls1.style.opacity = 1;
    }
    // 隐藏video的控制面板
    function hideControls1() {
        // 为了让控制面板一直出现，我把videoControls.style.opacity的值改为1
        videoControls1.style.opacity = 1;
    }
    // 控制video的播放
    function play1() {
        if (video1.paused || video1.ended) {
            if (video1.ended) {
                video1.currentTime = 0;
            }
            video1.play();
            progressFlag1 = setInterval(getProgress1, 60);
        } else {
            video1.pause();
            clearInterval(progressFlag1);
        }
    }
    // video的播放条
    function getProgress1() {
        var percent1 = video1.currentTime / video1.duration;
        playProgress1.style.width = percent1 * (progressWrap1.offsetWidth) - 2 + "px";
        showProgress1.innerHTML = (percent1 * 100).toFixed(1) + "%";
    }
    // 鼠标在播放条上点击时进行捕获并进行处理
    function videoSeek1(e) {
        if (video1.paused || video1.ended) {
            play1();
            enhanceVideoSeek1(e);
        } else {
            enhanceVideoSeek1(e);
        }
  
    }
  
    function enhanceVideoSeek1(e) {
        clearInterval(progressFlag1);
        var length1 = e.pageX - progressWrap1.offsetLeft-200;
        var percent1 = length1 / progressWrap1.offsetWidth;
        playProgress1.style.width = percent1 * (progressWrap1.offsetWidth) - 2 + "px";
        video1.currentTime = percent1 * video1.duration;
        progressFlag1 = setInterval(getProgress1, 60);
    }
  
  
    var video2 = document.getElementById("video2");
    var videoControls2 = document.getElementById("videoControls2");
    var playBtn = document.getElementById("playBtn");
    var progressWrap2 = document.getElementById("progressWrap2");
    var playProgress2 = document.getElementById("playProgress2");
    var showProgress2 = document.getElementById("showProgress2");
  
    var fullScreenFlag = false;
    var progressFlag2;
  
    // 创建我们的操作对象，我们的所有操作都在这个对象上。
    var videoPlayer2 = {
        init: function () {
            var that = this;
            video2.removeAttribute("controls");
            bindEvent(video2, "loadeddata", videoPlayer2.initControls);
            videoPlayer2.operateControls();
        },
        initControls: function () {
            videoPlayer2.showHideControls();
        },
        showHideControls: function () {
            bindEvent(video2, "mouseover", showControls2);
            bindEvent(videoControls2, "mouseover", showControls2);
            bindEvent(video2, "mouseout", hideControls2);
            bindEvent(videoControls2, "mouseout", hideControls2);
        },
        operateControls: function () {
            bindEvent(playBtn, "click", play2);
            bindEvent(video2, "click", play2);
            bindEvent(progressWrap2, "mousedown", videoSeek2);
        }
    }
  
    videoPlayer2.init();
  
    // 原生的JavaScript事件绑定函数
    function bindEvent(ele, eventName, func) {
        if (window.addEventListener) {
            ele.addEventListener(eventName, func);
        } else {
            ele.attachEvent('on' + eventName, func);
        }
    }
    // 显示video的控制面板
    function showControls2() {
        videoControls2.style.opacity = 1;
    }
    // 隐藏video的控制面板
    function hideControls2() {
        // 为了让控制面板一直出现，我把videoControls.style.opacity的值改为1
        videoControls2.style.opacity = 1;
    }
    // 控制video的播放
    function play2() {
        if (video2.paused || video2.ended) {
            if (video2.ended) {
                video2.currentTime = 0;
            }
            video2.play();
            progressFlag2 = setInterval(getProgress2, 60);
        } else {
            video2.pause();
            clearInterval(progressFlag2);
        }
    }
    // video的播放条
    function getProgress2() {
        var percent2 = video2.currentTime / video2.duration;
        playProgress2.style.width = percent2 * (progressWrap2.offsetWidth) - 2 + "px";
        showProgress2.innerHTML = (percent2 * 100).toFixed(1) + "%";
    }
    // 鼠标在播放条上点击时进行捕获并进行处理
    function videoSeek2(e) {
        if (video2.paused || video2.ended) {
            play2();
            enhanceVideoSeek2(e);
        } else {
            enhanceVideoSeek2(e);
        }
  
    }
  
    function enhanceVideoSeek2(e) {
        clearInterval(progressFlag2);
        var length2 = e.pageX - progressWrap2.offsetLeft-200;
        var percent2 = length2 / progressWrap2.offsetWidth;
        playProgress2.style.width = percent2 * (progressWrap2.offsetWidth) - 2 + "px";
        video2.currentTime = percent2 * video2.duration;
        progressFlag2 = setInterval(getProgress2, 60);
    }
  
    var video3 = document.getElementById("video3");
    var videoControls3 = document.getElementById("videoControls3");
    var playBtn = document.getElementById("playBtn");
    var progressWrap3 = document.getElementById("progressWrap3");
    var playProgress3 = document.getElementById("playProgress3");
    var showProgress3 = document.getElementById("showProgress3");
  
    var fullScreenFlag = false;
    var progressFlag3;
  
    // 创建我们的操作对象，我们的所有操作都在这个对象上。
    var videoPlayer3 = {
        init: function () {
            var that = this;
            video3.removeAttribute("controls");
            bindEvent(video3, "loadeddata", videoPlayer3.initControls);
            videoPlayer3.operateControls();
        },
        initControls: function () {
            videoPlayer3.showHideControls();
        },
        showHideControls: function () {
            bindEvent(video3, "mouseover", showControls3);
            bindEvent(videoControls3, "mouseover", showControls3);
            bindEvent(video3, "mouseout", hideControls3);
            bindEvent(videoControls3, "mouseout", hideControls3);
        },
        operateControls: function () {
            bindEvent(playBtn, "click", play3);
            bindEvent(video3, "click", play3);
            bindEvent(progressWrap3, "mousedown", videoSeek3);
        }
    }
  
    videoPlayer3.init();
  
    // 原生的JavaScript事件绑定函数
    function bindEvent(ele, eventName, func) {
      console.log(ele, eventName,123123)
        if (window.addEventListener) {
            ele.addEventListener(eventName, func);
        } else {
            ele.attachEvent('on' + eventName, func);
        }
    }
    // 显示video的控制面板
    function showControls3() {
        videoControls3.style.opacity = 1;
    }
    // 隐藏video的控制面板
    function hideControls3() {
        // 为了让控制面板一直出现，我把videoControls.style.opacity的值改为1
        videoControls3.style.opacity = 1;
    }
    // 控制video的播放
    function play3() {
        if (video3.paused || video3.ended) {
            if (video3.ended) {
                video3.currentTime = 0;
            }
            video3.play();
            progressFlag3 = setInterval(getProgress3, 60);
        } else {
            video3.pause();
            clearInterval(progressFlag3);
        }
    }
    // video的播放条
    function getProgress3() {
        var percent3 = video3.currentTime / video3.duration;
        playProgress3.style.width = percent3 * (progressWrap3.offsetWidth) - 2 + "px";
        showProgress3.innerHTML = (percent3 * 100).toFixed(1) + "%";
    }
    // 鼠标在播放条上点击时进行捕获并进行处理
    function videoSeek3(e) {
        if (video3.paused || video3.ended) {
            play3();
            enhanceVideoSeek3(e);
        } else {
            enhanceVideoSeek3(e);
        }
  
    }
  
    function enhanceVideoSeek3(e) {
        clearInterval(progressFlag3);
        var length3 = e.pageX - progressWrap3.offsetLeft-200;
        var percent3 = length3 / progressWrap3.offsetWidth;
        playProgress3.style.width = percent3 * (progressWrap3.offsetWidth) - 2 + "px";
        video3.currentTime = percent3 * video3.duration;
        progressFlag3 = setInterval(getProgress3, 60);
    }
  }(this, document))