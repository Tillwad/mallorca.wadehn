"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { DataTable } from "@/components/ui/data-table";
import { getVisibleBookings } from "@/lib/actions/getBookings";
import { updateBookingStatus } from "@/lib/actions/updateBookingStatus";

type Booking = {
  id: string;
  user: { id: string; name: string };
  startDate: string;
  endDate: string;
  flightNumber?: string | null;
  companions: { id: string; name: string }[];
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
};

export default function AnfragenPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getVisibleBookings();
      const pending = all.filter((b: Booking) => b.status === "PENDING");
      setBookings(pending);
      setLoading(false);
    }
    load();
  }, []);

  const columns: ColumnDef<Booking>[] = [
    {
      header: "Ersteller",
      accessorFn: (row) => row.user.name,
    },
    {
      header: "Zeitraum",
      accessorFn: (row) =>
        `${format(new Date(row.startDate), "dd.MM.yyyy")} - ${format(
          new Date(row.endDate),
          "dd.MM.yyyy"
        )}`,
    },
    {
      header: "Flugnummer",
      accessorKey: "flightNumber",
    },
    {
      header: "Begleitpersonen",
      accessorFn: (row) => row.companions.map((c) => c.name).join(", "),
    },
    {
      header: "Erstellt am",
      accessorFn: (row) => format(new Date(row.createdAt), "dd.MM.yyyy HH:mm"),
    },
    {
      header: "Aktion",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await updateBookingStatus({
                  bookingId: booking.id,
                  newStatus: "CONFIRMED",
                });
                // Nachladen der Liste
                const all = await getVisibleBookings();
                const pending = all.filter(
                  (b: Booking) => b.status === "PENDING"
                );
                setBookings(pending);
              }}
              className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Annehmen
            </button>
            <button
              onClick={async () => {
                await updateBookingStatus({
                  bookingId: booking.id,
                  newStatus: "REJECTED",
                });
                const all = await getVisibleBookings();
                const pending = all.filter(
                  (b: Booking) => b.status === "PENDING"
                );
                setBookings(pending);
              }}
              className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Ablehnen
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Offene Buchungsanfragen</h1>
      {loading ? (
        <p>Lade Daten...</p>
      ) : (
        <DataTable columns={columns} data={bookings} />
      )}
    </div>
  );
}
