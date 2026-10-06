import { NextResponse } from "next/server";
import { getSessionCustomer, updateCustomerProfile } from "@/lib/customers";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getSessionCustomer();
  if (!session) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  const body = await request.json();
  const result = updateCustomerProfile(session.id, {
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    address: String(body.address ?? ""),
    city: String(body.city ?? ""),
    buildingNumber: String(body.buildingNumber ?? ""),
  });

  if (!result.customer) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.customer);
}
