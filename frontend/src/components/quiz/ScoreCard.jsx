import React from "react";
import { Trophy, Award, CheckCircle, Clock } from "lucide-react";

export default function ScoreCard({ score, totalQuestions, percentage, timeTakenSeconds }) {
  const isPassed = percentage >= 60;

  const formatTime = (secs) => {
    if (!secs) return "N/A";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-6 sm:p-8 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {isPassed ? <Trophy size={32} className="text-yellow-400" /> : <Award size={32} className="text-primary" />}
      </div>

      <h2 className="text-2xl font-bold text-white">
        {isPassed ? "Great Job! Quiz Completed" : "Quiz Completed! Keep Practicing"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {isPassed
          ? "You demonstrated strong understanding of this concept."
          : "Review the answers below to reinforce your understanding."}
      </p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="rounded-xl border border-border bg-card p-3.5">
          <p className="text-xs text-muted">Final Score</p>
          <p className="mt-1 text-xl font-bold text-white">
            {score} <span className="text-sm font-normal text-muted">/ {totalQuestions}</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5">
          <p className="text-xs text-muted">Accuracy</p>
          <p className={`mt-1 text-xl font-bold ${isPassed ? "text-emerald-400" : "text-amber-400"}`}>
            {percentage}%
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-card p-3.5">
          <p className="text-xs text-muted">Time Spent</p>
          <p className="mt-1 text-xl font-bold text-white flex items-center justify-center gap-1">
            <Clock size={16} className="text-muted" />
            {formatTime(timeTakenSeconds)}
          </p>
        </div>
      </div>
    </div>
  );
}
