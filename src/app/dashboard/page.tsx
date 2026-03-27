import { auth } from "@/lib/auth";
import { getUserLinks } from "@/actions/link-actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WagaraPattern } from "@/components/wagara-pattern";
import { LinkCard } from "@/components/dashboard/link-card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("dashboard");
  const { links = [] } = await getUserLinks().then((r) => r ?? { links: [] });

  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />

      <main className="relative flex-1 px-4 py-12">
        <WagaraPattern pattern="asanoha" opacity={0.02} />

        <div className="relative z-10 mx-auto max-w-5xl space-y-10">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
                {t("welcome")}
              </p>
              <h1 className="text-2xl font-light text-sumi sm:text-3xl">
                {session?.user?.name?.split(" ")[0] ?? t("title")}
              </h1>
            </div>
            <Link
              href="/create"
              className="inline-flex w-full items-center justify-center rounded-lg bg-beni px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-beni/90 sm:w-auto"
            >
              + {t("createNew")}
            </Link>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard label={t("totalLinks")} value={String(links.length)} />
            <StatCard label={t("totalClicks")} value={String(totalClicks)} />
            <StatCard
              label={t("activeLinks")}
              value={String(links.filter((l) => l.status === "active").length)}
            />
          </div>

          {/* Lista de links */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-ginnezumi">
              {t("recentLinks")}
            </h2>

            {links.length === 0 ? (
              <div className="rounded-lg border border-dashed border-hai bg-white py-16 text-center">
                <p className="text-sm text-ginnezumi">{t("noLinks")}</p>
                <Link
                  href="/create"
                  className="mt-4 inline-block text-sm font-medium text-beni hover:underline"
                >
                  {t("createFirst")}
                </Link>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-hai bg-white px-5 py-4 shadow-sm">
      <p className="text-xs text-ginnezumi">{label}</p>
      <p className="mt-1 text-2xl font-light text-sumi">{value}</p>
    </div>
  );
}
