import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CircleHelp,
  Sparkles,
  Plus,
  Loader2,
  BookOpen,
  ArrowLeft,
  X,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

import QuizCard from "@/components/quiz/QuizCard";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResult from "@/components/quiz/QuizResult";
import Timer from "@/components/quiz/Timer";

import {
  getQuizzes,
  getQuiz,
  generateQuiz,
  submitQuiz,
  deleteQuiz,
} from "@/services/quizService";
import { getUploadedFiles } from "@/services/uploadService";

export default function Quiz() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fileIdParam = searchParams.get("fileId");
  const topicParam = searchParams.get("topic");

  // State
  const [quizzes, setQuizzes] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedAnswer }
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(fileIdParam || "");
  const [topicInput, setTopicInput] = useState(topicParam || "");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [quizzesData, filesData] = await Promise.all([
        getQuizzes().catch(() => []),
        getUploadedFiles().catch(() => []),
      ]);
      setQuizzes(quizzesData);
      setFiles(filesData);

      if (fileIdParam || topicParam) {
        setShowModal(true);
      }
    } catch (error) {
      toast.error("Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fileIdParam, topicParam]);

  // Start taking a quiz
  const handleStartQuiz = async (quizId) => {
    try {
      toast.loading("Loading quiz...", { id: "load-quiz" });
      const fullQuiz = await getQuiz(quizId);
      toast.dismiss("load-quiz");

      setActiveQuiz(fullQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTimeSpent(0);
      setQuizResult(null);
    } catch (error) {
      toast.dismiss();
      toast.error("Could not load quiz questions.");
    }
  };

  // Submit active quiz
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    try {
      setSubmitting(true);
      const payloadAnswers = activeQuiz.questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[q.id] || "",
      }));

      toast.loading("Evaluating answers...", { id: "eval" });
      const result = await submitQuiz(activeQuiz.id, payloadAnswers, timeSpent);
      toast.success("Quiz graded!", { id: "eval" });

      setQuizResult(result);
      setActiveQuiz(null); // exit active quiz taker mode
      loadData(); // reload quiz best scores
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate a new quiz
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!selectedFileId && !topicInput.trim()) {
      toast.error("Please select a note or enter a topic.");
      return;
    }

    try {
      setGenerating(true);
      toast.loading("Generating quiz questions with Phi-3...", { id: "gen" });

      const newQuiz = await generateQuiz({
        fileId: selectedFileId ? Number(selectedFileId) : null,
        topic: topicInput.trim() || null,
        numQuestions,
        difficulty,
      });

      toast.success("Quiz generated successfully!", { id: "gen" });
      setShowModal(false);
      setSearchParams({}); // clear URL params

      await loadData();
      handleStartQuiz(newQuiz.id);
    } catch (error) {
      toast.dismiss();
      const msg = error?.response?.data?.detail || error.message || "Failed to generate quiz.";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  // Delete a quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      toast.success("Quiz deleted.");
    } catch (error) {
      toast.error("Failed to delete quiz.");
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* VIEW 1: Active Quiz Taking Mode */}
        {activeQuiz && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Exit quiz? Your progress will not be saved.")) {
                      setActiveQuiz(null);
                    }
                  }}
                  className="rounded-xl border border-border p-2 text-muted hover:text-white transition"
                  title="Exit Quiz"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
                  <p className="text-xs text-muted">Topic: {activeQuiz.topic}</p>
                </div>
              </div>

              <Timer isRunning={!submitting} onTimeUpdate={(s) => setTimeSpent(s)} />
            </div>

            <QuizQuestion
              question={activeQuiz.questions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={activeQuiz.questions.length}
              selectedAnswer={userAnswers[activeQuiz.questions[currentQuestionIndex]?.id]}
              onSelectAnswer={(ans) =>
                setUserAnswers((prev) => ({
                  ...prev,
                  [activeQuiz.questions[currentQuestionIndex].id]: ans,
                }))
              }
              onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
              onPrev={() => setCurrentQuestionIndex((prev) => prev - 1)}
              onSubmit={handleSubmitQuiz}
              isLast={currentQuestionIndex === activeQuiz.questions.length - 1}
              isSubmitting={submitting}
            />
          </div>
        )}

        {/* VIEW 2: Quiz Result Mode */}
        {!activeQuiz && quizResult && (
          <QuizResult
            result={quizResult}
            onRetake={() => handleStartQuiz(quizResult.quiz_id)}
            onBack={() => setQuizResult(null)}
          />
        )}

        {/* VIEW 3: Quizzes Dashboard (Default) */}
        {!activeQuiz && !quizResult && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <PageHeader
                title="AI Quiz Assessment"
                subtitle="Test your knowledge with automatically generated MCQs, immediate grading, and conceptual explanations."
              />

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95"
              >
                <Plus size={18} />
                Generate New Quiz
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-muted rounded-2xl border border-border bg-card">
                <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
                Loading your quizzes...
              </div>
            ) : quizzes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <CircleHelp size={48} className="mx-auto mb-4 text-muted" />
                <h3 className="text-lg font-bold text-white">No Quizzes Created Yet</h3>
                <p className="mt-1 text-sm text-muted max-w-md mx-auto">
                  Generate your first quiz directly from your uploaded notes or enter any academic topic.
                </p>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90"
                >
                  <Sparkles size={16} />
                  Generate Your First Quiz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onStart={handleStartQuiz}
                    onDelete={handleDeleteQuiz}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate Quiz Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Generate AI Quiz</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSearchParams({});
                  }}
                  className="text-muted hover:text-white transition p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                {/* File selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Generate from Uploaded Note (Optional)
                  </label>
                  <select
                    value={selectedFileId}
                    onChange={(e) => setSelectedFileId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary"
                  >
                    <option value="">-- None (Enter topic below) --</option>
                    {files.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.original_name} ({f.file_category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                    Or Enter Academic Topic / Subject
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. Operating Systems, Thermodynamics, Photosynthesis..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-white placeholder-muted outline-none focus:border-primary"
                  />
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                      Questions Count
                    </label>
                    <select
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary"
                    >
                      <option value={3}>3 Questions (Quick)</option>
                      <option value={5}>5 Questions (Standard)</option>
                      <option value={10}>10 Questions (Comprehensive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary capitalize"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSearchParams({});
                    }}
                    className="rounded-xl border border-border px-4 py-2.5 text-xs sm:text-sm font-medium text-muted hover:text-white transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={generating || (!selectedFileId && !topicInput.trim())}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate Quiz
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}