import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import type { AuthenticatedRequest } from "../common/auth-context";
import { DashboardAccessGuard } from "./dashboard-access.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(DashboardAccessGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}
  @Get("resumen") resumen(@Req() request: AuthenticatedRequest) { return this.service.resumen(request.user); }
  @Get("prioridades/:indicador") prioridad(@Param("indicador") indicador: string, @Req() request: AuthenticatedRequest) { return this.service.prioridad(indicador, request.user); }
}
