package com.example.random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.*;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final Queue<String> waitingUsers = new LinkedList<>();
    private final Map<String, String> userRoomMap = new HashMap<>();

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/join")
    public void joinRoom(@Payload String username) {
        synchronized (this) {
            if (!waitingUsers.isEmpty()) {
                String otherUser = waitingUsers.poll();
                String roomId = UUID.randomUUID().toString();
                userRoomMap.put(username, roomId);
                userRoomMap.put(otherUser, roomId);

                // 두 사용자에게 방 정보 전송
                messagingTemplate.convertAndSend("/topic/room/" + username, new Room(roomId, username, otherUser));
                messagingTemplate.convertAndSend("/topic/room/" + otherUser, new Room(roomId, otherUser, username));
            } else {
                waitingUsers.add(username);
                messagingTemplate.convertAndSend("/topic/room/" + username, new Room(null, username, null));
            }
        }
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable String roomId, ChatMessage chat) {
        return new ChatMessage(chat.getSender(), chat.getContent(), roomId);
    }
}
