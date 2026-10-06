"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { productsForCategory } from "@/lib/types";

export default function ShopPage() {
  const { products, categories } = useStore();
  const [filter, setFilter] = useState("all");

  const list = useMemo(() => {
    if (filter === "all") return products;
    const category = categories.find((c) => c.slug === filter);
    if (!category) return products.filter((p) => p.collection === filter);
    return productsForCategory(products, category);
  }, [filter, products, categories]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <p className="text-center text-xs uppercase tracking-[0.28em] text-muted">Shop all</p>
      <h1 className="logo-mark mt-2 text-center text-5xl">SitnDip Cups</h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-xs uppercase tracking-[0.16em] ${
            filter === "all" ? "bg-cocoa text-white" : "border border-line"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setFilter(c.slug)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] ${
              filter === c.slug ? "bg-cocoa text-white" : "border border-line"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
