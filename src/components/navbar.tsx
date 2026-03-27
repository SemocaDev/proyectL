"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "./language-switcher";
import { SignInButton } from "./auth/sign-in-button";
import { UserMenu } from "./auth/user-menu";
import Link from "next/link";

export function Navbar() {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-hai/60 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-credit text-base font-bold tracking-tight text-sumi transition-colors hover:text-beni"
        >
          DevMinds Links
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ginnezumi transition-colors hover:bg-hai/40 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-hai/40 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-ginnezumi transition-colors hover:bg-hai/30 hover:text-sumi"
              >
                {t("dashboard")}
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-ginnezumi transition-colors hover:bg-hai/30 hover:text-sumi"
              >
                {t("admin")}
              </Link>
            )}
            <div className="flex items-center justify-between border-t border-hai/30 pt-3">
              <LanguageSwitcher />
              {session?.user ? <UserMenu /> : <SignInButton />}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
