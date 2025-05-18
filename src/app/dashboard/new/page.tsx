"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanionSelector from "@/components/dashboard/CompanionSelector";

export default function NewBookingPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [flightNumber, setFlightNumber] = useState("");
  const [personen, setPersonen] = useState<string[]>([]);
  const [guest, setGuest] = useState<boolean>(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

    startTransition(async () => {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          flightNumber,
          personen,
          guest,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Fehler beim Speichern.");
      }
    });
  };

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

          {/* Reisende Personen */}
          <CompanionSelector
            selectedIds={personen}
            setSelectedIds={setPersonen}
            guest={guest}
          />

          {/* Gast-Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="guest"
              checked={guest}
              onChange={() => {setGuest(!guest); setPersonen([]);}}
            />
            <Label htmlFor="guest">Als Gastbuchung markieren</Label>
          </div>

          {guest && (
            <div className="text-sm text-gray-500">
              <Input
                type="text"
                placeholder="Gastname"
                className="border rounded px-2 py-1 w-full"
                onChange={(e) => setPersonen([e.target.value])}
              />
              </div>)}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Speichern..." : "Speichern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
