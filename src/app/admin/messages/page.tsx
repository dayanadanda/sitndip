import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const messages = getMessages();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Contact messages</h1>
      {messages.length === 0 ? (
        <p className="bg-white p-6 text-sm text-[#646970] shadow-sm">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <article key={msg.id} className="bg-white p-5 shadow-sm">
              <p className="font-medium">{msg.name}</p>
              <p className="text-sm text-[#646970]">
                {msg.email}
                {msg.phone ? ` · ${msg.phone}` : ""}
              </p>
              <p className="mt-3 text-sm leading-6">{msg.message}</p>
              <p className="mt-2 text-xs text-[#646970]">{new Date(msg.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
