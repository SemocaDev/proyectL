import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  permissions,
  rolePermissions,
  PERMISSION_SEEDS,
  ROLE_PERMISSION_SEEDS,
} from "../src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Seeding permissions...");
  await db.insert(permissions).values(PERMISSION_SEEDS);

  console.log("Seeding role permissions...");
  await db.insert(rolePermissions).values(ROLE_PERMISSION_SEEDS);

  console.log("Seed complete! Inserted:");
  console.log(`  - ${PERMISSION_SEEDS.length} permissions`);
  console.log(`  - ${ROLE_PERMISSION_SEEDS.length} role-permission mappings`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
