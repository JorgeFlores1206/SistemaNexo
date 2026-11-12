import type { GenerationResult } from "@nexo/contracts";

export function ResumenReporteMensual({ resumen }: { resumen: GenerationResult }) {
  const mensaje = resumen.estadoGeneracion === "FALLIDO" ? "El reporte no está disponible." : resumen.estadoGeneracion === "VACIO" ? "Reporte generado sin productos." : "Reporte generado correctamente.";
  return <section aria-label="Resumen del reporte mensual"><h2>Reporte mensual</h2><p>{mensaje}</p><p>Mes: {resumen.mesReferencia} · Productos: {resumen.cantidadIncluida}</p></section>;
}
