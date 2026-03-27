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
    <div className="rounded-lg border border-hai bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md sm:px-5 sm:py-4">
      {/* Top: info + clicks */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium text-sumi">/{link.shortCode}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] leading-none ${
                link.mode === "linkhub"
                  ? "bg-ai/10 text-ai"
                  : "bg-hai text-ginnezumi"
              }`}
            >
              {link.mode}
            </span>
            {link.status !== "active" && (
              <span className="rounded bg-shu/10 px-1.5 py-0.5 text-[11px] leading-none text-shu">
                {link.status}
              </span>
            )}
          </div>
          {link.title && (
            <p className="text-xs text-ginnezumi">{link.title}</p>
          )}
          {link.targetUrl && (
            <p className="truncate text-xs text-ginnezumi/50">{link.targetUrl}</p>
          )}
        </div>

        {/* Click count */}
        <div className="shrink-0 text-right">
          <span className="block text-sm font-medium text-sumi">
            {link.clickCount ?? 0}
          </span>
          <span className="text-[11px] text-ginnezumi">clicks</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 border-t border-hai/40 pt-3">
        <button
          onClick={handleCopy}
          className="flex-1 rounded-md border border-hai py-1.5 text-xs text-ginnezumi transition-colors hover:border-sumi hover:text-sumi sm:flex-none sm:px-4"
        >
          {t("copy")}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-md px-3 py-1.5 text-xs text-ginnezumi/50 transition-colors hover:text-shu disabled:opacity-40"
        >
          {deleting ? "..." : t("delete")}
        </button>
      </div>
    </div>
  );
}
