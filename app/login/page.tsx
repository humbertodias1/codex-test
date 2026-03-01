"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Login failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto mt-24 max-w-md rounded bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-semibold">Login</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" required className="w-full rounded border p-2" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded border p-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-slate-900 p-2 text-white">Login</button>
      </form>
      <div className="mt-4 space-y-2 text-sm">
        <p>
          Don&apos;t have an account? <Link href="/register" className="text-blue-600">Register</Link>
        </p>
        <p>
          <Link href="/forgot-password" className="text-blue-600">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
