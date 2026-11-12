import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { DashboardAccessGuard } from "./dashboard-access.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(DashboardAccessGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}
  @Get("resumen") resumen(@Req() request: { headers: Record<string, string | undefined> }) { return this.service.resumen(request.headers["x-role"] ?? ""); }
  @Get("prioridades/:indicador") prioridad(@Param("indicador") indicador: string, @Req() request: { headers: Record<string, string | undefined> }) { return this.service.prioridad(indicador, request.headers["x-role"] ?? ""); }
}
