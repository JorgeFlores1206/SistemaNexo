const test = require("node:test");
const assert = require("node:assert/strict");
const { calcularFechaEfectiva, calcularRegla, esPoliticaDevolucion } = require("../dist/inventario/reglas.js");
const { InventarioService } = require("../dist/inventario/inventario.service.js");
const XLSX = require("xlsx");

const date = (value) => new Date(`${value}T00:00:00Z`);
const importUser = { id: "test-user", nombre: "Test", rol: "ADMINISTRADOR" };
const importHeaders = ["Artículo", "Descripción del artículo", "On hand", "Saldo", "Arqueo", "UOM primaria", "Laboratorio", "Marca", "Política devolución"];
function workbook(rows) {
  const file = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(file, XLSX.utils.aoa_to_sheet([importHeaders, ...rows]), "Inventario");
  return XLSX.write(file, { type: "base64", bookType: "xlsx" });
}

test("calcula una fecha efectiva y limita el día al último del mes", () => {
  assert.equal(calcularFechaEfectiva(date("2026-03-31"), "1 mes antes").toISOString().slice(0, 10), "2026-02-28");
});

test("mantiene estados y alerta separados", () => {
  const result = calcularRegla({ codigo: "A", nombre: "A", politicaDevolucion: "1 mes antes", vencimientoOriginal: date("2026-12-20"), danado: true, onHand: 1, saldo: 1 }, date("2026-11-25"));
  assert.equal(result.estadoCalculado, "Vencido + Devolución");
  assert.equal(result.prontoAVencer, false);
  assert.equal(result.diasRestantes, -5);
});

test("no clasifica un producto sin vencimiento", () => {
  const result = calcularRegla({ codigo: "A", nombre: "A", politicaDevolucion: null, vencimientoOriginal: null, danado: false, onHand: null, saldo: null }, date("2026-11-13"));
  assert.equal(result.estadoCalculado, null);
  assert.equal(result.prontoAVencer, false);
});

test("acepta las políticas sin fecha de devolución y no les calcula una", () => {
  for (const policy of ["producto fisico suc", "sin devolucio", "SIN DEVOLUCION", "vacia", "N#D", "#N/D"]) {
    assert.equal(esPoliticaDevolucion(policy), true);
    assert.equal(calcularFechaEfectiva(date("2026-12-20"), policy), null);
  }
});

test("reconoce la política mensual sin importar mayúsculas", () => {
  assert.equal(esPoliticaDevolucion("en el mes"), true);
  assert.equal(calcularFechaEfectiva(date("2026-12-20"), "en el mes").toISOString().slice(0, 10), "2026-12-01");
});

test("importa On hand inválido sin borrar lo existente y deja null en artículos nuevos", async () => {
  const updated = [];
  const created = [];
  const prisma = {
    producto: {
      findUnique: async ({ where }) => where.codigo === "EXISTENTE"
        ? { id: "existing-id", version: 1, vencimientoOriginal: null, danado: false }
        : null,
      update: async ({ data }) => updated.push(data),
      create: async ({ data }) => created.push(data),
    },
    bitacoraEvento: { create: async () => undefined },
  };
  const service = new InventarioService(prisma);
  const result = await service.importar({
    archivo: workbook([
      ["EXISTENTE", "Existente", "5.5", "2", "", "", "", "", ""],
      ["NUEVO", "Nuevo", "desconocido", "3", "", "", "", "", ""],
    ]),
    nombreArchivo: "test.xlsx",
    hoja: "Inventario",
  }, importUser);

  assert.equal(result.importadas, 2);
  assert.equal(result.rechazadas, 0);
  assert.equal(updated[0].onHand, undefined);
  assert.equal(created[0].onHand, null);
  assert.deepEqual(result.advertencias.map(({ fila, campo }) => [fila, campo]), [[2, "On hand"], [3, "On hand"]]);
});

test("guarda la última fila de un código duplicado y marca todas las filas repetidas", async () => {
  const created = [];
  const prisma = {
    producto: {
      findUnique: async () => null,
      update: async () => undefined,
      create: async ({ data }) => created.push(data),
    },
    bitacoraEvento: { create: async () => undefined },
  };
  const service = new InventarioService(prisma);
  const result = await service.importar({
    archivo: workbook([
      ["DUPLICADO", "Primera fila", "1", "2", "", "", "", "", ""],
      ["DUPLICADO", "Última fila", "3", "4", "", "", "", "", ""],
    ]),
    nombreArchivo: "test.xlsx",
    hoja: "Inventario",
  }, importUser);

  assert.equal(result.importadas, 1);
  assert.equal(result.rechazadas, 0);
  assert.equal(created.length, 1);
  assert.equal(created[0].nombre, "Última fila");
  assert.deepEqual(result.advertencias.map(({ fila, campo }) => [fila, campo]), [[2, "Artículo"], [3, "Artículo"]]);
});
