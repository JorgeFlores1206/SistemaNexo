import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { BitacoraService } from "./bitacora.service";
import type { AuthenticatedRequest } from "../common/auth-context";

@Controller("bitacora")
@UseGuards(AdminGuard)
export class BitacoraController {
  constructor(private readonly service: BitacoraService) {}
  @Get()
  listar(@Query("buscar") buscar: string | undefined, @Req() request: AuthenticatedRequest) { return this.service.listar(buscar, request.user); }
}
