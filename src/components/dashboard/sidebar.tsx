"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/logout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { getCurrentUserRole } from "@/lib/actions/getCurrent";
import { se } from "date-fns/locale";

type SidebarProps = {
  role?: "ADMIN" | "FAMILY" | "GUEST";
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const links = [
    { href: "/dashboard", label: "Kalender", role: ["FAMILY", "ADMIN", "GUEST"] },
    { href: "/dashboard/new", label: "Neuer Urlaub", role: ["FAMILY", "ADMIN"] },
    { href: "/dashboard/gaeste", label: "Gäste", role: ["FAMILY", "ADMIN"] },
    { href: "/dashboard/anfragen", label: "Anfragen", role: ["FAMILY", "ADMIN"] },
    { href: "/dashboard/urlaub-anfragen", label: "Urlaubsanfragen", role: ["GUEST", "ADMIN"] },
  ];

  useEffect(() => {
    getCurrentUserRole().then(setRole);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">🏝️ Mallorca Planer</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r flex flex-col justify-between p-6 md:w-64 min-h-screen transition-transform duration-200 ease-in-out z-50",
          isOpen ? "translate-x-0 fixed top-0 left-0 w-64 h-full" : "-translate-x-full fixed top-0 left-0 w-64 h-full md:translate-x-0 md:static"
        )}
      >
        <div>
          <h2 className="text-xl font-bold mb-6 hidden md:block">
            🏝️ Mallorca Planer
          </h2>
          <nav className="flex flex-col gap-4">
            {links.map(({ href, label, role: allowedRoles }) =>
              role && allowedRoles.includes(role) ? (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-md hover:bg-gray-100 transition",
                    pathname === href ? "bg-gray-100 font-semibold" : ""
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ) : null
            )}
          </nav>
        </div>

        <form action={logout} className="mt-6">
          <Button type="submit" variant="outline" className="w-full">
            Abmelden
          </Button>
        </form>
      </aside>
    </>
  );
}
