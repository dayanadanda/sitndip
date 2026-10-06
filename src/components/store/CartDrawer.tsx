"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";
import { IconClose } from "./Icons";

export function CartDrawer() {
  const { products, cart, cartOpen, setCartOpen, setQty, removeFromCart, cartTotal } = useStore();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
      />
      <aside className="absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-medium">Your cart</h2>
          <button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">Your cart is currently empty.</p>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <li key={item.productId} className="flex gap-4">
                    <img src={product.image} alt={product.name} className="h-20 w-20 object-contain" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{product.name}</p>
                      <p className="mt-1 text-sm text-muted">{money(product.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="h-7 w-7 border border-line"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          className="h-7 w-7 border border-line"
                          onClick={() => setQty(item.productId, item.qty + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-xs text-muted underline"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>{money(cartTotal)}</span>
          </div>
          <p className="mb-4 text-xs text-muted">
            Shipping, taxes, and discount codes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            onClick={() => setCartOpen(false)}
            className={`block w-full bg-cocoa py-3 text-center text-sm uppercase tracking-[0.16em] text-white ${
              cart.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Check out
          </Link>
        </div>
      </aside>
    </div>
  );
}
