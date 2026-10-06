"use client";

import { FormEvent, useState } from "react";
import type { Subscriber } from "@/lib/types";

export function SubscriberAdmin({ initial }: { initial: Subscriber[] }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setBusy(true);
    const res = await fetch("/api/subscribe/campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send the offer.");
      return;
    }
    setStatus(`Sent to ${data.sent} of ${data.total} subscribers.${data.failed ? ` ${data.failed} failed.` : ""}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="bg-white p-5 shadow-sm">
        <h2 className="font-medium">Send an offer</h2>
        <p className="mt-1 text-sm text-[#646970]">This goes to every subscribed email.</p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            placeholder="Subject"
            className="w-full border border-[#c3c4c7] px-3 py-2"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={8}
            placeholder="Offer or discount details"
            className="w-full border border-[#c3c4c7] px-3 py-2"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          {status && <p className="text-sm text-green-700">{status}</p>}
          <button
            type="submit"
            disabled={busy}
            className="bg-[#2271b1] px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send to subscribers"}
          </button>
        </form>
      </section>
      <section className="bg-white p-5 shadow-sm">
        <h2 className="font-medium">Subscribers ({initial.length})</h2>
        {initial.length === 0 ? (
          <p className="mt-3 text-sm text-[#646970]">Nobody has subscribed yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {initial.map((item) => (
              <li key={item.id} className="border-b border-[#f0f0f1] py-2">
                {item.email}
                {item.name ? ` · ${item.name}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
