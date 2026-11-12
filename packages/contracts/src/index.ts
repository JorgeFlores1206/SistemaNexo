import { z } from "zod";

export const sessionResponseSchema = z.object({
  userId: z.string().min(1),
  expiresAt: z.string().datetime(),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;

export const reportGenerationStatusSchema = z.enum(["EN_PROCESO", "GENERADO", "VACIO", "FALLIDO"]);
export type ReportGenerationStatus = z.infer<typeof reportGenerationStatusSchema>;

export const reportProductSchema = z.object({
  codigo: z.string(),
  nombre: z.string(),
  politicaDevolucion: z.string().nullable(),
  fechaEfectiva: z.string().nullable(),
  vencimientoOriginal: z.string(),
  fechaRelevante: z.string(),
  estadoCalculado: z.string(),
  danado: z.boolean(),
  diasRestantes: z.number().int(),
});
export type ReportProduct = z.infer<typeof reportProductSchema>;

export const monthlyReportSchema = z.object({
  mesReferencia: z.string(),
  fechaNegocio: z.string(),
  estadoGeneracion: reportGenerationStatusSchema,
  cantidadIncluida: z.number().int().nonnegative(),
  productos: z.array(reportProductSchema),
  errorMensaje: z.string().nullable().optional(),
});
export type MonthlyReport = z.infer<typeof monthlyReportSchema>;

export const generationResultSchema = monthlyReportSchema.omit({ productos: true });
export type GenerationResult = z.infer<typeof generationResultSchema>;

export const dashboardIndicatorSchema = z.object({
  clave: z.string(), etiqueta: z.string(), cantidad: z.number().int().nonnegative(), disponible: z.boolean(),
});
export type DashboardIndicator = z.infer<typeof dashboardIndicatorSchema>;

export const dashboardProductSchema = z.object({
  codigo: z.string(), nombre: z.string(), estadoCalculado: z.string(), danado: z.boolean(),
  fechaRelevante: z.string().nullable(), onHand: z.number().int(), saldo: z.number().int(), diasRestantes: z.number().int().nullable(),
});
export type DashboardProduct = z.infer<typeof dashboardProductSchema>;

export const dashboardSummarySchema = z.object({
  fechaNegocio: z.string(), indicadores: z.array(dashboardIndicatorSchema), resumenReporteMensual: generationResultSchema.nullable().optional(),
});
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

export const dashboardPrioritySchema = z.object({ indicador: z.string(), fechaNegocio: z.string(), productos: z.array(dashboardProductSchema) });
export type DashboardPriority = z.infer<typeof dashboardPrioritySchema>;

export const inventoryProductSchema = z.object({
  id: z.string(), codigo: z.string(), nombre: z.string(), estadoCalculado: z.string(),
  onHand: z.number().int(), saldo: z.number().int(), trazabilidad: z.string().nullable(),
  uomPrimaria: z.string().nullable(), laboratorio: z.string().nullable(), marca: z.string().nullable(),
  politicaDevolucion: z.string().nullable(), observacion: z.string().nullable(), danado: z.boolean(),
});
export type InventoryProduct = z.infer<typeof inventoryProductSchema>;
export const inventoryResponseSchema = z.object({ productos: z.array(inventoryProductSchema), total: z.number().int().nonnegative() });
export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;

export const userSchema = z.object({ id: z.string(), nombre: z.string(), correo: z.string().email(), rol: z.enum(["ADMINISTRADOR", "USUARIO"]), activo: z.boolean(), ultimoAcceso: z.string().nullable() });
export type User = z.infer<typeof userSchema>;
export const usersResponseSchema = z.object({ usuarios: z.array(userSchema), total: z.number().int().nonnegative() });
export type UsersResponse = z.infer<typeof usersResponseSchema>;

export const permissionMatrixRowSchema = z.object({ modulo: z.string(), accion: z.string(), administrador: z.boolean(), usuario: z.boolean() });
export type PermissionMatrixRow = z.infer<typeof permissionMatrixRowSchema>;
export const permissionMatrixSchema = z.object({ permisos: z.array(permissionMatrixRowSchema) });
export type PermissionMatrix = z.infer<typeof permissionMatrixSchema>;

export const auditEventSchema = z.object({ id: z.string(), fecha: z.string(), actor: z.string(), accion: z.string(), detalle: z.string(), resultado: z.string(), cuentaAfectada: z.string().nullable() });
export type AuditEvent = z.infer<typeof auditEventSchema>;
export const auditResponseSchema = z.object({ eventos: z.array(auditEventSchema), total: z.number().int().nonnegative() });
export type AuditResponse = z.infer<typeof auditResponseSchema>;

export const profileSchema = z.object({ id: z.string(), nombre: z.string(), correo: z.string().email(), rol: z.enum(["ADMINISTRADOR", "USUARIO"]), activo: z.boolean(), debeCambiarPassword: z.boolean(), ultimoAcceso: z.string().nullable() });
export type Profile = z.infer<typeof profileSchema>;
