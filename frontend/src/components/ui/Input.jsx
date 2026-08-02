export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="text-sm text-muted">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="
        w-full
        rounded-xl
        border
        border-border
        bg-card
        px-4
        py-3
        text-white
        placeholder:text-gray-500
        focus:border-primary
        transition"
      />

      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

    </div>
  );
}