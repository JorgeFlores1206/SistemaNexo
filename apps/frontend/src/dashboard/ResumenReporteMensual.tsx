import type { GenerationResult } from "@nexo/contracts";

const labels = { GENERADO: "Generado", VACIO: "Sin productos", FALLIDO: "No disponible", EN_PROCESO: "En proceso" };
export function ResumenReporteMensual({ resumen }: { resumen: GenerationResult }) { return <section className="card report-summary"><div><p className="eyebrow">SOLO ADMINISTRADOR</p><h2>Reporte mensual anticipado</h2><p>Mes de referencia: {resumen.mesReferencia} · fecha de negocio: {resumen.fechaNegocio}</p></div><div className={`report-status ${resumen.estadoGeneracion.toLowerCase()}`}><strong>{labels[resumen.estadoGeneracion]}</strong><span>{resumen.cantidadIncluida} productos incluidos</span></div></section>; }
