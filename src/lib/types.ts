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
  address: string;
  city: string;
  buildingNumber: string;
};

export type PaymentMethod = "cod" | "visa" | "whish";

export const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    description:
      "Pay in cash when your SitnDip order arrives at your door. No online payment is needed.",
  },
  {
    id: "visa",
    label: "Visa",
    description:
      "Pay by Visa card. After you place the order we will contact you to complete the card payment.",
  },
  {
    id: "whish",
    label: "Whish Money",
    description:
      "Pay through the Whish Money app. After you place the order we will send you the Whish number to transfer to.",
  },
];

export type Subscriber = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export function paymentLabel(method?: PaymentMethod) {
  return PAYMENT_OPTIONS.find((option) => option.id === method)?.label ?? "Payment pending";
}

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
    buildingNumber?: string;
    notes?: string;
  };
  paymentMethod: PaymentMethod;
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
