import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, isValidLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!isValidLogin(String(username || ""), String(password || ""))) {
    return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
