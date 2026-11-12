import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FechaNegocioService } from "../reportes-programados/fecha-negocio.service";
import { DashboardAccessGuard } from "./dashboard-access.guard";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({ controllers: [DashboardController], providers: [PrismaService, FechaNegocioService, DashboardAccessGuard, DashboardService] })
export class DashboardModule {}
