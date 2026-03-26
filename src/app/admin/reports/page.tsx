import { getAllReports } from "@/actions/admin-actions";
import { Navbar } from "@/components/navbar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const t = await getTranslations("admin");
  const { reports, total, pageSize } = await getAllReports(page, 20);

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="mb-8 space-y-1">
          <Link href="/admin" className="text-xs text-ginnezumi hover:text-sumi">
            ← Admin
          </Link>
          <h1 className="text-3xl font-light text-sumi">{t("reports")}</h1>
          <p className="text-sm text-ginnezumi">{total} reportes en total</p>
        </div>

        <div className="space-y-3">
          {reports.length === 0 && (
            <div className="rounded-lg border border-dashed border-hai bg-white py-16 text-center">
              <p className="text-sm text-ginnezumi">No hay reportes pendientes.</p>
            </div>
          )}
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-hai bg-white px-5 py-4 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    report.status === "pending"
                      ? "bg-shu/10 text-shu"
                      : report.status === "resolved"
                        ? "bg-uguisu/10 text-uguisu"
                        : "bg-hai text-ginnezumi"
                  }`}
                >
                  {report.status}
                </span>
                <span className="text-xs text-ginnezumi/60">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-sumi">{report.reason}</p>
            </div>
          ))}
        </div>

        {total > pageSize && (
          <div className="mt-8 flex justify-center gap-2">
            {page > 1 && (
              <Link href={`/admin/reports?page=${page - 1}`} className="rounded border border-hai px-4 py-2 text-sm text-ginnezumi hover:border-sumi">
                ← Anterior
              </Link>
            )}
            {page * pageSize < total && (
              <Link href={`/admin/reports?page=${page + 1}`} className="rounded border border-hai px-4 py-2 text-sm text-ginnezumi hover:border-sumi">
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
