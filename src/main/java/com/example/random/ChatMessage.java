package com.example.random;

import lombok.Getter;

@Getter
public class ChatMessage {
    private String sender;
    private String content;
    private String roomId;

    public ChatMessage(String sender, String content, String roomId) {
        this.sender = sender;
        this.content = content;
        this.roomId = roomId;
    }

}
