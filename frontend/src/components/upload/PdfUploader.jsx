import UploadCard from "./UploadCard";


export default function PdfUploader({
  onFileSelect,
  disabled = false,
}) {
  return (
    <UploadCard
      title="PDF Notes"
      description="Upload lecture notes, textbooks, or study material in PDF format."
      accept=".pdf,application/pdf"
      onFileSelect={onFileSelect}
      disabled={disabled}
    />
  );
}