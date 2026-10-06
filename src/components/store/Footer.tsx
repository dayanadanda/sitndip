"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export function Footer() {
  const { categories } = useStore();

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="logo-mark text-3xl">SitnDip</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            ISO-certified chocolate spreads made in Lebanon. ½ KG cups and 6 KG wholesale tubs.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/shop">Shop All</Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/collections/${category.slug}`}>
                {category.name}
              </Link>
            ))}
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Reach out</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href="mailto:sitndip@gmail.com">sitndip@gmail.com</a>
            <a href="tel:+96170888898">+961 70 888 898</a>
            <a href="https://wa.me/96170888898" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <Link href="/admin">Store admin</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-6 py-4 text-center text-xs text-muted">
        © 2026 SitnDip. All TTC included. Made in Lebanon.
      </div>
    </footer>
  );
}
