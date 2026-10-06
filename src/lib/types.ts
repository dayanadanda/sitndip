export type CategoryKind = "regular" | "bestsellers";

export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  kind: CategoryKind;
};

export type Slide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  buttonText: string;
  buttonHref: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  description: string;
  image: string;
  collection: string;
  popular: boolean;
  bestseller: boolean;
  inStock: boolean;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Order = {
  id: string;
  userId?: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  total: number;
  createdAt: string;
};

export const BESTSELLERS_SLUG = "bestsellers";

export function productsForCategory(products: Product[], category: Category) {
  if (category.kind === "bestsellers" || category.slug === BESTSELLERS_SLUG) {
    return products.filter((product) => product.bestseller);
  }
  return products.filter((product) => product.collection === category.slug);
}
