import { usersResponseSchema, type UsersResponse } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerUsuarios(buscar?: string): Promise<UsersResponse> { const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ""; return usersResponseSchema.parse(await apiFetch<unknown>(`/usuarios${query}`)); }
