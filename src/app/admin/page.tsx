import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getMessages, getOrders, getProducts, getSubscribers } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");

  const products = getProducts();
  const orders = getOrders();
  const messages = getMessages();
  const subscribers = getSubscribers();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {[
          { label: "Products", value: products.length, href: "/admin/products" },
          { label: "Orders", value: orders.length, href: "/admin/orders" },
          { label: "Messages", value: messages.length, href: "/admin/messages" },
          { label: "Subscribers", value: subscribers.length, href: "/admin/subscribers" },
          { label: "Revenue", value: money(revenue), href: "/admin/orders" },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-[#646970]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 bg-white p-5 shadow-sm">
        <h2 className="font-medium">Quick start</h2>
        <p className="mt-2 text-sm text-[#646970]">
          Add cups, edit the homepage slider, or create categories like 500g Cups. Best Sellers stays as a category and shows in Explore.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="bg-[#2271b1] px-4 py-2 text-sm text-white">
            Add a product
          </Link>
          <Link href="/admin/products" className="border border-[#2271b1] px-4 py-2 text-sm text-[#2271b1]">
            Edit products
          </Link>
          <Link href="/admin/categories" className="border border-[#2271b1] px-4 py-2 text-sm text-[#2271b1]">
            Categories
          </Link>
          <Link href="/admin/slider" className="border border-[#2271b1] px-4 py-2 text-sm text-[#2271b1]">
            Homepage slider
          </Link>
        </div>
      </div>
    </div>
  );
}
