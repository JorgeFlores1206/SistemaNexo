import { Injectable, NotFoundException } from "@nestjs/common";
import { EstadoGeneracionReporte } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../common/auth-context";
import { calcularRegla, fechaSolo, iso } from "../inventario/reglas";
import { FechaNegocioService } from "./fecha-negocio.service";

@Injectable()
export class ReportesProgramadosService {
  constructor(private readonly prisma: PrismaService, private readonly fechas: FechaNegocioService) {}

  async consultar(mesReferencia?: Date) {
    const mes = fechaSolo(mesReferencia ?? this.fechas.primerDiaMesSiguiente(this.fechas.hoy()));
    const reporte = await this.prisma.reporteMensualVencimientos.findUnique({ where: { mesReferencia: mes }, include: { productos: true } });
    if (!reporte) throw new NotFoundException("No existe una generación para el mes solicitado");
    return { mesReferencia: iso(reporte.mesReferencia), fechaNegocio: iso(reporte.fechaNegocio), estadoGeneracion: reporte.estadoGeneracion, cantidadIncluida: reporte.cantidadIncluida, errorMensaje: reporte.errorMensaje, productos: reporte.estadoGeneracion === EstadoGeneracionReporte.GENERADO ? reporte.productos.map((producto) => ({ codigo: producto.codigo, nombre: producto.nombre, politicaDevolucion: producto.politicaDevolucion, fechaEfectiva: iso(producto.fechaEfectiva), vencimientoOriginal: iso(producto.vencimientoOriginal)!, fechaRelevante: iso(producto.fechaRelevante)!, estadoCalculado: producto.estadoCalculado, danado: producto.danado, diasRestantes: producto.diasRestantes })) : [] };
  }

  async generar(fechaNegocio = this.fechas.hoy(), actor?: AuthenticatedUser) {
    const negocio = fechaSolo(fechaNegocio);
    const mes = this.fechas.primerDiaMesSiguiente(negocio);
    const productos = await this.prisma.producto.findMany({ where: { activo: true, vencimientoOriginal: { not: null } } });
    const filas = productos.flatMap((producto) => {
      const regla = calcularRegla(producto, negocio);
      if (!producto.vencimientoOriginal || !regla.prontoAVencer || !regla.fechaRelevante || regla.diasRestantes === null) return [];
      return [{ productoId: producto.id, codigo: producto.codigo, nombre: producto.nombre, politicaDevolucion: producto.politicaDevolucion, fechaEfectiva: regla.fechaEfectiva, vencimientoOriginal: fechaSolo(producto.vencimientoOriginal), fechaRelevante: fechaSolo(regla.fechaRelevante), estadoCalculado: regla.estadoCalculado ?? "", danado: producto.danado, diasRestantes: regla.diasRestantes }];
    });
    const result = await this.prisma.$transaction(async (tx) => {
      const anterior = await tx.reporteMensualVencimientos.findUnique({ where: { mesReferencia: mes } });
      if (anterior) await tx.productoProximoAVencer.deleteMany({ where: { reporteId: anterior.id } });
      const reporte = anterior ? await tx.reporteMensualVencimientos.update({ where: { id: anterior.id }, data: { fechaNegocio: negocio, estadoGeneracion: filas.length ? EstadoGeneracionReporte.GENERADO : EstadoGeneracionReporte.VACIO, cantidadIncluida: filas.length, errorCodigo: null, errorMensaje: null, productos: { create: filas } }, include: { productos: true } }) : await tx.reporteMensualVencimientos.create({ data: { mesReferencia: mes, fechaNegocio: negocio, estadoGeneracion: filas.length ? EstadoGeneracionReporte.GENERADO : EstadoGeneracionReporte.VACIO, cantidadIncluida: filas.length, productos: { create: filas } }, include: { productos: true } });
      await tx.bitacoraReporteMensual.create({ data: { reporteId: reporte.id, mesReferencia: mes, fechaNegocio: negocio, resultado: reporte.estadoGeneracion, cantidadIncluida: reporte.cantidadIncluida } });
      if (actor) await tx.bitacoraEvento.create({ data: { actor: actor.nombre, accion: "Generación de reporte mensual", detalle: `Mes ${iso(mes)}: ${reporte.cantidadIncluida} productos`, resultado: reporte.estadoGeneracion, cuentaAfectada: actor.id } });
      return reporte;
    });
    return { mesReferencia: iso(result.mesReferencia), fechaNegocio: iso(result.fechaNegocio), estadoGeneracion: result.estadoGeneracion, cantidadIncluida: result.cantidadIncluida, errorMensaje: result.errorMensaje, productos: result.productos.map((producto) => ({ codigo: producto.codigo, nombre: producto.nombre, politicaDevolucion: producto.politicaDevolucion, fechaEfectiva: iso(producto.fechaEfectiva), vencimientoOriginal: iso(producto.vencimientoOriginal)!, fechaRelevante: iso(producto.fechaRelevante)!, estadoCalculado: producto.estadoCalculado, danado: producto.danado, diasRestantes: producto.diasRestantes })) };
  }
}
