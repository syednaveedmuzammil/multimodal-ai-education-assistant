export default function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="text-muted mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}