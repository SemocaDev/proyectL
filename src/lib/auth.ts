import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Role } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      // PKCE usa cookies temporales que no sobreviven entre instancias en Vercel.
      // Con DrizzleAdapter (database strategy) el state check es suficiente.
      checks: ["state"],
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const [dbUser] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      session.user.id = user.id;
      session.user.role = (dbUser?.role ?? "USER") as Role;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
