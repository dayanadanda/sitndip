import { redirect } from "next/navigation";
import { getSessionCustomer } from "@/lib/customers";
import { CheckoutForm } from "@/components/store/CheckoutForm";

export const metadata = { title: "Checkout — SitnDip" };

export default async function CheckoutPage() {
  const customer = await getSessionCustomer();
  if (!customer) redirect("/account/login?next=/checkout");
  return <CheckoutForm customer={customer} />;
}
