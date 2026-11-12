import type { DashboardIndicator } from "@nexo/contracts";

export function IndicadoresInventario({ indicadores, seleccionar }: { indicadores: DashboardIndicator[]; seleccionar: (clave: string) => void }) {
  return <section aria-label="Indicadores de inventario"><h2>Estado del inventario</h2><div>{indicadores.map((indicador) => <button type="button" key={indicador.clave} onClick={() => seleccionar(indicador.clave)} disabled={!indicador.disponible}>{indicador.etiqueta}: {indicador.cantidad}</button>)}</div></section>;
}
