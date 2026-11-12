import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService) {}
  async obtener(id: string) { const user = await this.prisma.usuario.findUnique({ where: { id } }); if (!user) throw new NotFoundException("Cuenta no encontrada"); return this.publico(user); }
  async actualizar(id: string, nombre: string, correo: string) { if (!nombre.trim() || !correo.includes("@")) throw new BadRequestException("Nombre y correo son obligatorios"); const user = await this.prisma.usuario.update({ where: { id }, data: { nombre: nombre.trim(), correo: correo.trim().toLowerCase() } }); return this.publico(user); }
  async cambiarPassword(id: string, nueva: string, confirmacion: string) { if (nueva.length < 12 || nueva !== confirmacion) throw new BadRequestException("La contraseña debe tener 12 caracteres y coincidir"); const user = await this.prisma.usuario.update({ where: { id }, data: { passwordHash: "managed-by-authentication-provider", debeCambiarPassword: false } }); return { actualizado: true, usuario: this.publico(user) }; }
  private publico(user: { id: string; nombre: string; correo: string; rol: "ADMINISTRADOR" | "USUARIO"; activo: boolean; debeCambiarPassword: boolean; ultimoAcceso: Date | null }) { return { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, activo: user.activo, debeCambiarPassword: user.debeCambiarPassword, ultimoAcceso: user.ultimoAcceso?.toISOString() ?? null }; }
}
