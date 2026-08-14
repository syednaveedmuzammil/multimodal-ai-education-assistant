import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

import PageHeader from "@/components/common/PageHeader";

import {
  WelcomeBanner,
  SearchHero,
  QuickActions,
  DashboardStats,
  RecentActivity,
  StudyStreak,
  WeeklyProgress,
} from "@/components/dashboard";

export default function Dashboard() {
  return (
    <DashboardLayout>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ================= Page Header ================= */}

        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Continue your AI-powered learning journey."
        />

        {/* ================= Dashboard Content ================= */}

        <div className="space-y-10">

          <WelcomeBanner />

          <SearchHero />

          <QuickActions />

          <DashboardStats />

          {/* ================= Activity + Streak ================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2">
              <RecentActivity />
            </div>

            <StudyStreak />

          </div>

          {/* ================= Weekly Progress ================= */}

          <WeeklyProgress />

        </div>

      </div>

    </DashboardLayout>
  );
}