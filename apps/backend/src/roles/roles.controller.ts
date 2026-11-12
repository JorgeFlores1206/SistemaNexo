import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { RolesService } from "./roles.service";

@Controller("roles")
@UseGuards(AdminGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}
  @Get("permisos") listar() { return this.service.listar(); }
}
