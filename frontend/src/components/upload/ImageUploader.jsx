import UploadCard from "./UploadCard";


export default function ImageUploader({
  onFileSelect,
  disabled = false,
}) {
  return (
    <UploadCard
      title="Images"
      description="Upload screenshots, diagrams, handwritten notes, or educational images."
      accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
      onFileSelect={onFileSelect}
      disabled={disabled}
    />
  );
}