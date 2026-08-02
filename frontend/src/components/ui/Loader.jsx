import { LoaderCircle } from "lucide-react";

export default function Loader({
  text = "Loading...",
  fullScreen = false,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <LoaderCircle
        size={36}
        className="animate-spin text-primary"
      />

      <p className="text-sm text-muted">
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      {content}
    </div>
  );
}