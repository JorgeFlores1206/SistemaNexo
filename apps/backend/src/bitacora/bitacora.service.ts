import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../common/auth-context";

@Injectable()
export class BitacoraService {
  constructor(private readonly prisma: PrismaService) {}
  async listar(buscar: string | undefined, user: AuthenticatedUser) {
    if (user.rol !== "ADMINISTRADOR") throw new ForbiddenException();
    const eventos = await this.prisma.bitacoraEvento.findMany({ where: buscar ? { OR: [{ actor: { contains: buscar } }, { accion: { contains: buscar } }, { detalle: { contains: buscar } }] } : undefined, orderBy: { fecha: "desc" }, take: 100 });
    return { total: eventos.length, eventos: eventos.map((evento) => ({ ...evento, fecha: evento.fecha.toISOString() })) };
  }
}
