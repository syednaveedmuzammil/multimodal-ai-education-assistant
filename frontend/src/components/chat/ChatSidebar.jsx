import React from "react";
import { MessageSquarePlus, BookOpen, Sparkles, FileText, Check } from "lucide-react";

import Button from "@/components/ui/Button";
import { CHAT_SIDEBAR_WIDTH } from "@/constants/chat";

export default function ChatSidebar({
  onNewChat,
  files = [],
  selectedFileId,
  onSelectFile,
}) {
  return (
    <aside
      style={{ width: CHAT_SIDEBAR_WIDTH }}
      className="hidden md:flex h-full bg-sidebar border-r border-border flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button fullWidth onClick={onNewChat}>
          <MessageSquarePlus size={18} />
          New Chat
        </Button>
      </div>

      {/* Note Context Section */}
      <div className="p-4 border-b border-border bg-card/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          <BookOpen size={14} />
          Study Context
        </div>
        <p className="text-[11px] text-muted mb-3 leading-relaxed">
          Ground AI answers in one of your uploaded notes:
        </p>

        <select
          value={selectedFileId || ""}
          onChange={(e) => onSelectFile(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-white outline-none focus:border-primary truncate"
        >
          <option value="">None (General Academic QA)</option>
          {files.map((file) => (
            <option key={file.id} value={file.id}>
              📄 {file.original_name}
            </option>
          ))}
        </select>

        {selectedFileId && (
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
            <span className="flex items-center gap-1">
              <Check size={12} />
              Grounded in note
            </span>
            <button
              type="button"
              onClick={() => onSelectFile(null)}
              className="text-muted hover:text-white transition"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Quick Study Prompts */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Prompt Suggestions
        </p>

        {[
          "Explain this step-by-step with an example",
          "What are the key formulas and definitions?",
          "Can you test my knowledge on this topic?",
          "Explain this simply (ELI5)",
        ].map((prompt, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card/60 p-2.5 text-xs text-slate-300 hover:border-primary/40 hover:bg-card hover:text-white transition cursor-default flex items-start gap-2"
          >
            <Sparkles size={13} className="text-primary mt-0.5 shrink-0" />
            <span>{prompt}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}