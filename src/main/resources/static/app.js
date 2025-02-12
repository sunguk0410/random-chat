let currentUser;

const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/random-chat'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/chatMessage', (chat) => {
        showChatMessage(JSON.parse(chat.body));
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

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
    stompClient.activate();
    currentUser = generateRandomUsername();
    console.log(currentUser);
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendChat() {
    let message = $("#content").val();
    let sender = currentUser;

    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({'sender': sender, 'content': message})
    });
}


function generateRandomUsername() {
    return "User_" + Math.floor(Math.random() * 1000); // 예: User_123
}

function showChatMessage(chat) {
    let messageClass = (chat.sender === currentUser) ? "my-message" : "other-message";

    $("#greetings").append(`
        <div class="${messageClass}">
            ${chat.content}
        </div>
    `);
}


$(function () {
    connect();
    $("form").on('submit', (e) => e.preventDefault());
    $( "#send" ).click(() => sendChat());
});

