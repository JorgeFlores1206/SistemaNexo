import type { PublicUser } from "@nexo/contracts";

// Vite provides the proxy during development. Electron loads the compiled
// app with file://, so it must call the local API explicitly.
const API_BASE = import.meta.env.VITE_API_URL ?? (window.location.protocol === "file:" ? "http://localhost:3000" : "");
const TOKEN_KEY = "nexo.session.token";
const USER_KEY = "nexo.session.user";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE}/api${path}`, { ...init, headers, credentials: "include" });
  if (!response.ok) {
    let message = `La solicitud no se pudo completar (${response.status}).`;
    try {
      const body = await response.json() as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(" ");
      else if (body.message) message = body.message;
    } catch { /* La respuesta puede no tener JSON. */ }
    if (response.status === 401) window.dispatchEvent(new CustomEvent("nexo:session-expired"));
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export async function apiDownload(path: string): Promise<Blob> {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE}/api${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, credentials: "include" });
  if (!response.ok) throw new ApiError(response.status, "No se pudo generar el archivo.");
  return response.blob();
}

export function saveSession(token: string, user: PublicUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): PublicUser | null {
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as PublicUser; } catch { return null; }
}

export function updateStoredUser(user: PublicUser) { window.localStorage.setItem(USER_KEY, JSON.stringify(user)); }

export function hasSession() { return Boolean(window.localStorage.getItem(TOKEN_KEY)); }

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
