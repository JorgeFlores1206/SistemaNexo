import { permissionMatrixSchema, type PermissionMatrix } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerMatrizPermisos(): Promise<PermissionMatrix> { return permissionMatrixSchema.parse(await apiFetch<unknown>("/roles/permisos")); }
