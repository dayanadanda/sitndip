"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";
import { IconClose } from "./Icons";

export function SearchModal() {
  const { products, searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [products, query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search SitnDip jars"
          className="w-full border-b border-line py-3 text-lg outline-none"
        />
        <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
          <IconClose />
        </button>
      </div>
      <div className="mx-auto max-w-3xl px-5">
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            onClick={() => setSearchOpen(false)}
            className="flex items-center gap-4 border-b border-line py-3"
          >
            <img src={product.image} alt="" className="h-16 w-16 object-contain" />
            <div>
              <p>{product.name}</p>
              <p className="text-sm text-muted">{money(product.price)}</p>
            </div>
          </Link>
        ))}
        {query && results.length === 0 && (
          <p className="py-10 text-sm text-muted">No jars match “{query}”.</p>
        )}
      </div>
    </div>
  );
}
