import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../common/auth-context";

@Injectable()
export class SessionService {
  private readonly durationMs = 8 * 60 * 60 * 1000;

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string): Promise<{ token: string; expiraEn: Date; sessionId: string }> {
    const token = randomBytes(32).toString("base64url");
    const expiraEn = new Date(Date.now() + this.durationMs);
    const session = await this.prisma.sesion.create({ data: { tokenHash: this.hash(token), usuarioId: userId, expiraEn } });
    return { token, expiraEn, sessionId: session.id };
  }

  async authenticate(authorization: string | undefined): Promise<{ user: AuthenticatedUser; sessionId: string }> {
    const token = authorization?.match(/^Bearer\s+(.+)$/)?.[1];
    if (!token) throw new UnauthorizedException("Sesión requerida");
    const session = await this.prisma.sesion.findUnique({ where: { tokenHash: this.hash(token) }, include: { usuario: true } });
    if (!session || session.revocadaEn || session.expiraEn <= new Date() || !session.usuario.activo) throw new UnauthorizedException("La sesión no es válida");
    return {
      sessionId: session.id,
      user: {
        id: session.usuario.id,
        nombre: session.usuario.nombre,
        correo: session.usuario.correo,
        rol: session.usuario.rol,
        activo: session.usuario.activo,
        debeCambiarPassword: session.usuario.debeCambiarPassword,
      },
    };
  }

  async revoke(authorization: string | undefined): Promise<void> {
    const token = authorization?.match(/^Bearer\s+(.+)$/)?.[1];
    if (token) await this.prisma.sesion.updateMany({ where: { tokenHash: this.hash(token), revocadaEn: null }, data: { revocadaEn: new Date() } });
  }

  async revokeUserSessions(userId: string): Promise<void> {
    await this.prisma.sesion.updateMany({ where: { usuarioId: userId, revocadaEn: null }, data: { revocadaEn: new Date() } });
  }

  async revokeOtherUserSessions(userId: string, currentSessionId: string): Promise<void> {
    await this.prisma.sesion.updateMany({ where: { usuarioId: userId, id: { not: currentSessionId }, revocadaEn: null }, data: { revocadaEn: new Date() } });
  }

  private hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
