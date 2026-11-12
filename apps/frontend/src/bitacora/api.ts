import { auditResponseSchema, type AuditResponse } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerBitacora(buscar?: string): Promise<AuditResponse> { const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ""; return auditResponseSchema.parse(await apiFetch<unknown>(`/bitacora${query}`)); }
