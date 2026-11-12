import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AdminGuard } from "../reportes-programados/admin.guard";
import { BitacoraController } from "./bitacora.controller";
import { BitacoraService } from "./bitacora.service";

@Module({ controllers: [BitacoraController], providers: [PrismaService, AdminGuard, BitacoraService] })
export class BitacoraModule {}
