import { inventoryResponseSchema, type InventoryResponse } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerInventario(buscar?: string, estado?: string): Promise<InventoryResponse> {
  const query = new URLSearchParams();
  if (buscar) query.set("buscar", buscar);
  if (estado && estado !== "Todos los estados") query.set("estado", estado);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return inventoryResponseSchema.parse(await apiFetch<unknown>(`/inventario${suffix}`));
}
