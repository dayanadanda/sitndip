"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { HeroSlider } from "@/components/store/HeroSlider";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { productsForCategory } from "@/lib/types";

export default function HomePage() {
  const { products, categories } = useStore();
  const [tab, setTab] = useState("all");
  const scroller = useRef<HTMLDivElement>(null);
  const bestsellersCategory = categories.find((c) => c.kind === "bestsellers");
  const bestsellers = products.filter((p) => p.bestseller);

  const popular = (() => {
    if (tab === "all") return products.filter((p) => p.popular);
    const category = categories.find((c) => c.slug === tab);
    if (!category) return products.filter((p) => p.collection === tab);
    return productsForCategory(products, category);
  })();

  function scrollBy(dir: number) {
    scroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <div>
      <HeroSlider />

      <section className="px-4 py-16 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-center gap-x-8 gap-y-3">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`text-2xl md:text-3xl ${
              tab === "all" ? "border-b-2 border-ink pb-1" : "text-muted"
            }`}
          >
            <span className="block text-center">
              <span className="block text-[11px] uppercase tracking-[0.28em]">Most popular</span>
              <span className="logo-mark">SitnDip Cups</span>
            </span>
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.slug)}
              className={`text-2xl md:text-3xl ${
                tab === item.slug ? "border-b-2 border-ink pb-1" : "text-muted"
              }`}
            >
              <span className="logo-mark">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <div
            ref={scroller}
            className="no-scrollbar flex gap-8 overflow-x-auto px-2 pb-4 md:px-10"
          >
            {popular.map((product) => (
              <div key={product.id} className="w-[240px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-white md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-white md:flex"
          >
            ›
          </button>
        </div>
      </section>

      <section>
        <div className={`grid ${categories.length > 2 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
          {categories.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative min-h-[280px] overflow-hidden bg-cream md:min-h-[360px]"
            >
              <img
                src={collection.image}
                alt=""
                className="absolute inset-0 h-full w-full object-contain p-10 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 flex h-full items-end p-6 text-white">
                <h2 className="text-2xl font-medium leading-tight">{collection.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream px-4 py-20 text-center md:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Brand new</p>
        <h2 className="logo-mark mt-3 text-4xl md:text-5xl">
          {bestsellersCategory?.name || "Our Best Sellers"}
        </h2>
        <Link
          href={`/collections/${bestsellersCategory?.slug || "bestsellers"}`}
          className="mt-6 inline-block border border-ink px-8 py-3 text-xs uppercase tracking-[0.2em]"
        >
          Buy now
        </Link>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
