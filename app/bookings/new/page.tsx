"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { FormEvent, useState } from "react";

export default function CreateBookingPage() {
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const date = new Date(`${form.get("date")}T${form.get("time")}:00.000Z`).toISOString();

    const payload = {
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      email: form.get("email"),
      address: form.get("address"),
      serviceType: form.get("serviceType"),
      serviceArea: form.get("serviceArea"),
      date,
      notes: form.get("notes") || undefined
    };

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setMessage(response.ok ? "Booking created successfully" : data.error ?? "Failed to create booking");
    if (response.ok) event.currentTarget.reset();
  };

  return (
    <DashboardShell>
      <h1 className="mb-6 text-3xl font-semibold">Create Booking</h1>
      <form onSubmit={onSubmit} className="grid gap-3 rounded bg-white p-4 shadow md:grid-cols-2">
        <input name="customerName" placeholder="Customer name" required className="rounded border p-2" />
        <input name="phone" placeholder="Phone" required className="rounded border p-2" />
        <input name="email" type="email" placeholder="Email" required className="rounded border p-2" />
        <input name="address" placeholder="Address" required className="rounded border p-2" />
        <input name="serviceType" placeholder="Service type" required className="rounded border p-2" />
        <input name="serviceArea" placeholder="Service area" required className="rounded border p-2" />
        <input name="date" type="date" required className="rounded border p-2" />
        <input name="time" type="time" required className="rounded border p-2" />
        <textarea name="notes" placeholder="Notes" className="rounded border p-2 md:col-span-2" />
        <button className="rounded bg-slate-900 p-2 text-white md:col-span-2">Create booking</button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </DashboardShell>
  );
}
