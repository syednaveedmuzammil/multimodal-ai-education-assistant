import {
  File,
  Upload,
} from "lucide-react";


export default function UploadCard({
  title = "Upload File",
  description = "Select a file to upload.",
  accept,
  onFileSelect,
  disabled = false,
}) {
  const handleChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    onFileSelect?.(selectedFile);

    event.target.value = "";
  };


  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

          <File
            size={22}
            className="text-primary"
          />

        </div>

        <div className="min-w-0">

          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-muted">
            {description}
          </p>

        </div>

      </div>


      <label
        className={`
          mt-6
          flex
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-border
          px-6
          py-10
          text-center
          transition
          hover:border-primary/50
          hover:bg-primary/5
          ${disabled ? "pointer-events-none opacity-50" : ""}
        `}
      >

        <Upload
          size={28}
          className="mb-3 text-muted"
        />

        <span className="text-sm font-medium text-white">
          Choose a file
        </span>

        <span className="mt-1 text-xs text-muted">
          Click to browse your device
        </span>

        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />

      </label>

    </div>
  );
}