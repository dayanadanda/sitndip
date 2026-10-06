import { NextResponse } from "next/server";
import { addOrder, getOrders, getOrdersForUser, getProducts } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { getSessionCustomer } from "@/lib/customers";
import { uid } from "@/lib/format";
import type { Order, OrderItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (await isAdmin()) return NextResponse.json(getOrders());
  const customer = await getSessionCustomer();
  if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getOrdersForUser(customer.id));
}

export async function POST(request: Request) {
  const customer = await getSessionCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Please log in to place an order." }, { status: 401 });
  }

  const body = await request.json();
  if (!body.customer?.name || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  // Prices always come from the database, never from the browser.
  const products = getProducts();
  const items: OrderItem[] = [];
  for (const raw of body.items as { productId: string; qty: number }[]) {
    const product = products.find((p) => p.id === raw.productId);
    const qty = Math.max(1, Math.floor(Number(raw.qty) || 0));
    if (!product || !product.inStock) {
      return NextResponse.json({ error: "An item in your cart is unavailable." }, { status: 400 });
    }
    items.push({ productId: product.id, name: product.name, price: product.price, qty });
  }

  const order: Order = {
    id: uid("ord-").toUpperCase(),
    userId: customer.id,
    items,
    customer: body.customer,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    createdAt: new Date().toISOString(),
  };

  addOrder(order);
  return NextResponse.json(order, { status: 201 });
}
