import api from "@/services/api";

/*
 * ============================================================
 * Upload File
 * ============================================================
 */

export const uploadFile = async (file, onUploadProgress) => {
  if (!file) {
    throw new Error("A file is required.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/uploads", formData, {
    onUploadProgress: (progressEvent) => {
      if (!onUploadProgress || !progressEvent.total) {
        return;
      }

      const percentage = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );

      onUploadProgress(percentage);
    },
  });

  return response.data;
};

export const transcribeUploadedFile = async (fileId) => {
  const response = await api.post(`/uploads/${fileId}/transcribe`);
  return response.data;
};

export const processUploadedFile = async (fileId) => {
  const response = await api.post(`/uploads/${fileId}/process`);
  return response.data;
};

export const ocrUploadedFile = async (fileId) => {
  const response = await api.post(`/uploads/${fileId}/ocr`);
  return response.data;
};

export const getExtractedContent = async (fileId) => {
  const response = await api.get(`/uploads/${fileId}/content`);
  return response.data;
};

/*
 * ============================================================
 * List Uploaded Files
 * ============================================================
 */

export const getUploadedFiles = async () => {
  const response = await api.get("/uploads");
  return response.data;
};

/*
 * ============================================================
 * Get File Metadata
 * ============================================================
 */

export const getUploadedFile = async (fileId) => {
  const response = await api.get(`/uploads/${fileId}`);
  return response.data;
};

/*
 * ============================================================
 * Get Download URL
 * ============================================================
 */

export const getFileDownloadUrl = (fileId) => {
  const baseURL = api.defaults.baseURL || "";
  return `${baseURL}/uploads/${fileId}/download`;
};

/*
 * ============================================================
 * Delete Uploaded File
 * ============================================================
 */

export const deleteUploadedFile = async (fileId) => {
  await api.delete(`/uploads/${fileId}`);
};