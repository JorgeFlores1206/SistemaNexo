import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

config({ path: resolve(process.cwd(), "../../bd/.env") });
config({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  engine: "classic",
  datasource: { url: env("DATABASE_URL") },
  migrations: { path: "prisma/migrations", seed: "node prisma/seed.js" },
});
