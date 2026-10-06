"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@/lib/types";

const field = "w-full border border-line px-4 py-3";
const label = "mb-1 block text-xs uppercase tracking-[0.16em] text-muted";

export function ProfileForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save your profile.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-lg space-y-3">
      <div>
        <label className={label} htmlFor="profile-name">
          Full name
        </label>
        <input id="profile-name" name="name" required defaultValue={customer.name} className={field} />
      </div>
      <div>
        <label className={label}>Email</label>
        <input value={customer.email} readOnly className={`${field} bg-cream text-muted`} />
      </div>
      <div>
        <label className={label} htmlFor="profile-phone">
          Phone number
        </label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          required
          defaultValue={customer.phone}
          className={field}
        />
      </div>
      <div>
        <label className={label} htmlFor="profile-address">
          Address
        </label>
        <input
          id="profile-address"
          name="address"
          required
          defaultValue={customer.address}
          className={field}
        />
      </div>
      <div>
        <label className={label} htmlFor="profile-building">
          Building / house number
        </label>
        <input
          id="profile-building"
          name="buildingNumber"
          required
          defaultValue={customer.buildingNumber}
          className={field}
        />
      </div>
      <div>
        <label className={label} htmlFor="profile-city">
          City
        </label>
        <input id="profile-city" name="city" required defaultValue={customer.city} className={field} />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-cocoa">Profile saved. Checkout will use these details.</p>}
      <button
        type="submit"
        disabled={busy}
        className="bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.16em] text-white disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
