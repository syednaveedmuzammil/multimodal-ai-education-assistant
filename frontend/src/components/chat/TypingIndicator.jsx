export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="bg-card border border-border rounded-2xl px-5 py-4">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />

          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{
              animationDelay: ".15s",
            }}
          />

          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{
              animationDelay: ".3s",
            }}
          />
        </div>
      </div>
    </div>
  );
}