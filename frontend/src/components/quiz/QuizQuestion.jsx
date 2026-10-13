import React from "react";
import { Check } from "lucide-react";

export default function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrev,
  onSubmit,
  isLast,
  isSubmitting,
}) {
  if (!question) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl max-w-3xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <div className="h-2 w-32 rounded-full bg-background overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
        {question.question_text}
      </h3>

      {/* Options list */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <div
              key={idx}
              onClick={() => onSelectAnswer(option)}
              className={`flex items-center gap-3.5 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-border bg-background/60 hover:border-primary/40 hover:bg-background"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-muted/60 text-muted"
                }`}
              >
                {isSelected ? <Check size={14} /> : String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-slate-300"}`}>
                {option}
              </span>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onPrev}
          disabled={questionIndex === 0}
          className="rounded-xl border border-border bg-background px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-card disabled:opacity-40"
        >
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !selectedAnswer}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
