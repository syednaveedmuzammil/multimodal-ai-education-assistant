export default function UploadProgress({
  file,
  progress = 0,
  status = "uploading",
}) {
  if (!file) {
    return null;
  }

  const statusText = {
    uploading: "Uploading...",
    success: "Uploaded successfully",
    error: "Upload failed",
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4">

      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">

          <p className="truncate text-sm font-medium text-white">
            {file.name}
          </p>

          <p className="mt-1 text-xs text-muted">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

        </div>

        <span className="shrink-0 text-xs text-muted">
          {statusText[status] || status}
        </span>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">

        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: `${Math.min(
              Math.max(progress, 0),
              100,
            )}%`,
          }}
        />

      </div>

      <div className="mt-2 flex justify-between text-xs text-muted">

        <span>
          {Math.round(progress)}%
        </span>

        {status === "success" && (
          <span className="text-emerald-400">
            Complete
          </span>
        )}

      </div>

    </div>
  );
}