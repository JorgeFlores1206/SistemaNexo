import { authLoginResponseSchema, sessionResponseSchema, type AuthLoginResponse, type SessionResponse } from "@nexo/contracts";
import { apiFetch, clearSession, saveSession } from "../api/client";

export async function iniciarSesion(correo: string, password: string): Promise<AuthLoginResponse> {
  const result = authLoginResponseSchema.parse(await apiFetch<unknown>("/auth/login", { method: "POST", body: JSON.stringify({ correo, password }) }));
  saveSession(result.token, result.usuario);
  return result;
}

export async function obtenerSesion(): Promise<SessionResponse> { return sessionResponseSchema.parse(await apiFetch<unknown>("/auth/me")); }
export async function cerrarSesion() { try { await apiFetch<{ cerrado: boolean }>("/auth/logout", { method: "POST" }); } finally { clearSession(); } }
