"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { TermsConsentModal } from "./terms-consent-modal";

export function SignInButton() {
  const t = useTranslations("nav");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModalOpen(true)}
        className="border-hai text-sumi hover:bg-hai/30"
      >
        {t("signIn")}
      </Button>

      <TermsConsentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
