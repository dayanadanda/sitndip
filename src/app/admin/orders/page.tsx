import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/db";
import { money } from "@/lib/format";
import { paymentLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const orders = getOrders();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <p className="bg-white p-6 text-sm text-[#646970] shadow-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium">{order.id}</h2>
                <span>{money(order.total)}</span>
              </div>
              <p className="mt-1 text-sm text-[#646970]">
                {order.customer.name} · {order.customer.phone} · {order.customer.city}
              </p>
              <p className="text-sm text-[#646970]">
                {order.customer.address}
                {order.customer.buildingNumber ? `, ${order.customer.buildingNumber}` : ""}
              </p>
              <p className="mt-1 text-sm font-medium">{paymentLabel(order.paymentMethod)}</p>
              <ul className="mt-3 text-sm">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} × {item.qty} — {money(item.price * item.qty)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
