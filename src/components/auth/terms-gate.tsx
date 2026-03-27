import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TermsConsentModal } from "./terms-consent-modal";

interface TermsGateProps {
  children: React.ReactNode;
}

/**
 * Server component that blocks access to children if the user
 * hasn't accepted the terms of service. Shows a full-screen modal
 * until they accept. Must be used inside authenticated layouts.
 */
export async function TermsGate({ children }: TermsGateProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (!session.user.termsAcceptedAt) {
    return <TermsConsentModal />;
  }

  return <>{children}</>;
}
