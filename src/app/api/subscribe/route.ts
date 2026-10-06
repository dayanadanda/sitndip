import { NextResponse } from "next/server";
import { addSubscriber, findSubscriber } from "@/lib/subscribers";
import { sendWelcomeSubscriber } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "");
  const name = String(body.name ?? "");

  if (findSubscriber(email)) {
    return NextResponse.json({
      already: true,
      subscribed: true,
      message: "This email is already subscribed to SitnDip offers.",
    });
  }

  const result = addSubscriber(email, name);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const mail = await sendWelcomeSubscriber(result.subscriber!.email);
  return NextResponse.json({
    already: false,
    subscribed: true,
    emailSent: mail.sent,
    message: mail.sent
      ? "You are subscribed. We sent a confirmation email."
      : "You are subscribed. We could not send the confirmation email yet.",
    mailError: mail.sent ? undefined : mail.error,
  });
}
