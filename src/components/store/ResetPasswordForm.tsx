"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const input = "w-full border border-line px-4 py-3";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/account/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not reset the password.");
      return;
    }
    router.push("/account/login");
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="logo-mark text-4xl">Reset password</h1>
        <p className="mt-4 text-sm text-muted">This reset link is missing. Request a new one from log in.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="logo-mark text-4xl">New password</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input name="password" type="password" required minLength={6} placeholder="New password" className={input} />
        <input name="confirm" type="password" required minLength={6} placeholder="Confirm password" className={input} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
