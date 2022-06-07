var stompClient = null;

function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if (connected) {
		$("#conversation").show();
	}
	else {
		$("#conversation").hide();
	}
	$("#greetings").html("");
}

function connect() {
	var socket = new SockJS('/gs-guide-websocket');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		setConnected(true);
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/greetings', function(greeting) {
			console.log("0000000000000000000000000000");
			showGreeting(JSON.parse(greeting.body).status);
		});
		stompClient.subscribe('/topic/greeting', function(greeting) {
			console.log(greeting);
			showGreeting(greeting.body);
		});
		
	});
}

function disconnect() {
	if (stompClient !== null) {
		stompClient.disconnect();
	}
	setConnected(false);
	console.log("Disconnected");
}

function sendName() {
	console.log("bvhg=cfhgjh=====================")
	stompClient.send("/app/saveEmpLeave", {}, 
	JSON.stringify({ 'empId': $("#empId").val(),'name': $("#name").val(),'status': $("#status").val() }));
	console.log("bvhg=cfhgjh=====================")
}

function showGreeting(message) {
	$("#greetings").empty();
	$("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function() {
	$("form").on('submit', function(e) {
		e.preventDefault();
	});
	connect();
	$("#disconnect").click(function() { disconnect(); });
	$("#send").click(function() { sendName(); });
});