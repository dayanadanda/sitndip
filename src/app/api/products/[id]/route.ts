import { NextResponse } from "next/server";
import { getProducts, saveProducts, slugify } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  products[index] = {
    ...products[index],
    name: String(body.name || products[index].name),
    slug: slugify(body.slug || body.name || products[index].slug),
    price: Number(body.price ?? products[index].price),
    compareAt: body.compareAt ? Number(body.compareAt) : undefined,
    description: String(body.description ?? products[index].description),
    image: String(body.image || products[index].image),
    collection: String(body.collection || products[index].collection),
    popular: Boolean(body.popular),
    bestseller: Boolean(body.bestseller),
    inStock: body.inStock !== false,
  };

  saveProducts(products);
  return NextResponse.json(products[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return NextResponse.json({ ok: true });
}
