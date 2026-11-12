import { dashboardPrioritySchema, dashboardSummarySchema, type DashboardPriority, type DashboardSummary } from "@nexo/contracts";
import { apiFetch } from "../api/client";

export async function obtenerResumenDashboard(): Promise<DashboardSummary> { return dashboardSummarySchema.parse(await apiFetch<unknown>("/dashboard/resumen")); }
export async function obtenerPrioridad(indicador: string): Promise<DashboardPriority> { return dashboardPrioritySchema.parse(await apiFetch<unknown>(`/dashboard/prioridades/${encodeURIComponent(indicador)}`)); }
