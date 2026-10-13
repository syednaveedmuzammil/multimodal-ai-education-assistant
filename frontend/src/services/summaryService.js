import api from "@/services/api";

export const summarizeFile = async (fileId) => {
  const response = await api.post(`/ai/summarize/${fileId}`);
  return response.data;
};

export const summarizeText = async (text) => {
  const response = await api.post("/ai/summarize/text", { text });
  return response.data;
};

export const getFileExtractedContent = async (fileId) => {
  const response = await api.get(`/uploads/${fileId}/content`);
  return response.data;
};
