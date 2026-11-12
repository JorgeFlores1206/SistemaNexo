import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PerfilGuard } from "./perfil.guard";
import { PerfilService } from "./perfil.service";

@Controller("perfil")
@UseGuards(PerfilGuard)
export class PerfilController {
  constructor(private readonly service: PerfilService) {}
  @Get() obtener(@Req() request: { headers: Record<string, string | undefined> }) { return this.service.obtener(request.headers["x-user-id"]!); }
  @Patch() actualizar(@Req() request: { headers: Record<string, string | undefined> }, @Body() body: { nombre: string; correo: string }) { return this.service.actualizar(request.headers["x-user-id"]!, body.nombre, body.correo); }
  @Post("password") cambiarPassword(@Req() request: { headers: Record<string, string | undefined> }, @Body() body: { nueva: string; confirmacion: string }) { return this.service.cambiarPassword(request.headers["x-user-id"]!, body.nueva, body.confirmacion); }
}
