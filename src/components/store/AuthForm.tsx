"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const input = "w-full border border-line px-4 py-3";

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get("next") ?? "/account";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch(`/api/account/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    if (mode === "register" && form.get("offers") === "on") {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), name: form.get("name") }),
      });
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="logo-mark text-4xl">{mode === "login" ? "Log in" : "Create account"}</h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "login"
          ? "Log in to place orders and see your order history."
          : "Sign up to order your favourite SitnDip jars."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        {mode === "register" && (
          <>
            <input name="name" required placeholder="Full name" className={input} />
            <input name="phone" type="tel" required placeholder="Phone number" className={input} />
          </>
        )}
        <input name="email" type="email" required placeholder="Email" className={input} />
        <input
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 6 : undefined}
          placeholder="Password"
          className={input}
        />
        {mode === "register" && (
          <label className="flex items-start gap-2 text-sm text-muted">
            <input name="offers" type="checkbox" defaultChecked className="mt-1" />
            Email me SitnDip offers and discounts
          </label>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      {mode === "login" && (
        <Link href="/account/forgot" className="mt-4 inline-block text-sm underline">
          Forgot password?
        </Link>
      )}

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError("");
        }}
        className="mt-6 block text-sm underline"
      >
        {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
      </button>
    </div>
  );
}
