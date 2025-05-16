"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState, useTransition, useEffect } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { de } from "date-fns/locale";
import { updateBooking } from "@/lib/actions/updateBooking";
import { deleteBooking } from "@/lib/actions/deleteBooking";
import { getAllUsers } from "@/lib/actions/getUsers";
import { getCurrentUserRole } from "@/lib/actions/getCurrent";
import { MdOutlineFamilyRestroom, MdOutlineLuggage } from "react-icons/md";
import { usePathname } from "next/navigation";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { de },
});

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  flightNumber?: string;
  userId?: string;
  companions: string | null;
};

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

export default function StayCalendar({ bookings }: { bookings: Booking[] }) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | null>(null);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [newFlightNumber, setNewFlightNumber] = useState("");
  const [newWithUserId, setNewWithUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isUpdating, startUpdate] = useTransition();
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getAllUsers().then(setUsers);
    getCurrentUserRole().then(setRole);
  }, []);

  const events = useMemo(() => {
    return bookings.map((booking) => {
      const user = booking.user || booking.companions[0];
      const role = user?.role;
      const hasFamilyCompanion = booking.companions?.some(
        (companion) => companion.role === "FAMILY"
      );

      const color = hasFamilyCompanion
        ? "#facc15" // gelb
        : booking.status === "PENDING"
        ? "#808080" // grau
        : "#3b82f6"; // blau// Gelb / Blau

      return {
        id: booking.id,
        title: booking.companions[0] ?? "?",
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
        color,
        flightNumber: booking.flightNumber ?? "",
        companions: booking.companions,
      };
    });
  }, [bookings]);

  return (
    <div className="h-[600px] relative">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
          date={date}
  onNavigate={(newDate) => setDate(newDate)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "0.5rem",
            opacity: 0.9,
            color: "black",
            border: "none",
          },
        })}
        onSelectEvent={(event) => {
          setEditMode(false);
          setNewStartDate(event.start);
          setNewEndDate(event.end);
          setNewFlightNumber(event.flightNumber ?? "");
        }}
        components={{
          event: ({ event }) => (
            <span className="flex items-center gap-1">
              {event.color === "#facc15" ? (
                <MdOutlineFamilyRestroom className="inline" />
              ) : (
                <MdOutlineLuggage className="inline" />
              )}
              {event.title.name}
            </span>
          ),
        }}
      />

      {selectedEvent && (role === "FAMILY" || role === "ADMIN") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:inset-auto absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2">
          <div className="bg-white border rounded-lg shadow-lg p-4 w-80">
            {!editMode ? (
              <>
                {/* Schließen-X oben rechts */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
                    aria-label="Schließen"
                  >
                    &times;
                  </button>
                </div>

                {/* Inhalt */}
                <h3 className="text-lg font-semibold mb-2">
                  {selectedEvent.title}
                </h3>
                <p>
                  <strong>Von:</strong>{" "}
                  {selectedEvent.start.toLocaleDateString()}
                </p>
                <p>
                  <strong>Bis:</strong> {selectedEvent.end.toLocaleDateString()}
                </p>
                {selectedEvent.flightNumber && (
                  <p>
                    <strong>Flug:</strong> {selectedEvent.flightNumber}
                  </p>
                )}

                {/* Aktionen */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm("Möchtest du diese Buchung wirklich löschen?")
                      ) {
                        deleteBooking(selectedEvent.id);
                        setSelectedEvent(null);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Löschen
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newStartDate || !newEndDate) return;
                  startUpdate(() => {
                    updateBooking({
                      bookingId: selectedEvent.id,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      flightNumber: newFlightNumber,
                      withUserId: newWithUserId,
                    });

                    setEditMode(false);
                    setSelectedEvent(null);
                  });
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-sm">Startdatum</label>
                  <input
                    type="date"
                    value={newStartDate?.toISOString().substring(0, 10)}
                    onChange={(e) => setNewStartDate(new Date(e.target.value))}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Enddatum</label>
                  <input
                    type="date"
                    value={newEndDate?.toISOString().substring(0, 10)}
                    onChange={(e) => setNewEndDate(new Date(e.target.value))}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Flugnummer</label>
                  <input
                    type="text"
                    value={newFlightNumber}
                    onChange={(e) => setNewFlightNumber(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm">Begleitperson</label>
                  <select
                    value={newWithUserId ?? ""}
                    onChange={(e) => setNewWithUserId(e.target.value || null)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Keine</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    Speichern
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
