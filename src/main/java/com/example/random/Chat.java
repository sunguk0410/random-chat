package com.example.random;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Chat {

    private String content;
    private String sender;

    public Chat() {
    }

    public Chat(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }
}
