"use client";

import { FormEvent, useState } from "react";

const input = "w-full border border-line px-4 py-3";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDone("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/account/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send the reset email.");
      return;
    }
    setDone(data.message ?? "Check your email.");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="logo-mark text-4xl">Forgot password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter the email on your SitnDip account. If it exists, we will send a reset link.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input name="email" type="email" required placeholder="Email" className={input} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        {done && <p className="text-sm text-cocoa">{done}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <a href="/account/login" className="mt-6 inline-block text-sm underline">
        Back to log in
      </a>
    </div>
  );
}
