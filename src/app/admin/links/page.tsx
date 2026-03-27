import { getAllLinks } from "@/actions/admin-actions";
import { Navbar } from "@/components/navbar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AdminLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const t = await getTranslations("admin");
  const { links, total, pageSize } = await getAllLinks(page, 20);

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-1">
            <Link href="/admin" className="text-xs text-ginnezumi hover:text-sumi">
              ← Admin
            </Link>
            <h1 className="text-3xl font-light text-sumi">{t("allLinks")}</h1>
            <p className="text-sm text-ginnezumi">{total} links en total</p>
          </div>
        </div>

        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-hai bg-white px-5 py-4 shadow-sm"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sumi">/{link.shortCode}</span>
                  <span className={`rounded px-1.5 py-0.5 text-xs ${
                    link.status === "active" ? "bg-uguisu/10 text-uguisu" :
                    link.status === "disabled" ? "bg-shu/10 text-shu" :
                    "bg-ginnezumi/10 text-ginnezumi"
                  }`}>
                    {link.status}
                  </span>
                </div>
                {link.targetUrl && (
                  <p className="truncate text-xs text-ginnezumi/60">{link.targetUrl}</p>
                )}
              </div>
              <AdminLinkActions linkId={link.id} status={link.status} />
            </div>
          ))}
        </div>

        {/* Paginación */}
        {total > pageSize && (
          <div className="mt-8 flex justify-center gap-2">
            {page > 1 && (
              <Link href={`/admin/links?page=${page - 1}`} className="rounded border border-hai px-4 py-2 text-sm text-ginnezumi hover:border-sumi">
                ← Anterior
              </Link>
            )}
            {page * pageSize < total && (
              <Link href={`/admin/links?page=${page + 1}`} className="rounded border border-hai px-4 py-2 text-sm text-ginnezumi hover:border-sumi">
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function AdminLinkActions({ linkId, status }: { linkId: string; status: string }) {
  return (
    <div className="ml-4 flex gap-2">
      <Link
        href={`/admin/links/${linkId}/stats`}
        className="rounded-md border border-hai px-3 py-1.5 text-xs text-ginnezumi transition-colors hover:border-ai hover:text-ai"
      >
        Stats
      </Link>
      <form action={`/api/admin/links/${linkId}/disable`} method="POST">
        <button
          type="submit"
          disabled={status === "disabled"}
          className="rounded-md px-3 py-1.5 text-xs text-ginnezumi/60 transition-colors hover:text-shu disabled:opacity-30"
        >
          Deshabilitar
        </button>
      </form>
    </div>
  );
}
