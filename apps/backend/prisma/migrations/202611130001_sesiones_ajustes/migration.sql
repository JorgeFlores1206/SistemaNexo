ALTER TABLE "nexo"."Producto"
  ALTER COLUMN "estadoCalculado" DROP NOT NULL,
  ALTER COLUMN "estadoCalculado" DROP DEFAULT,
  ALTER COLUMN "onHand" DROP NOT NULL,
  ALTER COLUMN "onHand" DROP DEFAULT,
  ALTER COLUMN "saldo" DROP NOT NULL,
  ALTER COLUMN "saldo" DROP DEFAULT,
  ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE "nexo"."Sesion" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tokenHash" TEXT NOT NULL,
  "usuarioId" UUID NOT NULL,
  "expiraEn" TIMESTAMP(3) NOT NULL,
  "revocadaEn" TIMESTAMP(3),
  "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Sesion_tokenHash_key" ON "nexo"."Sesion"("tokenHash");
CREATE INDEX "Sesion_usuarioId_revocadaEn_idx" ON "nexo"."Sesion"("usuarioId", "revocadaEn");
CREATE INDEX "Sesion_expiraEn_idx" ON "nexo"."Sesion"("expiraEn");
ALTER TABLE "nexo"."Sesion"
  ADD CONSTRAINT "Sesion_usuarioId_fkey"
  FOREIGN KEY ("usuarioId") REFERENCES "nexo"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "nexo"."AjusteInventario" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "productoId" UUID NOT NULL,
  "actorId" UUID NOT NULL,
  "saldoAnterior" INTEGER NOT NULL,
  "saldoNuevo" INTEGER NOT NULL,
  "motivo" TEXT NOT NULL,
  "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AjusteInventario_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AjusteInventario_productoId_fecha_idx" ON "nexo"."AjusteInventario"("productoId", "fecha");
CREATE INDEX "AjusteInventario_actorId_fecha_idx" ON "nexo"."AjusteInventario"("actorId", "fecha");
ALTER TABLE "nexo"."AjusteInventario"
  ADD CONSTRAINT "AjusteInventario_productoId_fkey"
  FOREIGN KEY ("productoId") REFERENCES "nexo"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "AjusteInventario_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "nexo"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
