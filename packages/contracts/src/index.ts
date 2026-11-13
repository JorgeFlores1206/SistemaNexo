import { z } from "zod";

export const POLITICAS = ["En el mes", "1 mes antes", "2 meses antes", "3 meses antes", "producto fisico suc", "sin devolucio", "sin devolucion", "vacia", "N#D", "#N/D"] as const;
export type PoliticaDevolucion = typeof POLITICAS[number];

export const roleSchema = z.enum(["ADMINISTRADOR", "USUARIO"]);
export type Role = z.infer<typeof roleSchema>;

export const publicUserSchema = z.object({
  id: z.string().min(1),
  nombre: z.string(),
  correo: z.string().email(),
  rol: roleSchema,
  activo: z.boolean(),
  debeCambiarPassword: z.boolean().optional(),
  ultimoAcceso: z.string().nullable(),
});
export type PublicUser = z.infer<typeof publicUserSchema>;
export type User = PublicUser;

export const authLoginResponseSchema = z.object({
  token: z.string().min(1),
  expiraEn: z.string().datetime(),
  usuario: publicUserSchema,
});
export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;

export const sessionResponseSchema = z.object({
  usuario: publicUserSchema,
  expiraEn: z.string().datetime(),
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
  estadoCalculado: z.string().nullable(),
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
  clave: z.string(),
  etiqueta: z.string(),
  cantidad: z.number().int().nonnegative(),
  disponible: z.boolean(),
  tipo: z.enum(["estado", "alerta", "condicion", "cantidad", "administrativo"]).optional(),
});
export type DashboardIndicator = z.infer<typeof dashboardIndicatorSchema>;

export const dashboardProductSchema = z.object({
  id: z.string().optional(),
  codigo: z.string(),
  nombre: z.string(),
  estadoCalculado: z.string().nullable(),
  danado: z.boolean(),
  fechaEfectiva: z.string().nullable().optional(),
  vencimientoOriginal: z.string().nullable().optional(),
  fechaRelevante: z.string().nullable(),
  onHand: z.number().int().nonnegative().nullable(),
  saldo: z.number().int().nonnegative().nullable(),
  diasRestantes: z.number().int().nullable(),
  prontoAVencer: z.boolean().optional(),
});
export type DashboardProduct = z.infer<typeof dashboardProductSchema>;

export const dashboardSummarySchema = z.object({
  fechaNegocio: z.string(),
  totalProductos: z.number().int().nonnegative(),
  indicadores: z.array(dashboardIndicatorSchema),
  resumenReporteMensual: generationResultSchema.nullable().optional(),
});
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

export const dashboardPrioritySchema = z.object({
  indicador: z.string(),
  fechaNegocio: z.string(),
  productos: z.array(dashboardProductSchema),
});
export type DashboardPriority = z.infer<typeof dashboardPrioritySchema>;

export const inventoryProductSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  nombre: z.string(),
  estadoCalculado: z.string().nullable(),
  fechaEfectiva: z.string().nullable(),
  vencimientoOriginal: z.string().nullable(),
  diasRestantes: z.number().int().nullable(),
  prontoAVencer: z.boolean(),
  onHand: z.number().int().nonnegative().nullable(),
  saldo: z.number().int().nonnegative().nullable(),
  arqueo: z.string().nullable(),
  uomPrimaria: z.string().nullable(),
  laboratorio: z.string().nullable(),
  marca: z.string().nullable(),
  politicaDevolucion: z.string().nullable(),
  danado: z.boolean(),
  activo: z.boolean(),
  version: z.number().int().positive(),
});
export type InventoryProduct = z.infer<typeof inventoryProductSchema>;

export const inventoryResponseSchema = z.object({
  productos: z.array(inventoryProductSchema),
  total: z.number().int().nonnegative(),
  pagina: z.number().int().positive(),
  porPagina: z.number().int().positive(),
  totalPaginas: z.number().int().nonnegative(),
  fechaNegocio: z.string(),
});
export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;

export const productMutationResponseSchema = z.object({ producto: inventoryProductSchema });
export type ProductMutationResponse = z.infer<typeof productMutationResponseSchema>;

export const importIssueSchema = z.object({
  fila: z.number().int().positive(),
  campo: z.string().nullable(),
  motivo: z.string(),
});
export type ImportIssue = z.infer<typeof importIssueSchema>;

export const importPreviewSchema = z.object({
  hojas: z.array(z.string()),
  hojaSeleccionada: z.string(),
  encabezados: z.array(z.string()),
  filasEstimadas: z.number().int().nonnegative(),
});
export type ImportPreview = z.infer<typeof importPreviewSchema>;

export const importResultSchema = z.object({
  archivo: z.string(),
  hoja: z.string(),
  filasLeidas: z.number().int().nonnegative(),
  importadas: z.number().int().nonnegative(),
  rechazadas: z.number().int().nonnegative(),
  vacias: z.number().int().nonnegative(),
  incompletas: z.boolean(),
  errores: z.array(importIssueSchema),
  advertencias: z.array(importIssueSchema),
});
export type ImportResult = z.infer<typeof importResultSchema>;

export const usersResponseSchema = z.object({ usuarios: z.array(publicUserSchema), total: z.number().int().nonnegative() });
export type UsersResponse = z.infer<typeof usersResponseSchema>;

export const permissionMatrixRowSchema = z.object({ modulo: z.string(), accion: z.string(), administrador: z.boolean(), usuario: z.boolean() });
export type PermissionMatrixRow = z.infer<typeof permissionMatrixRowSchema>;
export const permissionMatrixSchema = z.object({ permisos: z.array(permissionMatrixRowSchema) });
export type PermissionMatrix = z.infer<typeof permissionMatrixSchema>;

export const auditEventSchema = z.object({ id: z.string(), fecha: z.string(), actor: z.string(), accion: z.string(), detalle: z.string(), resultado: z.string(), cuentaAfectada: z.string().nullable() });
export type AuditEvent = z.infer<typeof auditEventSchema>;
export const auditResponseSchema = z.object({ eventos: z.array(auditEventSchema), total: z.number().int().nonnegative() });
export type AuditResponse = z.infer<typeof auditResponseSchema>;

export const profileSchema = publicUserSchema.extend({ debeCambiarPassword: z.boolean() });
export type Profile = z.infer<typeof profileSchema>;

export const adjustmentSchema = z.object({
  id: z.string(),
  productoId: z.string(),
  codigo: z.string(),
  nombre: z.string(),
  saldoAnterior: z.number().int().nonnegative(),
  saldoNuevo: z.number().int().nonnegative(),
  motivo: z.string(),
  fecha: z.string(),
  actor: z.string(),
});
export type InventoryAdjustment = z.infer<typeof adjustmentSchema>;
export const adjustmentsResponseSchema = z.object({ ajustes: z.array(adjustmentSchema), total: z.number().int().nonnegative() });
export type AdjustmentsResponse = z.infer<typeof adjustmentsResponseSchema>;
