"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "./language-switcher";
import { SignInButton } from "./auth/sign-in-button";
import { UserMenu } from "./auth/user-menu";
import Link from "next/link";

export function Navbar() {
  const t = useTranslations("nav");
  const { data: session } = useSession();

  return (
    <header className="border-b border-hai/60 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-credit text-base font-bold tracking-tight text-sumi transition-colors hover:text-beni"
        >
          DevMinds Links
        </Link>

        <div className="flex items-center gap-4">
          {session?.user && (
            <Link
              href="/dashboard"
              className="text-sm text-ginnezumi transition-colors hover:text-sumi"
            >
              {t("dashboard")}
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm text-ginnezumi transition-colors hover:text-sumi"
            >
              {t("admin")}
            </Link>
          )}
          <LanguageSwitcher />
          {session?.user ? <UserMenu /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
}
