"use client";

import { FormEvent, useState } from "react";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not subscribe.");
      return;
    }
    setMessage(data.message);
    if (!data.already) form.reset();
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "mt-4 space-y-2" : "mt-6 flex max-w-md flex-col gap-2 sm:flex-row"}>
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="w-full border border-line px-4 py-3 text-sm"
      />
      <button
        type="submit"
        disabled={busy}
        className="bg-cocoa px-5 py-3 text-xs uppercase tracking-[0.16em] text-white disabled:opacity-60"
      >
        {busy ? "Checking…" : "Subscribe"}
      </button>
      {message && <p className="text-sm text-cocoa sm:col-span-2">{message}</p>}
      {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
    </form>
  );
}
