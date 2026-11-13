import { monthlyReportSchema, type MonthlyReport } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerReporte(mesReferencia?: string): Promise<MonthlyReport> {
  const query = mesReferencia ? `?mesReferencia=${encodeURIComponent(mesReferencia)}` : "";
  return monthlyReportSchema.parse(await apiFetch<unknown>(`/reportes-programados/vencimientos${query}`));
}
export async function generarReporte(): Promise<MonthlyReport> { return monthlyReportSchema.parse(await apiFetch<unknown>("/reportes-programados/generar", { method: "POST" })); }
