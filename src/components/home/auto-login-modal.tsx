"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TermsConsentModal } from "@/components/auth/terms-consent-modal";

export function AutoLoginModal() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      const cb = searchParams.get("callbackUrl") ?? "/dashboard";
      setCallbackUrl(cb);
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <TermsConsentModal
      open={open}
      onClose={() => setOpen(false)}
      callbackUrl={callbackUrl}
    />
  );
}
