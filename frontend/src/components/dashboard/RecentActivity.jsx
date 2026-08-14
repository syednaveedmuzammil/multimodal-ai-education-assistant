import React from "react";
import { Clock3 } from "lucide-react";

import Card from "@/components/ui/Card";
import { RECENT_ACTIVITY } from "@/data/dashboardData";
import SectionHeader from "@/components/common/SectionHeader";

export default function RecentActivity() {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">

        <SectionHeader
            title="Recent Activity"
            actionText="View All"
        />

        <Clock3
          size={20}
          className="text-primary"
        />

      </div>

      <div className="space-y-4">

        {RECENT_ACTIVITY.map((item) => (
          <div
            key={item.id}
            className="border-b border-border pb-4 last:border-none"
          >
            <h3 className="font-medium">
              {item.title}
            </h3>

            <div className="flex justify-between mt-2 text-sm text-muted">

              <span>{item.type}</span>

              <span>{item.time}</span>

            </div>
          </div>
        ))}

      </div>
    </Card>
  );
}