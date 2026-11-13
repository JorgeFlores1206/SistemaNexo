import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SessionService } from "../auth/session.service";
import { hashPassword, verifyPassword } from "../auth/password";
import type { AuthenticatedUser } from "../common/auth-context";

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService, private readonly sessions: SessionService) {}

  async obtener(user: AuthenticatedUser) {
    const account = await this.prisma.usuario.findUnique({ where: { id: user.id } });
    if (!account) throw new NotFoundException("Cuenta no encontrada");
    return this.publico(account);
  }

  async actualizar(user: AuthenticatedUser, nombre: unknown, correo: unknown) {
    const nombreText = typeof nombre === "string" ? nombre.trim() : "";
    const correoText = typeof correo === "string" ? correo.trim().toLowerCase() : "";
    if (!nombreText || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoText)) throw new BadRequestException("Nombre y correo son obligatorios y válidos");
    try {
      const account = await this.prisma.usuario.update({ where: { id: user.id }, data: { nombre: nombreText, correo: correoText } });
      await this.audit(user, "Actualización de perfil", "Datos personales actualizados", "Exitoso");
      return this.publico(account);
    } catch (error) {
      if (this.isUniqueError(error)) throw new BadRequestException("El correo ya está registrado");
      throw error;
    }
  }

  async cambiarPassword(user: AuthenticatedUser, actual: unknown, nueva: unknown, confirmacion: unknown, sessionId: string) {
    const account = await this.prisma.usuario.findUnique({ where: { id: user.id } });
    if (!account) throw new NotFoundException("Cuenta no encontrada");
    if (!account.debeCambiarPassword && !(await verifyPassword(typeof actual === "string" ? actual : "", account.passwordHash))) throw new UnauthorizedException("La contraseña vigente no coincide");
    if (typeof nueva !== "string" || nueva.length < 12 || nueva !== confirmacion) throw new BadRequestException("La contraseña debe tener al menos 12 caracteres y coincidir");
    const updated = await this.prisma.usuario.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(nueva), debeCambiarPassword: false } });
    await this.sessions.revokeOtherUserSessions(user.id, sessionId);
    await this.audit(user, "Cambio de contraseña", "Contraseña actualizada", "Exitoso");
    return { actualizado: true, usuario: this.publico(updated) };
  }

  private publico(user: { id: string; nombre: string; correo: string; rol: "ADMINISTRADOR" | "USUARIO"; activo: boolean; debeCambiarPassword: boolean; ultimoAcceso: Date | null }) { return { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, activo: user.activo, debeCambiarPassword: user.debeCambiarPassword, ultimoAcceso: user.ultimoAcceso?.toISOString() ?? null }; }
  private async audit(actor: AuthenticatedUser, accion: string, detalle: string, resultado: string) { await this.prisma.bitacoraEvento.create({ data: { actor: actor.nombre, accion, detalle, resultado, cuentaAfectada: actor.id } }); }
  private isUniqueError(error: unknown): boolean { return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002"; }
}
