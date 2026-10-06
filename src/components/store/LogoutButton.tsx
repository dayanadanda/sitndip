"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/account/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="border border-line px-4 py-2 text-xs uppercase tracking-[0.16em]"
    >
      Log out
    </button>
  );
}
