CREATE TYPE "nexo"."EstadoGeneracionReporte" AS ENUM ('EN_PROCESO', 'GENERADO', 'VACIO', 'FALLIDO');

CREATE TABLE "nexo"."Producto" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "codigo" TEXT NOT NULL, "nombre" TEXT NOT NULL,
  "politicaDevolucion" TEXT, "fechaEfectiva" DATE, "vencimientoOriginal" DATE,
  "estadoCalculado" TEXT NOT NULL DEFAULT 'Neutro', "danado" BOOLEAN NOT NULL DEFAULT false,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "actualizadoEn" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Producto_codigo_key" ON "nexo"."Producto"("codigo");
CREATE TABLE "nexo"."ReporteMensualVencimientos" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "mesReferencia" DATE NOT NULL, "fechaNegocio" DATE NOT NULL,
  "estadoGeneracion" "nexo"."EstadoGeneracionReporte" NOT NULL, "cantidadIncluida" INTEGER NOT NULL DEFAULT 0,
  "errorCodigo" TEXT, "errorMensaje" TEXT, "generadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReporteMensualVencimientos_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ReporteMensualVencimientos_mesReferencia_key" ON "nexo"."ReporteMensualVencimientos"("mesReferencia");
CREATE TABLE "nexo"."ProductoProximoAVencer" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "reporteId" UUID NOT NULL, "productoId" UUID NOT NULL,
  "codigo" TEXT NOT NULL, "nombre" TEXT NOT NULL, "politicaDevolucion" TEXT, "fechaEfectiva" DATE,
  "vencimientoOriginal" DATE NOT NULL, "fechaRelevante" DATE NOT NULL, "estadoCalculado" TEXT NOT NULL,
  "danado" BOOLEAN NOT NULL, "diasRestantes" INTEGER NOT NULL,
  CONSTRAINT "ProductoProximoAVencer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProductoProximoAVencer_reporteId_productoId_key" ON "nexo"."ProductoProximoAVencer"("reporteId", "productoId");
CREATE TABLE "nexo"."BitacoraReporteMensual" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "reporteId" UUID NOT NULL, "mesReferencia" DATE NOT NULL,
  "fechaNegocio" DATE NOT NULL, "resultado" "nexo"."EstadoGeneracionReporte" NOT NULL,
  "cantidadIncluida" INTEGER NOT NULL, "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BitacoraReporteMensual_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "nexo"."ProductoProximoAVencer" ADD CONSTRAINT "ProductoProximoAVencer_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "nexo"."ReporteMensualVencimientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexo"."ProductoProximoAVencer" ADD CONSTRAINT "ProductoProximoAVencer_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "nexo"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "nexo"."BitacoraReporteMensual" ADD CONSTRAINT "BitacoraReporteMensual_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "nexo"."ReporteMensualVencimientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
