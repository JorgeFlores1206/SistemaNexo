import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { BitacoraService } from "./bitacora.service";

@Controller("bitacora")
@UseGuards(AdminGuard)
export class BitacoraController {
  constructor(private readonly service: BitacoraService) {}
  @Get()
  listar(@Query("buscar") buscar: string | undefined, @Req() request: { headers: Record<string, string | undefined> }) { return this.service.listar(buscar, request.headers["x-role"] ?? ""); }
}
