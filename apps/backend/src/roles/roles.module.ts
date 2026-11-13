import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

@Module({ imports: [AuthModule], controllers: [RolesController], providers: [AdminGuard, RolesService] })
export class RolesModule {}
