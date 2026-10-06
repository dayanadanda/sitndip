"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { ImageUpload } from "./ImageUpload";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const { refreshCatalog } = useStore();
  const [name, setName] = useState(category?.name || "");
  const [tagline, setTagline] = useState(category?.tagline || "");
  const [image, setImage] = useState(category?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const locked = category?.kind === "bestsellers";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name,
      slug: form.get("slug"),
      tagline,
      image,
    };
    const url = category ? `/api/categories/${category.id}` : "/api/categories";
    const res = await fetch(url, {
      method: category ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this category.");
      return;
    }
    await refreshCatalog();
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5 bg-white p-6 shadow-sm">
      {locked && (
        <p className="bg-[#f0f6fc] px-3 py-2 text-sm text-[#1d2327]">
          Best Sellers is a built-in category. You can change its name and image. Products marked
          Best seller appear here automatically.
        </p>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Category name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="500g Cups"
          className="w-full border border-black/15 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Slug</span>
        <input
          name="slug"
          defaultValue={category?.slug}
          disabled={locked}
          placeholder="500g-cups"
          className="w-full border border-black/15 px-3 py-2 disabled:bg-[#f6f7f7]"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Short description</span>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full border border-black/15 px-3 py-2"
        />
      </label>
      <ImageUpload value={image} onChange={setImage} label="Category image" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving} className="bg-[#2271b1] px-5 py-2 text-white disabled:opacity-60">
        {saving ? "Saving…" : category ? "Save category" : "Add category"}
      </button>
    </form>
  );
}
