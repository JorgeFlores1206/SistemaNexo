import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../common/auth-context";
import { fechaSolo, calcularRegla, iso, ESTADOS } from "../inventario/reglas";
import { FechaNegocioService } from "../reportes-programados/fecha-negocio.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService, private readonly fechas: FechaNegocioService) {}

  async resumen(user: AuthenticatedUser) {
    this.requireAccess(user);
    const fecha = this.fechas.hoy();
    const productos = await this.prisma.producto.findMany({ where: { activo: true } });
    const calculados = productos.map((producto) => ({ producto, regla: calcularRegla(producto, fecha) }));
    const indicadores = [
      ...ESTADOS.map((estado) => ({ clave: estado, etiqueta: estado, cantidad: calculados.filter(({ regla }) => regla.estadoCalculado === estado).length, disponible: true, tipo: "estado" as const })),
      { clave: "PRONTO_A_VENCER", etiqueta: "Pronto a vencer", cantidad: calculados.filter(({ regla }) => regla.prontoAVencer).length, disponible: true, tipo: "alerta" as const },
      { clave: "DANADO", etiqueta: "Dañado", cantidad: calculados.filter(({ producto }) => producto.danado).length, disponible: true, tipo: "condicion" as const },
      { clave: "SIN_CLASIFICAR", etiqueta: "Sin fecha de vencimiento", cantidad: calculados.filter(({ regla }) => !regla.estadoCalculado).length, disponible: true, tipo: "administrativo" as const },
      { clave: "ON_HAND", etiqueta: "On hand", cantidad: calculados.reduce((total, { producto }) => total + (producto.onHand ?? 0), 0), disponible: true, tipo: "cantidad" as const },
      { clave: "SALDO", etiqueta: "Saldo", cantidad: calculados.reduce((total, { producto }) => total + (producto.saldo ?? 0), 0), disponible: true, tipo: "cantidad" as const },
    ];
    let resumenReporteMensual = null;
    if (user.rol === "ADMINISTRADOR") {
      const mes = this.fechas.primerDiaMesSiguiente(fecha);
      const reporte = await this.prisma.reporteMensualVencimientos.findUnique({ where: { mesReferencia: mes } });
      if (reporte) resumenReporteMensual = { mesReferencia: iso(reporte.mesReferencia), fechaNegocio: iso(reporte.fechaNegocio), estadoGeneracion: reporte.estadoGeneracion, cantidadIncluida: reporte.cantidadIncluida };
    }
    return { fechaNegocio: iso(fecha), totalProductos: productos.length, indicadores, resumenReporteMensual };
  }

  async prioridad(indicador: string, user: AuthenticatedUser) {
    this.requireAccess(user);
    const fecha = this.fechas.hoy();
    const productos = await this.prisma.producto.findMany({ where: { activo: true } });
    const seleccionados = productos.map((producto) => ({ producto, regla: calcularRegla(producto, fecha) })).filter(({ producto, regla }) => {
      if (indicador === "PRONTO_A_VENCER") return regla.prontoAVencer;
      if (indicador === "DANADO") return producto.danado;
      if (indicador === "SIN_CLASIFICAR") return !regla.estadoCalculado;
      if (indicador === "ON_HAND" || indicador === "SALDO") return true;
      return ESTADOS.includes(indicador as typeof ESTADOS[number]) && regla.estadoCalculado === indicador;
    });
    seleccionados.sort((a, b) => {
      if (indicador === "ON_HAND") return (b.producto.onHand ?? -1) - (a.producto.onHand ?? -1);
      if (indicador === "SALDO") return (b.producto.saldo ?? -1) - (a.producto.saldo ?? -1);
      return (a.regla.fechaRelevante?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.regla.fechaRelevante?.getTime() ?? Number.MAX_SAFE_INTEGER);
    });
    return { indicador, fechaNegocio: iso(fecha), productos: seleccionados.map(({ producto, regla }) => ({ id: producto.id, codigo: producto.codigo, nombre: producto.nombre, estadoCalculado: regla.estadoCalculado, danado: producto.danado, fechaEfectiva: iso(regla.fechaEfectiva), vencimientoOriginal: iso(producto.vencimientoOriginal), fechaRelevante: iso(regla.fechaRelevante), onHand: producto.onHand, saldo: producto.saldo, diasRestantes: regla.diasRestantes, prontoAVencer: regla.prontoAVencer })) };
  }

  private requireAccess(user: AuthenticatedUser) { if (user.rol !== "ADMINISTRADOR" && user.rol !== "USUARIO") throw new ForbiddenException(); }
}
