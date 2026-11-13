import { publicUserSchema, usersResponseSchema, type PublicUser, type UsersResponse } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerUsuarios(buscar?: string): Promise<UsersResponse> { const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ""; return usersResponseSchema.parse(await apiFetch<unknown>(`/usuarios${query}`)); }
export async function crearUsuario(payload: { nombre: string; correo: string; rol: "ADMINISTRADOR" | "USUARIO"; passwordTemporal: string }): Promise<PublicUser> { return publicUserSchema.parse((await apiFetch<{ usuario: unknown }>("/usuarios", { method: "POST", body: JSON.stringify(payload) })).usuario); }
export async function actualizarUsuario(id: string, payload: { nombre: string; correo: string; rol: "ADMINISTRADOR" | "USUARIO" }): Promise<PublicUser> { return publicUserSchema.parse((await apiFetch<{ usuario: unknown }>(`/usuarios/${id}`, { method: "PATCH", body: JSON.stringify(payload) })).usuario); }
export async function cambiarEstadoUsuario(id: string, activo: boolean): Promise<PublicUser> { return publicUserSchema.parse((await apiFetch<{ usuario: unknown }>(`/usuarios/${id}/estado`, { method: "PATCH", body: JSON.stringify({ activo }) })).usuario); }
export async function restablecerPasswordUsuario(id: string, passwordTemporal: string): Promise<PublicUser> { return publicUserSchema.parse((await apiFetch<{ usuario: unknown }>(`/usuarios/${id}/restablecer-password`, { method: "POST", body: JSON.stringify({ passwordTemporal }) })).usuario); }
