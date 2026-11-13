import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DashboardAccessGuard } from "../dashboard/dashboard-access.guard";
import { InventarioController } from "./inventario.controller";
import { InventarioService } from "./inventario.service";

@Module({ imports: [AuthModule], controllers: [InventarioController], providers: [DashboardAccessGuard, InventarioService] })
export class InventarioModule {}
