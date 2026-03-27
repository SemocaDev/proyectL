import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl pasa requestLocale desde la URL cuando hay prefijo.
  // Con localePrefix: "never", lo leemos del header que inyecta el proxy.
  let locale = await requestLocale;

  if (!locale || !hasLocale(routing.locales, locale)) {
    const headerStore = await headers();
    const headerLocale = headerStore.get("X-NEXT-INTL-LOCALE");
    locale =
      headerLocale && hasLocale(routing.locales, headerLocale)
        ? headerLocale
        : routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
