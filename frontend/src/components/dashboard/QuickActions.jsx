import { useNavigate } from "react-router-dom";

import { QUICK_ACTIONS } from "@/constants/dashboard";
import QuickActionCard from "./QuickActionCard";
import SectionHeader from "@/components/common/SectionHeader";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="mt-10">

      <SectionHeader
        title="Quick Actions"
      />

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6"
      >
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <QuickActionCard
              key={action.id}
              icon={
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Icon
                    size={24}
                    className="text-primary"
                  />
                </div>
              }
              title={action.title}
              description={action.description}
              onClick={() => navigate(action.route)}
            />
          );
        })}
      </div>

    </section>
  );
}