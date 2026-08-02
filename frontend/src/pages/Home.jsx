import DashboardLayout from "@/layouts/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold gradient-text">
        LearnMate AI
      </h1>

      <p className="text-muted mt-4">
        Dashboard Layout is working.
      </p>

    </DashboardLayout>
  );
}