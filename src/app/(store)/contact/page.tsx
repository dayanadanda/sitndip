"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) form.reset();
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Reach out</p>
        <h1 className="logo-mark mt-3 text-5xl">Contact Us</h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          Retail, wholesale, or a flavor you need in 6 KG — write to us. SitnDip is manufactured in Lebanon and ships worldwide.
        </p>
        <div className="mt-8 space-y-2 text-sm">
          <p>
            <a href="mailto:sitndip@gmail.com">sitndip@gmail.com</a>
          </p>
          <p>
            <a href="tel:+96170888898">+961 70 888 898</a>
          </p>
          <p>
            <a href="tel:+96170888856">+961 70 888 856</a>
          </p>
          <p>Beirut · Shipping worldwide · All TTC included</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input name="name" required placeholder="Name" className="w-full border border-line px-4 py-3 outline-none" />
        <input name="email" type="email" required placeholder="Email" className="w-full border border-line px-4 py-3 outline-none" />
        <input name="phone" placeholder="Phone" className="w-full border border-line px-4 py-3 outline-none" />
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us about your order, event, or wholesale request"
          className="w-full border border-line px-4 py-3 outline-none"
        />
        <button type="submit" className="w-full bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white">
          Send message
        </button>
        {status === "sent" && <p className="text-sm text-green-700">Thank you. We received your message.</p>}
        {status === "error" && <p className="text-sm text-red-700">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
