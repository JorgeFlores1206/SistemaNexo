import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SessionService } from "../auth/session.service";
import { hashPassword } from "../auth/password";
import type { AuthenticatedUser } from "../common/auth-context";

type Role = "ADMINISTRADOR" | "USUARIO";

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService, private readonly sessions: SessionService) {}

  async listar(buscar: string | undefined) {
    const text = buscar?.trim();
    const usuarios = await this.prisma.usuario.findMany({ where: text ? { OR: [{ nombre: { contains: text } }, { correo: { contains: text.toLowerCase() } }] } : undefined, orderBy: { nombre: "asc" } });
    return { total: usuarios.length, usuarios: usuarios.map((usuario) => this.publico(usuario)) };
  }

  async crear(body: { nombre?: unknown; correo?: unknown; rol?: unknown; passwordTemporal?: unknown }, actor: AuthenticatedUser) {
    const nombre = this.requiredText(body.nombre, "Nombre");
    const correo = this.email(body.correo);
    const rol = this.role(body.rol);
    const passwordTemporal = this.password(body.passwordTemporal);
    try {
      const usuario = await this.prisma.usuario.create({ data: { nombre, correo, rol, passwordHash: await hashPassword(passwordTemporal), debeCambiarPassword: true } });
      await this.audit(actor, "Creación de usuario", `${correo} (${rol})`, "Exitoso", usuario.id);
      return { usuario: this.publico(usuario) };
    } catch (error) {
      if (this.isUniqueError(error)) throw new ConflictException("El correo ya está registrado");
      throw error;
    }
  }

  async actualizar(id: string, body: { nombre?: unknown; correo?: unknown; rol?: unknown }, actor: AuthenticatedUser) {
    const actual = await this.prisma.usuario.findUnique({ where: { id } });
    if (!actual) throw new NotFoundException("Cuenta no encontrada");
    const nombre = this.requiredText(body.nombre, "Nombre");
    const correo = this.email(body.correo);
    const rol = this.role(body.rol);
    if (actual.rol === "ADMINISTRADOR" && rol !== "ADMINISTRADOR" && actual.activo) await this.ensureAnotherAdmin(id);
    try {
      const usuario = await this.prisma.usuario.update({ where: { id }, data: { nombre, correo, rol } });
      if (actual.rol !== rol || actual.correo !== correo) await this.sessions.revokeUserSessions(id);
      await this.audit(actor, "Actualización de usuario", `${correo} (${rol})`, "Exitoso", id);
      return { usuario: this.publico(usuario) };
    } catch (error) {
      if (this.isUniqueError(error)) throw new ConflictException("El correo ya está registrado");
      throw error;
    }
  }

  async cambiarEstado(id: string, activo: boolean, actor: AuthenticatedUser) {
    const actual = await this.prisma.usuario.findUnique({ where: { id } });
    if (!actual) throw new NotFoundException("Cuenta no encontrada");
    if (!activo && actual.rol === "ADMINISTRADOR" && actual.activo) await this.ensureAnotherAdmin(id);
    const usuario = await this.prisma.usuario.update({ where: { id }, data: { activo } });
    if (!activo) await this.sessions.revokeUserSessions(id);
    await this.audit(actor, activo ? "Activación de usuario" : "Desactivación de usuario", usuario.correo, "Exitoso", id);
    return { usuario: this.publico(usuario) };
  }

  async restablecerPassword(id: string, passwordTemporal: unknown, actor: AuthenticatedUser) {
    const password = this.password(passwordTemporal);
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException("Cuenta no encontrada");
    const actualizado = await this.prisma.usuario.update({ where: { id }, data: { passwordHash: await hashPassword(password), debeCambiarPassword: true } });
    await this.sessions.revokeUserSessions(id);
    await this.audit(actor, "Restablecimiento de contraseña", usuario.correo, "Exitoso", id);
    return { usuario: this.publico(actualizado), actualizado: true };
  }

  private async ensureAnotherAdmin(id: string) {
    const admins = await this.prisma.usuario.count({ where: { rol: "ADMINISTRADOR", activo: true, id: { not: id } } });
    if (admins === 0) throw new ConflictException("Debe permanecer al menos un Administrador activo");
  }

  private publicRole(rol: Role): Role { return rol; }
  private publico(usuario: { id: string; nombre: string; correo: string; rol: Role; activo: boolean; debeCambiarPassword: boolean; ultimoAcceso: Date | null }) { return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: this.publicRole(usuario.rol), activo: usuario.activo, debeCambiarPassword: usuario.debeCambiarPassword, ultimoAcceso: usuario.ultimoAcceso?.toISOString() ?? null }; }
  private requiredText(value: unknown, field: string): string { const text = typeof value === "string" ? value.trim() : ""; if (!text) throw new BadRequestException(`${field} es obligatorio`); return text; }
  private email(value: unknown): string { const email = this.requiredText(value, "Correo").toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException("El correo no tiene un formato válido"); return email; }
  private role(value: unknown): Role { if (value !== "ADMINISTRADOR" && value !== "USUARIO") throw new BadRequestException("El rol no es válido"); return value; }
  private password(value: unknown): string { if (typeof value !== "string" || value.length < 12) throw new BadRequestException("La contraseña temporal debe tener al menos 12 caracteres"); return value; }
  private async audit(actor: AuthenticatedUser, accion: string, detalle: string, resultado: string, cuenta?: string) { await this.prisma.bitacoraEvento.create({ data: { actor: actor.nombre, accion, detalle, resultado, cuentaAfectada: cuenta ?? actor.id } }); }
  private isUniqueError(error: unknown): boolean { return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002"; }
}
