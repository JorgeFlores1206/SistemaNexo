import { Injectable } from "@nestjs/common";
import { FechaNegocioService } from "./fecha-negocio.service";
import { ReportesProgramadosService } from "./reportes-programados.service";

@Injectable()
export class GeneracionMensualService {
  constructor(private readonly fechas: FechaNegocioService, private readonly reportes: ReportesProgramadosService) {}
  generar(fecha = this.fechas.hoy()) { return this.reportes.generar(fecha); }
}
