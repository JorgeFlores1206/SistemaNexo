import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AdminGuard } from "./admin.guard";
import { FechaNegocioService } from "./fecha-negocio.service";
import { ReportesProgramadosController } from "./reportes-programados.controller";
import { ReportesProgramadosService } from "./reportes-programados.service";
import { BitacoraReportesService } from "./bitacora-reportes.service";
import { GeneracionMensualService } from "./generacion-mensual.service";
import { GeneracionMensualController } from "./generacion-mensual.controller";
import { ReporteSchedulerService } from "./reporte-scheduler.service";

@Module({ imports: [AuthModule], controllers: [ReportesProgramadosController, GeneracionMensualController], providers: [AdminGuard, FechaNegocioService, ReportesProgramadosService, BitacoraReportesService, GeneracionMensualService, ReporteSchedulerService] })
export class ReportesProgramadosModule {}
