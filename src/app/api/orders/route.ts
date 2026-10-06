import { NextResponse } from "next/server";
import { addOrder, getOrders, getOrdersForUser, getProducts } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { getSessionCustomer, updateCustomerProfile } from "@/lib/customers";
import { uid } from "@/lib/format";
import { sendOrderReceipt } from "@/lib/mail";
import type { Order, OrderItem, PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAYMENTS = new Set<PaymentMethod>(["cod", "visa", "whish"]);

function text(value: unknown) {
  return String(value ?? "").trim();
}

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
  const paymentMethod = body.paymentMethod as PaymentMethod;
  if (!PAYMENTS.has(paymentMethod)) {
    return NextResponse.json({ error: "Please choose a payment method." }, { status: 400 });
  }

  const details = {
    name: text(body.customer?.name),
    email: text(body.customer?.email) || customer.email,
    phone: text(body.customer?.phone),
    address: text(body.customer?.address),
    city: text(body.customer?.city),
    buildingNumber: text(body.customer?.buildingNumber),
    notes: text(body.customer?.notes) || undefined,
  };

  if (!details.name || !details.phone || !details.address || !details.city || !details.buildingNumber) {
    return NextResponse.json(
      { error: "Please fill in your name, phone, address, building number, and city." },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

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

  updateCustomerProfile(customer.id, {
    name: details.name,
    phone: details.phone,
    address: details.address,
    city: details.city,
    buildingNumber: details.buildingNumber,
  });

  const order: Order = {
    id: uid("ord-").toUpperCase(),
    userId: customer.id,
    items,
    customer: details,
    paymentMethod,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    createdAt: new Date().toISOString(),
  };

  addOrder(order);
  const receipt = await sendOrderReceipt(order);
  return NextResponse.json({ ...order, emailSent: receipt.sent }, { status: 201 });
}
