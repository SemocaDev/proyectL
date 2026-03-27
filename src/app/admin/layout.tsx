import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TermsGate } from "@/components/auth/terms-gate";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <TermsGate>{children}</TermsGate>;
}
