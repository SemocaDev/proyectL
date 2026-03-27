"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useConsentFlow } from "./use-consent-flow";
import { TermsConsentModal } from "./terms-consent-modal";

export function SignInButton() {
  const t = useTranslations("nav");
  const { modalOpen, pendingCallbackUrl, openLogin, closeModal } = useConsentFlow();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openLogin("/dashboard")}
        className="border-hai text-sumi hover:bg-hai/30"
      >
        {t("signIn")}
      </Button>

      <TermsConsentModal open={modalOpen} onClose={closeModal} callbackUrl={pendingCallbackUrl} />
    </>
  );
}
