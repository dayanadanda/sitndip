import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSlides } from "@/lib/db";
import { SliderAdmin } from "@/components/admin/SliderAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSliderPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const slides = getSlides();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Homepage slider</h1>
      <p className="mb-6 text-sm text-[#646970]">
        Change the header images, titles, and buttons that rotate on the home page.
      </p>
      <SliderAdmin initialSlides={slides} />
    </div>
  );
}
