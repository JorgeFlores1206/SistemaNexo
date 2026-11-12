import type { GenerationResult } from "@nexo/contracts";

export function ResultadoGeneracion({ resultado }: { resultado: GenerationResult }) {
  const mensaje = resultado.estadoGeneracion === "VACIO" ? "No hay productos próximos a vencer." : resultado.estadoGeneracion === "FALLIDO" ? "El reporte no está disponible." : "Reporte generado correctamente.";
  return <section aria-live="polite"><h2>Resultado de generación</h2><p>{mensaje}</p><p>Mes: {resultado.mesReferencia} · Fecha de negocio: {resultado.fechaNegocio} · Productos: {resultado.cantidadIncluida}</p></section>;
}
