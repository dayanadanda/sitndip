import { NextResponse } from "next/server";
import { getMessages, saveMessages } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { uid } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getMessages());
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const messages = getMessages();
  messages.unshift({
    id: uid("m"),
    name,
    email,
    phone: String(body.phone || ""),
    message,
    createdAt: new Date().toISOString(),
  });
  saveMessages(messages);
  return NextResponse.json({ ok: true }, { status: 201 });
}
