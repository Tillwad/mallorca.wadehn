"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Login fehlgeschlagen");
      setIsPending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <div>
          <label className="block mb-1">E-Mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block mb-1">Passwort</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Einloggen..." : "Einloggen"}
        </button>
      </form>
    </main>
  );
}
