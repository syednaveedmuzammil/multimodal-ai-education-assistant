import { Mic } from "lucide-react";
import Toast from "@/components/ui/Toast";

export default function VoiceRecorder({
  onClick = () => Toast.success("Voice input will be available after backend integration."),
}) {
  return (
    <button
      onClick={onClick}
      className="
      h-11
      w-11
      rounded-xl
      border
      border-border
      bg-card
      flex
      items-center
      justify-center
      hover:bg-slate-700
      transition"
    >
      <Mic size={18} />
    </button>
  );
}