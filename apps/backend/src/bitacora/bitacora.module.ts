import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { BitacoraController } from "./bitacora.controller";
import { BitacoraService } from "./bitacora.service";

@Module({ imports: [AuthModule], controllers: [BitacoraController], providers: [AdminGuard, BitacoraService] })
export class BitacoraModule {}
