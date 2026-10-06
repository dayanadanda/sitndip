import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionCustomer } from "@/lib/customers";
import { AuthForm } from "@/components/store/AuthForm";

export const metadata = { title: "Log in — SitnDip" };

export default async function LoginPage() {
  if (await getSessionCustomer()) redirect("/account");
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
