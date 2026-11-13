import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

config({ path: resolve(process.cwd(), "bd/.env") });
config({ path: resolve(process.cwd(), "apps/backend/.env") });

export default defineConfig({
  schema: "apps/backend/prisma/schema.prisma",
  engine: "classic",
  datasource: { url: env("DATABASE_URL") },
  migrations: { path: "apps/backend/prisma/migrations", seed: "node apps/backend/prisma/seed.js" },
});
