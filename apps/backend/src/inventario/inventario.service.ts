import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InventarioService {
  constructor(private readonly prisma: PrismaService) {}
  async listar(buscar: string | undefined, estado: string | undefined, rol: string) {
    if (rol !== "Administrador" && rol !== "Usuario") throw new ForbiddenException();
    const productos = await this.prisma.producto.findMany({ where: { ...(estado && estado !== "Todos" ? { estadoCalculado: estado } : {}), ...(buscar ? { OR: [{ codigo: { contains: buscar, mode: "insensitive" } }, { nombre: { contains: buscar, mode: "insensitive" } }] } : {}) }, orderBy: { nombre: "asc" } });
    return { total: productos.length, productos };
  }
}
