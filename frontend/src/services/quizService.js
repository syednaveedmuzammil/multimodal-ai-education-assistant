import api from "@/services/api";

export const generateQuiz = async ({
  fileId = null,
  topic = null,
  numQuestions = 5,
  difficulty = "medium",
}) => {
  const payload = {
    file_id: fileId ? Number(fileId) : null,
    topic: topic || null,
    num_questions: Number(numQuestions),
    difficulty,
  };
  const response = await api.post("/quizzes/generate", payload);
  return response.data;
};

export const getQuizzes = async () => {
  const response = await api.get("/quizzes");
  return response.data;
};

export const getQuiz = async (quizId) => {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async (quizId, answers, timeTakenSeconds = null) => {
  const payload = {
    answers: answers.map((a) => ({
      question_id: a.questionId,
      selected_answer: a.selectedAnswer,
    })),
    time_taken_seconds: timeTakenSeconds,
  };
  const response = await api.post(`/quizzes/${quizId}/submit`, payload);
  return response.data;
};

export const getQuizAttempts = async (quizId) => {
  const response = await api.get(`/quizzes/${quizId}/attempts`);
  return response.data;
};

export const deleteQuiz = async (quizId) => {
  await api.delete(`/quizzes/${quizId}`);
};
