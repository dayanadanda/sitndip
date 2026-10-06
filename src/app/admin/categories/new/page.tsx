import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function NewCategoryPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Add category</h1>
      <p className="mb-5 text-sm text-[#646970]">This category will appear in Explore and on the shop.</p>
      <CategoryForm />
    </div>
  );
}
