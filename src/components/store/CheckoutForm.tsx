"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";
import { PAYMENT_OPTIONS, type Customer, type PaymentMethod } from "@/lib/types";

const field = "w-full border border-line px-4 py-3";
const label = "mb-1 block text-xs uppercase tracking-[0.16em] text-muted";

export function CheckoutForm({ customer }: { customer: Customer }) {
  const { products, cart, cartTotal, clearCart } = useStore();
  const [done, setDone] = useState<{ id: string; payment: PaymentMethod; emailSent?: boolean } | null>(null);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentMethod | "">("");

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, qty: item.qty } : null;
    })
    .filter(Boolean) as { product: (typeof products)[number]; qty: number }[];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!payment) {
      setError("Please choose how you want to pay.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod: payment,
        customer: {
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          city: form.get("city"),
          buildingNumber: form.get("buildingNumber"),
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
    setDone({ id: order.id, payment, emailSent: order.emailSent });
  }

  if (done) {
    const thanks =
      done.payment === "cod"
        ? "Pay in cash when your order is delivered."
        : done.payment === "visa"
          ? "We will contact you to complete the Visa payment."
          : "We will send you the Whish Money number to complete payment.";
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="logo-mark text-4xl">Order received</h1>
        <p className="mt-4 text-sm text-muted">
          Thank you. Your SitnDip order <strong>{done.id}</strong> is in. {thanks}{" "}
          {done.emailSent
            ? "A receipt was sent to your email."
            : "We could not send the receipt email yet. Keep this order number."}
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
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="logo-mark mb-2 text-4xl">Checkout</h1>
        <p className="text-sm text-muted">
          Confirm your delivery details and choose how you want to pay. These details are also saved to your
          profile.
        </p>

        <div>
          <label className={label} htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" required defaultValue={customer.name} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={customer.email}
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={customer.phone}
            placeholder="e.g. 70 888 898"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            required
            defaultValue={customer.address}
            placeholder="Street name"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="buildingNumber">
            Building / house number
          </label>
          <input
            id="buildingNumber"
            name="buildingNumber"
            required
            defaultValue={customer.buildingNumber}
            placeholder="Building or apartment number"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="city">
            City
          </label>
          <input
            id="city"
            name="city"
            required
            defaultValue={customer.city}
            placeholder="City"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="notes">
            Order note
          </label>
          <textarea id="notes" name="notes" rows={3} placeholder="Optional" className={field} />
        </div>

        <fieldset className="space-y-3 pt-2">
          <legend className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Payment method</legend>
          {PAYMENT_OPTIONS.map((option) => {
            const selected = payment === option.id;
            return (
              <label
                key={option.id}
                className={`block cursor-pointer border p-4 ${selected ? "border-cocoa bg-cream" : "border-line"}`}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={selected}
                    onChange={() => setPayment(option.id)}
                    required
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="mt-1 block text-sm text-muted">{option.description}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white">
          Place order
        </button>
      </form>
      <aside className="h-fit bg-cream p-6">
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
