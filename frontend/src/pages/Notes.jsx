import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileAudio,
  FileImage,
  FileText,
  Trash2,
  Sparkles,
  CircleHelp,
  MessageSquare,
  Eye,
  Download,
  Loader2,
  ScanText,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

import ImageUploader from "@/components/upload/ImageUploader";
import NotesUploader from "@/components/upload/NotesUploader";
import PdfUploader from "@/components/upload/PdfUploader";
import UploadProgress from "@/components/upload/UploadProgress";
import VoiceRecorder from "@/components/upload/VoiceRecorder";

import {
  deleteUploadedFile,
  getUploadedFiles,
  transcribeUploadedFile,
  processUploadedFile,
  ocrUploadedFile,
  getExtractedContent,
  getFileDownloadUrl,
  uploadFile,
} from "@/services/uploadService";

const getFileIcon = (category) => {
  if (category === "image") return FileImage;
  if (category === "audio") return FileAudio;
  return FileText;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function Notes() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Processing state for individual files
  const [processingId, setProcessingId] = useState(null);

  // Extracted text preview modal
  const [viewingContent, setViewingContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const uploadedFiles = await getUploadedFiles();
      setFiles(uploadedFiles);
    } catch (error) {
      toast.error("Unable to load your files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileSelect = async (file) => {
    if (uploading) return;

    setSelectedFile(file);
    setProgress(0);
    setUploading(true);

    try {
      const uploaded = await uploadFile(file, setProgress);
      let finalFile = uploaded;

      if (uploaded.file_category === "audio") {
        toast.loading("Voice note uploaded. Transcribing with Whisper...", { id: "audio" });
        finalFile = await transcribeUploadedFile(uploaded.id);
        toast.success("Voice note transcribed!", { id: "audio" });
      } else if (uploaded.file_category === "text" || uploaded.file_category === "document" || uploaded.file_category === "pdf") {
        toast.loading("Processing and extracting document text...", { id: "doc" });
        try {
          finalFile = await processUploadedFile(uploaded.id);
          toast.success("Document text extracted successfully!", { id: "doc" });
        } catch {
          toast.dismiss("doc");
        }
      } else if (uploaded.file_category === "image") {
        toast.loading("Running EasyOCR on image...", { id: "ocr" });
        try {
          finalFile = await ocrUploadedFile(uploaded.id);
          toast.success("Text extracted from image via OCR!", { id: "ocr" });
        } catch {
          toast.dismiss("ocr");
        }
      } else {
        toast.success("File uploaded successfully.");
      }

      setFiles((previous) => [finalFile, ...previous.filter((f) => f.id !== finalFile.id)]);
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.detail || "Unable to process the file.");
    } finally {
      setUploading(false);
    }
  };

  const handleExtractText = async (file) => {
    try {
      setProcessingId(file.id);
      toast.loading("Extracting text...", { id: "extract" });

      let updated;
      if (file.file_category === "image" || file.processing_status === "needs_ocr") {
        updated = await ocrUploadedFile(file.id);
      } else if (file.file_category === "audio") {
        updated = await transcribeUploadedFile(file.id);
      } else {
        updated = await processUploadedFile(file.id);
      }

      setFiles((prev) => prev.map((f) => (f.id === file.id ? updated : f)));
      toast.success("Text extracted successfully!", { id: "extract" });
    } catch (err) {
      toast.dismiss("extract");
      toast.error(err?.response?.data?.detail || "Failed to extract text.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewContent = async (file) => {
    try {
      setLoadingContent(true);
      const data = await getExtractedContent(file.id);
      setViewingContent({
        fileName: file.original_name,
        text: data.extracted_text,
        wordCount: data.word_count,
        characterCount: data.character_count,
      });
    } catch {
      toast.error("No extracted content available yet for this file.");
    } finally {
      setLoadingContent(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteUploadedFile(fileId);
      setFiles((previous) => previous.filter((file) => file.id !== fileId));
      toast.success("File deleted successfully.");
    } catch (error) {
      toast.error("Unable to delete the file.");
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <PageHeader
          title="Multimodal Study Materials"
          subtitle="Upload lecture PDFs, textbook photos, handwritten notes, or audio recordings for automated AI analysis."
        />

        {/* Upload Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PdfUploader onFileSelect={handleFileSelect} disabled={uploading} />
          <ImageUploader onFileSelect={handleFileSelect} disabled={uploading} />
          <NotesUploader onFileSelect={handleFileSelect} disabled={uploading} />
          <VoiceRecorder onRecordingComplete={handleFileSelect} disabled={uploading} />
        </div>

        {/* Upload Progress */}
        {selectedFile && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <UploadProgress
              file={selectedFile}
              progress={progress}
              status={uploading ? "uploading" : progress >= 100 ? "success" : "error"}
            />
          </div>
        )}

        {/* Uploaded Files Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Your Uploaded Materials</h2>
              <p className="text-xs text-muted mt-0.5">
                Processed resources ready for summarization, quizzes, and AI tutoring.
              </p>
            </div>
            <span className="text-xs text-muted font-medium bg-card px-3 py-1.5 rounded-lg border border-border">
              {files.length} Resources
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted">
              <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
              Loading your files...
            </div>
          ) : files.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <FileText size={40} className="mx-auto mb-3 text-muted" />
              <p className="font-semibold text-white">No materials uploaded yet</p>
              <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                Upload a lecture PDF, diagram image, handwritten note, or voice audio above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => {
                const Icon = getFileIcon(file.file_category);
                const isProcessing = processingId === file.id;

                const statusColor =
                  file.processing_status === "processed" || file.processing_status === "transcribed"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : file.processing_status === "needs_ocr"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : file.processing_status === "processing"
                    ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                    : "text-muted bg-card border-border";

                return (
                  <div
                    key={file.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 transition hover:border-primary/40 shadow-sm"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={24} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm sm:text-base font-semibold text-white">
                          {file.original_name}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-muted uppercase font-mono text-[11px]">
                            {file.file_category}
                          </span>
                          <span className="text-muted">•</span>
                          <span className="text-muted">{formatFileSize(file.file_size)}</span>
                          <span className="text-muted">•</span>
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[11px] font-medium capitalize ${statusColor}`}
                          >
                            {file.processing_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/60">
                      {/* Extract/OCR button if not processed */}
                      {(file.processing_status === "uploaded" ||
                        file.processing_status === "needs_ocr" ||
                        file.processing_status === "failed") && (
                        <button
                          type="button"
                          onClick={() => handleExtractText(file)}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-white transition hover:bg-card hover:border-primary/50 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <ScanText size={13} />
                          )}
                          {file.file_category === "image" ? "Run OCR" : "Extract Text"}
                        </button>
                      )}

                      {/* View Extracted text */}
                      {(file.processing_status === "processed" ||
                        file.processing_status === "transcribed") && (
                        <button
                          type="button"
                          onClick={() => handleViewContent(file)}
                          className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-card hover:text-white"
                          title="View extracted text"
                        >
                          <Eye size={13} />
                          View Text
                        </button>
                      )}

                      {/* AI Summarize */}
                      <button
                        type="button"
                        onClick={() => navigate(`/summary?fileId=${file.id}`)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:opacity-90"
                      >
                        <Sparkles size={13} />
                        Summarize
                      </button>

                      {/* Generate Quiz */}
                      <button
                        type="button"
                        onClick={() => navigate(`/quiz?fileId=${file.id}`)}
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-white transition hover:bg-card hover:border-primary/50"
                      >
                        <CircleHelp size={13} />
                        Quiz
                      </button>

                      {/* Chat with note */}
                      <button
                        type="button"
                        onClick={() => navigate(`/chat?fileId=${file.id}`)}
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-white transition hover:bg-card hover:border-primary/50"
                      >
                        <MessageSquare size={13} />
                        Chat
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                        className="rounded-xl border border-border bg-background p-2 text-muted transition hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                        title="Delete file"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Extracted Text Modal */}
        {viewingContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-white truncate max-w-md">
                    Extracted Content: {viewingContent.fileName}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {viewingContent.wordCount} words • {viewingContent.characterCount} characters
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingContent(null)}
                  className="text-muted hover:text-white transition p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto rounded-xl bg-background p-4 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed border border-border">
                {viewingContent.text}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setViewingContent(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-white hover:bg-background transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}