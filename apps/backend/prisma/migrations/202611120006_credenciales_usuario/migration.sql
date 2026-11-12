ALTER TABLE "nexo"."Usuario" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "nexo"."Usuario" ADD COLUMN "debeCambiarPassword" BOOLEAN NOT NULL DEFAULT true;
