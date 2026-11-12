import { Injectable, NotFoundException } from "@nestjs/common";
import { EstadoGeneracionReporte } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { FechaNegocioService } from "./fecha-negocio.service";

@Injectable()
export class ReportesProgramadosService {
  constructor(private readonly prisma: PrismaService, private readonly fechas: FechaNegocioService) {}

  async consultar(mesReferencia?: Date) {
    const mes = mesReferencia ?? this.fechas.primerDiaMesSiguiente(this.fechas.hoy());
    const reporte = await this.prisma.reporteMensualVencimientos.findUnique({ where: { mesReferencia: mes }, include: { productos: true } });
    if (!reporte) throw new NotFoundException("No existe una generación para el mes solicitado");
    return { mesReferencia: this.iso(reporte.mesReferencia), fechaNegocio: this.iso(reporte.fechaNegocio), estadoGeneracion: reporte.estadoGeneracion, cantidadIncluida: reporte.cantidadIncluida, errorMensaje: reporte.errorMensaje, productos: reporte.estadoGeneracion === EstadoGeneracionReporte.GENERADO ? reporte.productos.map((p) => ({ ...p, fechaEfectiva: p.fechaEfectiva ? this.iso(p.fechaEfectiva) : null, vencimientoOriginal: this.iso(p.vencimientoOriginal), fechaRelevante: this.iso(p.fechaRelevante) })) : [] };
  }

  async generar(fechaNegocio = this.fechas.hoy()) {
    const mes = this.fechas.primerDiaMesSiguiente(fechaNegocio);
    const productos = await this.prisma.producto.findMany({ where: { vencimientoOriginal: { not: null } } });
    const filas = productos.flatMap((p) => {
      if (!p.vencimientoOriginal) return [];
      const relevante = p.politicaDevolucion && p.fechaEfectiva ? p.fechaEfectiva : p.vencimientoOriginal;
      const dias = this.fechas.diasEntre(fechaNegocio, relevante);
      return dias >= 1 && dias <= 30 ? [{ productoId: p.id, codigo: p.codigo, nombre: p.nombre, politicaDevolucion: p.politicaDevolucion, fechaEfectiva: p.fechaEfectiva, vencimientoOriginal: p.vencimientoOriginal, fechaRelevante: relevante, estadoCalculado: p.estadoCalculado, danado: p.danado, diasRestantes: dias }] : [];
    });
    return this.prisma.$transaction(async (tx) => {
      const reporte = await tx.reporteMensualVencimientos.upsert({ where: { mesReferencia: mes }, create: { mesReferencia: mes, fechaNegocio, estadoGeneracion: filas.length ? EstadoGeneracionReporte.GENERADO : EstadoGeneracionReporte.VACIO, cantidadIncluida: filas.length, productos: { create: filas } }, update: {} , include: { productos: true } });
      await tx.bitacoraReporteMensual.create({ data: { reporteId: reporte.id, mesReferencia: mes, fechaNegocio, resultado: reporte.estadoGeneracion, cantidadIncluida: reporte.cantidadIncluida } });
      return reporte;
    });
  }

  private iso(date: Date): string { return date.toISOString().slice(0, 10); }
}
