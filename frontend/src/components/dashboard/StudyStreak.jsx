import { Flame } from "lucide-react";

import Card from "@/components/ui/Card";
import { STUDY_STREAK } from "@/data/dashboardData";

export default function StudyStreak() {
  return (
    <Card className="h-full">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center">
        
          <SectionHeader
            title="Study Streak"
          />
          <Flame
            size={30}
            className="text-orange-400"
          />

        </div>

        <div>

          <h2 className="text-3xl font-bold">

            {STUDY_STREAK.days}

          </h2>

          <p className="text-muted">

            Day Streak

          </p>

        </div>

      </div>

      <p className="text-muted mt-6">

        {STUDY_STREAK.message}

      </p>

    </Card>
  );
}