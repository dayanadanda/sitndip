"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { setQuickView } = useStore();

  return (
    <article className="group relative min-w-[220px] flex-1 text-center">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative mx-auto flex aspect-square items-center justify-center bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="h-[78%] w-[78%] object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-wider text-white">
              Sold out
            </span>
          )}
        </div>
        <h3 className="mt-3 text-sm">{product.name}</h3>
        <p className="mt-1 text-sm text-muted">
          {product.compareAt ? (
            <>
              <span className="mr-2 line-through">{money(product.compareAt)}</span>
              {money(product.price)}
            </>
          ) : (
            money(product.price)
          )}
        </p>
      </Link>
      <button
        type="button"
        onClick={() => setQuickView(product)}
        className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted underline-offset-4 hover:underline"
      >
        Quick view
      </button>
    </article>
  );
}
