"use client";

import { useEffect, useState, useTransition } from "react";
import { createGuest } from "@/lib/actions/createGuest";
import { getAllUsers } from "@/lib/actions/getUsers";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import { FaRegTrashAlt } from "react-icons/fa";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
};

export default function GästePage() {
  const [guests, setGuests] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const loadGuests = async () => {
    const result = await getAllUsers();
    setGuests(result.filter((user: User) => user.role === "GUEST"));
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createGuest({ name, email });
      if (result?.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        await loadGuests();
        setShowForm(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "E-Mail",
      accessorKey: "email",
    },
    {
      header: "Erstellt am",
      accessorFn: (row) => {
        const date = new Date(row.createdAt);
        return isNaN(date.getTime())
          ? "Ungültig"
          : format(date, "dd.MM.yyyy HH:mm");
      },
    },
    {
      header: "Aktionen",
      accessorKey: "id",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          onClick={() => {
            // Handle delete action here
          }}
          className="cursor-pointer"
        >
          <FaRegTrashAlt className="text-white" />
        </Button>
      ),
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gästeverwaltung</h1>
        <Button onClick={() => setShowForm(!showForm)} className="hidden md:block cursor-pointer">
          {showForm ? "Formular schließen" : "Neuen Gast anlegen"}
        </Button>
        <Button onClick={() => setShowForm(!showForm)} className="md:hidden block cursor-pointer">
          {showForm ? "X" : "+"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Neuen Gast erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>E-Mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Speichern..." : "Gast erstellen"}
              </Button>
              {success && (
                <p className="text-green-600 text-sm mt-2">
                  ✅ Gast wurde erfolgreich erstellt. Passwort:{" "}
                  <code>login123</code>
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={guests} />
    </div>
  );
}
