"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "./language-switcher";
import { SignInButton } from "./auth/sign-in-button";
import { UserMenu } from "./auth/user-menu";

export function Navbar() {
  const t = useTranslations("nav");
  const { data: session } = useSession();

  return (
    <header className="border-b border-hai/50 bg-shironeri/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <a
          href="/"
          className="font-credit text-lg font-bold text-sumi transition-colors hover:text-beni"
        >
          DevMinds Links
        </a>

        <div className="flex items-center gap-4">
          {session?.user && (
            <a
              href="/dashboard"
              className="text-sm text-ginnezumi transition-colors hover:text-sumi"
            >
              {t("dashboard")}
            </a>
          )}
          <LanguageSwitcher />
          {session?.user ? <UserMenu /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
}
