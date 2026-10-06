"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";
import { ProductCard } from "@/components/store/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products, addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="px-6 py-24 text-center">
        <p>This jar is no longer on the shelf.</p>
        <Link href="/shop" className="mt-4 inline-block underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="bg-cream">
          <img src={product.image} alt={product.name} className="mx-auto h-[420px] w-[420px] object-contain" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{product.collection}</p>
          <h1 className="logo-mark mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl">{money(product.price)}</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">{product.description}</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border border-line">
              <button type="button" className="h-11 w-11" onClick={() => setQty(Math.max(1, qty - 1))}>
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button type="button" className="h-11 w-11" onClick={() => setQty(qty + 1)}>
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => addToCart(product.id, qty)}
              className="flex-1 bg-cocoa py-3 text-sm uppercase tracking-[0.16em] text-white disabled:opacity-40"
            >
              {product.inStock ? "Add to cart" : "Sold out"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="logo-mark text-center text-3xl">You may also dip</h2>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
