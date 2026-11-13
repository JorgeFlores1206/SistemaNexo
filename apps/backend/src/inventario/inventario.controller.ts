import { Body, Controller, Get, Param, Post, Patch, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { DashboardAccessGuard } from "../dashboard/dashboard-access.guard";
import { AdminGuard } from "../reportes-programados/admin.guard";
import type { AuthenticatedRequest } from "../common/auth-context";
import { InventarioService } from "./inventario.service";

@Controller("inventario")
export class InventarioController {
  constructor(private readonly service: InventarioService) {}

  @Get()
  @UseGuards(DashboardAccessGuard)
  listar(@Query() query: { buscar?: string; estado?: string; pagina?: string; porPagina?: string; ordenar?: string; direccion?: string }, @Req() request: AuthenticatedRequest) {
    return this.service.listar(query, request.user);
  }

  @Get("ajustes")
  @UseGuards(AdminGuard)
  ajustes(@Query() query: { buscar?: string; desde?: string; hasta?: string }, @Req() request: AuthenticatedRequest) { return this.service.listarAjustes(query, request.user); }

  @Get("exportar")
  @UseGuards(AdminGuard)
  async exportar(@Query() query: { buscar?: string; estado?: string; ordenar?: string; direccion?: string }, @Req() request: AuthenticatedRequest, @Res() response: Response) {
    const result = await this.service.exportar(query, request.user);
    response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", `attachment; filename="nexo-inventario-${new Date().toISOString().slice(0, 10)}.xlsx"`);
    response.send(result.archivo);
  }

  @Get(":id")
  @UseGuards(DashboardAccessGuard)
  obtener(@Param("id") id: string, @Req() request: AuthenticatedRequest) { return this.service.obtener(id, request.user); }

  @Post()
  @UseGuards(AdminGuard)
  crear(@Body() body: Record<string, unknown>, @Req() request: AuthenticatedRequest) { return this.service.crear(body, request.user); }

  @Patch(":id")
  @UseGuards(AdminGuard)
  actualizar(@Param("id") id: string, @Body() body: Record<string, unknown>, @Req() request: AuthenticatedRequest) { return this.service.actualizar(id, body, request.user); }

  @Post(":id/ajuste")
  @UseGuards(AdminGuard)
  ajustar(@Param("id") id: string, @Body() body: { saldoNuevo?: unknown; motivo?: unknown; version?: unknown }, @Req() request: AuthenticatedRequest) { return this.service.ajustar(id, body, request.user); }

  @Post("importar/previsualizar")
  @UseGuards(DashboardAccessGuard)
  inspeccionar(@Body() body: { archivo?: string; hoja?: string }) { return this.service.inspeccionar(body.archivo ?? "", body.hoja); }

  @Post("importar")
  @UseGuards(DashboardAccessGuard)
  importar(@Body() body: { archivo?: unknown; nombreArchivo?: unknown; hoja?: unknown }, @Req() request: AuthenticatedRequest) { return this.service.importar(body, request.user); }
}
