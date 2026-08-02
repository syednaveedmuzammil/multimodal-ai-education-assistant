export default function SectionHeader({
  title,
  subtitle,
  actionText,
  onActionClick,
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-muted mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        <button
          onClick={onActionClick}
          className="text-primary text-sm hover:underline"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}