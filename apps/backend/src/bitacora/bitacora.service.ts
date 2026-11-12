import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BitacoraService {
  constructor(private readonly prisma: PrismaService) {}
  async listar(buscar: string | undefined, rol: string) {
    if (rol !== "Administrador") throw new ForbiddenException();
    const eventos = await this.prisma.bitacoraEvento.findMany({ where: buscar ? { OR: [{ actor: { contains: buscar, mode: "insensitive" } }, { accion: { contains: buscar, mode: "insensitive" } }, { detalle: { contains: buscar, mode: "insensitive" } }] } : undefined, orderBy: { fecha: "desc" }, take: 100 });
    return { total: eventos.length, eventos: eventos.map((evento) => ({ ...evento, fecha: evento.fecha.toISOString() })) };
  }
}
