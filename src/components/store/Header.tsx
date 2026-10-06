"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { IconCart, IconClose, IconMenu, IconSearch, IconUser } from "./Icons";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function Header({ signedIn = false }: { signedIn?: boolean }) {
  const { cartCount, setCartOpen, menuOpen, setMenuOpen, setSearchOpen, categories } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-cocoa px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-white">
        Shipping all over the world
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-4 py-4 md:px-8">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="justify-self-start p-2"
        >
          <IconMenu />
        </button>

        <Logo />

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="p-2"
          >
            <IconSearch />
          </button>
          <Link
            href={signedIn ? "/account" : "/account/login"}
            aria-label={signedIn ? "My account" : "Log in"}
            className="p-2"
          >
            <IconUser />
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="relative p-2"
          >
            <IconCart />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-cocoa px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white px-7 py-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="logo-mark text-2xl">SitnDip</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <IconClose />
              </button>
            </div>
            <div className="flex flex-col gap-5 text-lg">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mt-10 text-xs uppercase tracking-[0.2em] text-muted">Our Collections</p>
            <div className="mt-3 flex flex-col gap-3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-base"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="mt-auto pt-10 text-xs uppercase tracking-[0.18em] text-muted"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
