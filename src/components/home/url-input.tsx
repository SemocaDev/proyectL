"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UrlInputProps {
  placeholder: string;
  cta: string;
}

export function UrlInput({ placeholder, cta }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      toast.error("Ingresa una URL válida (ej. https://ejemplo.com)");
      return;
    }

    if (!session?.user) {
      // Guardar URL para después del login y redirigir a login
      sessionStorage.setItem("pending_url", url);
      signIn("google", { callbackUrl: `/create?url=${encodeURIComponent(url)}` });
      return;
    }

    setLoading(true);
    router.push(`/create?url=${encodeURIComponent(url)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-hai bg-white px-5 py-3.5 text-sm text-sumi shadow-sm placeholder:text-ginnezumi/40 focus:border-beni focus:outline-none focus:ring-1 focus:ring-beni transition-colors"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="whitespace-nowrap rounded-lg bg-beni px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-beni/90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-beni focus:ring-offset-2"
        >
          {loading ? "…" : cta}
        </button>
      </div>
    </form>
  );
}
