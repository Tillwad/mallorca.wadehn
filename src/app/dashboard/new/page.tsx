"use client";

import { useEffect, useState, useTransition } from "react";
import { createBooking } from "@/lib/actions/createBooking";
import { getCurrentUserId } from "@/lib/actions/getCurrent";
import { getAllUsers } from "@/lib/actions/getUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "react-datepicker/dist/react-datepicker.css";
import CompanionSelector from "@/components/dashboard/CompanionSelector";

type UserOption = { id: string; name: string };

export default function NewBookingPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [flightNumber, setFlightNumber] = useState("");
  const [selectedCompanionIds, setSelectedCompanionIds] = useState<string[]>(
    []
  );
  const [users, setUsers] = useState<UserOption[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Bitte Start- und Enddatum angeben.");
      return;
    }

    if (endDate < startDate) {
      setError("Das Enddatum darf nicht vor dem Startdatum liegen.");
      return;
    }

    setError(null);

    startTransition(() => {
      createBooking({
        startDate,
        endDate,
        flightNumber,
        companionIds: selectedCompanionIds || null,
      });
    });
  };

  useEffect(() => {
    async function load() {
      const [users, myId] = await Promise.all([
        getAllUsers(),
        getCurrentUserId(),
      ]);
      setUsers(users);
      if (myId) {
        setSelectedCompanionIds([myId]); // eigene ID vorausgewählt
      }
    }

    load();
  }, []);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Neuen Urlaub eintragen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Startdatum */}
          <div className="grid gap-2">
            <Label>Startdatum</Label>
            <Input
              type="date"
              required
              value={startDate ? startDate.toISOString().substring(0, 10) : ""}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Enddatum */}
          <div className="grid gap-2">
            <Label>Enddatum</Label>
            <Input
              type="date"
              required
              value={endDate ? endDate.toISOString().substring(0, 10) : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Flugnummer */}
          <div className="grid gap-2">
            <Label>Flugnummer (optional)</Label>
            <Input
              placeholder="z.B. LH1234"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
          </div>

          {/* Reisende Person */}
          <CompanionSelector
            selectedIds={selectedCompanionIds}
            setSelectedIds={setSelectedCompanionIds}
          />

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Speichern..." : "Speichern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
