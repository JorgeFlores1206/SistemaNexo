import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DashboardAccessGuard } from "../dashboard/dashboard-access.guard";
import { InventarioController } from "./inventario.controller";
import { InventarioService } from "./inventario.service";

@Module({ controllers: [InventarioController], providers: [PrismaService, DashboardAccessGuard, InventarioService] })
export class InventarioModule {}
