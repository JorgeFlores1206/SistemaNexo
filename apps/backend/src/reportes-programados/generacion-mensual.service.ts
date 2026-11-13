import { Injectable } from "@nestjs/common";
import { FechaNegocioService } from "./fecha-negocio.service";
import { ReportesProgramadosService } from "./reportes-programados.service";
import type { AuthenticatedUser } from "../common/auth-context";

@Injectable()
export class GeneracionMensualService {
  constructor(private readonly fechas: FechaNegocioService, private readonly reportes: ReportesProgramadosService) {}
  generar(actor: AuthenticatedUser, fecha = this.fechas.hoy()) { return this.reportes.generar(fecha, actor); }
}
