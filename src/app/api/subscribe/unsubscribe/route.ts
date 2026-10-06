import { NextResponse } from "next/server";
import { unsubscribeToken } from "@/lib/mail";
import { findSubscriber, removeSubscriber } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = String(url.searchParams.get("email") ?? "");
  const token = String(url.searchParams.get("token") ?? "");
  if (!email || token !== unsubscribeToken(email) || !findSubscriber(email)) {
    return NextResponse.json({ error: "This unsubscribe link is not valid." }, { status: 400 });
  }
  removeSubscriber(email);
  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px">
      <h1>Unsubscribed</h1>
      <p>${email} will no longer receive SitnDip offers.</p>
      <p><a href="/">Back to SitnDip</a></p>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
