import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSubscribers } from "@/lib/db";
import { sendOffer } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getSubscribers());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!subject || !message) {
    return NextResponse.json({ error: "Please enter a subject and a message." }, { status: 400 });
  }
  const subscribers = getSubscribers();
  if (subscribers.length === 0) {
    return NextResponse.json({ error: "There are no subscribers yet." }, { status: 400 });
  }
  let sent = 0;
  let failed = 0;
  for (const subscriber of subscribers) {
    const result = await sendOffer(subscriber.email, subject, message);
    if (result.sent) sent += 1;
    else failed += 1;
  }
  return NextResponse.json({ sent, failed, total: subscribers.length });
}
