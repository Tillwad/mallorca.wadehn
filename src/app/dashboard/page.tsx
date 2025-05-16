import { getVisibleBookings } from "@/lib/actions/getBookings";
import StayCalendar from "@/components/dashboard/StayCalendar";

type Booking = {
  id: string;
  user: { id: string; name: string; role: string };
  startDate: Date;
  endDate: Date;
  flightNumber?: string | null;
  companions: { id: string; name: string, role: string }[];
  createdAt: Date;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
};

export default async function DashboardPage() {
  const bookings = await getVisibleBookings() as Booking[];

  return (
    <main className="max-w-4xl mx-auto mt-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Kalender</h1>
      <StayCalendar bookings={bookings} />
    </main>
  );
}
