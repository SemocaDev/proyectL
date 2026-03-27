"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const t = useTranslations("nav");

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signIn("google")}
      className="border-hai text-sumi hover:bg-hai/30"
    >
      {t("signIn")}
    </Button>
  );
}
