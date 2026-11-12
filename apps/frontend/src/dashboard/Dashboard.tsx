import { useCallback, useEffect, useState } from "react";
import type { DashboardPriority, DashboardSummary } from "@nexo/contracts";
import { obtenerPrioridad, obtenerResumenDashboard } from "./api";
import { IndicadoresInventario } from "./IndicadoresInventario";
import { PrioridadInventario } from "./PrioridadInventario";
import { ResumenReporteMensual } from "./ResumenReporteMensual";

export function Dashboard() {
  const [resumen, setResumen] = useState<DashboardSummary | null>(null);
  const [prioridad, setPrioridad] = useState<DashboardPriority | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cargar = useCallback(async () => { setCargando(true); setError(null); try { setResumen(await obtenerResumenDashboard()); } catch { setError("No se pudo actualizar el dashboard."); } finally { setCargando(false); } }, []);
  useEffect(() => { void cargar(); }, [cargar]);
  if (!resumen && cargando) return <main aria-busy="true"><p role="status">Cargando dashboard...</p></main>;
  if (!resumen && error) return <main><p role="alert">{error}</p><button type="button" onClick={() => void cargar}>Reintentar</button></main>;
  if (!resumen) return null;
  return <section className="dashboard-connected"><div className="page-actions"><span className="business-date">Fecha de negocio: {resumen.fechaNegocio}</span><button className="button secondary" type="button" onClick={() => void cargar} disabled={cargando}>{cargando ? "Actualizando..." : "↻ Actualizar"}</button></div>{error && <p role="alert">{error}</p>}<IndicadoresInventario indicadores={resumen.indicadores} seleccionar={async (clave) => { try { setPrioridad(await obtenerPrioridad(clave)); } catch { setError("No se pudo consultar la prioridad."); } }} />{prioridad && <PrioridadInventario prioridad={prioridad} />}{resumen.resumenReporteMensual && <ResumenReporteMensual resumen={resumen.resumenReporteMensual} />}</section>;
}
