"use client";

import { useRouter } from "next/navigation";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-red-700 hover:underline"
      onClick={async () => {
        if (!confirm("Move this jar to the trash?")) return;
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
