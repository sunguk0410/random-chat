let currentUser;
let roomId = null; // 매칭된 방 ID

const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/random-chat'
});

stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    currentUser = generateRandomUsername();
    joinRoom(); // 자동으로 방에 입장
};

function joinRoom() {
    stompClient.publish({
        destination: "/app/join",
        body: currentUser
    });

    stompClient.subscribe(`/topic/room/${currentUser}`, (response) => {
        let data = JSON.parse(response.body);
        if (data.roomId) {
            showSystemMessage("매칭되었습니다!");
            roomId = data.roomId;
            console.log(`Matched with room: ${roomId}`);
            stompClient.subscribe(`/topic/chat/${roomId}`, (chat) => {
                showChatMessage(JSON.parse(chat.body));
            });
        } else {
            showSystemMessage("상대를 찾고 있습니다....");
        }
    });
}

function sendChat() {
    if (!roomId) {
        alert("아직 상대방과 매칭되지 않았습니다.");
        return;
    }

    let message = $("#content").val();

    stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({ sender: currentUser, content: message })
    });
}

function showSystemMessage(message) {
    $("#greetings").append(`
        <div class="system-message">
            ${message}
        </div>
    `);
}

function showChatMessage(chat) {
    let messageClass = (chat.sender === currentUser) ? "my-message" : "other-message";
    $("#greetings").append(`
        <div class="${messageClass}">
            ${chat.content}
        </div>
    `);
}

function generateRandomUsername() {
    return "User_" + Math.floor(Math.random() * 1000);
}

$(function () {
    stompClient.activate();
    $("form").on('submit', (e) => e.preventDefault());
    $("#send").click(() => sendChat());
});
