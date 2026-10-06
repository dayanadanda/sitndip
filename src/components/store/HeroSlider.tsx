"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export function HeroSlider() {
  const { slides } = useStore();
  const [index, setIndex] = useState(0);
  const list = slides.length
    ? slides
    : [
        {
          id: "fallback",
          image: "/images/hero-sweet.jpg",
          eyebrow: "ISO certified · Made in Lebanon",
          title: "Sit down. Dip in.",
          buttonText: "Shop cups",
          buttonHref: "/shop",
        },
      ];

  useEffect(() => {
    setIndex(0);
  }, [list.length]);

  useEffect(() => {
    if (list.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % list.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [list.length]);

  const slide = list[index] ?? list[0];

  return (
    <section className="relative h-[68vw] max-h-[720px] min-h-[380px] overflow-hidden bg-cream">
      {list.map((item, i) => (
        <img
          key={item.id}
          src={item.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-xs uppercase tracking-[0.35em]">{slide.eyebrow}</p>
        <h1 className="logo-mark mt-3 text-4xl md:text-6xl">{slide.title}</h1>
        <Link
          href={slide.buttonHref || "/shop"}
          className="mt-8 border border-white px-8 py-3 text-xs uppercase tracking-[0.22em] hover:bg-white hover:text-ink"
        >
          {slide.buttonText || "Shop cups"}
        </Link>
      </div>
      {list.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((index - 1 + list.length) % list.length)}
            className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((index + 1) % list.length)}
            className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
