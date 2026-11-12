CREATE TYPE "nexo"."RolUsuario" AS ENUM ('ADMINISTRADOR', 'USUARIO');
CREATE TABLE "nexo"."Usuario" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "nombre" TEXT NOT NULL, "correo" TEXT NOT NULL,
  "rol" "nexo"."RolUsuario" NOT NULL, "activo" BOOLEAN NOT NULL DEFAULT true,
  "ultimoAcceso" TIMESTAMP(3), "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Usuario_correo_key" ON "nexo"."Usuario"("correo");
CREATE INDEX "Usuario_activo_rol_idx" ON "nexo"."Usuario"("activo", "rol");
