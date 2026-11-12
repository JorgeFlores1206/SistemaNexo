import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AdminGuard } from "./admin.guard";
import { FechaNegocioService } from "./fecha-negocio.service";
import { ReportesProgramadosController } from "./reportes-programados.controller";
import { ReportesProgramadosService } from "./reportes-programados.service";
import { BitacoraReportesService } from "./bitacora-reportes.service";
import { GeneracionMensualService } from "./generacion-mensual.service";
import { GeneracionMensualController } from "./generacion-mensual.controller";

@Module({ controllers: [ReportesProgramadosController, GeneracionMensualController], providers: [PrismaService, AdminGuard, FechaNegocioService, ReportesProgramadosService, BitacoraReportesService, GeneracionMensualService] })
export class ReportesProgramadosModule {}
