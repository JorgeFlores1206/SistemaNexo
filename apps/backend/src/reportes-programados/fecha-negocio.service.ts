import { Injectable } from "@nestjs/common";

@Injectable()
export class FechaNegocioService {
  hoy(): Date { return this.dateOnly(new Date()); }
  primerDiaMesSiguiente(fecha: Date): Date { return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth() + 1, 1)); }
  dateOnly(fecha: Date): Date { return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate())); }
  diasEntre(desde: Date, hasta: Date): number { return Math.round((hasta.getTime() - desde.getTime()) / 86400000); }
}
