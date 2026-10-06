import { NextResponse } from "next/server";
import { getSlides, saveSlides } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { uid } from "@/lib/format";
import type { Slide } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getSlides());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slides = getSlides();
  const slide: Slide = {
    id: uid("s"),
    image: String(body.image || "/images/hero-sweet.jpg"),
    eyebrow: String(body.eyebrow || ""),
    title: String(body.title || "SitnDip"),
    buttonText: String(body.buttonText || "Shop cups"),
    buttonHref: String(body.buttonHref || "/shop"),
  };
  slides.push(slide);
  saveSlides(slides);
  return NextResponse.json(slide, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slides = getSlides();
  const id = String(body.id || "");
  const index = slides.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  slides[index] = {
    ...slides[index],
    image: String(body.image || slides[index].image),
    eyebrow: String(body.eyebrow ?? slides[index].eyebrow),
    title: String(body.title || slides[index].title),
    buttonText: String(body.buttonText || slides[index].buttonText),
    buttonHref: String(body.buttonHref || slides[index].buttonHref),
  };
  saveSlides(slides);
  return NextResponse.json(slides[index]);
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const slides = getSlides();
  if (slides.length <= 1) {
    return NextResponse.json({ error: "Keep at least one slider image." }, { status: 400 });
  }

  saveSlides(slides.filter((s) => s.id !== id));
  return NextResponse.json({ ok: true });
}
