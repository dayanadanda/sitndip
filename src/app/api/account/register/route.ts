import { NextResponse } from "next/server";
import { createSession, registerCustomer, SESSION_COOKIE } from "@/lib/customers";

export async function POST(request: Request) {
  const body = await request.json();
  const result = registerCustomer({
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    password: String(body.password ?? ""),
  });
  if (!result.customer) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { token, maxAge } = createSession(result.customer.id);
  const res = NextResponse.json(result.customer, { status: 201 });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
