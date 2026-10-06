"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";
import { IconClose } from "./Icons";

export function QuickView() {
  const { quickView, setQuickView, addToCart } = useStore();
  if (!quickView) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close quick view"
        onClick={() => setQuickView(null)}
      />
      <div className="relative grid w-full max-w-3xl gap-6 bg-white p-6 md:grid-cols-2">
        <button
          type="button"
          className="absolute right-3 top-3"
          aria-label="Close"
          onClick={() => setQuickView(null)}
        >
          <IconClose />
        </button>
        <img src={quickView.image} alt={quickView.name} className="mx-auto h-72 w-72 object-contain" />
        <div className="flex flex-col justify-center pr-6">
          <h3 className="logo-mark text-3xl">{quickView.name}</h3>
          <p className="mt-2 text-lg">{money(quickView.price)}</p>
          <p className="mt-4 text-sm leading-6 text-muted">{quickView.description}</p>
          <button
            type="button"
            disabled={!quickView.inStock}
            onClick={() => {
              addToCart(quickView.id);
              setQuickView(null);
            }}
            className="mt-6 bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white disabled:opacity-40"
          >
            {quickView.inStock ? "Add to cart" : "Sold out"}
          </button>
          <Link
            href={`/product/${quickView.slug}`}
            onClick={() => setQuickView(null)}
            className="mt-3 text-center text-xs uppercase tracking-[0.16em] underline"
          >
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}
