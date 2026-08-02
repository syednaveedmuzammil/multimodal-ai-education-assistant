import Card from "@/components/ui/Card";

export default function StatsCard({
  title,
  value,
  icon,
  color = "text-primary",
}) {
  return (
    <Card>

      <div className="flex justify-between items-start">

        <div>

          <p className="text-muted text-sm">

            {title}

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {value}

          </h2>

        </div>

        <div className={color}>

          {icon}

        </div>

      </div>

    </Card>
  );
}