import React from "react";
import { FileText, ArrowRight, Calendar, Sparkles } from "lucide-react";

export default function SummaryCard({ file, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(file)}
      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
          : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">
              {file.original_name}
            </h3>
            <p className="mt-0.5 text-xs text-muted flex items-center gap-2">
              <span className="uppercase">{file.file_category}</span>
              <span>•</span>
              <span className="capitalize">{file.processing_status}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg p-1.5 text-muted hover:text-primary transition"
          aria-label="Select file"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
