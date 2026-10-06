import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, verifyCustomer } from "@/lib/customers";

export async function POST(request: Request) {
  const body = await request.json();
  const customer = verifyCustomer(String(body.email ?? ""), String(body.password ?? ""));
  if (!customer) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }
  const { token, maxAge } = createSession(customer.id);
  const res = NextResponse.json(customer);
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
