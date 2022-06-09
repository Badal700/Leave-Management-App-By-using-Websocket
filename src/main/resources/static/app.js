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

function connect(id) {
	
	var socket = new SockJS('/gs-guide-websocket');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		setConnected(true);
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/greetings', function(greeting) {
			showGreeting(JSON.parse(greeting.body).status);
		});
		stompClient.subscribe('/topic/greeting/'+id, function(greeting) {
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
	
	$("#empId").change(function() { connect($("#empId").val()); });
	
	$("#disconnect").click(function() { disconnect(); });
	$("#send").click(function() { sendName(); });
});
