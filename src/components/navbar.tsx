"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.header
      className="sticky top-0 z-40 border-b border-hai/50 bg-shironeri/90 backdrop-blur-md"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 md:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          {/* Línea decorativa beni */}
          <span className="block h-4 w-px bg-beni transition-transform duration-300 group-hover:scale-y-125" />
          <span className="font-credit text-sm font-semibold tracking-tight text-sumi transition-colors duration-200 group-hover:text-beni">
            DevMinds Links
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          {session?.user && (
            <Link
              href="/dashboard"
              className="text-sm text-ginnezumi transition-colors duration-200 hover:text-sumi"
            >
              {t("dashboard")}
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm text-ginnezumi transition-colors duration-200 hover:text-sumi"
            >
              {t("admin")}
            </Link>
          )}
          <div className="h-3.5 w-px bg-hai" />
          <LanguageSwitcher />
          {session?.user ? <UserMenu /> : <SignInButton />}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ginnezumi transition-colors hover:bg-hai/50 md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="3" y1="3" x2="15" y2="15" />
                <line x1="15" y1="3" x2="3" y2="15" />
              </>
            ) : (
              <>
                <line x1="2" y1="4.5" x2="16" y2="4.5" />
                <line x1="2" y1="9" x2="16" y2="9" />
                <line x1="2" y1="13.5" x2="16" y2="13.5" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t border-hai/40 bg-shironeri/95 px-4 pb-5 pt-3 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-1">
              {session?.user && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-ginnezumi transition-colors hover:bg-hai/40 hover:text-sumi"
                >
                  {t("dashboard")}
                </Link>
              )}
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-ginnezumi transition-colors hover:bg-hai/40 hover:text-sumi"
                >
                  {t("admin")}
                </Link>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-hai/30 pt-3">
                <LanguageSwitcher />
                {session?.user ? <UserMenu /> : <SignInButton />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
