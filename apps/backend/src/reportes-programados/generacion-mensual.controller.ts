import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";
import { BitacoraReportesService } from "./bitacora-reportes.service";
import { GeneracionMensualService } from "./generacion-mensual.service";
import { ReportesProgramadosService } from "./reportes-programados.service";

@Controller("reportes-programados")
@UseGuards(AdminGuard)
export class GeneracionMensualController {
  constructor(private readonly generacion: GeneracionMensualService, private readonly reportes: ReportesProgramadosService, private readonly bitacora: BitacoraReportesService) {}
  @Get("generar") generar() { return this.generacion.generar(); }
  @Get("generaciones/:mesReferencia") resultado(@Param("mesReferencia") mes: string) { return this.reportes.consultar(new Date(`${mes}T00:00:00Z`)); }
  @Get("bitacora") listarBitacora() { return this.bitacora.listar(); }
}
