import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, X, Sparkles } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

import {
  ChatSidebar,
  ChatWindow,
  ChatInput,
} from "@/components/chat";

import useChat from "@/hooks/useChat";
import { getUploadedFiles } from "@/services/uploadService";

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fileIdParam = searchParams.get("fileId");

  const [files, setFiles] = useState([]);

  const {
    messages,
    isTyping,
    sendMessage,
    startNewChat,
    selectedFileId,
    setSelectedFileId,
  } = useChat();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getUploadedFiles();
        setFiles(data);
        if (fileIdParam) {
          const match = data.find((f) => f.id === Number(fileIdParam));
          if (match) {
            setSelectedFileId(match.id);
          }
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchFiles();
  }, [fileIdParam, setSelectedFileId]);

  const activeFile = files.find((f) => f.id === selectedFileId);

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          title="Interactive AI Study Assistant"
          subtitle="Ask academic queries, seek step-by-step concept explanations, or discuss your uploaded notes."
        />

        <div className="flex h-[calc(100vh-230px)] rounded-2xl overflow-hidden border border-border bg-background shadow-xl">
          <ChatSidebar
            onNewChat={startNewChat}
            files={files}
            selectedFileId={selectedFileId}
            onSelectFile={(id) => {
              setSelectedFileId(id);
              if (id) setSearchParams({ fileId: id });
              else setSearchParams({});
            }}
          />

          <div className="flex flex-col flex-1 min-w-0">
            {/* Context bar if a file is attached */}
            {activeFile && (
              <div className="flex items-center justify-between border-b border-border bg-card/70 px-5 py-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 text-primary shrink-0">
                    <BookOpen size={13} />
                  </span>
                  <span className="font-semibold text-white truncate">
                    Studying: {activeFile.original_name}
                  </span>
                  <span className="hidden sm:inline text-muted text-[11px]">
                    (AI answers will be grounded in this note)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFileId(null);
                    setSearchParams({});
                  }}
                  className="flex items-center gap-1 text-muted hover:text-white transition ml-2 shrink-0"
                >
                  <X size={14} />
                  <span className="hidden sm:inline">Detach</span>
                </button>
              </div>
            )}

            <ChatWindow
              messages={messages}
              isTyping={isTyping}
            />

            <ChatInput
              onSend={sendMessage}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}