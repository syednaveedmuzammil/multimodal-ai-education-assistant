export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`app-card hover-card p-6 ${className}`}
    >
      {children}
    </div>
  );
}