import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here",
  description = "Content will appear here.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">

        <Inbox
          size={36}
          className="text-muted"
        />

      </div>

      <h3 className="text-xl font-semibold mt-5">

        {title}

      </h3>

      <p className="text-muted mt-2">

        {description}

      </p>

    </div>
  );
}