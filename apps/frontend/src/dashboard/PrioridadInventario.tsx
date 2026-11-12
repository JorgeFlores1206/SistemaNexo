import type { DashboardPriority } from "@nexo/contracts";

export function PrioridadInventario({ prioridad }: { prioridad: DashboardPriority }) {
  if (prioridad.productos.length === 0) return <p role="status">No hay productos para este indicador.</p>;
  return <section aria-label="Prioridad de inventario"><h2>{prioridad.indicador}</h2><ul>{prioridad.productos.map((producto) => <li key={`${producto.codigo}-${producto.fechaRelevante ?? "sin-fecha"}`}>{producto.codigo} — {producto.nombre} — {producto.estadoCalculado} — Saldo: {producto.saldo}{producto.danado ? " — Dañado" : ""}</li>)}</ul></section>;
}
