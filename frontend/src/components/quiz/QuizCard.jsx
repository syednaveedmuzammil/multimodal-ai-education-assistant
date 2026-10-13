import React from "react";
import { CircleHelp, Play, Trash2, Award, Calendar } from "lucide-react";

export default function QuizCard({ quiz, onStart, onDelete }) {
  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "hard":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getDifficultyBadge(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty || "Medium"}
          </span>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(quiz.id);
              }}
              className="text-muted hover:text-red-400 transition p-1"
              title="Delete Quiz"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <h3 className="mt-3 text-base sm:text-lg font-bold text-white line-clamp-1">
          {quiz.title}
        </h3>

        <p className="mt-1 text-xs text-muted line-clamp-1">
          Topic: <span className="text-slate-300 font-medium">{quiz.topic}</span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted border-t border-border/60 pt-3">
          <span className="flex items-center gap-1">
            <CircleHelp size={14} className="text-primary" />
            {quiz.total_questions} Questions
          </span>

          {quiz.best_score !== null && quiz.best_score !== undefined && (
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <Award size={14} />
              Best: {quiz.best_score}%
            </span>
          )}

          <span className="flex items-center gap-1 ml-auto text-[11px]">
            <Calendar size={13} />
            {formatDate(quiz.created_at)}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-2">
        <button
          type="button"
          onClick={() => onStart(quiz.id)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:opacity-90"
        >
          <Play size={15} fill="currentColor" />
          {quiz.attempts_count > 0 ? "Retake Quiz" : "Start Quiz"}
        </button>
      </div>
    </div>
  );
}
