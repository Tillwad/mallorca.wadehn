// StayCalendar.tsx (Hauptkomponente)
"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  useCallback,
} from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { de } from "date-fns/locale";
import { MdOutlineFamilyRestroom, MdOutlineLuggage } from "react-icons/md";
import { toast } from "sonner";
import BookingDetailsModal from "@/components/dashboard/BookingDetailsModal";
import CustomToolbar from "@/components/dashboard/CustomToolbar";
import { Booking } from "@/types/booking";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  flightNumber: string;
  personen: string[];
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date:Date) => startOfWeek(date, { weekStartsOn: 1, locale: de }),
  getDay,
  locales: { de },
});

export default function StayCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | null>(null);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [newFlightNumber, setNewFlightNumber] = useState("");
  const [newPersonen, setNewPersonen] = useState<string[]>([]);
  const [isUpdating, startUpdate] = useTransition();
  const [date, setDate] = useState(new Date());

  const loadBookings = useCallback(async () => {
    const res = await fetch("/api/booking", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setBookings(data);
    } else {
      toast.error("Fehler beim Laden der Buchungen.");
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const events = useMemo(() => {
    return bookings.map((booking) => {
      let color = "#facc15";
      if (booking.guest) {
        color = "#3b82f6";
      } else if (booking.personen && booking.personen.length > 0) {
        const name = booking.personen[0]?.toLowerCase();
        switch (name) {
          case "lutz":
            color = "#f87171"; // rot
            break;
          case "conny":
            color = "#34d399"; // grün
            break;
          case "leo":
            color = "#60a5fa"; // blau
            break;
          case "till":
            color = "#a78bfa"; // lila
            break;
          case "bennet":
            color = "#fbbf24"; // gelb
            break;
          default:
            color = "#facc15"; // Standardfarbe
        }
      }
      return {
        id: booking.id,
        title:
          booking.personen?.[0] && booking.personen?.[1]
            ? `${booking.personen[0]} & ${booking.personen[1]}`
            : booking.personen?.[0] || booking.personen?.[1] || "Unbekannt",
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
        color,
        flightNumber: booking.flightNumber ?? "",
        personen: booking.personen,
      };
    });
  }, [bookings]);

  return (
    <div className="h-[600px] relative">
      <Calendar<CalendarEvent>
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
          setSelectedEvent(event);
          setEditMode(false);
          setNewStartDate(event.start);
          setNewEndDate(event.end);
          setNewFlightNumber(event.flightNumber ?? "");
          setNewPersonen(event.personen ?? []);
        }}
        components={{
          toolbar: CustomToolbar,
          event: ({ event }) => (
            <span className="flex items-center gap-1">
              {event.color === "#facc15" ? (
                <MdOutlineFamilyRestroom className="inline" />
              ) : (
                <MdOutlineLuggage className="inline" />
              )}
              {event.title}
            </span>
          ),
        }}
      />

      {selectedEvent && (
        <BookingDetailsModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          editMode={editMode}
          setEditMode={setEditMode}
          newStartDate={newStartDate}
          setNewStartDate={setNewStartDate}
          newEndDate={newEndDate}
          setNewEndDate={setNewEndDate}
          newFlightNumber={newFlightNumber}
          setNewFlightNumber={setNewFlightNumber}
          newPersonen={newPersonen}
          setNewPersonen={setNewPersonen}
          isUpdating={isUpdating}
          startUpdate={startUpdate}
          loadBookings={loadBookings}
        />
      )}
    </div>
  );
}
