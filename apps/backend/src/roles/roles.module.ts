import { Module } from "@nestjs/common";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

@Module({ controllers: [RolesController], providers: [AdminGuard, RolesService] })
export class RolesModule {}
