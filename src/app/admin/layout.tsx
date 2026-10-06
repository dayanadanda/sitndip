import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { AdminLogout } from "@/components/admin/AdminLogout";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();

  if (!authed) {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      <aside className="flex w-56 flex-col bg-[#1d2327] text-[#f0f0f1]">
        <Link href="/admin" className="border-b border-white/10 px-5 py-5">
          <span className="logo-mark text-2xl text-white">SitnDip</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-white/60">
            Store admin
          </span>
        </Link>
        <nav className="flex flex-col px-3 py-4 text-sm">
          <Link href="/admin" className="rounded px-3 py-2 hover:bg-white/10">
            Dashboard
          </Link>
          <Link href="/admin/products" className="rounded px-3 py-2 hover:bg-white/10">
            Products
          </Link>
          <Link href="/admin/products/new" className="rounded px-3 py-2 hover:bg-white/10">
            Add Product
          </Link>
          <Link href="/admin/categories" className="rounded px-3 py-2 hover:bg-white/10">
            Categories
          </Link>
          <Link href="/admin/slider" className="rounded px-3 py-2 hover:bg-white/10">
            Homepage slider
          </Link>
          <Link href="/admin/orders" className="rounded px-3 py-2 hover:bg-white/10">
            Orders
          </Link>
          <Link href="/admin/messages" className="rounded px-3 py-2 hover:bg-white/10">
            Messages
          </Link>
          <Link href="/admin/subscribers" className="rounded px-3 py-2 hover:bg-white/10">
            Email offers
          </Link>
          <Link href="/" className="mt-6 rounded px-3 py-2 text-white/70 hover:bg-white/10">
            View store
          </Link>
        </nav>
        <div className="mt-auto p-4">
          <AdminLogout />
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-3">
          <p className="text-sm text-[#646970]">Manage SitnDip jars, orders, and contact messages</p>
          <Link href="/admin/products/new" className="bg-[#2271b1] px-3 py-1.5 text-sm text-white">
            Add New
          </Link>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
