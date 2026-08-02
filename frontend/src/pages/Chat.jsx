import DashboardLayout from "@/layouts/DashboardLayout";

import PageHeader from "@/components/common/PageHeader";

import {
  ChatSidebar,
  ChatWindow,
  ChatInput,
} from "@/components/chat";

import useChat from "@/hooks/useChat";

export default function Chat() {
  const {
    messages,
    isTyping,
    sendMessage,
  } = useChat();

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Assistant"
        subtitle="Ask questions, upload notes, and learn with AI."
      />

      <div
        className="
        flex
        h-[calc(100vh-220px)]
        rounded-2xl
        overflow-hidden
        border
        border-border
        bg-background"
      >
        <ChatSidebar />

        <div className="flex flex-col flex-1">

          <ChatWindow
            messages={messages}
            isTyping={isTyping}
          />

          <ChatInput
            onSend={sendMessage}
          />

        </div>

      </div>
    </DashboardLayout>
  );
}