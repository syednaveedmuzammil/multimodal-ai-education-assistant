import UploadCard from "./UploadCard";


export default function NotesUploader({
  onFileSelect,
  disabled = false,
}) {
  return (
    <UploadCard
      title="Notes & Documents"
      description="Upload TXT, Markdown, or DOCX study material."
      accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      onFileSelect={onFileSelect}
      disabled={disabled}
    />
  );
}