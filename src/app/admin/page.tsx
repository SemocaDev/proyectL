import { db } from "@/db";
import { shortLinks, reports, users } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { Navbar } from "@/components/navbar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AdminPage() {
  const t = await getTranslations("admin");

  const [[{ totalLinks }], [{ totalReports }], [{ totalUsers }]] =
    await Promise.all([
      db.select({ totalLinks: count() }).from(shortLinks),
      db
        .select({ totalReports: count() })
        .from(reports)
        .where(eq(reports.status, "pending")),
      db.select({ totalUsers: count() }).from(users),
    ]);

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="mb-8 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-ginnezumi">
            {t("title")}
          </p>
          <h1 className="text-3xl font-light text-sumi">Admin</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard label={t("totalLinks")} value={String(totalLinks)} />
          <StatCard label={t("pendingReports")} value={String(totalReports)} accent={totalReports > 0} />
          <StatCard label={t("totalUsers")} value={String(totalUsers)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin/links" className="rounded-lg border border-hai bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-lg font-light text-sumi">{t("allLinks")}</p>
            <p className="mt-1 text-sm text-ginnezumi">{t("allLinksDesc")}</p>
          </Link>
          <Link href="/admin/reports" className="rounded-lg border border-hai bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-lg font-light text-sumi">{t("reports")}</p>
            <p className="mt-1 text-sm text-ginnezumi">{t("reportsDesc")}</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-hai bg-white px-5 py-4 shadow-sm">
      <p className="text-xs text-ginnezumi">{label}</p>
      <p className={`mt-1 text-2xl font-light ${accent ? "text-shu" : "text-sumi"}`}>{value}</p>
    </div>
  );
}
