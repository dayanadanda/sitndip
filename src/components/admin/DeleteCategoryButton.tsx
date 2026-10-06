"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter();
  const { refreshCatalog } = useStore();

  return (
    <button
      type="button"
      className="text-red-700 hover:underline"
      onClick={async () => {
        if (!confirm("Delete this category?")) return;
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Could not delete this category.");
          return;
        }
        await refreshCatalog();
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
