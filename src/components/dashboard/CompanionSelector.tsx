"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers } from "@/lib/actions/getUsers";

type User = {
  id: string;
  name: string;
  role: "FAMILY" | "GUEST";
};

export default function CompanionSelector({
  selectedIds,
  setSelectedIds,
}: {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const filteredUsers =
    roleFilter === "ALL"
      ? users
      : users.filter((u) => u.role === roleFilter);


  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((uid) => uid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Personen auswählen</Label>

      <Select onValueChange={(value) => setRoleFilter(value)} defaultValue="ALL">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Rolle filtern" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Alle</SelectItem>
          <SelectItem value="FAMILY">Family</SelectItem>
          <SelectItem value="GUEST">Guest</SelectItem>
        </SelectContent>
      </Select>

      <div className="max-h-64 overflow-auto border rounded">
        {filteredUsers.map((user) => (
          <label
            key={user.id}
            className="flex items-center gap-2 px-4 py-2 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
          >
            <Checkbox
              checked={selectedIds.includes(user.id)}
              onCheckedChange={() => toggleSelection(user.id)}
            />
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground ml-auto">{user.role}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
