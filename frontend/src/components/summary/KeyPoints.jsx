import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function KeyPoints({ points = [] }) {
  if (!points || points.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-400" />
        Key Learning Points
      </h3>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
