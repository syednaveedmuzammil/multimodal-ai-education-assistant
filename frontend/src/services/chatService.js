import api from "@/services/api";

export const sendChatMessage = async ({ messages, fileId = null }) => {
  const payload = {
    messages,
    file_id: fileId ? Number(fileId) : null,
  };
  const response = await api.post("/ai/chat", payload);
  return response.data;
};

export const explainConcept = async ({ topic, level = "intermediate", fileId = null }) => {
  const payload = {
    topic,
    level,
    file_id: fileId ? Number(fileId) : null,
  };
  const response = await api.post("/ai/explain", payload);
  return response.data;
};

export const generateAiResponse = async (prompt, systemPrompt = null) => {
  const response = await api.post("/ai/generate", {
    prompt,
    system_prompt: systemPrompt,
  });
  return response.data;
};
