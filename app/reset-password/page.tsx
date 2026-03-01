"use client";

import { FormEvent, useState } from "react";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      token: formData.get("token"),
      password: formData.get("password")
    };

    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setMessage(data.message ?? data.error ?? "Done");
  };

  return (
    <div className="mx-auto mt-24 max-w-md rounded bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-semibold">Set New Password</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input name="token" placeholder="Reset token" required className="w-full rounded border p-2" />
        <input
          name="password"
          type="password"
          placeholder="New password"
          minLength={8}
          required
          className="w-full rounded border p-2"
        />
        <button className="w-full rounded bg-slate-900 p-2 text-white">Reset password</button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
