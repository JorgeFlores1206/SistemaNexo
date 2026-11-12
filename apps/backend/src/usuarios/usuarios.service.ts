import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}
  async listar(buscar: string | undefined, rol: string) {
    if (rol !== "Administrador") throw new ForbiddenException();
    const usuarios = await this.prisma.usuario.findMany({ where: buscar ? { OR: [{ nombre: { contains: buscar, mode: "insensitive" } }, { correo: { contains: buscar, mode: "insensitive" } }] } : undefined, orderBy: { nombre: "asc" } });
    return { total: usuarios.length, usuarios: usuarios.map((usuario) => ({ ...usuario, rol: usuario.rol, ultimoAcceso: usuario.ultimoAcceso?.toISOString() ?? null })) };
  }
}
