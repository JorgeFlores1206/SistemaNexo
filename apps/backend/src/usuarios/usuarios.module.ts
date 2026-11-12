import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DashboardAccessGuard } from "../dashboard/dashboard-access.guard";
import { UsuariosController } from "./usuarios.controller";
import { UsuariosService } from "./usuarios.service";

@Module({ controllers: [UsuariosController], providers: [PrismaService, DashboardAccessGuard, UsuariosService] })
export class UsuariosModule {}
