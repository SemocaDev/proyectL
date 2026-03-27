"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TermsConsentModal } from "@/components/auth/terms-consent-modal";
import { useConsentFlow } from "@/components/auth/use-consent-flow";

export function AutoLoginModal() {
  const searchParams = useSearchParams();
  const { modalOpen, pendingCallbackUrl, openLogin, closeModal } = useConsentFlow();

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      const cb = searchParams.get("callbackUrl") ?? "/dashboard";
      openLogin(cb);
    }
  // openLogin is stable (defined outside render), searchParams changes are the trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <TermsConsentModal
      open={modalOpen}
      onClose={closeModal}
      callbackUrl={pendingCallbackUrl}
    />
  );
}
