"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          disabled={isPending}
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
