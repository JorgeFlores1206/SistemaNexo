import type { MonthlyReport } from "@nexo/contracts";

export function ReporteMensualVencimientos({ reporte }: { reporte: MonthlyReport }) {
  if (reporte.estadoGeneracion === "VACIO") return <p role="status">No hay productos próximos a vencer.</p>;
  if (reporte.estadoGeneracion === "FALLIDO") return <p role="alert">El reporte no está disponible.</p>;
  return <main><h1>Vencimientos próximos</h1><p>Mes: {reporte.mesReferencia} · Fecha de negocio: {reporte.fechaNegocio}</p><table><caption>Productos próximos a vencer</caption><thead><tr><th>Código</th><th>Nombre</th><th>Política</th><th>Fecha relevante</th><th>Estado</th><th>Días restantes</th><th>Condición</th></tr></thead><tbody>{reporte.productos.map((p) => <tr key={`${p.codigo}-${p.fechaRelevante}`}><td>{p.codigo}</td><td>{p.nombre}</td><td>{p.politicaDevolucion ?? "Sin política"}</td><td>{p.fechaRelevante}</td><td>{p.estadoCalculado}</td><td>{p.diasRestantes}</td><td>{p.danado ? "Dañado" : "-"}</td></tr>)}</tbody></table></main>;
}
