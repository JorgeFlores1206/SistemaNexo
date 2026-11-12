# Data Model: Spec 012

## IndicadorInventario

Resumen calculado de una categoría visible del inventario.

| Campo | Regla |
|---|---|
| `clave` | Estado, alerta, condición o cantidad aprobada |
| `etiqueta` | Texto en español |
| `cantidad` | Conteo sin duplicar productos |
| `fechaNegocio` | Fecha común para valores dependientes del calendario |
| `disponible` | Si el rol puede consultar el indicador |

Indicadores mínimos: los cuatro estados calculados, `Pronto a vencer`, `Dañado`, cantidades
`On hand`/`Saldo` cuando estén disponibles y resumen del reporte mensual solo para Administrador.

## PrioridadInventario

Lista derivada de un indicador seleccionado, sin persistencia propia.

| Campo | Regla |
|---|---|
| `indicador` | Clave que originó la consulta |
| `productoId` | Producto de inventario |
| `codigo`, `nombre` | Identidad mostrada |
| `estadoCalculado` | Uno de los cuatro estados aprobados |
| `danado` | Condición separada |
| `fechaRelevante` | Fecha efectiva con política o vencimiento original sin política |
| `onHand`, `saldo` | Cantidades según Spec 009 |
| `diasRestantes` | Solo cuando aplica una prioridad de vencimiento |

## ResumenReporteMensual

Lectura de `ReporteMensualVencimientos` de la Spec 011: `mesReferencia`, `fechaNegocio`, estado
`GENERADO`, `VACIO` o `FALLIDO`, y cantidad incluida. No crea una copia.

## Reglas de integridad

- Los productos sin vencimiento válido no aparecen en prioridades de vencimiento.
- `Dañado` puede coexistir con estado y alerta y no altera sus conteos.
- Cada producto aparece como máximo una vez por prioridad.
- La vista no muta productos, cantidades, estados, alertas ni ajustes.
- La actualización manual reemplaza los indicadores solo si la consulta termina correctamente.
