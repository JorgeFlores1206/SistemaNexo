import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import * as XLSX from "xlsx";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../common/auth-context";
import { ESTADOS, esPoliticaDevolucion, calcularRegla, iso, parseDateInput, fechaSolo } from "./reglas";

const IMPORT_HEADERS = ["Artículo", "Descripción del artículo", "On hand", "Saldo", "Arqueo", "UOM primaria", "Laboratorio", "Marca", "Política devolución"] as const;
const IGNORED_HEADERS = ["Estado", "Acción"] as const;
const HEADER_ALIASES: Record<string, string> = {
  articulo: "Artículo", codigo: "Artículo",
  "descripcion del articulo": "Descripción del artículo", "descripcion articulo": "Descripción del artículo",
  "on hand": "On hand", saldo: "Saldo", arqueo: "Arqueo", trazabilidad: "Arqueo",
  "uom primaria": "UOM primaria", laboratorio: "Laboratorio", marca: "Marca",
  "politica devolucion": "Política devolución", "politica de devolucion": "Política devolución",
};
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_ROWS = 10_000;

type ProductPayload = {
  codigo?: unknown;
  nombre?: unknown;
  onHand?: unknown;
  saldo?: unknown;
  arqueo?: unknown;
  uomPrimaria?: unknown;
  laboratorio?: unknown;
  marca?: unknown;
  politicaDevolucion?: unknown;
  fechaVencimiento?: unknown;
  danado?: unknown;
  version?: unknown;
};

type ImportRow = {
  fila: number;
  codigo: string;
  nombre: string;
  onHand: number | null | undefined;
  saldo: number | null;
  arqueo: string | null;
  uomPrimaria: string | null;
  laboratorio: string | null;
  marca: string | null;
  politicaDevolucion: string | null;
};

@Injectable()
export class InventarioService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(query: { buscar?: string; estado?: string; pagina?: string; porPagina?: string; ordenar?: string; direccion?: string }, user: AuthenticatedUser) {
    this.requireReader(user);
    const referencia = fechaSolo(new Date());
    const pagina = Math.max(1, Number(query.pagina ?? 1) || 1);
    const porPagina = Math.min(10_000, Math.max(10, Number(query.porPagina ?? 25) || 25));
    const buscar = query.buscar?.trim().toLocaleLowerCase("es");
    const todos = await this.prisma.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } });
    let productos = todos.map((producto) => this.serializar(producto, referencia));
    if (buscar) productos = productos.filter((producto) => producto.codigo.toLocaleLowerCase("es").includes(buscar) || producto.nombre.toLocaleLowerCase("es").includes(buscar));
    if (query.estado && query.estado !== "Todos") {
      productos = productos.filter((producto) => query.estado === "PRONTO_A_VENCER" ? producto.prontoAVencer : query.estado === "DANADO" ? producto.danado : producto.estadoCalculado === query.estado);
    }
    const allowedSort = new Set(["codigo", "nombre", "estadoCalculado", "onHand", "saldo", "vencimientoOriginal"]);
    if (allowedSort.has(query.ordenar ?? "")) {
      const field = query.ordenar as keyof typeof productos[number];
      const direction = query.direccion === "desc" ? -1 : 1;
      productos.sort((a, b) => String(a[field] ?? "").localeCompare(String(b[field] ?? ""), "es", { numeric: true }) * direction);
    }
    const total = productos.length;
    const totalPaginas = total === 0 ? 0 : Math.ceil(total / porPagina);
    return { productos: productos.slice((pagina - 1) * porPagina, pagina * porPagina), total, pagina, porPagina, totalPaginas, fechaNegocio: iso(referencia) };
  }

  async obtener(id: string, user: AuthenticatedUser) {
    this.requireReader(user);
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException("Artículo no encontrado");
    return { producto: this.serializar(producto, fechaSolo(new Date())) };
  }

  async crear(body: ProductPayload, user: AuthenticatedUser) {
    this.requireAdmin(user);
    let productoId: string | null = null;
    try {
      const payload = this.validarPayload(body, true);
      const existente = await this.prisma.producto.findUnique({ where: { codigo: payload.codigo } });
      if (existente) throw new ConflictException("El código de artículo ya existe");
      const regla = calcularRegla({ ...payload, politicaDevolucion: payload.politicaDevolucion ?? null, vencimientoOriginal: payload.vencimientoOriginal ?? null, codigo: payload.codigo, nombre: payload.nombre ?? "", danado: payload.danado ?? false, onHand: payload.onHand ?? 0, saldo: payload.saldo ?? 0 }, new Date());
      const producto = await this.prisma.producto.create({ data: { ...payload, nombre: payload.nombre ?? "", fechaEfectiva: regla.fechaEfectiva, estadoCalculado: regla.estadoCalculado } });
      productoId = producto.id;
      await this.registrar(user, "Creación de producto", `Artículo ${producto.codigo}`, "Exitoso", producto.id);
      return { producto: this.serializar(producto, fechaSolo(new Date())) };
    } catch (error) {
      await this.registrar(user, "Creación de producto", productoId ? `Artículo ${productoId}` : "Validación de datos", "Rechazado").catch(() => undefined);
      throw error;
    }
  }

  async actualizar(id: string, body: ProductPayload, user: AuthenticatedUser) {
    this.requireAdmin(user);
    const actual = await this.prisma.producto.findUnique({ where: { id } });
    if (!actual) throw new NotFoundException("Artículo no encontrado");
    const version = this.optionalInteger(body.version, "version");
    if (version !== null && version !== actual.version) throw new ConflictException("El artículo cambió; actualiza la pantalla e inténtalo otra vez");
    const payload = this.validarPayload({ ...body, codigo: body.codigo ?? actual.codigo }, false);
    const regla = calcularRegla({ ...actual, ...payload, codigo: payload.codigo, nombre: payload.nombre ?? actual.nombre }, new Date());
    const resultado = await this.prisma.producto.updateMany({ where: { id, version: actual.version }, data: { ...payload, fechaEfectiva: regla.fechaEfectiva, estadoCalculado: regla.estadoCalculado, version: { increment: 1 } } });
    if (resultado.count !== 1) throw new ConflictException("El artículo cambió; actualiza la pantalla e inténtalo otra vez");
    const actualizado = await this.prisma.producto.findUniqueOrThrow({ where: { id } });
    await this.registrar(user, "Actualización de producto", `Artículo ${actualizado.codigo}`, "Exitoso", id);
    return { producto: this.serializar(actualizado, fechaSolo(new Date())) };
  }

  async ajustar(id: string, body: { saldoNuevo?: unknown; motivo?: unknown; version?: unknown }, user: AuthenticatedUser) {
    this.requireAdmin(user);
    const saldoNuevo = this.requiredInteger(body.saldoNuevo, "Saldo");
    const motivo = this.requiredText(body.motivo, "Motivo");
    const version = this.optionalInteger(body.version, "version");
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException("Artículo no encontrado");
    if (version !== null && version !== producto.version) throw new ConflictException("El artículo cambió; actualiza la pantalla e inténtalo otra vez");
    const anterior = producto.saldo ?? 0;
    const ajuste = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.producto.updateMany({ where: { id, version: producto.version }, data: { saldo: saldoNuevo, version: { increment: 1 } } });
      if (updated.count !== 1) throw new ConflictException("El artículo cambió; el ajuste no se aplicó");
      const registro = await tx.ajusteInventario.create({ data: { productoId: id, actorId: user.id, saldoAnterior: anterior, saldoNuevo, motivo } });
      await tx.bitacoraEvento.create({ data: { actor: user.nombre, accion: "Ajuste físico", detalle: `${producto.codigo}: saldo ${anterior} a ${saldoNuevo}. ${motivo}`, resultado: "Exitoso", cuentaAfectada: user.id } });
      return registro;
    });
    return { ajuste: { id: ajuste.id, productoId: id, codigo: producto.codigo, nombre: producto.nombre, saldoAnterior: anterior, saldoNuevo, motivo, fecha: ajuste.fecha.toISOString(), actor: user.nombre }, producto: await this.obtener(id, user).then((value) => value.producto) };
  }

  async listarAjustes(query: { buscar?: string; desde?: string; hasta?: string }, user: AuthenticatedUser) {
    this.requireAdmin(user);
    const buscar = query.buscar?.trim();
    const ajustes = await this.prisma.ajusteInventario.findMany({ where: { ...(query.desde || query.hasta ? { fecha: { ...(query.desde ? { gte: new Date(`${query.desde}T00:00:00Z`) } : {}), ...(query.hasta ? { lte: new Date(`${query.hasta}T23:59:59Z`) } : {}) } } : {}), ...(buscar ? { producto: { OR: [{ codigo: { contains: buscar } }, { nombre: { contains: buscar } }] } } : {}) }, include: { producto: true, actor: true }, orderBy: { fecha: "desc" }, take: 500 });
    return { total: ajustes.length, ajustes: ajustes.map((ajuste) => ({ id: ajuste.id, productoId: ajuste.productoId, codigo: ajuste.producto.codigo, nombre: ajuste.producto.nombre, saldoAnterior: ajuste.saldoAnterior, saldoNuevo: ajuste.saldoNuevo, motivo: ajuste.motivo, fecha: ajuste.fecha.toISOString(), actor: ajuste.actor.nombre })) };
  }

  async inspeccionar(archivo: string, hoja?: string) {
    const workbook = this.readWorkbook(archivo);
    const selected = hoja && workbook.SheetNames.includes(hoja) ? hoja : workbook.SheetNames[0];
    if (!selected) throw new BadRequestException("El libro no contiene hojas");
    const sheet = workbook.Sheets[selected];
    if (!sheet) throw new BadRequestException("La hoja seleccionada no existe");
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: true });
    const headers = (rows[0] ?? []).map((value) => String(value ?? "").trim()).filter(Boolean);
    return { hojas: workbook.SheetNames, hojaSeleccionada: selected, encabezados: headers, filasEstimadas: Math.max(0, rows.length - 1) };
  }

  async importar(body: { archivo?: unknown; nombreArchivo?: unknown; hoja?: unknown }, user: AuthenticatedUser) {
    this.requireImporter(user);
    const nombreArchivo = this.requiredText(body.nombreArchivo, "archivo");
    const archivo = this.requiredText(body.archivo, "contenido");
    const workbook = this.readWorkbook(archivo);
    const hoja = typeof body.hoja === "string" && workbook.SheetNames.includes(body.hoja) ? body.hoja : workbook.SheetNames[0];
    if (!hoja) throw new BadRequestException("El libro no contiene hojas");
    const sheet = workbook.Sheets[hoja];
    if (!sheet) throw new BadRequestException("La hoja seleccionada no existe");
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: true });
    const { indexes } = this.validarEncabezados(rows[0] ?? []);
    const dataRows = rows.slice(1);
    if (dataRows.length > MAX_ROWS) throw new BadRequestException(`El libro supera el máximo de ${MAX_ROWS} filas de datos`);
    const vacias = dataRows.filter((row) => row.every((cell) => this.cellText(cell) === "")).length;
    const errores: Array<{ fila: number; campo: string | null; motivo: string }> = [];
    const advertencias: Array<{ fila: number; campo: string | null; motivo: string }> = [];
    const seen = new Map<string, number[]>();
    for (let index = 0; index < dataRows.length; index += 1) {
      const codigo = this.cellText(dataRows[index]?.[indexes["Artículo"] ?? -1]).trim();
      if (codigo) seen.set(codigo, [...(seen.get(codigo) ?? []), index + 2]);
    }
    for (const filas of seen.values()) {
      if (filas.length < 2) continue;
      const ultimaFila = filas[filas.length - 1]!;
      for (const fila of filas) {
        advertencias.push({
          fila,
          campo: "Artículo",
          motivo: fila === ultimaFila ? "Código repetido; esta última fila se seleccionó para importar" : `Código repetido; se seleccionó la fila ${ultimaFila} para importar`,
        });
      }
    }
    const validas: ImportRow[] = [];
    for (let index = 0; index < dataRows.length; index += 1) {
      const row = dataRows[index] ?? [];
      const fila = index + 2;
      if (row.every((cell) => this.cellText(cell) === "")) continue;
      const codigo = this.cellText(row[indexes["Artículo"] ?? -1]).trim();
      if (!codigo) { errores.push({ fila, campo: "Artículo", motivo: "El código es obligatorio" }); continue; }
      const filasCodigo = seen.get(codigo) ?? [];
      if (filasCodigo.length > 1 && fila !== filasCodigo[filasCodigo.length - 1]) continue;
      try {
        const onHand = this.parseImportOnHand(row[indexes["On hand"] ?? -1]);
        if (onHand === undefined) advertencias.push({ fila, campo: "On hand", motivo: "Valor inválido; se conservó la cantidad existente o se dejó sin dato para un artículo nuevo" });
        validas.push({ fila, codigo, nombre: this.cellText(row[indexes["Descripción del artículo"] ?? -1]), onHand, saldo: this.parseOptionalInteger(row[indexes["Saldo"] ?? -1], "Saldo"), arqueo: this.optionalCell(row[indexes["Arqueo"] ?? -1]), uomPrimaria: this.optionalCell(row[indexes["UOM primaria"] ?? -1]), laboratorio: this.optionalCell(row[indexes["Laboratorio"] ?? -1]), marca: this.optionalCell(row[indexes["Marca"] ?? -1]), politicaDevolucion: this.parsePolicy(row[indexes["Política devolución"] ?? -1]) });
      } catch (error) { errores.push({ fila, campo: error instanceof FieldIssue ? error.field : null, motivo: error instanceof Error ? error.message : "Fila inválida" }); }
    }
    let importadas = 0;
    let incompletas = false;
    for (const row of validas) {
      try {
        const actual = await this.prisma.producto.findUnique({ where: { codigo: row.codigo } });
        const base = actual ?? { vencimientoOriginal: null, danado: false };
        const regla = calcularRegla({ ...base, ...row, codigo: row.codigo, nombre: row.nombre, onHand: row.onHand ?? 0, saldo: row.saldo ?? 0 }, new Date());
        if (actual) {
          await this.prisma.producto.update({ where: { id: actual.id }, data: { nombre: row.nombre, ...(row.onHand !== undefined ? { onHand: row.onHand } : {}), saldo: row.saldo, arqueo: row.arqueo, uomPrimaria: row.uomPrimaria, laboratorio: row.laboratorio, marca: row.marca, politicaDevolucion: row.politicaDevolucion, fechaEfectiva: regla.fechaEfectiva, estadoCalculado: regla.estadoCalculado, version: { increment: 1 } } });
        } else {
          await this.prisma.producto.create({ data: { codigo: row.codigo, nombre: row.nombre, onHand: row.onHand ?? null, saldo: row.saldo, arqueo: row.arqueo, uomPrimaria: row.uomPrimaria, laboratorio: row.laboratorio, marca: row.marca, politicaDevolucion: row.politicaDevolucion, danado: false, fechaEfectiva: regla.fechaEfectiva, estadoCalculado: regla.estadoCalculado } });
        }
        importadas += 1;
      } catch (error) {
        incompletas = true;
        errores.push({ fila: row.fila, campo: null, motivo: error instanceof Error ? error.message : "No se pudo guardar la fila" });
      }
    }
    const resultado = { archivo: nombreArchivo, hoja, filasLeidas: dataRows.length, importadas, rechazadas: errores.length, vacias, incompletas, errores, advertencias };
    const resultadoBitacora = errores.length ? "Parcial" : advertencias.length ? "Con advertencias" : "Exitoso";
    await this.registrar(user, "Importación Excel", `${nombreArchivo}: ${importadas} importadas, ${errores.length} rechazadas, ${advertencias.length} advertencias`, resultadoBitacora, undefined);
    return resultado;
  }

  async exportar(query: { buscar?: string; estado?: string; ordenar?: string; direccion?: string }, user: AuthenticatedUser): Promise<{ archivo: Buffer; cantidad: number }> {
    this.requireAdmin(user);
    try {
      const response = await this.listar({ ...query, pagina: "1", porPagina: "10000" }, user);
      if (response.total > MAX_ROWS) throw new BadRequestException(`El reporte supera el máximo de ${MAX_ROWS} filas`);
      const headers = ["Artículo", "Descripción del artículo", "Estado", "On hand", "Saldo", "Arqueo", "UOM primaria", "Laboratorio", "Marca", "Política devolución"];
      const rows = response.productos.map((product) => [product.codigo, product.nombre, product.estadoCalculado ?? "", product.onHand ?? "", product.saldo ?? "", product.arqueo ?? "", product.uomPrimaria ?? "", product.laboratorio ?? "", product.marca ?? "", product.politicaDevolucion ?? ""]);
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
      const archivo = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
      await this.registrar(user, "Exportación Excel", `Inventario: ${response.total} filas`, "Exitoso", undefined);
      return { archivo, cantidad: response.total };
    } catch (error) {
      await this.registrar(user, "Exportación Excel", "Solicitud de reporte", "Rechazado", undefined).catch(() => undefined);
      throw error;
    }
  }

  private validarPayload(body: ProductPayload, crear: boolean) {
    const codigo = this.requiredText(body.codigo, "Artículo").trim();
    if (!codigo) throw new BadRequestException("Artículo es obligatorio");
    const nombre = body.nombre === undefined && !crear ? undefined : this.text(body.nombre);
    const onHand = this.parseOptionalInteger(body.onHand, "On hand");
    const saldo = this.parseOptionalInteger(body.saldo, "Saldo");
    const politicaDevolucion = body.politicaDevolucion === undefined && !crear ? undefined : this.parsePolicy(body.politicaDevolucion);
    let vencimientoOriginal: Date | null | undefined;
    if (body.fechaVencimiento !== undefined) {
      if (body.fechaVencimiento === "" || body.fechaVencimiento === null) vencimientoOriginal = null;
      else { vencimientoOriginal = parseDateInput(body.fechaVencimiento); if (!vencimientoOriginal) throw new BadRequestException("La fecha de vencimiento debe usar DD/MM/YYYY"); }
    } else if (crear) vencimientoOriginal = null;
    const data = { codigo, ...(nombre !== undefined ? { nombre } : {}), ...(crear || body.onHand !== undefined ? { onHand } : {}), ...(crear || body.saldo !== undefined ? { saldo } : {}), ...(crear || body.arqueo !== undefined ? { arqueo: this.optionalBodyText(body.arqueo) } : {}), ...(crear || body.uomPrimaria !== undefined ? { uomPrimaria: this.optionalBodyText(body.uomPrimaria) } : {}), ...(crear || body.laboratorio !== undefined ? { laboratorio: this.optionalBodyText(body.laboratorio) } : {}), ...(crear || body.marca !== undefined ? { marca: this.optionalBodyText(body.marca) } : {}), ...(politicaDevolucion !== undefined ? { politicaDevolucion } : {}), ...(vencimientoOriginal !== undefined ? { vencimientoOriginal } : {}), ...(body.danado !== undefined ? { danado: body.danado === true || body.danado === "true" } : {}) };
    return data;
  }

  private serializar(producto: any, referencia: Date) {
    const regla = calcularRegla(producto, referencia);
    return { id: producto.id, codigo: producto.codigo, nombre: producto.nombre, estadoCalculado: regla.estadoCalculado, fechaEfectiva: iso(regla.fechaEfectiva), vencimientoOriginal: iso(producto.vencimientoOriginal), diasRestantes: regla.diasRestantes, prontoAVencer: regla.prontoAVencer, onHand: producto.onHand, saldo: producto.saldo, arqueo: producto.arqueo, uomPrimaria: producto.uomPrimaria, laboratorio: producto.laboratorio, marca: producto.marca, politicaDevolucion: producto.politicaDevolucion, danado: producto.danado, activo: producto.activo, version: producto.version };
  }

  private readWorkbook(encoded: string) {
    const clean = encoded.replace(/^data:.*?;base64,/, "");
    const buffer = Buffer.from(clean, "base64");
    if (!buffer.length) throw new BadRequestException("El archivo está vacío");
    if (buffer.length > MAX_FILE_BYTES) throw new BadRequestException("El archivo supera el límite de 10 MB");
    try { return XLSX.read(buffer, { type: "buffer", cellDates: false }); } catch { throw new BadRequestException("No se pudo leer el libro Excel"); }
  }

  private validarEncabezados(raw: unknown[]) {
    const headers = raw.map((value) => {
      const header = String(value ?? "").trim();
      const normalized = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
      return HEADER_ALIASES[normalized] ?? header;
    });
    const indexes: Record<string, number> = {};
    for (let index = 0; index < headers.length; index += 1) {
      const header = headers[index];
      if (!header) continue;
      if (indexes[header] !== undefined) throw new BadRequestException(`El encabezado "${header}" está repetido`);
      indexes[header] = index;
      // Se aceptan columnas adicionales del archivo para no bloquear la importación.
      // Solo se persisten las columnas soportadas por el modelo Producto.
    }
    const faltantes = IMPORT_HEADERS.filter((header) => indexes[header] === undefined);
    if (faltantes.length) throw new BadRequestException(`Faltan encabezados: ${faltantes.join(", ")}`);
    return { indexes };
  }

  private cellText(value: unknown): string {
    if (value === null || value === undefined) return "";
    return typeof value === "string" ? value.trim() : String(value).trim();
  }

  private optionalCell(value: unknown): string | null { const valueText = this.cellText(value); return valueText ? valueText : null; }
  private text(value: unknown): string { return this.cellText(value); }
  private optionalBodyText(value: unknown): string | null { return value === undefined ? null : this.optionalCell(value); }
  private requiredText(value: unknown, field: string): string { const text = this.cellText(value); if (!text) throw new BadRequestException(`${field} es obligatorio`); return text; }
  private requiredInteger(value: unknown, field: string): number { const parsed = this.parseOptionalInteger(value, field); if (parsed === null) throw new BadRequestException(`${field} debe ser un entero no negativo`); return parsed; }
  private optionalInteger(value: unknown, field: string): number | null { return value === undefined || value === null || value === "" ? null : this.requiredInteger(value, field); }
  private parseOptionalInteger(value: unknown, field: string): number | null { if (value === undefined || value === null || value === "") return null; const text = this.cellText(value); if (!/^\d+$/.test(text)) throw new FieldIssue(field, `${field} debe ser un entero no negativo`); const number = Number(text); if (!Number.isSafeInteger(number)) throw new FieldIssue(field, `${field} está fuera de rango`); return number; }
  private parseImportOnHand(value: unknown): number | null | undefined {
    try { return this.parseOptionalInteger(value, "On hand"); }
    catch (error) { if (error instanceof FieldIssue && error.field === "On hand") return undefined; throw error; }
  }
  private parsePolicy(value: unknown): string | null { const policy = this.optionalCell(value); if (!policy) return null; if (!esPoliticaDevolucion(policy)) throw new FieldIssue("Política devolución", "La política no pertenece al catálogo aprobado"); return policy; }

  private requireReader(user: AuthenticatedUser) { if (user.rol !== "ADMINISTRADOR" && user.rol !== "USUARIO") throw new ForbiddenException(); }
  private requireImporter(user: AuthenticatedUser) { this.requireReader(user); }
  private requireAdmin(user: AuthenticatedUser) { if (user.rol !== "ADMINISTRADOR") throw new ForbiddenException("Operación reservada al Administrador"); }
  private async registrar(user: AuthenticatedUser, accion: string, detalle: string, resultado: string, cuentaAfectada?: string) { await this.prisma.bitacoraEvento.create({ data: { actor: user.nombre, accion, detalle, resultado, cuentaAfectada: cuentaAfectada ?? user.id } }); }
}

class FieldIssue extends Error {
  constructor(public readonly field: string, message: string) { super(message); }
}
