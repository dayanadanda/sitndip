"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    if (!res.ok) {
      setError("Invalid username or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1d2327] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-8 shadow-xl">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-muted">SitnDip Admin</p>
        <h1 className="logo-mark mt-2 text-center text-3xl">Log in</h1>
        <input
          name="username"
          defaultValue="admin"
          placeholder="Username"
          className="mt-8 w-full border border-line px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="mt-3 w-full border border-line px-3 py-2"
        />
        <button type="submit" className="mt-5 w-full bg-[#2271b1] py-2.5 text-white">
          Log In
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-6 text-center text-xs text-muted">
          Default login: <strong>admin</strong> / <strong>sitndip2026</strong>
        </p>
      </form>
    </div>
  );
}
