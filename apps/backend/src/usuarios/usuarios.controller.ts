import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../reportes-programados/admin.guard";
import type { AuthenticatedRequest } from "../common/auth-context";
import { UsuariosService } from "./usuarios.service";

@Controller("usuarios")
@UseGuards(AdminGuard)
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}
  @Get() listar(@Query("buscar") buscar: string | undefined) { return this.service.listar(buscar); }
  @Post() crear(@Body() body: { nombre?: unknown; correo?: unknown; rol?: unknown; passwordTemporal?: unknown }, @Req() request: AuthenticatedRequest) { return this.service.crear(body, request.user); }
  @Patch(":id") actualizar(@Param("id") id: string, @Body() body: { nombre?: unknown; correo?: unknown; rol?: unknown }, @Req() request: AuthenticatedRequest) { return this.service.actualizar(id, body, request.user); }
  @Patch(":id/estado") cambiarEstado(@Param("id") id: string, @Body() body: { activo?: unknown }, @Req() request: AuthenticatedRequest) { return this.service.cambiarEstado(id, body.activo === true, request.user); }
  @Post(":id/restablecer-password") restablecer(@Param("id") id: string, @Body() body: { passwordTemporal?: unknown }, @Req() request: AuthenticatedRequest) { return this.service.restablecerPassword(id, body.passwordTemporal, request.user); }
}
