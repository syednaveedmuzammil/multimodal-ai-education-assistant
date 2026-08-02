import { MessageSquarePlus } from "lucide-react";

import Button from "@/components/ui/Button";
import ChatHistoryItem from "./ChatHistoryItem";

import { CHAT_HISTORY } from "@/data/chatData";
import { CHAT_SIDEBAR_WIDTH } from "@/constants/chat";

export default function ChatSidebar() {
  return (
    <aside
      style={{ width: CHAT_SIDEBAR_WIDTH }}
      className="
      h-full
      bg-sidebar
      border-r
      border-border
      flex
      flex-col"
    >
      {/* Header */}

      <div className="p-5 border-b border-border">

        <Button fullWidth>
          <MessageSquarePlus size={18} />
          New Chat
        </Button>

      </div>

      {/* Chat List */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {CHAT_HISTORY.map((chat, index) => (
          <ChatHistoryItem
            key={chat.id}
            title={chat.title}
            preview={chat.preview}
            updatedAt={chat.updatedAt}
            active={index === 0}
            onClick={() => {
              // TODO:
              // Load conversation by chat.id
            }}
          />
        ))}

      </div>
    </aside>
  );
}