import {
  FileStack,
  ClipboardCheck,
  CircleHelp,
  Flame,
} from "lucide-react";

import StatsCard from "./StatsCard";
import { DASHBOARD_STATS } from "@/data/dashboardData";
import SectionHeader from "@/components/common/SectionHeader";

const STAT_CONFIG = {
  "Notes Uploaded": {
    icon: FileStack,
    color: "text-blue-400",
  },
  Summaries: {
    icon: ClipboardCheck,
    color: "text-green-400",
  },
  Quizzes: {
    icon: CircleHelp,
    color: "text-yellow-400",
  },
  "Study Streak": {
    icon: Flame,
    color: "text-red-400",
  },
};

export default function DashboardStats() {
  return (
    <section className="mt-10">
      <SectionHeader
        title="Learning Overview"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat) => {
          const config = STAT_CONFIG[stat.title];
          const Icon = config.icon;

          return (
            <StatsCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              color={config.color}
              icon={<Icon size={32} />}
            />
          );
        })}
      </div>
    </section>
  );
}