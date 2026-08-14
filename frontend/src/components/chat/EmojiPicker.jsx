import React from "react";
import { Smile } from "lucide-react";
import Toast from "@/components/ui/Toast";

export default function EmojiPicker({
  onClick = () => Toast.success("Emoji picker will be available after backend integration."),
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
      <Smile size={18} />
    </button>
  );
}