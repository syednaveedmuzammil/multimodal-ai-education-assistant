import Card from "@/components/ui/Card";

export default function WelcomeBanner() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between overflow-hidden">

      <div className="space-y-3">

        <h2 className="text-3xl font-bold">
          {greeting} 👋
        </h2>

        <p className="text-muted max-w-lg">
          Welcome back! Continue your learning journey
          with AI-powered study tools.
        </p>

      </div>

      <img
        src="/images/hero-learning.svg"
        alt="Learning"
        className="w-full max-w-xs object-contain"
      />

    </Card>
  );
}