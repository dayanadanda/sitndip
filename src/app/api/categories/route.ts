import { NextResponse } from "next/server";
import { getCategories, saveCategories, slugify } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { uid } from "@/lib/format";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCategories());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const categories = getCategories();
  const slug = slugify(body.slug || name) || uid("cat");
  if (categories.some((c) => c.slug === slug)) {
    return NextResponse.json({ error: "A category with this slug already exists." }, { status: 400 });
  }

  const category: Category = {
    id: uid("c"),
    slug,
    name,
    tagline: String(body.tagline || ""),
    image: String(body.image || "/images/hazelnut-tub.png"),
    kind: "regular",
  };

  categories.push(category);
  saveCategories(categories);
  return NextResponse.json(category, { status: 201 });
}
