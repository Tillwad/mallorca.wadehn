"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { useState } from "react";

const FIXED_PERSONEN = ["Lutz", "Conny", "Leo", "Till", "Bennet"];

// Hilfsfunktion für sortierte Reihenfolge
function sortSelectedIds(ids: string[]): string[] {
  const fixed = FIXED_PERSONEN.filter((name) => ids.includes(name));
  const rest = ids.filter((name) => !FIXED_PERSONEN.includes(name));
  return [...fixed, ...rest];
}

export default function CompanionSelector({
  selectedIds,
  setSelectedIds,
  guest,
}: {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  guest: boolean;
}) {
  const [guestName, setGuestName] = useState("");

  const toggleSelection = (name: string) => {
    if (!name.trim()) return;

    if (selectedIds.includes(name)) {
      setSelectedIds(sortSelectedIds(selectedIds.filter((n) => n !== name)));
    } else {
      setSelectedIds(sortSelectedIds([...selectedIds, name]));
    }
  };

  const handleGuestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestName(e.target.value);
  };

  const handleGuestNameAdd = () => {
    const trimmed = guestName.trim();
    if (trimmed && !selectedIds.includes(trimmed)) {
      setSelectedIds(sortSelectedIds([...selectedIds, trimmed]));
    }
    setGuestName("");
  };

  return (
    <div className="space-y-4">
      <Label>Mitreisende Personen</Label>
      <div className="border rounded max-h-64 overflow-auto">
        {FIXED_PERSONEN.map((name) => (
          <label
            key={name}
            className="flex items-center gap-2 px-4 py-2 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
          >
            <Checkbox
              checked={selectedIds.includes(name)}
              onCheckedChange={() => toggleSelection(name)}
              disabled={guest}
            />
            <span className="font-medium">{name}</span>
          </label>
        ))}

        {/* Benutzerdefinierte Namen (z. B. Gast) */}
        {selectedIds
          .filter((name) => !FIXED_PERSONEN.includes(name))
          .map((name) => (
            <label
              key={name}
              className="flex items-center gap-2 px-4 py-2 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
            >
              <Checkbox
                checked
                onCheckedChange={() => toggleSelection(name)}
                disabled={guest}
              />
              <span className="font-medium italic">{name}</span>
            </label>
          ))}
      </div>

      {/* Gastnamenfeld */}

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Gastname hinzufügen..."
            value={guestName}
            onChange={handleGuestNameChange}
            className="w-full"
          />
          <button
            type="button"
            onClick={handleGuestNameAdd}
            className="cursor-pointer bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>

    </div>
  );
}
