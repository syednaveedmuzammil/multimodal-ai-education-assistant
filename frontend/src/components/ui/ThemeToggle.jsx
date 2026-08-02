import { Moon } from "lucide-react";

export default function ThemeToggle() {
  return (
    <button
      className="
      h-10
      w-10
      rounded-xl
      bg-card
      border
      border-border
      flex
      items-center
      justify-center
      hover:bg-slate-700
      transition"
    >
      <Moon
        size={18}
        className="text-white"
      />
    </button>
  );
}