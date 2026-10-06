"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Category, Product, Slide } from "@/lib/types";

type StoreContextValue = {
  products: Product[];
  categories: Category[];
  slides: Slide[];
  refreshProducts: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickView: Product | null;
  setQuickView: (product: Product | null) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({
  children,
  initialProducts,
  initialCategories,
  initialSlides,
}: {
  children: React.ReactNode;
  initialProducts: Product[];
  initialCategories: Category[];
  initialSlides: Slide[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [slides, setSlides] = useState(initialSlides);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setSlides(initialSlides);
  }, [initialSlides]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sitndip-cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    localStorage.setItem("sitndip-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  const refreshProducts = useCallback(async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (res.ok) setProducts(await res.json());
  }, []);

  const refreshCatalog = useCallback(async () => {
    const [catRes, slideRes] = await Promise.all([
      fetch("/api/categories", { cache: "no-store" }),
      fetch("/api/slides", { cache: "no-store" }),
    ]);
    if (catRes.ok) setCategories(await catRes.json());
    if (slideRes.ok) setSlides(await slideRes.json());
  }, []);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((item) => item.productId === productId);
      if (found) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...prev, { productId, qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, qty } : item)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const value = useMemo(
    () => ({
      products,
      categories,
      slides,
      refreshProducts,
      refreshCatalog,
      cart,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartCount,
      cartTotal,
      cartOpen,
      setCartOpen,
      menuOpen,
      setMenuOpen,
      searchOpen,
      setSearchOpen,
      quickView,
      setQuickView,
    }),
    [
      products,
      categories,
      slides,
      refreshProducts,
      refreshCatalog,
      cart,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartCount,
      cartTotal,
      cartOpen,
      menuOpen,
      searchOpen,
      quickView,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
