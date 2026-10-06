import { NextResponse } from "next/server";
import { getCategories, saveCategories, slugify } from "@/lib/db";
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
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = categories[index];
  const nextSlug =
    current.kind === "bestsellers" ? current.slug : slugify(body.slug || body.name || current.slug);

  categories[index] = {
    ...current,
    name: String(body.name || current.name),
    slug: nextSlug,
    tagline: String(body.tagline ?? current.tagline),
    image: String(body.image || current.image),
  };

  saveCategories(categories);
  return NextResponse.json(categories[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const categories = getCategories();
  const current = categories.find((c) => c.id === id);
  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (current.kind === "bestsellers") {
    return NextResponse.json({ error: "Best Sellers cannot be deleted." }, { status: 400 });
  }

  saveCategories(categories.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}
