import type { DashboardIndicator } from "@nexo/contracts";

const tone: Record<string, string> = { "Vencido + Devolución": "danger", "Vencido + Ofertar": "danger", "Ofertar": "info", "Neutro": "success", PRONTO_A_VENCER: "warning", DANADO: "danger", SIN_CLASIFICAR: "muted", ON_HAND: "teal", SALDO: "teal" };
const icon: Record<string, string> = { PRONTO_A_VENCER: "!", DANADO: "◇", ON_HAND: "↗", SALDO: "≡", SIN_CLASIFICAR: "?" };

export function IndicadoresInventario({ indicadores, seleccionar, seleccionado }: { indicadores: DashboardIndicator[]; seleccionar: (clave: string) => void; seleccionado: string | null }) {
  return <section className="indicator-section" aria-labelledby="indicator-title"><div className="section-heading"><div><p className="eyebrow">INDICADORES</p><h2 id="indicator-title">Estado del inventario</h2><p>Selecciona una tarjeta para revisar los artículos que la componen.</p></div></div><div className="indicator-grid">{indicadores.map((indicator) => <button className={`indicator-card ${tone[indicator.clave] ?? "neutral"} ${seleccionado === indicator.clave ? "selected" : ""}`} type="button" key={indicator.clave} onClick={() => seleccionar(indicator.clave)} disabled={!indicator.disponible} aria-pressed={seleccionado === indicator.clave}><span className="indicator-icon">{icon[indicator.clave] ?? (indicator.tipo === "estado" ? "•" : "#")}</span><span className="indicator-content"><span>{indicator.etiqueta}</span><strong>{indicator.cantidad.toLocaleString("es-BO")}</strong></span><span className="indicator-arrow">→</span></button>)}</div></section>;
}
