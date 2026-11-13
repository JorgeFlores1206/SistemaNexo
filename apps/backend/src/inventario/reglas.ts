export const ESTADOS = ["Neutro", "Ofertar", "Vencido + Devolución", "Vencido + Ofertar"] as const;
export type EstadoCalculado = typeof ESTADOS[number];
export const POLITICAS = ["En el mes", "1 mes antes", "2 meses antes", "3 meses antes", "producto fisico suc", "sin devolucio", "sin devolucion", "vacia", "N#D", "#N/D"] as const;
export type PoliticaDevolucion = typeof POLITICAS[number];

export function esPoliticaDevolucion(value: string): boolean {
  const normalizada = value.toLocaleLowerCase("es");
  return POLITICAS.some((policy) => policy.toLocaleLowerCase("es") === normalizada);
}

export type ProductoConFechas = {
  id?: string;
  codigo: string;
  nombre: string;
  politicaDevolucion: string | null;
  vencimientoOriginal: Date | null;
  fechaEfectiva?: Date | null;
  estadoCalculado?: string | null;
  danado: boolean;
  onHand: number | null;
  saldo: number | null;
  activo?: boolean;
  version?: number;
  arqueo?: string | null;
  uomPrimaria?: string | null;
  laboratorio?: string | null;
  marca?: string | null;
};

export type ResultadoRegla = {
  fechaEfectiva: Date | null;
  estadoCalculado: EstadoCalculado | null;
  fechaRelevante: Date | null;
  diasRestantes: number | null;
  prontoAVencer: boolean;
};

export function fechaSolo(fecha: Date): Date {
  return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
}

export function iso(fecha: Date | null | undefined): string | null {
  return fecha ? fechaSolo(fecha).toISOString().slice(0, 10) : null;
}

export function calcularFechaEfectiva(vencimiento: Date | null, politica: string | null): Date | null {
  if (!vencimiento) return null;
  const original = fechaSolo(vencimiento);
  const normalizada = politica?.toLocaleLowerCase("es") ?? "";
  if (normalizada === "en el mes") return new Date(Date.UTC(original.getUTCFullYear(), original.getUTCMonth(), 1));
  const match = /^(1|2|3) mes(?:es)? antes$/.exec(normalizada);
  if (!match) return null;
  const meses = Number(match[1]);
  const targetMonth = original.getUTCMonth() - meses;
  const targetYear = original.getUTCFullYear() + Math.floor(targetMonth / 12);
  const month = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, month, Math.min(original.getUTCDate(), lastDay)));
}

export function diasEntre(desde: Date, hasta: Date): number {
  return Math.round((fechaSolo(hasta).getTime() - fechaSolo(desde).getTime()) / 86400000);
}

export function calcularRegla(producto: ProductoConFechas, referencia: Date): ResultadoRegla {
  const fechaVencimiento = producto.vencimientoOriginal ? fechaSolo(producto.vencimientoOriginal) : null;
  const fechaEfectiva = calcularFechaEfectiva(fechaVencimiento, producto.politicaDevolucion);
  if (!fechaVencimiento) return { fechaEfectiva, estadoCalculado: null, fechaRelevante: null, diasRestantes: null, prontoAVencer: false };
  const fecha = fechaSolo(referencia);
  const relevante = fechaEfectiva ?? fechaVencimiento;
  const diasRestantes = diasEntre(fecha, relevante);
  let estadoCalculado: EstadoCalculado;
  if (fechaEfectiva) {
    estadoCalculado = fecha < fechaEfectiva ? "Neutro" : fecha <= fechaVencimiento ? "Vencido + Devolución" : "Vencido + Ofertar";
  } else {
    estadoCalculado = fecha <= fechaVencimiento ? "Ofertar" : "Vencido + Ofertar";
  }
  return { fechaEfectiva, estadoCalculado, fechaRelevante: relevante, diasRestantes, prontoAVencer: diasRestantes >= 1 && diasRestantes <= 30 };
}

export function parseDateInput(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const parts = value.split("/").map(Number);
  const day = parts[0] ?? 0;
  const month = parts[1] ?? 0;
  const year = parts[2] ?? 0;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

export function parseDateQuery(value: string | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parts = value.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 0;
  const day = parts[2] ?? 0;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}
