import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/db";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = getCategories();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/categories/new" className="bg-[#2271b1] px-3 py-2 text-sm text-white">
          Add category
        </Link>
      </div>
      <p className="mb-5 text-sm text-[#646970]">
        Categories appear on the homepage, in Explore, and in the shop filters. Best Sellers stays
        as a category and shows products marked Best seller.
      </p>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#f6f7f7] text-[#646970]">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-black/5">
                <td className="px-4 py-3">
                  <img src={category.image} alt="" className="h-12 w-12 object-contain" />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/categories/${category.id}`} className="text-[#2271b1] hover:underline">
                    {category.name}
                  </Link>
                  {category.kind === "bestsellers" && (
                    <span className="ml-2 text-xs text-[#646970]">Built-in</span>
                  )}
                </td>
                <td className="px-4 py-3">{category.slug}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/categories/${category.id}`} className="mr-3 text-[#2271b1] hover:underline">
                    Edit
                  </Link>
                  {category.kind !== "bestsellers" && <DeleteCategoryButton id={category.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
