"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { refreshProducts, categories } = useStore();
  const regularCategories = categories.filter((c) => c.kind !== "bestsellers");
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(String(product?.price ?? 3.5));
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState(product?.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    setUploading(false);
    if (!res.ok) {
      setError("Could not upload this image.");
      return;
    }
    const json = await res.json();
    setImage(json.url);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name,
      slug: form.get("slug"),
      price,
      compareAt: form.get("compareAt"),
      description,
      collection: form.get("collection"),
      image,
      popular: form.get("popular") === "on",
      bestseller: form.get("bestseller") === "on",
      inStock: form.get("inStock") === "on",
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const res = await fetch(url, {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not save this product.");
      return;
    }
    await refreshProducts();
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6 bg-white p-6 shadow-sm">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Product name</span>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-black/15 px-3 py-2"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Slug</span>
        <input
          name="slug"
          defaultValue={product?.slug}
          placeholder="hazelnut-chocolate-500g"
          className="w-full border border-black/15 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Price ($)</span>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-black/15 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-[#646970]">Shelf or wholesale price shown on the store.</span>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Compare at</span>
          <input
            name="compareAt"
            type="number"
            step="0.01"
            defaultValue={product?.compareAt}
            className="w-full border border-black/15 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Collection</span>
          <select
            name="collection"
            defaultValue={product?.collection || regularCategories[0]?.slug || "jars"}
            className="w-full border border-black/15 px-3 py-2"
          >
            {regularCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Description</span>
        <textarea
          name="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-black/15 px-3 py-2"
        />
        <span className="mt-1 block text-xs text-[#646970]">This text appears on the product page and in quick view.</span>
      </label>

      <div className="rounded border border-black/10 p-4">
        <p className="mb-3 text-sm font-medium">Product image</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex h-40 w-40 items-center justify-center border border-black/10 bg-[#f6f7f7]">
            {image ? (
              <img src={image} alt={name || "Product"} className="h-full w-full object-contain p-2" />
            ) : (
              <span className="px-3 text-center text-xs text-[#646970]">No image yet</span>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm">Upload a new photo</span>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                }}
              />
              {uploading && <p className="mt-1 text-xs text-[#646970]">Uploading…</p>}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm">Or image URL</span>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/hazelnut-tub.png"
                className="w-full border border-black/15 px-3 py-2"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} />
          In stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="popular" defaultChecked={product?.popular} />
          Most popular
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="bestseller" defaultChecked={product?.bestseller} />
          Best seller
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving || uploading} className="bg-[#2271b1] px-5 py-2 text-white disabled:opacity-60">
        {saving ? "Saving…" : product ? "Save changes" : "Publish product"}
      </button>
    </form>
  );
}
