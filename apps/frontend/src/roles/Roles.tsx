import { useEffect, useState } from "react";
import type { PermissionMatrixRow } from "@nexo/contracts";
import { obtenerMatrizPermisos } from "./api";

export function Roles() {
  const [permisos, setPermisos] = useState<PermissionMatrixRow[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { void obtenerMatrizPermisos().then((result) => setPermisos(result.permisos)).catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudo cargar la matriz de permisos.")).finally(() => setLoading(false)); }, []);
  return <section className="page-section"><article className="table-card"><div className="card-heading"><div><p className="eyebrow">AUTORIZACIÓN</p><h2>Matriz de permisos</h2><p>Los controles de esta pantalla son informativos; la API aplica la autorización real.</p></div></div>{loading ? <p className="loading-state">Cargando permisos...</p> : error ? <div className="empty-state"><p className="form-error">{error}</p></div> : <div className="table-scroll"><table className="data-table"><thead><tr><th>Módulo</th><th>Acción</th><th>Administrador</th><th>Usuario</th></tr></thead><tbody>{permisos.map((permission) => <tr key={`${permission.modulo}-${permission.accion}`}><td>{permission.modulo}</td><td>{permission.accion}</td><td className="permission-cell">{permission.administrador ? "✓" : "—"}</td><td className="permission-cell">{permission.usuario ? "✓" : "—"}</td></tr>)}</tbody></table></div>}</article></section>;
}
