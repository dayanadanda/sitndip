import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/customers";
import { mailConfigured, sendPasswordReset } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!mailConfigured()) {
    return NextResponse.json(
      { error: "Password reset email is not set up yet. Ask SitnDip to add Gmail SMTP settings." },
      { status: 503 },
    );
  }
  const reset = requestPasswordReset(email);
  if (reset.token && reset.email) {
    const mail = await sendPasswordReset(reset.email, reset.token);
    if (!mail.sent) {
      return NextResponse.json({ error: mail.error ?? "Could not send the reset email." }, { status: 500 });
    }
  }
  return NextResponse.json({
    ok: true,
    message: "If this email has a SitnDip account, we sent a reset link.",
  });
}
