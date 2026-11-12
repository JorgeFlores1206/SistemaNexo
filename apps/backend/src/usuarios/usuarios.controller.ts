import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { DashboardAccessGuard } from "../dashboard/dashboard-access.guard";
import { UsuariosService } from "./usuarios.service";

@Controller("usuarios")
@UseGuards(DashboardAccessGuard)
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}
  @Get()
  listar(@Query("buscar") buscar: string | undefined, @Req() request: { headers: Record<string, string | undefined> }) { return this.service.listar(buscar, request.headers["x-role"] ?? ""); }
}
