import { notFound } from "next/navigation";
import { getLinkStats } from "@/actions/link-actions";
import { StatsPage } from "@/components/stats/stats-page";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminLinkStatsPage({ params }: Props) {
  const { id } = await params;

  const result = await getLinkStats(id);
  if ("error" in result) notFound();

  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
      <StatsPage data={result} backHref="/admin/links" />
    </div>
  );
}
