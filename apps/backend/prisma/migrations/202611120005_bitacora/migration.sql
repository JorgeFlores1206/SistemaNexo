CREATE TABLE "nexo"."BitacoraEvento" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actor" TEXT NOT NULL, "accion" TEXT NOT NULL, "detalle" TEXT NOT NULL,
  "resultado" TEXT NOT NULL, "cuentaAfectada" TEXT,
  CONSTRAINT "BitacoraEvento_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "BitacoraEvento_fecha_idx" ON "nexo"."BitacoraEvento"("fecha");
CREATE INDEX "BitacoraEvento_accion_idx" ON "nexo"."BitacoraEvento"("accion");
