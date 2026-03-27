import type { Role } from "@/lib/config";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      termsAcceptedAt: Date | null;
    };
  }
}
