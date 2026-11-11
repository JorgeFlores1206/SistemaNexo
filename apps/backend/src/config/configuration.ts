export function configuration() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    sessionSecret: process.env.SESSION_SECRET,
  };
}
