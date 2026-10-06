import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";
import { money } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const products = getProducts();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="bg-[#2271b1] px-3 py-2 text-sm text-white">
          Add New
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#f6f7f7] text-[#646970]">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Collection</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5">
                <td className="px-4 py-3">
                  <img src={product.image} alt="" className="h-12 w-12 object-contain" />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${product.id}`} className="text-[#2271b1] hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{product.collection}</td>
                <td className="px-4 py-3">{money(product.price)}</td>
                <td className="px-4 py-3">{product.inStock ? "In stock" : "Sold out"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="mr-3 text-[#2271b1] hover:underline">
                    Edit
                  </Link>
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
