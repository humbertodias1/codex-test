"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  serviceType: string;
  date: string;
  technician: { name: string };
  customer: { name: string; phone: string };
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then(setBookings)
      .catch(() => setBookings([]));
  }, []);

  return (
    <DashboardShell>
      <h1 className="mb-6 text-3xl font-semibold">Bookings</h1>
      <div className="rounded bg-white p-4 shadow">
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="border-b pb-2">
              <p className="font-medium">
                {new Date(booking.date).toLocaleString()} — {booking.serviceType}
              </p>
              <p className="text-sm text-slate-600">
                Customer: {booking.customer.name} ({booking.customer.phone})
              </p>
              <p className="text-sm text-slate-600">Technician: {booking.technician.name}</p>
            </li>
          ))}
          {bookings.length === 0 && <li>No bookings found.</li>}
        </ul>
      </div>
    </DashboardShell>
  );
}
