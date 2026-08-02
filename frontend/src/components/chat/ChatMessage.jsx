import clsx from "clsx";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({
  role,
  content,
  timestamp,
}) {
  const isUser = role === "user";

  return (
    <div
      className={clsx(
        "flex mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[75%] rounded-2xl px-5 py-4",
          isUser
            ? "bg-primary text-white"
            : "bg-card border border-border"
        )}
      >
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>

        <p
          className={clsx(
            "text-xs mt-3",
            isUser
              ? "text-violet-100"
              : "text-muted"
          )}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}