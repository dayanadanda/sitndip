import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const category = getCategories().find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Edit category</h1>
      <p className="mb-5 text-sm text-[#646970]">Change the name, image, and description, then save.</p>
      <CategoryForm category={category} />
    </div>
  );
}
