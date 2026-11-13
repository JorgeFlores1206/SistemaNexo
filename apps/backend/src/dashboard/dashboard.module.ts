import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { FechaNegocioService } from "../reportes-programados/fecha-negocio.service";
import { DashboardAccessGuard } from "./dashboard-access.guard";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({ imports: [AuthModule], controllers: [DashboardController], providers: [FechaNegocioService, DashboardAccessGuard, DashboardService] })
export class DashboardModule {}
