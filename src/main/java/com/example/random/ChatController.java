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
        // sender와 content 각각 htmlEscape 처리
        String escapedSender = HtmlUtils.htmlEscape(chat.getSender());
        String escapedContent = HtmlUtils.htmlEscape(chat.getContent());

        // 새로운 Chat 객체로 반환
        return new Chat(escapedSender, escapedContent);
    }

}
