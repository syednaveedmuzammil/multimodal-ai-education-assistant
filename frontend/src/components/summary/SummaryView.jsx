import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Sparkles, BookOpen, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SummaryView({ summary, fileName, fileId }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!summary) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName ? fileName.replace(/\.[^/.]+$/, "") : "Note"}-Summary.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded summary markdown!");
  };

  const handleCreateQuiz = () => {
    if (fileId) {
      navigate(`/quiz?fileId=${fileId}`);
    } else {
      navigate(`/quiz?topic=${encodeURIComponent(fileName || "My Summary")}`);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {fileName || "AI Educational Summary"}
            </h2>
            <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
              <BookOpen size={13} />
              Generated with Phi-3 Mini & LLM Analysis
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-white transition hover:bg-card hover:border-primary/50"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-white transition hover:bg-card hover:border-primary/50"
          >
            <Download size={14} />
            Export
          </button>

          <button
            type="button"
            onClick={handleCreateQuiz}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-medium text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            <Sparkles size={14} />
            Generate Quiz on This
          </button>
        </div>
      </div>

      <div className="mt-6 prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-primary leading-relaxed text-sm sm:text-base">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}
