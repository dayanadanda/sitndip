import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/store/ResetPasswordForm";

export const metadata = { title: "Reset password — SitnDip" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
