import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FechaNegocioService } from "../reportes-programados/fecha-negocio.service";

const estados = ["Neutro", "Ofertar", "Vencido + Devolución", "Vencido + Ofertar"] as const;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService, private readonly fechas: FechaNegocioService) {}

  async resumen(rol: string) {
    const fecha = this.fechas.hoy();
    const productos = await this.prisma.producto.findMany();
    const indicadores: Array<{ clave: string; etiqueta: string; cantidad: number; disponible: boolean }> = estados.map((estado) => ({ clave: estado, etiqueta: estado, cantidad: productos.filter((p) => p.estadoCalculado === estado).length, disponible: true }));
    const proximos = productos.filter((p) => this.diasRestantes(p, fecha) !== null && (this.diasRestantes(p, fecha) as number) >= 1 && (this.diasRestantes(p, fecha) as number) <= 30);
    indicadores.push({ clave: "PRONTO_A_VENCER", etiqueta: "Pronto a vencer", cantidad: proximos.length, disponible: true });
    indicadores.push({ clave: "DANADO", etiqueta: "Dañado", cantidad: productos.filter((p) => p.danado).length, disponible: true });
    indicadores.push({ clave: "ON_HAND", etiqueta: "On hand", cantidad: productos.reduce((total, p) => total + p.onHand, 0), disponible: true });
    indicadores.push({ clave: "SALDO", etiqueta: "Saldo", cantidad: productos.reduce((total, p) => total + p.saldo, 0), disponible: true });
    let resumenReporteMensual = null;
    if (rol === "Administrador") {
      const mes = this.fechas.primerDiaMesSiguiente(fecha);
      const reporte = await this.prisma.reporteMensualVencimientos.findUnique({ where: { mesReferencia: mes } });
      if (reporte) resumenReporteMensual = { mesReferencia: this.iso(reporte.mesReferencia), fechaNegocio: this.iso(reporte.fechaNegocio), estadoGeneracion: reporte.estadoGeneracion, cantidadIncluida: reporte.cantidadIncluida };
    }
    return { fechaNegocio: this.iso(fecha), indicadores, resumenReporteMensual };
  }

  async prioridad(indicador: string, rol: string) {
    if (rol !== "Administrador" && rol !== "Usuario") throw new ForbiddenException();
    const fecha = this.fechas.hoy();
    const productos = await this.prisma.producto.findMany();
    const seleccionados = productos.filter((p) => {
      const dias = this.diasRestantes(p, fecha);
      return indicador === "PRONTO_A_VENCER" ? dias !== null && dias >= 1 && dias <= 30 : indicador === "DANADO" ? p.danado : estados.includes(indicador as typeof estados[number]) && p.estadoCalculado === indicador;
    }).sort((a, b) => (this.diasRestantes(a, fecha) ?? 99999) - (this.diasRestantes(b, fecha) ?? 99999));
    return { indicador, fechaNegocio: this.iso(fecha), productos: seleccionados.map((p) => ({ codigo: p.codigo, nombre: p.nombre, estadoCalculado: p.estadoCalculado, danado: p.danado, fechaRelevante: p.vencimientoOriginal ? this.iso(p.fechaEfectiva ?? p.vencimientoOriginal) : null, onHand: p.onHand, saldo: p.saldo, diasRestantes: this.diasRestantes(p, fecha) })) };
  }

  private diasRestantes(producto: { fechaEfectiva: Date | null; vencimientoOriginal: Date | null; politicaDevolucion: string | null }, fecha: Date): number | null { const relevante = producto.politicaDevolucion && producto.fechaEfectiva ? producto.fechaEfectiva : producto.vencimientoOriginal; return relevante ? this.fechas.diasEntre(fecha, relevante) : null; }
  private iso(date: Date): string { return date.toISOString().slice(0, 10); }
}
