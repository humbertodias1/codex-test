"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { FormEvent, useEffect, useState } from "react";

type Technician = {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceArea: string;
  skills: string[];
};

const defaultAvailability = [{ day: 1, slots: [{ start: "09:00", end: "17:00" }] }];

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const load = async () => {
    const response = await fetch("/api/technicians");
    if (response.ok) setTechnicians(await response.json());
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch("/api/technicians", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        serviceArea: form.get("serviceArea"),
        skills: String(form.get("skills")).split(",").map((s) => s.trim()),
        calendarAvailability: defaultAvailability
      })
    });

    event.currentTarget.reset();
    await load();
  };

  const update = async (tech: Technician) => {
    const name = prompt("Name", tech.name);
    if (!name) return;
    const serviceArea = prompt("Service area", tech.serviceArea);
    if (!serviceArea) return;
    const skills = prompt("Skills comma-separated", tech.skills.join(", "));
    if (!skills) return;

    await fetch(`/api/technicians/${tech.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: tech.phone,
        email: tech.email,
        serviceArea,
        skills: skills.split(",").map((s) => s.trim()),
        calendarAvailability: defaultAvailability
      })
    });

    await load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/technicians/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <DashboardShell>
      <h1 className="mb-6 text-3xl font-semibold">Technicians</h1>
      <form onSubmit={create} className="mb-6 grid gap-3 rounded bg-white p-4 shadow md:grid-cols-2">
        <input name="name" placeholder="Name" required className="rounded border p-2" />
        <input name="phone" placeholder="Phone" required className="rounded border p-2" />
        <input name="email" type="email" placeholder="Email" required className="rounded border p-2" />
        <input name="serviceArea" placeholder="Service area" required className="rounded border p-2" />
        <input name="skills" placeholder="Skills comma-separated" required className="rounded border p-2 md:col-span-2" />
        <button className="rounded bg-slate-900 p-2 text-white md:col-span-2">Create Technician</button>
      </form>

      <div className="rounded bg-white p-4 shadow">
        <ul className="space-y-3">
          {technicians.map((tech) => (
            <li key={tech.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{tech.name}</p>
                <p className="text-sm text-slate-600">
                  {tech.serviceArea} • {tech.skills.join(", ")}
                </p>
              </div>
              <div className="space-x-2">
                <button onClick={() => update(tech)} className="rounded bg-slate-700 px-3 py-1 text-white">
                  Edit
                </button>
                <button onClick={() => remove(tech.id)} className="rounded bg-red-600 px-3 py-1 text-white">
                  Delete
                </button>
              </div>
            </li>
          ))}
          {technicians.length === 0 && <li>No technicians found.</li>}
        </ul>
      </div>
    </DashboardShell>
  );
}
