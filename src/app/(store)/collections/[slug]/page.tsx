"use client";

import { use } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { productsForCategory } from "@/lib/types";

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products, categories } = useStore();
  const collection = categories.find((c) => c.slug === slug);
  const list = collection ? productsForCategory(products, collection) : [];

  if (!collection) {
    return (
      <div className="px-6 py-24 text-center">
        <p>Collection not found.</p>
        <Link href="/shop" className="mt-4 inline-block underline">
          Shop all cups
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <p className="text-center text-xs uppercase tracking-[0.28em] text-muted">Collection</p>
      <h1 className="logo-mark mt-2 text-center text-5xl">{collection.name}</h1>
      <p className="mt-3 text-center text-muted">{collection.tagline}</p>
      <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {list.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
