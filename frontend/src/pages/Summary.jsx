import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Sparkles, Loader2, ArrowRight, BookOpen, Layers } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SummaryView from "@/components/summary/SummaryView";
import SummaryCard from "@/components/summary/SummaryCard";

import { getUploadedFiles, processUploadedFile, ocrUploadedFile } from "@/services/uploadService";
import { summarizeFile, summarizeText } from "@/services/summaryService";

export default function Summary() {
  const [searchParams] = useSearchParams();
  const fileIdParam = searchParams.get("fileId");

  const [activeTab, setActiveTab] = useState("files"); // 'files' or 'text'
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customText, setCustomText] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // Load uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoadingFiles(true);
        const data = await getUploadedFiles();
        setFiles(data);

        if (fileIdParam) {
          const match = data.find((f) => f.id === Number(fileIdParam));
          if (match) {
            setSelectedFile(match);
            handleSummarizeFile(match);
          }
        } else if (data.length > 0) {
          setSelectedFile(data[0]);
        }
      } catch (error) {
        toast.error("Could not load your uploaded files.");
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [fileIdParam]);

  const handleSummarizeFile = async (fileToSummarize = selectedFile) => {
    if (!fileToSummarize) {
      toast.error("Please select a file to summarize.");
      return;
    }

    try {
      setSummarizing(true);
      setSummaryData(null);

      // If document has not been processed yet, process it first
      if (fileToSummarize.processing_status === "uploaded" || fileToSummarize.processing_status === "failed") {
        toast.loading("Extracting content from file...", { id: "proc" });
        if (fileToSummarize.file_category === "image") {
          await ocrUploadedFile(fileToSummarize.id);
        } else {
          await processUploadedFile(fileToSummarize.id);
        }
        toast.success("Content extracted!", { id: "proc" });
      }

      toast.loading("Generating AI summary with Phi-3...", { id: "sum" });
      const result = await summarizeFile(fileToSummarize.id);
      toast.success("Summary generated!", { id: "sum" });

      setSummaryData({
        summary: result.summary,
        fileName: fileToSummarize.original_name,
        fileId: fileToSummarize.id,
      });
    } catch (error) {
      toast.dismiss();
      const detail = error?.response?.data?.detail || error.message || "Failed to generate summary.";
      toast.error(detail);
    } finally {
      setSummarizing(false);
    }
  };

  const handleSummarizeText = async () => {
    if (!customText.trim() || customText.trim().length < 20) {
      toast.error("Please enter at least 20 characters of educational text.");
      return;
    }

    try {
      setSummarizing(true);
      setSummaryData(null);
      toast.loading("Analyzing and summarizing text...", { id: "text-sum" });

      const result = await summarizeText(customText.trim());
      toast.success("Summary generated!", { id: "text-sum" });

      setSummaryData({
        summary: result.summary,
        fileName: "Pasted Study Notes",
        fileId: null,
      });
    } catch (error) {
      toast.dismiss();
      const detail = error?.response?.data?.detail || error.message || "Failed to generate summary.";
      toast.error(detail);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <PageHeader
          title="AI Document Summarizer"
          subtitle="Generate clear, structured educational summaries and key takeaways from textbooks, notes, and transcripts."
        />

        {/* Tab selection */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("files")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "files"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <BookOpen size={16} />
            From My Learning Notes ({files.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "text"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            <FileText size={16} />
            Paste Study Text
          </button>
        </div>

        {/* Tab 1: Summarize from uploaded files */}
        {activeTab === "files" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Select Document</h3>
                <span className="text-xs text-muted">{files.length} available</span>
              </div>

              {loadingFiles ? (
                <div className="p-8 text-center text-sm text-muted rounded-xl border border-border bg-card">
                  Loading files...
                </div>
              ) : files.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card">
                  <p className="text-sm text-muted">No files uploaded yet.</p>
                  <a
                    href="/notes"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                  >
                    Go upload notes first <ArrowRight size={13} />
                  </a>
                </div>
              ) : (
                <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
                  {files.map((file) => (
                    <SummaryCard
                      key={file.id}
                      file={file}
                      selected={selectedFile?.id === file.id}
                      onSelect={(f) => setSelectedFile(f)}
                    />
                  ))}
                </div>
              )}

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => handleSummarizeFile(selectedFile)}
                  disabled={summarizing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:opacity-50"
                >
                  {summarizing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Summarizing with Phi-3...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Summarize Selected Note
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="lg:col-span-2">
              {summarizing ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center min-h-[350px]">
                  <div className="relative mb-4">
                    <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles size={20} className="absolute inset-0 m-auto text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Analyzing Educational Content</h3>
                  <p className="mt-1 text-xs text-muted max-w-sm">
                    Running Phi-3 Mini to preserve definitions, formulas, and generate concise key points...
                  </p>
                </div>
              ) : summaryData ? (
                <SummaryView
                  summary={summaryData.summary}
                  fileName={summaryData.fileName}
                  fileId={summaryData.fileId}
                />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center min-h-[350px]">
                  <Layers size={40} className="text-muted mb-3" />
                  <h3 className="text-base font-medium text-white">No Summary Generated Yet</h3>
                  <p className="mt-1 text-xs text-muted max-w-sm">
                    Select a note from the left and click "Summarize Selected Note" to generate structured AI takeaways.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Text Summarizer */}
        {activeTab === "text" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-white">
                Enter or Paste Study Text
              </label>
              <textarea
                rows={12}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste lecture notes, book excerpts, definitions, or transcription here..."
                className="w-full rounded-2xl border border-border bg-card p-4 text-sm text-white placeholder-muted outline-none focus:border-primary resize-none"
              />
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{customText.length} characters</span>
                <span>Minimum 20 characters</span>
              </div>

              <button
                type="button"
                onClick={handleSummarizeText}
                disabled={summarizing || customText.length < 20}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:opacity-50"
              >
                {summarizing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Summarize Pasted Text
                  </>
                )}
              </button>
            </div>

            <div>
              {summarizing ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center min-h-[350px]">
                  <Loader2 size={36} className="text-primary animate-spin mb-3" />
                  <h3 className="text-lg font-semibold text-white">Processing Content</h3>
                  <p className="text-xs text-muted mt-1">Distilling key points and formulas...</p>
                </div>
              ) : summaryData ? (
                <SummaryView
                  summary={summaryData.summary}
                  fileName={summaryData.fileName}
                  fileId={summaryData.fileId}
                />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center min-h-[350px]">
                  <FileText size={40} className="text-muted mb-3" />
                  <h3 className="text-base font-medium text-white">Summary Output</h3>
                  <p className="mt-1 text-xs text-muted max-w-sm">
                    Your generated summary and key takeaways will appear here once generated.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
