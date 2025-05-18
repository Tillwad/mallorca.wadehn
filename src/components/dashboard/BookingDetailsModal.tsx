// components/dashboard/BookingDetailsModal.tsx
"use client";

import { Dispatch, SetStateAction, FormEvent } from "react";
import CompanionSelector from "@/components/dashboard/CompanionSelector";
import { toast } from "sonner";

interface Props {
  selectedEvent: any;
  setSelectedEvent: Dispatch<SetStateAction<any>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  newStartDate: Date | null;
  setNewStartDate: (date: Date) => void;
  newEndDate: Date | null;
  setNewEndDate: (date: Date) => void;
  newFlightNumber: string;
  setNewFlightNumber: (value: string) => void;
  newPersonen: string[];
  setNewPersonen: (ids: string[]) => void;
  isUpdating: boolean;
  startUpdate: (cb: () => void | Promise<void>) => void;
  loadBookings: () => Promise<void>;
}

export default function BookingDetailsModal({
  selectedEvent,
  setSelectedEvent,
  editMode,
  setEditMode,
  newStartDate,
  setNewStartDate,
  newEndDate,
  setNewEndDate,
  newFlightNumber,
  setNewFlightNumber,
  newPersonen,
  setNewPersonen,
  isUpdating,
  startUpdate,
  loadBookings,
}: Props) {
  const handleDelete = async () => {
    const confirmed = confirm("Möchtest du diese Buchung wirklich löschen?");
    if (!confirmed) return;

    await fetch(`/api/booking/${selectedEvent.id}/delete`, {
      method: "DELETE",
    });

    toast.success("Buchung erfolgreich gelöscht");
    setSelectedEvent(null);
    await loadBookings();
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStartDate || !newEndDate) return;

    startUpdate(async () => {
      await fetch(`/api/booking/${selectedEvent.id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: newStartDate,
          endDate: newEndDate,
          flightNumber: newFlightNumber,
          personen: newPersonen,
        }),
      });

      toast.success("Buchung gespeichert");
      setEditMode(false);
      setSelectedEvent(null);
      await loadBookings();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto">
        {!editMode ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">Reisedetails</h3>
              <button
              onClick={() => setSelectedEvent(null)}
              className="cursor-pointer text-gray-400 hover:text-gray-600 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150"
              aria-label="Schließen"
              style={{ minWidth: 40, minHeight: 40 }}
              >
              &times;
              </button>
            </div>

            <p>
              <strong>Anreise:</strong> {selectedEvent.start.toLocaleDateString()}
            </p>
            <p>
              <strong>Abreise:</strong> {selectedEvent.end.toLocaleDateString()}
            </p>
            {selectedEvent.flightNumber && (
              <p>
                <strong>Flugnummer:</strong> {selectedEvent.flightNumber}
              </p>
            )}
            <p>
              <strong>Mitreisende:</strong> {selectedEvent.personen?.join(", ")}
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="cursor-pointer bg-blue-400 text-black px-4 py-2 rounded hover:bg-blue-500"
              >
                Bearbeiten
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-sm">Anreise</label>
              <input
                type="date"
                value={newStartDate?.toISOString().substring(0, 10)}
                onChange={(e) => setNewStartDate(new Date(e.target.value))}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="text-sm">Abreise</label>
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

            <CompanionSelector
              selectedIds={newPersonen}
              setSelectedIds={setNewPersonen}
              guest={false}
            />

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="submit"
                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={isUpdating}
              >
                Speichern
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="cursor-pointer text-sm text-gray-500 hover:underline"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}