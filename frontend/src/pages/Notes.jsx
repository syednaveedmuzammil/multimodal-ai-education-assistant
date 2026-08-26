import {
  FileAudio,
  FileImage,
  FileText,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ImageUploader from "@/components/upload/ImageUploader";
import NotesUploader from "@/components/upload/NotesUploader";
import PdfUploader from "@/components/upload/PdfUploader";
import UploadProgress from "@/components/upload/UploadProgress";

import {
  deleteUploadedFile,
  getUploadedFiles,
  uploadFile,
} from "@/services/uploadService";


const getFileIcon = (
  category,
) => {
  if (category === "image") {
    return FileImage;
  }

  if (category === "audio") {
    return FileAudio;
  }

  return FileText;
};


const formatFileSize = (
  bytes,
) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
};


const getErrorMessage = (
  error,
  fallback,
) => {
  const detail =
    error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (
          typeof item === "string"
        ) {
          return item;
        }

        return (
          item?.msg ||
          "Invalid request."
        );
      })
      .join(", ");
  }

  if (
    detail &&
    typeof detail === "object"
  ) {
    return (
      detail.msg ||
      "Invalid request."
    );
  }

  if (
    typeof error?.message ===
    "string"
  ) {
    return error.message;
  }

  return fallback;
};

export default function Notes() {
  const [files, setFiles] =
    useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);


  /*
   * ==========================================================
   * Load Existing Files
   * ==========================================================
   */

  const loadFiles = async () => {
    try {
      setLoading(true);

      const uploadedFiles =
        await getUploadedFiles();

      setFiles(uploadedFiles);

    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to load your files.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadFiles();
  }, []);


  /*
   * ==========================================================
   * Upload Selected File
   * ==========================================================
   */

  const handleFileSelect = async (
    file,
  ) => {
    if (uploading) {
      return;
    }

    setSelectedFile(file);
    setProgress(0);
    setUploading(true);

    try {
      const uploaded =
        await uploadFile(
          file,
          setProgress,
        );

      setFiles((previous) => [
        uploaded,
        ...previous,
      ]);

      toast.success(
        "File uploaded successfully.",
      );

    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to upload the file.",
        ),
      );

    } finally {
      setUploading(false);
    }
  };


  /*
   * ==========================================================
   * Delete File
   * ==========================================================
   */

  const handleDelete = async (
    fileId,
  ) => {
    try {
      await deleteUploadedFile(
        fileId,
      );

      setFiles((previous) =>
        previous.filter(
          (file) =>
            file.id !== fileId,
        ),
      );

      toast.success(
        "File deleted successfully.",
      );

    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Unable to delete the file.",
        ),
      );
    }
  };


  return (
    <div className="min-h-screen bg-background px-4 py-8 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ====================================================
            Header
            ==================================================== */}

        <div className="mb-8">

          <h1 className="text-2xl font-bold sm:text-3xl">
            My Learning Resources
          </h1>

          <p className="mt-2 text-sm text-muted">
            Upload notes and learning materials
            that LearnMate can process later.
          </p>

        </div>


        {/* ====================================================
            Upload Options
            ==================================================== */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          <PdfUploader
            onFileSelect={handleFileSelect}
            disabled={uploading}
          />

          <ImageUploader
            onFileSelect={handleFileSelect}
            disabled={uploading}
          />

          <NotesUploader
            onFileSelect={handleFileSelect}
            disabled={uploading}
          />

        </div>


        {/* ====================================================
            Upload Progress
            ==================================================== */}

        {selectedFile && (
          <div className="mt-6">

            <UploadProgress
              file={selectedFile}
              progress={progress}
              status={
                uploading
                  ? "uploading"
                  : progress >= 100
                    ? "success"
                    : "error"
              }
            />

          </div>
        )}


        {/* ====================================================
            Uploaded Files
            ==================================================== */}

        <div className="mt-10">

          <div className="mb-4">

            <h2 className="text-xl font-semibold">
              Uploaded Files
            </h2>

            <p className="mt-1 text-sm text-muted">
              Your previously uploaded learning
              resources.
            </p>

          </div>


          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted">
              Loading your files...
            </div>
          ) : files.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">

              <FileText
                size={32}
                className="mx-auto mb-3 text-muted"
              />

              <p className="font-medium text-white">
                No files uploaded yet
              </p>

              <p className="mt-1 text-sm text-muted">
                Upload your first learning resource
                above.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {files.map((file) => {
                const Icon =
                  getFileIcon(
                    file.file_category,
                  );

                return (
                  <div
                    key={file.id}
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-xl
                      border
                      border-border
                      bg-card
                      p-4
                    "
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">

                      <Icon
                        size={20}
                        className="text-primary"
                      />

                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium text-white">
                        {file.original_name}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">

                        <span>
                          {file.file_category}
                        </span>

                        <span>
                          {formatFileSize(
                            file.file_size,
                          )}
                        </span>

                        <span>
                          {file.processing_status}
                        </span>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          file.id,
                        )
                      }
                      className="
                        shrink-0
                        rounded-lg
                        p-2
                        text-muted
                        transition
                        hover:bg-red-500/10
                        hover:text-red-400
                      "
                      aria-label={`Delete ${file.original_name}`}
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}