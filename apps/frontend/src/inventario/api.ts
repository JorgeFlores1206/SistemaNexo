import { adjustmentsResponseSchema, importPreviewSchema, importResultSchema, inventoryResponseSchema, productMutationResponseSchema, type AdjustmentsResponse, type ImportPreview, type ImportResult, type InventoryResponse, type ProductMutationResponse } from "@nexo/contracts";
import { apiDownload, apiFetch } from "../api/client";

export type InventoryQuery = { buscar?: string; estado?: string; pagina?: number; porPagina?: number; ordenar?: string; direccion?: "asc" | "desc" };

export async function obtenerInventario(query: InventoryQuery = {}): Promise<InventoryResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== "") params.set(key, String(value));
  return inventoryResponseSchema.parse(await apiFetch<unknown>(`/inventario${params.size ? `?${params.toString()}` : ""}`));
}

export async function obtenerProducto(id: string): Promise<ProductMutationResponse> { return productMutationResponseSchema.parse(await apiFetch<unknown>(`/inventario/${id}`)); }
export async function crearProducto(payload: Record<string, unknown>): Promise<ProductMutationResponse> { return productMutationResponseSchema.parse(await apiFetch<unknown>("/inventario", { method: "POST", body: JSON.stringify(payload) })); }
export async function actualizarProducto(id: string, payload: Record<string, unknown>): Promise<ProductMutationResponse> { return productMutationResponseSchema.parse(await apiFetch<unknown>(`/inventario/${id}`, { method: "PATCH", body: JSON.stringify(payload) })); }
export async function ajustarSaldo(id: string, saldoNuevo: number, motivo: string, version: number): Promise<ProductMutationResponse> { return productMutationResponseSchema.parse(await apiFetch<unknown>(`/inventario/${id}/ajuste`, { method: "POST", body: JSON.stringify({ saldoNuevo, motivo, version }) })); }
export async function obtenerAjustes(query: { buscar?: string; desde?: string; hasta?: string } = {}): Promise<AdjustmentsResponse> { const params = new URLSearchParams(query); return adjustmentsResponseSchema.parse(await apiFetch<unknown>(`/inventario/ajustes${params.size ? `?${params.toString()}` : ""}`)); }
export async function previsualizarImportacion(archivo: string, hoja?: string): Promise<ImportPreview> { return importPreviewSchema.parse(await apiFetch<unknown>("/inventario/importar/previsualizar", { method: "POST", body: JSON.stringify({ archivo, hoja }) })); }
export async function importarExcel(nombreArchivo: string, archivo: string, hoja: string): Promise<ImportResult> { return importResultSchema.parse(await apiFetch<unknown>("/inventario/importar", { method: "POST", body: JSON.stringify({ nombreArchivo, archivo, hoja }) })); }
export async function exportarInventario(query: InventoryQuery = {}): Promise<Blob> { const params = new URLSearchParams(); for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== "") params.set(key, String(value)); return apiDownload(`/inventario/exportar${params.size ? `?${params.toString()}` : ""}`); }
