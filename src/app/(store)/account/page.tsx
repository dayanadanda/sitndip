import { redirect } from "next/navigation";
import { getSessionCustomer } from "@/lib/customers";
import { getOrdersForUser } from "@/lib/db";
import { money } from "@/lib/format";
import { paymentLabel } from "@/lib/types";
import { LogoutButton } from "@/components/store/LogoutButton";
import { ProfileForm } from "@/components/store/ProfileForm";

export const metadata = { title: "My account — SitnDip" };

export default async function AccountPage() {
  const customer = await getSessionCustomer();
  if (!customer) redirect("/account/login");
  const orders = getOrdersForUser(customer.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="logo-mark text-4xl">Hello, {customer.name}</h1>
          <p className="mt-2 text-sm text-muted">{customer.email}</p>
        </div>
        <LogoutButton />
      </div>

      <h2 className="mt-12 text-sm uppercase tracking-[0.16em]">Delivery profile</h2>
      <p className="mt-2 text-sm text-muted">
        Keep your phone, address, and building number up to date. Checkout uses this information every time you
        pay.
      </p>
      <ProfileForm customer={customer} />

      <h2 className="mt-12 text-sm uppercase tracking-[0.16em]">Your orders</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">You haven&apos;t placed any orders yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border border-line p-4">
              <div className="flex justify-between text-sm">
                <strong>{order.id}</strong>
                <span>{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{paymentLabel(order.paymentMethod)}</p>
              <ul className="mt-2 text-sm text-muted">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-right font-medium">{money(order.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
