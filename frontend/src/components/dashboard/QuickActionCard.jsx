import Card from "@/components/ui/Card";

export default function QuickActionCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full"
    >
      <Card
        className="
        hover:scale-[1.02]
        transition-all
        duration-300
        h-full"
      >

        <div className="mb-5">

          {icon}

        </div>

        <h3 className="font-semibold">

          {title}

        </h3>

        <p className="text-sm text-muted mt-2">

          {description}

        </p>

      </Card>
    </button>
  );
}