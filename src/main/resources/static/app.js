let currentUser;
let roomId = null; // 매칭된 방 ID

const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/random-chat'
});

stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    currentUser = generateRandomUsername();
    joinRoom(); // 자동으로 방에 입장
    // 브라우저 종료 시 서버에 알림 전송
        window.addEventListener('beforeunload', () => {
            stompClient.publish({
                destination: "/app/leave",
                body: currentUser
            });
        });
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
                let message = JSON.parse(chat.body);
                if (message.content === "상대방이 나갔습니다.") {
                    showSystemMessage(message.content);
                    roomId = null;
                } else {
                    showChatMessage(message);
                }
            });
        } else {
            showSystemMessage("상대를 찾고 있습니다....");
        }
    });
}

function sendChat() {
    if (!roomId) {
        alert("상대방과 매칭되지 않았습니다.");
        return;
    }

    let message = $("#content").val();

    if (!message) {
            alert("메시지를 입력해주세요.");
            return;
        }

    stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({ sender: currentUser, content: message })
    });

    $("#content").val('');
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
        <div style="display: flex; justify-content: ${chat.sender === currentUser ? 'flex-start' : 'flex-end'};">
            <div class="${messageClass}">
                ${chat.content}
            </div>
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
