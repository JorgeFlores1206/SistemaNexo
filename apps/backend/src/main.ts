import { config } from "dotenv";
import { resolve } from "node:path";
import { json } from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

config({ path: resolve(process.cwd(), "bd/.env") });
config({ path: resolve(process.cwd(), "../../bd/.env") });
config({ path: resolve(process.cwd(), "apps/backend/.env") });
config({ path: resolve(process.cwd(), ".env") });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: "15mb" }));
  app.setGlobalPrefix("api");
  app.enableCors({ origin: true, credentials: true });
  await app.listen(Number(process.env.PORT ?? 3000));
}

void bootstrap();
