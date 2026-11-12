# Data Model: Spec 011

## ReporteMensualVencimientos

Representa la generación vigente para un mes futuro.

| Campo | Regla |
|---|---|
| `id` | Identificador persistente |
| `mesReferencia` | Primer día del mes siguiente; único |
| `fechaNegocio` | Fecha calendario usada por estados y alertas |
| `estadoGeneracion` | `EN_PROCESO`, `GENERADO`, `VACIO` o `FALLIDO` |
| `cantidadIncluida` | Cero o cantidad de filas generadas |
| `errorCodigo` / `errorMensaje` | Solo para fallo, sin datos sensibles |
| `generadoEn` | Marca temporal técnica |

## ProductoProximoAVencer

Snapshot de los datos necesarios para consultar el reporte sin recalcularlo con cambios posteriores.

| Campo | Regla |
|---|---|
| `id` | Identificador persistente |
| `reporteId` | Relación con `ReporteMensualVencimientos` |
| `productoId` | Producto de inventario de origen |
| `codigo` / `nombre` | Valores mostrados al Administrador |
| `politicaDevolucion` | Política vigente en la generación |
| `fechaEfectiva` | Obligatoria cuando existe política |
| `vencimientoOriginal` | Fecha válida requerida |
| `fechaRelevante` | Efectiva con política; original sin política |
| `estadoCalculado` | Estado constitucional calculado |
| `danado` | Condición separada del estado |
| `diasRestantes` | Días calendario desde `fechaNegocio` hasta fecha relevante |

Un producto sin vencimiento válido no genera fila. La fila se incluye únicamente cuando `fechaRelevante - fechaNegocio` está entre 1 y 30 días calendario.

## ResultadoGeneracion

Se expresa mediante `estadoGeneracion`, `cantidadIncluida`, `mesReferencia`, `fechaNegocio` y, en caso de fallo, un error seguro. `VACIO` es éxito con cero filas; `FALLIDO` nunca reutiliza una generación anterior.

## BitacoraReporteMensual

Registro resumido por intento: mes de referencia, fecha de negocio, resultado, cantidad, timestamps y actor técnico/administrativo si aplica. Solo Administrador puede consultarlo.

## Relaciones e integridad

- Un `ReporteMensualVencimientos` tiene cero o muchas filas `ProductoProximoAVencer`.
- `mesReferencia` es único para impedir duplicados visibles.
- La generación escribe cabecera, filas y bitácora en una transacción; un fallo no publica una cabecera vigente parcial.
- Las fechas se almacenan como fechas calendario, no como instantes convertidos entre zonas.
