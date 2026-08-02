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
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Continue your AI-powered learning journey."
      />

      <WelcomeBanner />

      <SearchHero />

      <QuickActions />

      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        <div className="xl:col-span-2">

          <RecentActivity />

        </div>

        <StudyStreak />

      </div>

      <div className="mt-10">

        <WeeklyProgress />

      </div>

    </DashboardLayout>
  );
}