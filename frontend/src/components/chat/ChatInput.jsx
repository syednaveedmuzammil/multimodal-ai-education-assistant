import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AttachmentMenu from "./AttachmentMenu";
import VoiceRecorder from "./VoiceRecorder";
import SendButton from "./SendButton";

import { MAX_MESSAGE_LENGTH } from "@/constants/chat";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    onSend?.(text);
    setMessage("");
  };

  const handleVoiceTranscript = (transcript) => {
    setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <AttachmentMenu
          onSelect={() => {
            navigate("/notes");
          }}
        />

        <VoiceRecorder
          onTranscript={handleVoiceTranscript}
        />

        <textarea
          rows={1}
          value={message}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Ask LearnMate AI anything (e.g. explain recursion, clarify notes)..."
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 resize-none rounded-xl bg-card border border-border px-4 py-3 outline-none focus:border-primary text-sm text-white placeholder-muted"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <SendButton
          onClick={handleSend}
          disabled={!message.trim()}
        />
      </div>
    </div>
  );
}