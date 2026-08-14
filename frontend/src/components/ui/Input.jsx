export default function Input({
  label,
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  className = "",
  autoComplete,
  disabled = false,
}) {
  return (
    <div className="space-y-2">

      {label && (
        <label
          htmlFor={id || name}
          className="text-sm text-muted"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`
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
          focus:outline-none
          transition
          disabled:opacity-60
          disabled:cursor-not-allowed
          ${className}
        `}
      />

      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

    </div>
  );
}