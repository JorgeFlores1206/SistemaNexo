import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { DashboardAccessGuard } from "../dashboard/dashboard-access.guard";
import { InventarioService } from "./inventario.service";

@Controller("inventario")
@UseGuards(DashboardAccessGuard)
export class InventarioController {
  constructor(private readonly service: InventarioService) {}
  @Get()
  listar(@Query("buscar") buscar?: string, @Query("estado") estado?: string, @Req() request?: { headers: Record<string, string | undefined> }) {
    return this.service.listar(buscar, estado, request?.headers["x-role"] ?? "");
  }
}
