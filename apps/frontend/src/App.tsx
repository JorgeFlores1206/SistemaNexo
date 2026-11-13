import { useEffect, useMemo, useState } from "react";
import type { PublicUser } from "@nexo/contracts";
import { clearSession, getStoredUser, hasSession, updateStoredUser } from "./api/client";
import { cerrarSesion, iniciarSesion, obtenerSesion } from "./sesion";
import { Dashboard } from "./dashboard";
import { Inventory } from "./inventario";
import { Users } from "./usuarios";
import { Roles } from "./roles";
import { Bitacora } from "./bitacora";
import { Perfil } from "./perfil";
import { ImportarExcel } from "./inventario/ImportarExcel";
import { AjustesInventario } from "./inventario/AjustesInventario";
import { Reportes } from "./reportes-programados/Reportes";

type Screen = "dashboard" | "inventario" | "importar" | "ajustes" | "usuarios" | "roles" | "reportes" | "bitacora" | "perfil" | "contrasena";

const pageMeta: Record<Screen, { title: string; description: string }> = {
  dashboard: { title: "Vista general", description: "Un resumen claro para priorizar el trabajo del día." },
  inventario: { title: "Inventario", description: "Consulta y gestiona los artículos registrados en Nexo." },
  importar: { title: "Importar Excel", description: "Carga datos del inventario con validación por fila." },
  ajustes: { title: "Ajustes físicos", description: "Registra el resultado de un inventario físico sobre Saldo." },
  usuarios: { title: "Usuarios", description: "Administra las cuentas y accesos de Nexo." },
  roles: { title: "Roles y privilegios", description: "Consulta la matriz de permisos vigente." },
  reportes: { title: "Reportes programados", description: "Consulta y genera el reporte mensual de vencimientos." },
  bitacora: { title: "Bitácora de actividad", description: "Revisa las acciones administrativas realizadas en Nexo." },
  perfil: { title: "Mi perfil", description: "Consulta y administra tu información personal." },
  contrasena: { title: "Cambiar contraseña", description: "Actualiza tu contraseña para mantener tu cuenta segura." },
};

function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "NX"; }

function Icon({ children }: { children: string }) { return <span className="nav-icon" aria-hidden="true">{children}</span>; }

function Login({ onSuccess }: { onSuccess: (user: PublicUser) => void }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setCargando(true);
    try { const result = await iniciarSesion(correo, password); onSuccess(result.usuario); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión."); }
    finally { setCargando(false); }
  }
  return <main className="login-page"><section className="login-card" aria-labelledby="login-title"><div className="login-brand"><span className="brand-mark">N</span><span><strong>Nexo</strong><small>GESTIÓN DE INVENTARIO</small></span></div><div className="login-heading"><p className="eyebrow">ACCESO SEGURO</p><h1 id="login-title">Bienvenido de nuevo</h1><p>Ingresa tus credenciales para continuar.</p></div><form onSubmit={submit} className="stack-form"><label>Correo electrónico<input type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} placeholder="nombre@empresa.com" autoComplete="username" required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Escribe tu contraseña" autoComplete="current-password" required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary full-width" type="submit" disabled={cargando}>{cargando ? "Verificando..." : "Iniciar sesión"}</button></form><p className="login-note">Las cuentas son creadas por un Administrador. Si olvidaste tu contraseña, solicita un restablecimiento por el canal definido para tu organización.</p></section></main>;
}

function Sidebar({ screen, user, navigate, logout, open, close }: { screen: Screen; user: PublicUser; navigate: (screen: Screen) => void; logout: () => void; open: boolean; close: () => void }) {
  const admin = user.rol === "ADMINISTRADOR";
  const link = (id: Screen, label: string, icon: string) => <button type="button" className={`nav-link ${screen === id ? "active" : ""}`} aria-current={screen === id ? "page" : undefined} onClick={() => { navigate(id); close(); }}><Icon>{icon}</Icon><span>{label}</span></button>;
  return <><aside className={`sidebar ${open ? "open" : ""}`} id="side-navigation" aria-label="Navegación principal"><div className="brand"><span className="brand-mark">N</span><span><strong>Nexo</strong><small>GESTIÓN DE INVENTARIO</small></span></div><p className="nav-label">OPERACIÓN</p><nav className="side-nav">{link("dashboard", "Vista general", "⌂")}{link("inventario", "Inventario", "▦")}{link("importar", "Importar Excel", "⇩")}{admin && link("ajustes", "Ajustes físicos", "▤")}</nav>{admin && <><p className="nav-label">ADMINISTRACIÓN</p><nav className="side-nav">{link("usuarios", "Usuarios", "♙")}{link("roles", "Roles y privilegios", "♧")}{link("reportes", "Reportes programados", "◫")}{link("bitacora", "Bitácora", "◷")}</nav></>}<p className="nav-label">CUENTA</p><nav className="side-nav">{link("perfil", "Mi perfil", "◎")}{link("contrasena", "Cambiar contraseña", "⌁")}</nav><div className="sidebar-bottom"><button className="profile-link" type="button" onClick={() => { navigate("perfil"); close(); }}><span className="avatar">{initials(user.nombre)}</span><span><b>{user.nombre}</b><small>{user.rol === "ADMINISTRADOR" ? "Administrador" : "Usuario"}</small></span></button><button className="logout-link" type="button" onClick={logout}>Salir</button></div></aside><button className={`menu-backdrop ${open ? "visible" : ""}`} type="button" onClick={close} aria-label="Cerrar menú" /></>;
}

function Header({ screen, user, onMenu }: { screen: Screen; user: PublicUser; onMenu: () => void }) {
  const meta = pageMeta[screen];
  return <header className="topbar"><button className="menu-toggle" type="button" onClick={onMenu} aria-label="Abrir menú de navegación">☰</button><div><p className="eyebrow">NEXO / {screen === "dashboard" ? "INICIO" : meta.title.toUpperCase()}</p><h1>{screen === "dashboard" ? `Hola, ${user.nombre.split(" ")[0]} 👋` : meta.title}</h1><p>{meta.description}</p></div><div className="topbar-user"><span className="avatar small">{initials(user.nombre)}</span><span>{user.nombre.split(" ")[0]}</span></div></header>;
}

function AuthenticatedApp({ initialUser, onLogout }: { initialUser: PublicUser; onLogout: () => void }) {
  const [user, setUser] = useState(initialUser);
  const [screen, setScreen] = useState<Screen>(initialUser.debeCambiarPassword ? "contrasena" : "dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = user.rol === "ADMINISTRADOR";
  const canNavigate = (next: Screen) => { if (user.debeCambiarPassword && next !== "contrasena") return; if (!admin && ["ajustes", "usuarios", "roles", "reportes", "bitacora"].includes(next)) return; setScreen(next); };
  function userUpdated(next: PublicUser) { setUser(next); updateStoredUser(next); if (!next.debeCambiarPassword && screen === "contrasena") setScreen("dashboard"); }
  const content = useMemo(() => {
    if (screen === "dashboard") return <Dashboard />;
    if (screen === "inventario") return <Inventory isAdmin={admin} />;
    if (screen === "importar") return <ImportarExcel />;
    if (screen === "ajustes") return <AjustesInventario />;
    if (screen === "usuarios") return <Users />;
    if (screen === "roles") return <Roles />;
    if (screen === "reportes") return <Reportes />;
    if (screen === "bitacora") return <Bitacora />;
    return <Perfil password={screen === "contrasena"} onUserUpdated={userUpdated} />;
  }, [screen, admin]);
  return <div className="app-shell"><Sidebar screen={screen} user={user} navigate={canNavigate} logout={onLogout} open={menuOpen} close={() => setMenuOpen(false)} /><main className="main-content"><Header screen={screen} user={user} onMenu={() => setMenuOpen(true)} />{user.debeCambiarPassword && screen === "contrasena" && <div className="notice warning" role="status">Debes establecer una contraseña personal antes de continuar.</div>}{content}</main></div>;
}

export default function App() {
  const [user, setUser] = useState<PublicUser | null>(getStoredUser());
  const [checking, setChecking] = useState(hasSession());
  useEffect(() => {
    const expired = () => { clearSession(); setUser(null); };
    window.addEventListener("nexo:session-expired", expired);
    if (hasSession()) void obtenerSesion().then((session) => { updateStoredUser(session.usuario); setUser(session.usuario); }).catch(expired).finally(() => setChecking(false));
    else setChecking(false);
    return () => window.removeEventListener("nexo:session-expired", expired);
  }, []);
  if (checking) return <main className="loading-page"><p role="status">Comprobando sesión...</p></main>;
  if (!user) return <Login onSuccess={setUser} />;
  return <AuthenticatedApp initialUser={user} onLogout={() => { void cerrarSesion().finally(() => { clearSession(); setUser(null); }); }} />;
}
