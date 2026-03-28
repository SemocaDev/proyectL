"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { getLinkById, updateLink } from "@/actions/link-actions";
import { stripUndefined } from "@/lib/clean-data";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { LinkEditor, type LinkEditorData } from "@/components/editor/link-editor";
import type { LandingData } from "@/lib/schemas";
import type { ShortLink } from "@/db/schema";

export default function EditLinkPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("editor");
  const tNav = useTranslations("common");

  const tc = useTranslations("common");

  const [link, setLink] = useState<ShortLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorDirty, setEditorDirty] = useState(false);

  const { confirmLeave } = useUnsavedChanges(editorDirty, tc("unsavedChanges"));

  const handleBack = useCallback(() => {
    if (confirmLeave()) router.push("/dashboard");
  }, [confirmLeave, router]);

  useEffect(() => {
    async function load() {
      const res = await getLinkById(params.id);
      if (res.error || !res.link) {
        toast.error(res.error ?? "Not found");
        router.push("/dashboard");
        return;
      }
      setLink(res.link);
      setLoading(false);
    }
    load();
  }, [params.id, router]);

  async function handleSave(data: LinkEditorData) {
    const res = await updateLink(params.id, stripUndefined({
      targetUrl: data.targetUrl,
      title: data.title || undefined,
      redirectDelay: data.mode === "redirect" ? data.redirectDelay : null,
      landingData: data.mode === "linkhub" ? data.landingData : undefined,
    }));

    if (res.error) {
      toast.error(t("saveFailed"));
      return;
    }

    toast.success(t("saved"));
    router.push("/dashboard");
    router.refresh();
  }

  if (loading || !link) {
    return (
      <div className="flex min-h-screen flex-col bg-shironeri">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-ginnezumi">{tNav("loading")}</p>
        </div>
      </div>
    );
  }

  const landingData = (link.landingData as LandingData) ?? {};

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-shironeri">
      <Navbar />

      {/* Header */}
      <div className="border-b border-hai/30 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="rounded-md border border-hai px-3 py-1.5 text-xs text-ginnezumi transition-colors hover:border-sumi hover:text-sumi"
          >
            {tNav("back")}
          </button>
          <h1 className="text-lg font-light text-sumi">
            /{link.shortCode}
          </h1>
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] leading-none ${
              link.mode === "linkhub"
                ? "bg-ai/10 text-ai"
                : "bg-hai text-ginnezumi"
            }`}
          >
            {link.mode}
          </span>
        </div>
      </div>

      <LinkEditor
        mode={link.mode}
        initial={{
          targetUrl: link.targetUrl ?? "",
          title: link.title ?? landingData.title ?? "",
          mode: link.mode,
          redirectDelay: link.redirectDelay ?? 0,
          landingData,
        }}
        onSave={handleSave}
        saveLabel={t("save")}
        onDirtyChange={setEditorDirty}
      />
    </div>
  );
}
