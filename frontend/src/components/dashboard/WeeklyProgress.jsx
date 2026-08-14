import React from "react";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/common/SectionHeader";
import { WEEKLY_PROGRESS } from "@/data/dashboardData";

export default function WeeklyProgress() {
  return (
    <Card>

        <SectionHeader
            title="Weekly Progress"
        />

      <div className="flex items-end justify-between h-52">

        {WEEKLY_PROGRESS.map((item) => (

          <div
            key={item.day}
            className="flex flex-col items-center gap-3"
          >

            <div
              className="
              w-8
              rounded-full
              bg-primary
              transition-all"
              style={{
                height: `${item.progress}%`,
              }}
            />

            <span className="text-sm text-muted">

              {item.day}

            </span>

          </div>

        ))}

      </div>

    </Card>
  );
}