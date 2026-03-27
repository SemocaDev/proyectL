import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "ja"],
  defaultLocale: "es",
  localePrefix: "never",
});
