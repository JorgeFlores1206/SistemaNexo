import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BitacoraReportesService {
  constructor(private readonly prisma: PrismaService) {}
  listar() { return this.prisma.bitacoraReporteMensual.findMany({ orderBy: { creadoEn: "desc" }, take: 100 }); }
}
