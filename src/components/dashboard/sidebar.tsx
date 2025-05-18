"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { GiPalmTree } from "react-icons/gi";
import { se } from "date-fns/locale";
import { useRouter } from "next/navigation";

type SidebarProps = {
  role?: "ADMIN" | "FAMILY" | "GUEST";
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });
    router.push("/login");
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <Link href="/dashboard">
          <h2 className="text-lg font-bold flex gap-4">
            <GiPalmTree /> Mallorca Planer
          </h2>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-200">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white flex flex-col justify-between md:w-64 min-h-screen transition-transform duration-200 ease-in-out z-50",
          isOpen
            ? "translate-x-0 fixed top-0 left-0 w-64 h-full"
            : "-translate-x-full fixed top-0 left-0 w-64 h-full md:translate-x-0 md:static"
        )}
      >
        <div>
          <Link href="/dashboard">
            <h2 className="py-10 px-4 w-full hover:bg-gray-200 text-xl font-bold mb-2 hidden md:flex md:gap-4 rounded-b-xl">
              <GiPalmTree /> Mallorca Planer
            </h2>
          </Link>
          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className={cn(
                "py-10 px-4 hover:bg-gray-200 text-gray-700 hover:text-blue-500 rounded-b-xl md:rounded-xl",
                pathname === "/dashboard" && "text-blue-500 font-bold"
              )}
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/new"
              className={cn(
                "py-10 px-4 hover:bg-gray-200 h-full text-gray-700 hover:text-blue-500 rounded-xl",
                pathname === "/dashboard/new" && "text-blue-500 font-bold"
              )}
            >
              Neue Buchung
            </Link>
            <button
              onClick={handleLogout}
              className="block md:hidden w-full py-10 px-4 hover:bg-gray-200  text-gray-700 hover:text-blue-500 rounded-xl"
            >
              Abmelden
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="hidden md:inline w-full py-10 px-4 hover:bg-gray-200  text-gray-700 hover:text-blue-500 rounded-xl"
        >
          Abmelden
        </button>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
