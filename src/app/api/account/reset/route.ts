import { NextResponse } from "next/server";
import { resetCustomerPassword } from "@/lib/customers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const result = resetCustomerPassword(String(body.token ?? ""), String(body.password ?? ""));
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
