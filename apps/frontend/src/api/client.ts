export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = window.localStorage.getItem("nexo.session.token");
  const role = window.localStorage.getItem("nexo.session.role");
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (role) headers.set("X-Role", role);
  const response = await fetch(`/api${path}`, { ...init, headers, credentials: "include" });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return (await response.json()) as T;
}

export function saveSession(token: string, role: "Administrador" | "Usuario") {
  window.localStorage.setItem("nexo.session.token", token);
  window.localStorage.setItem("nexo.session.role", role);
}

export function clearSession() {
  window.localStorage.removeItem("nexo.session.token");
  window.localStorage.removeItem("nexo.session.role");
}
