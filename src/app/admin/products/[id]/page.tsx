import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const product = getProducts().find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Edit product</h1>
      <p className="mb-5 text-sm text-[#646970]">Change the image, price, and description, then save.</p>
      <ProductForm product={product} />
    </div>
  );
}
