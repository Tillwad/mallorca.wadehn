import StayCalendar from "@/components/dashboard/StayCalendar";

export default async function DashboardPage() {
  return (
    <main className="max-w-4xl mx-auto mt-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Kalender</h1>
      <StayCalendar />
    </main>
  );
}
