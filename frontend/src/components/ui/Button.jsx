import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  onClick,
  type = "button",
  ariaLabel,
}) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-violet-700",

    secondary:
      "bg-card border border-border text-white hover:bg-slate-700",

    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",

    danger:
      "bg-danger text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-5 py-2.5",

    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "rounded-xl font-medium transition-all duration-300",
        "flex items-center justify-center gap-2",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "active:scale-95",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) &&
          "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <LoaderCircle
          size={18}
          className="animate-spin"
        />
      ) : (
        leftIcon
      )}

      {children}

      {!loading && rightIcon}
    </button>
  );
}