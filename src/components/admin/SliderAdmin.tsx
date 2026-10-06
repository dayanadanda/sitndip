"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Slide } from "@/lib/types";
import { useStore } from "@/context/StoreContext";
import { ImageUpload } from "./ImageUpload";

function SlideEditor({
  slide,
  onSaved,
}: {
  slide?: Slide;
  onSaved: () => Promise<void>;
}) {
  const [image, setImage] = useState(slide?.image || "");
  const [eyebrow, setEyebrow] = useState(slide?.eyebrow || "");
  const [title, setTitle] = useState(slide?.title || "");
  const [buttonText, setButtonText] = useState(slide?.buttonText || "Shop cups");
  const [buttonHref, setButtonHref] = useState(slide?.buttonHref || "/shop");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/slides", {
      method: slide ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: slide?.id,
        image,
        eyebrow,
        title,
        buttonText,
        buttonHref,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not save this slide.");
      return;
    }
    if (!slide) {
      setImage("");
      setEyebrow("");
      setTitle("");
      setButtonText("Shop cups");
      setButtonHref("/shop");
    }
    await onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-5 shadow-sm">
      <ImageUpload value={image} onChange={setImage} label="Slider image" />
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Small line</span>
        <input
          value={eyebrow}
          onChange={(e) => setEyebrow(e.target.value)}
          className="w-full border border-black/15 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Title</span>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-black/15 px-3 py-2"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Button text</span>
          <input
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full border border-black/15 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Button link</span>
          <input
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            className="w-full border border-black/15 px-3 py-2"
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving} className="bg-[#2271b1] px-4 py-2 text-white disabled:opacity-60">
        {saving ? "Saving…" : slide ? "Save slide" : "Add slide"}
      </button>
    </form>
  );
}

export function SliderAdmin({ initialSlides }: { initialSlides: Slide[] }) {
  const router = useRouter();
  const { slides, refreshCatalog } = useStore();
  const list = slides.length ? slides : initialSlides;

  async function refresh() {
    await refreshCatalog();
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {list.map((slide, index) => (
        <section key={slide.id}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-medium">Slide {index + 1}</h2>
            {list.length > 1 && (
              <button
                type="button"
                className="text-sm text-red-700 hover:underline"
                onClick={async () => {
                  if (!confirm("Delete this slider image?")) return;
                  const res = await fetch(`/api/slides?id=${slide.id}`, { method: "DELETE" });
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    alert(data.error || "Could not delete this slide.");
                    return;
                  }
                  await refresh();
                }}
              >
                Delete
              </button>
            )}
          </div>
          <SlideEditor slide={slide} onSaved={refresh} />
        </section>
      ))}

      <section>
        <h2 className="mb-2 font-medium">Add another slide</h2>
        <SlideEditor onSaved={refresh} />
      </section>
    </div>
  );
}
