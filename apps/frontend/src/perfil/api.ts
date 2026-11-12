import { profileSchema, type Profile } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerPerfil(): Promise<Profile> { return profileSchema.parse(await apiFetch<unknown>("/perfil")); }
export async function actualizarPerfil(nombre: string, correo: string): Promise<Profile> { return profileSchema.parse(await apiFetch<unknown>("/perfil", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre, correo }) })); }
export async function cambiarPassword(nueva: string, confirmacion: string) { return apiFetch<{ actualizado: boolean }>("/perfil/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nueva, confirmacion }) }); }
