"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export type LoginState = { error: string } | { redirectTo: string } | null;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (!isPending && state && "redirectTo" in state) {
      console.log("Redirecting to:", state.redirectTo);
      router.push(state.redirectTo);
      router.refresh(); 
    }
  }, [isPending, state, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form action={formAction} className="space-y-4 w-full max-w-md">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <div>
          <label className="block mb-1">E-Mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Passwort</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {state && "error" in state && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Einloggen..." : "Einloggen"}
        </button>
      </form>
    </main>
  );
}
