const fs = require("node:fs");
const path = require("node:path");
const { defineConfig } = require("prisma/config");

const envPath = path.resolve(process.cwd(), "nexo.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)\s*$/.exec(line);
    if (match) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
  }
}

export default defineConfig({
  schema: "apps/backend/prisma/schema.prisma",
  engine: "classic",
  datasource: { url: process.env.DATABASE_URL },
  migrations: { path: "apps/backend/prisma/migrations", seed: "node apps/backend/prisma/seed.js" },
});
