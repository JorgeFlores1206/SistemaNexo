import { useEffect, useState } from "react";
import type { AuditEvent } from "@nexo/contracts";
import { obtenerBitacora } from "./api";

export function Bitacora() {
  const [eventos, setEventos] = useState<AuditEvent[]>([]); const [buscar, setBuscar] = useState(""); const [cargando, setCargando] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { let activo = true; setCargando(true); void obtenerBitacora(buscar).then((result) => { if (activo) setEventos(result.eventos); }).catch(() => { if (activo) setError("No se pudo cargar la bitácora."); }).finally(() => { if (activo) setCargando(false); }); return () => { activo = false; }; }, [buscar]);
  return <><div className="toolbar"><label className="search">⌕<input value={buscar} onChange={(event) => setBuscar(event.target.value)} placeholder="Buscar en la bitácora..." aria-label="Buscar en la bitácora" /></label><button className="button secondary" type="button" disabled>▣ Exportar</button></div>{error && <p role="alert">{error}</p>}{cargando ? <p role="status">Cargando bitácora...</p> : <article className="panel table-panel"><div className="panel-heading"><div><h2>Registro de acciones</h2><p>{eventos.length} eventos recientes</p></div></div>{eventos.length === 0 ? <p className="empty-state">No hay eventos registrados.</p> : <div className="table-scroll"><table><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Acción</th><th>Detalle</th><th>Resultado</th></tr></thead><tbody>{eventos.map((evento) => <tr key={evento.id}><td>{new Date(evento.fecha).toLocaleString("es-BO")}</td><td>{evento.actor}</td><td>{evento.accion}</td><td>{evento.detalle}</td><td><span className="badge green">{evento.resultado}</span></td></tr>)}</tbody></table></div>}</article>}</>;
}
