// components/dashboard/CustomToolbar.tsx
"use client";

import { ToolbarProps } from "react-big-calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function CustomToolbar<TEvent extends object = object>({
  date,
  onNavigate,
}: ToolbarProps<TEvent>) {
  const router = useRouter();
  const monthYear = format(date, "MMMM yyyy", { locale: de }); // z. B. Mai 2025

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-2 mb-2">
      <div className="text-lg md:text-xl font-bold capitalize">{monthYear}</div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-2 py-1 text-sm md:text-base rounded bg-gray-200 hover:bg-gray-300"
        >
          Heute
        </button>
        <button
          onClick={() => onNavigate("PREV")}
          className="px-2 py-1 text-sm md:text-base rounded bg-gray-200 hover:bg-gray-300"
        >
          Zurück
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="px-2 py-1 text-sm md:text-base rounded bg-gray-200 hover:bg-gray-300"
        >
          Weiter
        </button>
        <button
          onClick={() => router.push("/dashboard/new")}
          className="px-2 py-1 text-sm md:text-base rounded bg-black text-white hover:opacity-80"
        >
          + Neue Buchung
        </button>
      </div>
    </div>
  );
}
