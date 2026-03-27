import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Role } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      // PKCE usa cookies temporales que no sobreviven entre instancias en Vercel.
      // Con DrizzleAdapter (database strategy) el state check es suficiente.
      checks: ["state"],
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Si el usuario pasó por el modal de consentimiento y aún no tiene
      // termsAcceptedAt, lo marcamos ahora (primera vez o usuario legacy).
      try {
        if (!user.id) return true;
        const [dbUser] = await db
          .select({ termsAcceptedAt: users.termsAcceptedAt })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        if (!dbUser?.termsAcceptedAt) {
          await db
            .update(users)
            .set({ termsAcceptedAt: new Date() })
            .where(eq(users.id, user.id));
        }
      } catch {
        // No bloquear el login si falla este update
      }
      return true;
    },
    async session({ session, user }) {
      try {
        const [dbUser] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        session.user.id = user.id;
        session.user.role = (dbUser?.role ?? "USER") as Role;
      } catch {
        // DB unavailable or session stale — return session without role
        session.user.id = user.id;
        session.user.role = "USER" as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
