import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedRequest } from "../common/auth-context";
import { hashPassword, verifyPassword } from "./password";
import { SessionGuard } from "./guards/session.guard";
import { SessionService } from "./session.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly sessions: SessionService) {}

  @Post("login")
  async login(@Body() body: { correo?: string; password?: string }) {
    const correo = body.correo?.trim().toLowerCase();
    if (!correo || !body.password) throw new UnauthorizedException("Correo o contraseña incorrectos");
    const user = await this.prisma.usuario.findUnique({ where: { correo } });
    if (!user || !user.activo || !(await verifyPassword(body.password, user.passwordHash))) throw new UnauthorizedException("Correo o contraseña incorrectos");
    const session = await this.sessions.create(user.id);
    await this.prisma.usuario.update({ where: { id: user.id }, data: { ultimoAcceso: new Date() } });
    await this.prisma.bitacoraEvento.create({ data: { actor: user.nombre, accion: "Inicio de sesión", detalle: "Acceso al sistema", resultado: "Exitoso", cuentaAfectada: user.id } });
    return { token: session.token, expiraEn: session.expiraEn.toISOString(), usuario: this.publico({ ...user, ultimoAcceso: new Date() }) };
  }

  @Get("me")
  @UseGuards(SessionGuard)
  me(@Req() request: AuthenticatedRequest) {
    return { usuario: request.user, expiraEn: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() };
  }

  @Post("logout")
  @UseGuards(SessionGuard)
  async logout(@Req() request: AuthenticatedRequest) {
    await this.sessions.revoke(request.headers.authorization);
    await this.prisma.bitacoraEvento.create({ data: { actor: request.user.nombre, accion: "Cierre de sesión", detalle: "Sesión finalizada", resultado: "Exitoso", cuentaAfectada: request.user.id } });
    return { cerrado: true };
  }

  private publico(user: { id: string; nombre: string; correo: string; rol: "ADMINISTRADOR" | "USUARIO"; activo: boolean; debeCambiarPassword: boolean; ultimoAcceso: Date | null }) {
    return { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, activo: user.activo, debeCambiarPassword: user.debeCambiarPassword, ultimoAcceso: user.ultimoAcceso?.toISOString() ?? null };
  }
}
