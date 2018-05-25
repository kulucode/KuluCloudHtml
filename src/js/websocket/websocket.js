/* 
 * 
 * 
 */
function MyWebSocket(url, onMessageCallback) {
	this.websocket = null;
	this.url = url;
	this.onMessageCallback = onMessageCallback;
	//var url = "ws://localhost:8080/epcs/websocket/push.ws";

	//判断当前浏览器是否支持WebSocket
	if('WebSocket' in window) {
		this.websocket = new WebSocket(url);
	} else {
		alert('当前浏览器不支持socket,请使用Chrome浏览器！')
	}

	//连接发生错误的回调方法
	this.websocket.onerror = function() {
		console.log("WebSocket连接发生错误");
		this.websocket = new WebSocket(url);
	};

	//连接成功建立的回调方法
	this.websocket.onopen = function() {
		console.log("WebSocket连接成功");
		this.send("Hello,it's me");
	}

	//接收到消息的回调方法
	this.websocket.onmessage = function(event) {	
		onMessageCallback(event);
	}

	//连接关闭的回调方法
	this.websocket.onclose = function() {
		console.log("WebSocket连接关闭");
	}

	//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	window.onbeforeunload = function() {
		this.close();
	}
	 
}

MyWebSocket.prototype = {
	send: function(messaage) {
		this.websocket.send(messaage);
	},
};