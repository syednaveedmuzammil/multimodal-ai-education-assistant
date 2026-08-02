import { useState } from "react";

import { INITIAL_MESSAGES } from "@/data/chatData";

export default function useChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "This is a mock AI response.\n\nBackend integration will be added later.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      setIsTyping(false);
    }, 1200);
  };

  return {
    messages,
    isTyping,
    sendMessage,
  };
}