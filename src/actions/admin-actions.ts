"use server";

import { db } from "@/db";
import { shortLinks, reports } from "@/db/schema";
import { eq, sql, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/security";

export async function flagLink(linkId: string) {
  await requireAdmin();

  await db
    .update(shortLinks)
    .set({ status: "flagged" })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}

export async function disableLink(linkId: string) {
  await requireAdmin();

  await db
    .update(shortLinks)
    .set({ status: "disabled" })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}

export async function enableLink(linkId: string) {
  await requireAdmin();

  await db
    .update(shortLinks)
    .set({ status: "active" })
    .where(eq(shortLinks.id, linkId));

  return { success: true };
}

export async function resolveReport(
  reportId: string,
  action: "resolved" | "dismissed"
) {
  await requireAdmin();

  await db
    .update(reports)
    .set({ status: action })
    .where(eq(reports.id, reportId));

  return { success: true };
}

export async function getAllLinks(page = 1, pageSize = 20) {
  await requireAdmin();

  const offset = (page - 1) * pageSize;

  const links = await db
    .select({
      id: shortLinks.id,
      shortCode: shortLinks.shortCode,
      mode: shortLinks.mode,
      targetUrl: shortLinks.targetUrl,
      status: shortLinks.status,
      ownerId: shortLinks.ownerId,
      createdAt: shortLinks.createdAt,
    })
    .from(shortLinks)
    .orderBy(sql`${shortLinks.createdAt} DESC`)
    .limit(pageSize)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: count() })
    .from(shortLinks);

  return { links, total, page, pageSize };
}

export async function getAllReports(page = 1, pageSize = 20) {
  await requireAdmin();

  const offset = (page - 1) * pageSize;

  const reportsList = await db
    .select()
    .from(reports)
    .orderBy(sql`${reports.createdAt} DESC`)
    .limit(pageSize)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: count() })
    .from(reports);

  return { reports: reportsList, total, page, pageSize };
}
