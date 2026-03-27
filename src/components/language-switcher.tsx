"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function handleSwitch(newLocale: string) {
    // Set cookie and refresh — no URL change, no redirect
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          className={`rounded px-2 py-1 uppercase transition-colors ${
            locale === loc
              ? "bg-beni/10 font-medium text-beni"
              : "text-ginnezumi hover:text-sumi"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
