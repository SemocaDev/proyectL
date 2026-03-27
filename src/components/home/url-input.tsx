"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TermsConsentModal } from "@/components/auth/terms-consent-modal";

interface UrlInputProps {
  placeholder: string;
  cta: string;
}

export function UrlInput({ placeholder, cta }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("validation");

  function isValidUrl(value: string) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!url.trim()) {
      toast.error(t("urlRequired"));
      return;
    }

    if (!isValidUrl(url)) {
      toast.error(t("invalidUrl"));
      return;
    }

    if (!session?.user) {
      sessionStorage.setItem("pending_url", url);
      setConsentOpen(true);
      return;
    }

    setLoading(true);
    router.push(`/create?url=${encodeURIComponent(url)}`);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-hai bg-white px-4 py-3 text-sm text-sumi shadow-sm placeholder:text-ginnezumi/40 focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni transition-colors sm:px-5 sm:py-3.5"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="whitespace-nowrap rounded-lg bg-beni px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-beni/90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-beni focus:ring-offset-2 sm:py-3.5"
          >
            {loading ? "..." : cta}
          </button>
        </div>
      </form>

      <TermsConsentModal
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
        callbackUrl={`/create?url=${encodeURIComponent(url)}`}
      />
    </>
  );
}
