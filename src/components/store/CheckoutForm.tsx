"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";
import type { Customer } from "@/lib/types";

export function CheckoutForm({ customer }: { customer: Customer }) {
  const { products, cart, cartTotal, clearCart } = useStore();
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, qty: item.qty } : null;
    })
    .filter(Boolean) as { product: (typeof products)[number]; qty: number }[];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          city: form.get("city"),
          notes: form.get("notes"),
        },
        items: lines.map((line) => ({ productId: line.product.id, qty: line.qty })),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not place your order.");
      return;
    }
    const order = await res.json();
    clearCart();
    setDone(order.id);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="logo-mark text-4xl">Order received</h1>
        <p className="mt-4 text-sm text-muted">
          Thank you. Your SitnDip order <strong>{done}</strong> is in. We will confirm by email shortly.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="bg-cocoa px-6 py-3 text-xs uppercase tracking-[0.16em] text-white">
            Keep shopping
          </Link>
          <Link href="/account" className="border border-line px-6 py-3 text-xs uppercase tracking-[0.16em]">
            My orders
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="px-6 py-24 text-center">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block underline">
          Shop jars
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-3">
        <h1 className="logo-mark mb-6 text-4xl">Checkout</h1>
        <input name="name" required defaultValue={customer.name} placeholder="Full name" className="w-full border border-line px-4 py-3" />
        <input name="email" type="email" required defaultValue={customer.email} placeholder="Email" className="w-full border border-line px-4 py-3" />
        <input name="phone" required defaultValue={customer.phone} placeholder="Phone" className="w-full border border-line px-4 py-3" />
        <input name="address" required placeholder="Address" className="w-full border border-line px-4 py-3" />
        <input name="city" required placeholder="City" className="w-full border border-line px-4 py-3" />
        <textarea name="notes" rows={3} placeholder="Order note" className="w-full border border-line px-4 py-3" />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white">
          Place order
        </button>
      </form>
      <aside className="bg-cream p-6">
        <h2 className="text-sm uppercase tracking-[0.16em]">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex justify-between text-sm">
              <span>
                {product.name} × {qty}
              </span>
              <span>{money(product.price * qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-line pt-4 font-medium">
          <span>Total</span>
          <span>{money(cartTotal)}</span>
        </div>
      </aside>
    </div>
  );
}
