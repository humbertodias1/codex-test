"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") })
    });

    const data = await response.json();
    setMessage(data.message ?? data.error ?? "Done");
  };

  return (
    <div className="mx-auto mt-24 max-w-md rounded bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-semibold">Reset Password</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" required className="w-full rounded border p-2" />
        <button className="w-full rounded bg-slate-900 p-2 text-white">Request reset</button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
