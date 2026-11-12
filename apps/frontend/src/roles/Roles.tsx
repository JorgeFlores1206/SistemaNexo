import { useEffect, useState } from "react";
import type { PermissionMatrixRow } from "@nexo/contracts";
import { obtenerMatrizPermisos } from "./api";

export function Roles() {
  const [permisos, setPermisos] = useState<PermissionMatrixRow[]>([]); const [cargando, setCargando] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { void obtenerMatrizPermisos().then((result) => setPermisos(result.permisos)).catch(() => setError("No se pudo cargar la matriz de permisos.")).finally(() => setCargando(false)); }, []);
  return cargando ? <p role="status">Cargando permisos...</p> : error ? <p role="alert">{error}</p> : <article className="panel table-panel"><div className="panel-heading"><div><h2>Matriz de permisos</h2><p>Permisos definidos para los roles de Nexo</p></div></div><table><thead><tr><th>Módulo</th><th>Acción</th><th>Administrador</th><th>Usuario</th></tr></thead><tbody>{permisos.map((permiso) => <tr key={`${permiso.modulo}-${permiso.accion}`}><td>{permiso.modulo}</td><td>{permiso.accion}</td><td className="permission">{permiso.administrador ? "✓" : "—"}</td><td className="permission">{permiso.usuario ? "✓" : "—"}</td></tr>)}</tbody></table></article>;
}
