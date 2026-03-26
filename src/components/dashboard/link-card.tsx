"use client";

import { useState } from "react";
import { deleteLink } from "@/actions/link-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ShortLink } from "@/db/schema";

type LinkRow = Pick<
  ShortLink,
  "id" | "shortCode" | "mode" | "targetUrl" | "title" | "status" | "clickCount" | "createdAt"
>;

export function LinkCard({ link }: { link: LinkRow }) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/${link.shortCode}`;

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(true);
    const res = await deleteLink(link.id);
    if (res.success) {
      toast.success(t("deleted"));
      router.refresh();
    } else {
      toast.error(t("deleteFailed"));
      setDeleting(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
    toast.success(t("copied"));
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-hai bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-sumi">/{link.shortCode}</span>
          {link.title && (
            <span className="text-xs text-ginnezumi">— {link.title}</span>
          )}
          {/* Badge de modo */}
          <span
            className={`rounded px-1.5 py-0.5 text-xs ${
              link.mode === "linkhub"
                ? "bg-ai/10 text-ai"
                : "bg-hai text-ginnezumi"
            }`}
          >
            {link.mode}
          </span>
          {/* Badge de estado */}
          {link.status !== "active" && (
            <span className="rounded bg-shu/10 px-1.5 py-0.5 text-xs text-shu">
              {link.status}
            </span>
          )}
        </div>
        {link.targetUrl && (
          <p className="truncate text-xs text-ginnezumi/60">{link.targetUrl}</p>
        )}
      </div>

      {/* Stats + acciones */}
      <div className="ml-4 flex items-center gap-4">
        <span className="text-right text-xs text-ginnezumi">
          <span className="block text-sm font-medium text-sumi">
            {link.clickCount ?? 0}
          </span>
          clicks
        </span>

        <button
          onClick={handleCopy}
          className="rounded-md border border-hai px-3 py-1.5 text-xs text-ginnezumi transition-colors hover:border-sumi hover:text-sumi"
        >
          {t("copy")}
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-md px-3 py-1.5 text-xs text-ginnezumi/60 transition-colors hover:text-shu disabled:opacity-40"
        >
          {deleting ? "…" : t("delete")}
        </button>
      </div>
    </div>
  );
}
