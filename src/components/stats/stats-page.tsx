"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  AreaChart, Area,
  BarChart, Bar,
  Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { WagaraPattern } from "@/components/patterns";
import { colors, chartColors } from "@/lib/css-vars";
import type { getLinkStats } from "@/actions/link-actions";

type StatsData = Exclude<Awaited<ReturnType<typeof getLinkStats>>, { error: string }>;

interface StatsPageProps {
  data: StatsData;
  backHref: string;
}

const BENI = colors.beni;
const HAI = colors.hai;
const GINNEZUMI = colors.ginnezumi;
const CHART_COLORS = [...chartColors];

export function StatsPage({ data, backHref }: StatsPageProps) {
  const t = useTranslations("stats");
  const td = useTranslations("dashboard");
  const { link, clicksByDay, byCountry, byDevice, byBrowser, byOs, byReferer, uniqueVisitors, botClicks } = data;

  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/${link.shortCode}`;
  const totalLast30 = clicksByDay.reduce((s, d) => s + d.clicks, 0);

  // Format date labels: show only day/month, abbreviated
  const formatDate = (iso: unknown) => {
    if (typeof iso !== "string") return String(iso ?? "");
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-hai/60 bg-shironeri px-6 py-6">
        <WagaraPattern pattern="seigaiha" color={colors.beni} opacity={0.05} />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs text-ginnezumi transition-colors hover:text-sumi"
            >
              ← {t("backToDashboard")}
            </Link>
            <h1 className="text-xl font-light text-sumi sm:text-2xl">
              {link.title ?? link.shortCode}
            </h1>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ginnezumi/60 transition-colors hover:text-beni"
            >
              {shortUrl}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              link.status === "active"
                ? "bg-uguisu/10 text-uguisu"
                : "bg-hai text-ginnezumi"
            }`}>
              {link.status}
            </span>
            <span className="rounded-full bg-hai px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ginnezumi">
              {link.mode}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <KpiCard label={t("totalClicks")} value={link.clickCount} sub={t("last30days")} subValue={totalLast30} pattern="seigaiha" />
        <KpiCard label={t("uniqueVisitors")} value={uniqueVisitors} pattern="asanoha" />
        <KpiCard label={t("botClicks")} value={botClicks} pattern="ichimatsu" muted />
        <KpiCard
          label="Creado"
          value={new Date(link.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
          pattern="tokusa"
          isText
        />
      </div>

      {/* ── Clicks over time ── */}
      <ChartCard title={t("clicksOverTime")} subtitle={t("last30days")}>
        {totalLast30 === 0 ? (
          <EmptyState label={t("noData")} />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={clicksByDay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="beniGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BENI} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BENI} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: GINNEZUMI }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: GINNEZUMI }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ background: "#fff", border: `1px solid ${HAI}`, borderRadius: 12, fontSize: 12 }}
                labelFormatter={formatDate}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke={BENI}
                strokeWidth={2}
                fill="url(#beniGrad)"
                dot={false}
                activeDot={{ r: 4, fill: BENI, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* ── Country + Device (row) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChartCard title={t("byCountry")}>
          {byCountry.length === 0 ? (
            <EmptyState label={t("noData")} />
          ) : (
            <HorizBars data={byCountry} colors={CHART_COLORS} />
          )}
        </ChartCard>

        <ChartCard title={t("byDevice")}>
          {byDevice.length === 0 ? (
            <EmptyState label={t("noData")} />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byDevice} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: GINNEZUMI }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{ background: "#fff", border: `1px solid ${HAI}`, borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {byDevice.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Browser + OS (row) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChartCard title={t("byBrowser")}>
          {byBrowser.length === 0 ? <EmptyState label={t("noData")} /> : <HorizBars data={byBrowser} colors={CHART_COLORS} />}
        </ChartCard>
        <ChartCard title={t("byOs")}>
          {byOs.length === 0 ? <EmptyState label={t("noData")} /> : <HorizBars data={byOs} colors={CHART_COLORS} />}
        </ChartCard>
      </div>

      {/* ── Referers ── */}
      <ChartCard title={t("byReferer")}>
        {byReferer.length === 0 ? (
          <EmptyState label={t("noData")} />
        ) : (
          <div className="space-y-2">
            {byReferer.map((r, i) => {
              const max = byReferer[0].value;
              const pct = max > 0 ? (r.value / max) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-xs text-ginnezumi">{r.name}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-hai/60">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-sumi">{r.value}</span>
                </div>
              );
            })}
          </div>
        )}
      </ChartCard>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, subValue, pattern, muted = false, isText = false,
}: {
  label: string;
  value: number | string;
  sub?: string;
  subValue?: number;
  pattern: "seigaiha" | "asanoha" | "ichimatsu" | "tokusa";
  muted?: boolean;
  isText?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hai/60 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
      <WagaraPattern pattern={pattern} color={colors.beni} opacity={0.035} static />
      <div className="relative z-10">
        <p className="text-[10px] font-medium uppercase tracking-wider text-ginnezumi/60 sm:text-xs">{label}</p>
        <p className={`mt-1.5 font-light ${isText ? "text-base text-sumi" : "text-2xl"} ${muted ? "text-ginnezumi" : "text-sumi"}`}>
          {value}
        </p>
        {sub && subValue !== undefined && (
          <p className="mt-0.5 text-[10px] text-ginnezumi/50">
            {subValue} {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hai/60 bg-white px-5 py-5 shadow-sm">
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-ginnezumi">{title}</h3>
        {subtitle && <span className="text-[10px] text-ginnezumi/40">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function HorizBars({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="space-y-2.5">
      {data.map((r, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs text-ginnezumi">{r.name}</span>
          <div className="flex-1 overflow-hidden rounded-full bg-hai/60">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${(r.value / max) * 100}%`, background: colors[i % colors.length] }}
            />
          </div>
          <span className="w-8 text-right text-xs font-medium text-sumi">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-24 items-center justify-center">
      <p className="text-xs text-ginnezumi/40">{label}</p>
    </div>
  );
}
