import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkStats } from "@/actions/link-actions";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StatsPage } from "@/components/stats/stats-page";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkStatsPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { id } = await params;
  const t = await getTranslations("stats");

  const result = await getLinkStats(id);

  if ("error" in result) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <StatsPage data={result} backHref="/dashboard" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
