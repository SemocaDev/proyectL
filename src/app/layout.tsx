import type { Metadata } from "next";
import { Inter, Doto, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const BASE_URL = "https://l.devminds.online";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "DevMinds Links — URL Shortener & Link-in-Bio",
    template: "%s | DevMinds Links",
  },
  description:
    "Create short links instantly or build your custom link-in-bio page. Fast redirects, detailed analytics and beautiful Japanese-inspired designs.",
  keywords: [
    "url shortener",
    "link shortener",
    "link in bio",
    "linktree alternative",
    "short link",
    "bio page",
    "link page",
    "acortador de urls",
    "página de enlaces",
    "devminds links",
  ],
  authors: [{ name: "DevMinds", url: BASE_URL }],
  creator: "DevMinds",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "DevMinds Links",
    title: "DevMinds Links — URL Shortener & Link-in-Bio",
    description:
      "Create short links instantly or build your custom link-in-bio page. Fast redirects, detailed analytics and beautiful Japanese-inspired designs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevMinds Links — URL Shortener & Link-in-Bio",
      },
    ],
    locale: "en_US",
    alternateLocale: ["es_ES", "ja_JP"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMinds Links — URL Shortener & Link-in-Bio",
    description:
      "Create short links instantly or build your custom link-in-bio page.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "es": BASE_URL,
      "en": BASE_URL,
      "ja": BASE_URL,
    },
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${doto.variable} ${cormorant.variable}`}>
      <body>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster richColors position="bottom-right" />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
