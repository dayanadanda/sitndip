import { CartDrawer } from "@/components/store/CartDrawer";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { QuickView } from "@/components/store/QuickView";
import { SearchModal } from "@/components/store/SearchModal";
import { WhatsAppButton } from "@/components/store/WhatsAppButton";
import { getSessionCustomer } from "@/lib/customers";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const customer = await getSessionCustomer();

  return (
    <div className="flex min-h-screen flex-col">
      <Header signedIn={Boolean(customer)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <QuickView />
      <WhatsAppButton />
    </div>
  );
}
