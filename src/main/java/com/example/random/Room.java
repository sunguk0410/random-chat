package com.example.random;

import lombok.Getter;

@Getter
public class Room {
    private String roomId;
    private String user1;
    private String user2;

    public Room(String roomId, String user1, String user2) {
        this.roomId = roomId;
        this.user1 = user1;
        this.user2 = user2;
    }
}
