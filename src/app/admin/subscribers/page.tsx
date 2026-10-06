import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSubscribers } from "@/lib/db";
import { SubscriberAdmin } from "@/components/admin/SubscriberAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Email subscribers</h1>
      <p className="mb-6 max-w-2xl text-sm text-[#646970]">
        Customers who opted in for SitnDip offers. Sending uses the Gmail account in SMTP_USER / SMTP_PASS.
      </p>
      <SubscriberAdmin initial={getSubscribers()} />
    </div>
  );
}
