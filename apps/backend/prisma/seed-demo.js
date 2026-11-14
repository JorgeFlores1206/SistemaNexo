// Seed de datos de demostración para Nexo.
// Pensado para una base de datos recién migrada: crea un segundo usuario (rol USUARIO),
// un catálogo de productos que cubre cada estado calculado por las reglas de negocio
// (apps/backend/src/inventario/reglas.ts), su historial de ajustes y bitácora asociados.
// No toca el Administrador, que se provisiona con prisma/seed.js.
const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");
const { calcularRegla } = require("../dist/inventario/reglas");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

function diasDesdeHoy(dias) {
  const hoy = new Date();
  const fecha = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha;
}

const prisma = new PrismaClient();

// Vencimiento + política definen el estado calculado (ver reglas.ts):
//  - sin vencimiento                      -> Sin clasificar
//  - vencimiento futuro, sin política     -> Neutro
//  - vencimiento futuro, con política     -> Neutro (antes de la fecha efectiva) o alerta "pronto a vencer"
//  - vencimiento pasado, sin política     -> Vencido + Ofertar
//  - vencimiento pasado, con política     -> Vencido + Devolución (si aún no pasó el vencimiento original)
const productos = [
  // Ofertar: sin política de devolución, vencimiento todavía lejano.
  { codigo: "FAR-0001", nombre: "Paracetamol 500mg x20", laboratorio: "Lafar", marca: "Genfar", uomPrimaria: "CAJA", arqueo: "A-01", onHand: 420, saldo: 418, danado: false, politicaDevolucion: null, vencimientoOriginal: diasDesdeHoy(240) },
  // Ofertar + "pronto a vencer": sin política, vence en 15 días.
  { codigo: "FAR-0002", nombre: "Ibuprofeno 400mg x30", laboratorio: "Bagó", marca: "Bagó", uomPrimaria: "CAJA", arqueo: "A-02", onHand: 180, saldo: 175, danado: false, politicaDevolucion: null, vencimientoOriginal: diasDesdeHoy(15) },
  // Neutro: con política, la fecha efectiva todavía está lejos (38 días).
  { codigo: "FAR-0003", nombre: "Amoxicilina 500mg x12", laboratorio: "Lafar", marca: "Genfar", uomPrimaria: "CAJA", arqueo: "A-03", onHand: 95, saldo: 90, danado: false, politicaDevolucion: "2 meses antes", vencimientoOriginal: diasDesdeHoy(100) },
  // Neutro + "pronto a vencer": la fecha efectiva de devolución cae en ~10 días.
  { codigo: "FAR-0004", nombre: "Omeprazol 20mg x14", laboratorio: "Inti", marca: "Inti", uomPrimaria: "CAJA", arqueo: "A-04", onHand: 60, saldo: 60, danado: false, politicaDevolucion: "1 mes antes", vencimientoOriginal: diasDesdeHoy(40) },
  // Vencido + Ofertar: sin política, ya venció.
  { codigo: "FAR-0005", nombre: "Loratadina 10mg x10", laboratorio: "Bagó", marca: "Bagó", uomPrimaria: "CAJA", arqueo: "B-01", onHand: 140, saldo: 132, danado: false, politicaDevolucion: null, vencimientoOriginal: diasDesdeHoy(-15) },
  // Vencido + Ofertar + dañado: sin política, ya venció y está marcado como dañado.
  { codigo: "FAR-0006", nombre: "Diclofenaco gel 60g", laboratorio: "Lafar", marca: "Lafar", uomPrimaria: "UNIDAD", arqueo: "B-02", onHand: 70, saldo: 68, danado: true, politicaDevolucion: null, vencimientoOriginal: diasDesdeHoy(-40) },
  // Neutro + "pronto a vencer": política "En el mes" cae el día 1 del mes siguiente (~17 días).
  { codigo: "FAR-0007", nombre: "Vitamina C 1g x10 efervescente", laboratorio: "Bayer", marca: "Redoxon", uomPrimaria: "CAJA", arqueo: "B-03", onHand: 310, saldo: 305, danado: false, politicaDevolucion: "En el mes", vencimientoOriginal: diasDesdeHoy(20) },
  // Vencido + Devolución: con política, ya pasó la fecha efectiva pero no el vencimiento final.
  { codigo: "FAR-0008", nombre: "Suero fisiológico 500ml", laboratorio: "Baxter", marca: "Baxter", uomPrimaria: "UNIDAD", arqueo: "C-01", onHand: 85, saldo: 85, danado: false, politicaDevolucion: "3 meses antes", vencimientoOriginal: diasDesdeHoy(75) },
  // Sin clasificar: productos operativos sin fecha de vencimiento.
  { codigo: "FAR-0009", nombre: "Guantes de nitrilo talla M x100", laboratorio: "Medline", marca: "Medline", uomPrimaria: "CAJA", arqueo: "C-02", onHand: 25, saldo: 22, danado: false, politicaDevolucion: null, vencimientoOriginal: null },
  { codigo: "FAR-0010", nombre: "Alcohol en gel 1L", laboratorio: "Inti", marca: "Inti", uomPrimaria: "UNIDAD", arqueo: "C-03", onHand: 160, saldo: 158, danado: false, politicaDevolucion: null, vencimientoOriginal: null },
  // Vencido + Devolución: otra variante con política a 1 mes antes.
  { codigo: "FAR-0011", nombre: "Jarabe para la tos 120ml", laboratorio: "Bagó", marca: "Bagó", uomPrimaria: "UNIDAD", arqueo: "D-01", onHand: 50, saldo: 48, danado: false, politicaDevolucion: "1 mes antes", vencimientoOriginal: diasDesdeHoy(5) },
  // Ofertar: sin política, vencimiento muy lejano.
  { codigo: "FAR-0012", nombre: "Mascarillas quirúrgicas x50", laboratorio: "Medline", marca: "Medline", uomPrimaria: "CAJA", arqueo: "D-02", onHand: 200, saldo: 190, danado: false, politicaDevolucion: null, vencimientoOriginal: diasDesdeHoy(600) },
];

const ajustesDemo = [
  { codigo: "FAR-0002", motivo: "Conteo físico mensual: faltante por merma en bodega.", saldoAnterior: 180, saldoNuevo: 175 },
  { codigo: "FAR-0005", motivo: "Conteo físico mensual: unidades retiradas por devolución a laboratorio.", saldoAnterior: 140, saldoNuevo: 132 },
  { codigo: "FAR-0009", motivo: "Ajuste tras arqueo: caja dañada en recepción.", saldoAnterior: 25, saldoNuevo: 22 },
];

const bitacoraDemo = [
  { accion: "Importación de inventario", detalle: "Carga inicial de catálogo vía Excel (12 productos).", resultado: "Exitoso" },
  { accion: "Generación de reporte mensual", detalle: "Reporte de vencimientos del mes generado automáticamente.", resultado: "Exitoso" },
];

async function main() {
  const usuario = await prisma.usuario.upsert({
    where: { correo: "operador@nexo.local" },
    update: { nombre: "Operador Demo", rol: "USUARIO", activo: true },
    create: {
      nombre: "Operador Demo",
      correo: "operador@nexo.local",
      rol: "USUARIO",
      passwordHash: hashPassword("NexoOperador2026!"),
      debeCambiarPassword: true,
    },
  });
  console.log(`Usuario demo listo: ${usuario.correo} (password temporal: NexoOperador2026!)`);

  const admin = await prisma.usuario.findFirst({ where: { rol: "ADMINISTRADOR" } });
  const ahora = new Date();

  for (const base of productos) {
    const regla = calcularRegla({ ...base, codigo: base.codigo, nombre: base.nombre, politicaDevolucion: base.politicaDevolucion, vencimientoOriginal: base.vencimientoOriginal, danado: base.danado, onHand: base.onHand, saldo: base.saldo }, ahora);
    await prisma.producto.upsert({
      where: { codigo: base.codigo },
      update: {
        nombre: base.nombre, laboratorio: base.laboratorio, marca: base.marca, uomPrimaria: base.uomPrimaria,
        arqueo: base.arqueo, onHand: base.onHand, saldo: base.saldo, danado: base.danado,
        politicaDevolucion: base.politicaDevolucion, vencimientoOriginal: base.vencimientoOriginal,
        fechaEfectiva: regla.fechaEfectiva, estadoCalculado: regla.estadoCalculado, activo: true,
      },
      create: {
        codigo: base.codigo, nombre: base.nombre, laboratorio: base.laboratorio, marca: base.marca,
        uomPrimaria: base.uomPrimaria, arqueo: base.arqueo, onHand: base.onHand, saldo: base.saldo,
        danado: base.danado, politicaDevolucion: base.politicaDevolucion, vencimientoOriginal: base.vencimientoOriginal,
        fechaEfectiva: regla.fechaEfectiva, estadoCalculado: regla.estadoCalculado,
      },
    });
  }
  console.log(`Catálogo demo listo: ${productos.length} productos.`);

  if (admin) {
    for (const ajuste of ajustesDemo) {
      const producto = await prisma.producto.findUnique({ where: { codigo: ajuste.codigo } });
      if (!producto) continue;
      const existente = await prisma.ajusteInventario.findFirst({ where: { productoId: producto.id, motivo: ajuste.motivo } });
      if (existente) continue;
      await prisma.ajusteInventario.create({
        data: { productoId: producto.id, actorId: admin.id, saldoAnterior: ajuste.saldoAnterior, saldoNuevo: ajuste.saldoNuevo, motivo: ajuste.motivo },
      });
      await prisma.bitacoraEvento.create({
        data: { actor: admin.nombre, accion: "Ajuste físico", detalle: `${producto.codigo}: saldo ${ajuste.saldoAnterior} a ${ajuste.saldoNuevo}. ${ajuste.motivo}`, resultado: "Exitoso", cuentaAfectada: admin.id },
      });
    }
    for (const evento of bitacoraDemo) {
      const existente = await prisma.bitacoraEvento.findFirst({ where: { accion: evento.accion, detalle: evento.detalle } });
      if (existente) continue;
      await prisma.bitacoraEvento.create({ data: { actor: admin.nombre, accion: evento.accion, detalle: evento.detalle, resultado: evento.resultado, cuentaAfectada: admin.id } });
    }
    console.log("Historial de ajustes y bitácora demo listo.");
  } else {
    console.log("No se encontró un Administrador; omití el historial de ajustes y bitácora (ejecuta primero prisma/seed.js).");
  }
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
