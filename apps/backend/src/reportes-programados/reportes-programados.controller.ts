import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";
import { ReportesProgramadosService } from "./reportes-programados.service";

@Controller("reportes-programados")
@UseGuards(AdminGuard)
export class ReportesProgramadosController {
  constructor(private readonly service: ReportesProgramadosService) {}
  @Get("vencimientos") consultar(@Query("mesReferencia") mes?: string) { return this.service.consultar(mes ? new Date(`${mes}T00:00:00Z`) : undefined); }
}
