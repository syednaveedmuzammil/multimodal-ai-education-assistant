import React from "react";
import { CheckCircle2, XCircle, Sparkles, RotateCcw, ArrowLeft } from "lucide-react";
import ScoreCard from "./ScoreCard";

export default function QuizResult({ result, onRetake, onBack }) {
  if (!result) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top score banner */}
      <ScoreCard
        score={result.score}
        totalQuestions={result.total_questions}
        percentage={result.percentage}
        timeTakenSeconds={result.time_taken_seconds}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-card/80 hover:border-primary/40"
        >
          <ArrowLeft size={16} />
          Back to Quizzes
        </button>

        <button
          type="button"
          onClick={onRetake}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
        >
          <RotateCcw size={16} />
          Retake This Quiz
        </button>
      </div>

      {/* Review details */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Question Review & Explanations
        </h3>

        {result.review?.map((item, idx) => {
          const isCorrect = item.is_correct;

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                isCorrect
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-red-500/30 bg-red-950/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-semibold text-muted uppercase">
                  Question {idx + 1}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  {isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                </span>
              </div>

              <h4 className="text-base font-semibold text-white mb-4">
                {item.question_text}
              </h4>

              {/* Options display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {item.options?.map((opt, optIdx) => {
                  const isUserSelection = opt === item.selected_answer;
                  const isCorrectAnswer = opt === item.correct_answer;

                  let borderClass = "border-border bg-card/60 text-slate-300";
                  if (isCorrectAnswer) {
                    borderClass = "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium";
                  } else if (isUserSelection && !isCorrect) {
                    borderClass = "border-red-500 bg-red-500/10 text-red-300 font-medium";
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs sm:text-sm ${borderClass}`}
                    >
                      <span className="font-mono text-xs opacity-70">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* AI Explanation Box */}
              {item.explanation && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                    <Sparkles size={14} />
                    AI Concept Explanation:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
