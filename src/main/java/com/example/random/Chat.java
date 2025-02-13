package com.example.random;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Chat {

    private String content;
    private String sender;
    private String roomId;

    public Chat() {
    }

    public Chat(String content, String sender, String roomId) {
        this.content = content;
        this.sender = sender;
        this.roomId = roomId;
    }
}
