import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Add Product</h1>
      <ProductForm />
    </div>
  );
}
