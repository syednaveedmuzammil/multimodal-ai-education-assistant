import React from "react";
import { SendHorizontal } from "lucide-react";

export default function SendButton({
  onClick,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
      h-11
      w-11
      rounded-xl
      bg-primary
      hover:bg-violet-700
      transition
      flex
      items-center
      justify-center
      disabled:opacity-50
      disabled:cursor-not-allowed"
    >
      <SendHorizontal
        size={18}
        className="text-white"
      />
    </button>
  );
}