import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { AuthenticatedRequest } from "../common/auth-context";
import { PerfilGuard } from "./perfil.guard";
import { PerfilService } from "./perfil.service";

@Controller("perfil")
@UseGuards(PerfilGuard)
export class PerfilController {
  constructor(private readonly service: PerfilService) {}
  @Get() obtener(@Req() request: AuthenticatedRequest) { return this.service.obtener(request.user); }
  @Patch() actualizar(@Req() request: AuthenticatedRequest, @Body() body: { nombre?: unknown; correo?: unknown }) { return this.service.actualizar(request.user, body.nombre, body.correo); }
  @Post("password") cambiarPassword(@Req() request: AuthenticatedRequest, @Body() body: { actual?: unknown; nueva?: unknown; confirmacion?: unknown }) { return this.service.cambiarPassword(request.user, body.actual, body.nueva, body.confirmacion, request.sessionId); }
}
