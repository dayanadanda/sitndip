"use client";

import { useRouter } from "next/navigation";

export function AdminLogout() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="w-full rounded px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10"
      onClick={async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
