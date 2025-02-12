package com.example.random;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Chat {

    private String content;

    public Chat() {
    }

    public Chat(String content) {
        this.content = content;
    }
}
