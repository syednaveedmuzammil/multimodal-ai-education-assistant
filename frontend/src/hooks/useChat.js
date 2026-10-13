import { useState } from "react";
import toast from "react-hot-toast";

import { INITIAL_MESSAGES } from "@/data/chatData";
import { sendChatMessage } from "@/services/chatService";

export default function useChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const currentTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
      timestamp: currentTimestamp,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Prepare payload for backend: map to role & content
      const payloadMessages = newMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await sendChatMessage({
        messages: payloadMessages,
        fileId: selectedFileId,
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.detail ||
        error.message ||
        "Unable to reach LearnMate AI.";
      toast.error(errorMsg);

      const errorAssistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `⚠️ **Error:** ${errorMsg}\n\nPlease verify that the backend and Ollama are active.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Hello! 👋 Starting a new session. Ask any academic question or attach an uploaded note below.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    startNewChat,
    selectedFileId,
    setSelectedFileId,
  };
}