"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { DataTable } from "@/components/ui/data-table";
import { getAllBookings } from "@/lib/actions/getBookings";
import { updateBookingStatus } from "@/lib/actions/updateBookingStatus";
import { deleteBooking } from "@/lib/actions/deleteBooking";

type Booking = {
  id: string;
  user: { id: string; name: string };
  startDate: Date;
  endDate: Date;
  flightNumber?: string | null;
  companions: { id: string; name: string }[];
  createdAt: Date;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
};

export default function AnfragenPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rejectedBookings, setRejectedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    const all = await getAllBookings();
    setBookings(all.filter((b: Booking) => b.status === "PENDING"));
    setRejectedBookings(all.filter((b: Booking) => b.status === "REJECTED"));
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const baseColumns: ColumnDef<Booking>[] = [
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
      header: "Erstellt am",
      accessorFn: (row) =>
        format(new Date(row.createdAt), "dd.MM.yyyy HH:mm"),
    },
  ];

  const columnsWithActions: ColumnDef<Booking>[] = [
    ...baseColumns,
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
                await loadBookings();
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
                await loadBookings();
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

const columnsRejected: ColumnDef<Booking>[] = [
    ...baseColumns,
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
                  newStatus: "PENDING",
                });
                await loadBookings();
              }}
              className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Zurücknehmen
            </button>
            <button
              onClick={async () => {
                await deleteBooking(
                  booking.id
                );
                await loadBookings();
              }}
              className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Löschen
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Offene Buchungsanfragen</h1>
        {loading ? (
          <p>Lade Daten...</p>
        ) : (
          <DataTable columns={columnsWithActions} data={bookings} />
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Abgelehnte Buchungen</h2>
        {loading ? (
          <p>Lade Daten...</p>
        ) : (
          <DataTable columns={columnsRejected} data={rejectedBookings} />
        )}
      </div>
    </div>
  );
}
