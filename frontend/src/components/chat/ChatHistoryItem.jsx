import clsx from "clsx";

export default function ChatHistoryItem({
  title,
  preview,
  updatedAt,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-xl p-4 transition-all duration-200 border",
        active
          ? "bg-primary text-white border-primary"
          : "bg-card border-border hover:bg-slate-700"
      )}
    >
      <h3 className="font-semibold truncate">
        {title}
      </h3>

      <p className="text-sm mt-2 opacity-80 line-clamp-1">
        {preview}
      </p>

      <p className="text-xs mt-3 opacity-70">
        {updatedAt}
      </p>
    </button>
  );
}