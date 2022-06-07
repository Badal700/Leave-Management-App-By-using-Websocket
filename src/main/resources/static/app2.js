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
			//console.log(JSON.parse(greeting.body).status);
			showGreeting(JSON.parse(greeting.body));
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

function sendName(id, value) {
	stompClient.send("/app/leaveApproval/" + id + "/" + value, {});
}

function showGreeting(message) {
	
	$("#greetings").append("<tr><td>" + message.empId + "</td>" +
		"<td>" + message.name + "</td>" + "<td>" + message.status + "</td>" +

		"<td><input id=\"" + message.empId + "\"" + " type=\"" + "submit\"" + " class=\"" + "status\"" + " value=\"" + "approve\"/></td>"
		+ "<td><input id=\"" + message.empId + "\"" + " type=\"" + "submit\"" + " class=\"" + "status\"" + " value=\"" + "reject\"/></td>"

		+ "</tr>");
}



$(document).ready(function() {
	$("form").on('submit', function(e) {
		e.preventDefault();
	});
	connect();
	$("#disconnect").click(function() { disconnect(); });
});

$(document).on('click', '.status', function(e) {
	var id = $(this).attr('id');
	var value = $(this).attr('value');
	console.log(id);
	sendName(id, value);
});

