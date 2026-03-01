"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/technicians", label: "Technicians" },
  { href: "/bookings", label: "Bookings" },
  { href: "/bookings/new", label: "Create Booking" }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4">
      <h1 className="mb-8 text-2xl font-semibold">Booking SaaS</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded px-3 py-2 text-sm font-medium ${
              pathname.startsWith(link.href) ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-auto rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}
