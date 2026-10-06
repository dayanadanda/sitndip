import { NextResponse } from "next/server";
import { getProducts, saveProducts, slugify } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { uid } from "@/lib/format";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const products = getProducts();
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const product: Product = {
    id: uid("p"),
    slug: slugify(body.slug || name) || uid("jar"),
    name,
    price: Number(body.price) || 0,
    compareAt: body.compareAt ? Number(body.compareAt) : undefined,
    description: String(body.description || ""),
    image: String(body.image || "/images/hazelnut-tub.png"),
    collection: String(body.collection || "jars"),
    popular: Boolean(body.popular),
    bestseller: Boolean(body.bestseller),
    inStock: body.inStock !== false,
    createdAt: new Date().toISOString(),
  };

  products.unshift(product);
  saveProducts(products);
  return NextResponse.json(product, { status: 201 });
}
