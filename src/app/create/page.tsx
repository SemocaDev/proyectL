"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { createLink } from "@/actions/link-actions";
import { stripUndefined } from "@/lib/clean-data";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { WagaraPattern } from "@/components/patterns";
import { LinkEditor, type LinkEditorData } from "@/components/editor/link-editor";
import { colors } from "@/lib/css-vars";

type Step = 1 | 2 | 3;
type Mode = "redirect" | "linkhub";

function CreateWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("create");
  const tv = useTranslations("validation");

  const initialUrl = searchParams.get("url") ?? "";

  const tc = useTranslations("common");

  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<Mode>("redirect");
  const [result, setResult] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [editorDirty, setEditorDirty] = useState(false);

  // Guard: protect against accidental navigation when editing (step 2)
  const isEditing = step === 2 && editorDirty;
  const { confirmLeave } = useUnsavedChanges(isEditing, tc("unsavedChanges"));

  const handleBack = useCallback(() => {
    if (confirmLeave()) setStep(1);
  }, [confirmLeave]);

  async function handleEditorSave(data: LinkEditorData) {
    // Validate URL
    if (!data.targetUrl.trim() && data.mode === "redirect") {
      toast.error(tv("urlRequired"));
      return;
    }
    if (data.mode === "redirect") {
      try {
        const parsed = new URL(data.targetUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          toast.error(tv("invalidUrl"));
          return;
        }
      } catch {
        toast.error(tv("invalidUrl"));
        return;
      }
    }

    const res = await createLink(stripUndefined({
      targetUrl: data.targetUrl,
      mode: data.mode,
      title: data.title || undefined,
      redirectDelay: data.redirectDelay || undefined,
      landingData: data.mode === "linkhub" ? data.landingData : undefined,
    }));

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success(tv("linkCreated"));
    setResult({ shortUrl: res.shortUrl!, shortCode: res.shortCode! });
    setStep(3);
  }

  async function copyUrl() {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    toast.success(tv("copied"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`flex flex-col bg-shironeri ${step === 2 ? "h-dvh overflow-hidden" : "min-h-dvh"}`}>
      <Navbar />

      {/* Paso 2 — Editor (full width for linkhub preview) */}
      {step === 2 && (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Back button + title */}
          <div className="border-b border-hai/30 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="rounded-md border border-hai px-3 py-1.5 text-xs text-ginnezumi transition-colors hover:border-sumi hover:text-sumi"
              >
                {t("back")}
              </button>
              <h1 className="text-lg font-light text-sumi">
                {mode === "redirect" ? t("redirect") : t("linkhub")}
              </h1>
            </div>
          </div>

          <LinkEditor
            mode={mode}
            initial={{ targetUrl: initialUrl }}
            onSave={handleEditorSave}
            saveLabel={t("create")}
            onDirtyChange={setEditorDirty}
          />
        </div>
      )}

      {/* Paso 1 y 3 — centrados */}
      {step !== 2 && (
        <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
          <WagaraPattern pattern="asanoha" color={colors.beni} opacity={0.06} />

          <div className="relative z-10 w-full max-w-lg">
            {/* Progress dots */}
            <div className="mb-10 flex justify-center gap-2">
              {([1, 2, 3] as Step[]).map((s) => (
                <span
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step
                      ? "w-6 bg-beni"
                      : s < step
                        ? "w-3 bg-beni/40"
                        : "w-3 bg-hai"
                  }`}
                />
              ))}
            </div>

            {/* Paso 1 — Elegir modo */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-light text-sumi">{t("chooseMode")}</h1>
                  {initialUrl && (
                    <p className="truncate text-xs text-ginnezumi/60">
                      {initialUrl}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ModeCard
                    selected={mode === "redirect"}
                    onClick={() => setMode("redirect")}
                    icon="→"
                    title={t("redirect")}
                    description={t("redirectDesc")}
                  />
                  <ModeCard
                    selected={mode === "linkhub"}
                    onClick={() => setMode("linkhub")}
                    icon="⊞"
                    title={t("linkhub")}
                    description={t("linkhubDesc")}
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full rounded-lg bg-beni py-3 text-sm font-medium text-white transition-colors hover:bg-beni/90"
                >
                  {t("next")}
                </button>
              </div>
            )}

            {/* Paso 3 — Resultado */}
            {step === 3 && result && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-uguisu/30 bg-uguisu/10">
                    <span className="text-lg text-uguisu">✓</span>
                  </div>
                  <h1 className="text-2xl font-light text-sumi">{t("created")}</h1>
                  <p className="text-sm text-ginnezumi">{t("createdDesc")}</p>
                </div>

                {/* URL resultante */}
                <div className="flex items-center overflow-hidden rounded-lg border border-hai bg-white">
                  <span className="flex-1 truncate px-4 py-3 text-sm text-sumi">
                    {result.shortUrl}
                  </span>
                  <button
                    onClick={copyUrl}
                    className="border-l border-hai px-4 py-3 text-xs font-medium text-beni transition-colors hover:bg-beni/5"
                  >
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 rounded-lg border border-hai py-3 text-sm text-ginnezumi transition-colors hover:border-sumi hover:text-sumi"
                  >
                    {t("goToDashboard")}
                  </button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setResult(null);
                    }}
                    className="flex-1 rounded-lg bg-beni py-3 text-sm font-medium text-white transition-colors hover:bg-beni/90"
                  >
                    {t("createAnother")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

function ModeCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-5 text-left transition-all ${
        selected
          ? "border-beni bg-beni/5 ring-1 ring-beni"
          : "border-hai bg-white hover:border-sumi/20"
      }`}
    >
      <span className="mb-3 block text-2xl">{icon}</span>
      <p className="text-sm font-medium text-sumi">{title}</p>
      <p className="mt-1 text-xs text-ginnezumi">{description}</p>
    </button>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateWizard />
    </Suspense>
  );
}
