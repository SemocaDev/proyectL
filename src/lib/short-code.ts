import { db } from "@/db";
import { shortLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SHORT_CODE_LENGTH } from "./config";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateShortCode(length = SHORT_CODE_LENGTH): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export async function generateUniqueShortCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateShortCode();
    const [existing] = await db
      .select({ id: shortLinks.id })
      .from(shortLinks)
      .where(eq(shortLinks.shortCode, code))
      .limit(1);

    if (!existing) return code;
  }

  throw new Error("Failed to generate unique short code after 5 attempts");
}
