import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

import { INITIAL_MESSAGES } from "@/data/chatData";

export default function ChatWindow({
  messages = INITIAL_MESSAGES,
  isTyping = false,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <div
      className="
      flex-1
      overflow-y-auto
      p-6
      bg-background"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}