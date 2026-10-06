"use client";

import { useState } from "react";

export function ImageUpload({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
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
    onChange(json.url);
  }

  return (
    <div className="rounded border border-black/10 p-4">
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-40 w-40 items-center justify-center overflow-hidden border border-black/10 bg-[#f6f7f7]">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
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
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/hazelnut-tub.png"
              className="w-full border border-black/15 px-3 py-2"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}
