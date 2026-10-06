import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { getCategories, getProducts, getSlides } from "@/lib/db";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SitnDip — Chocolate Spreads Made in Lebanon",
  description:
    "ISO-certified SitnDip chocolate spreads. Hazelnut, pistachio, Lotus, cookies and cream — ½ KG cups and 6 KG wholesale tubs.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = getProducts();
  const categories = getCategories();
  const slides = getSlides();

  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white text-ink antialiased">
        <StoreProvider
          initialProducts={products}
          initialCategories={categories}
          initialSlides={slides}
        >
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
