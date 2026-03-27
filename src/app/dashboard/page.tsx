import { auth } from "@/lib/auth";
import { getUserLinks } from "@/actions/link-actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WagaraPattern } from "@/components/patterns";
import { LinkCard } from "@/components/dashboard/link-card";
import { getTranslations } from "next-intl/server";
import { colors } from "@/lib/css-vars";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("dashboard");
  const { links = [] } = await getUserLinks().then((r) => r ?? { links: [] });

  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);
  const activeLinks = links.filter((l) => l.status === "active").length;

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />

      <main className="relative flex-1 px-4 py-12">
        {/* Patrón asanoha en el background del dashboard */}
        <WagaraPattern pattern="asanoha" color={colors.beni} opacity={0.05} />

        <div className="relative z-10 mx-auto max-w-5xl space-y-10">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-ginnezumi/60">
                {t("welcome")}
              </p>
              <h1 className="text-2xl font-light text-sumi sm:text-3xl">
                {session?.user?.name?.split(" ")[0] ?? t("title")}
              </h1>
            </div>
            <Link
              href="/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-beni px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-beni/90 hover:shadow-md active:scale-[0.98] sm:w-auto"
            >
              <span className="text-base leading-none">+</span>
              {t("createNew")}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label={t("totalLinks")}
              value={String(links.length)}
              pattern="kikko"
            />
            <StatCard
              label={t("totalClicks")}
              value={String(totalClicks)}
              pattern="shippo"
            />
            <StatCard
              label={t("activeLinks")}
              value={String(activeLinks)}
              pattern="asanoha"
            />
          </div>

          {/* Lista de links */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-hai/60" />
              <h2 className="text-[11px] font-medium uppercase tracking-widest text-ginnezumi/60">
                {t("recentLinks")}
              </h2>
              <span className="h-px flex-1 bg-hai/60" />
            </div>

            {links.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-hai bg-white py-20 text-center">
                <WagaraPattern pattern="ichimatsu" color={colors.ginnezumi} opacity={0.03} static />
                <div className="relative z-10 space-y-3">
                  <p className="text-sm text-ginnezumi">{t("noLinks")}</p>
                  <Link
                    href="/create"
                    className="inline-block text-sm font-medium text-beni transition-colors hover:text-beni/70"
                  >
                    {t("createFirst")} →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  label,
  value,
  pattern,
}: {
  label: string;
  value: string;
  pattern: "kikko" | "shippo" | "asanoha";
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hai/60 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
      <WagaraPattern pattern={pattern} color={colors.beni} opacity={0.04} static />
      <div className="relative z-10">
        <p className="text-[10px] font-medium uppercase tracking-wider text-ginnezumi/60 sm:text-xs">
          {label}
        </p>
        <p className="mt-1.5 text-xl font-light text-sumi sm:text-2xl">{value}</p>
      </div>
    </div>
  );
}
