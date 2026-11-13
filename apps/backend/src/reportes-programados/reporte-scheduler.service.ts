import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { fechaSolo, iso } from "../inventario/reglas";
import { FechaNegocioService } from "./fecha-negocio.service";
import { ReportesProgramadosService } from "./reportes-programados.service";

@Injectable()
export class ReporteSchedulerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private timer: NodeJS.Timeout | undefined;

  constructor(private readonly prisma: PrismaService, private readonly fechas: FechaNegocioService, private readonly reportes: ReportesProgramadosService) {}

  async onApplicationBootstrap() {
    await this.generarSiCorresponde();
    this.timer = setInterval(() => { void this.generarSiCorresponde(); }, 6 * 60 * 60 * 1000);
  }

  onApplicationShutdown() { if (this.timer) clearInterval(this.timer); }

  private async generarSiCorresponde() {
    const fecha = this.fechas.hoy();
    if (!this.esUltimoDiaDelMes(fecha)) return;
    const mes = this.fechas.primerDiaMesSiguiente(fecha);
    const existente = await this.prisma.reporteMensualVencimientos.findUnique({ where: { mesReferencia: mes } });
    if (existente && iso(existente.fechaNegocio) === iso(fecha)) return;
    try { await this.reportes.generar(fecha); } catch { /* La consulta manual permite reintentar una generación fallida. */ }
  }

  private esUltimoDiaDelMes(fecha: Date) {
    const siguiente = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate() + 1));
    return siguiente.getUTCMonth() !== fecha.getUTCMonth();
  }
}
