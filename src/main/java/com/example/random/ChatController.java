package com.example.random;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/chatMessage")
    public Chat chat(Chat chat) throws Exception {
        return new Chat(HtmlUtils.htmlEscape(chat.getContent()));
    }

}
