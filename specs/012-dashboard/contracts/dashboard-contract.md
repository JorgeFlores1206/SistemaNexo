# Contract: Dashboard operativo

Todos los contratos se sirven bajo `/api`, requieren sesión válida y aplican la matriz de la Spec
005. Las formas se validan con Zod desde `packages/contracts`.

## GET `/dashboard/resumen`

Devuelve `{ fechaNegocio, indicadores[] }`.

Cada indicador incluye `{ clave, etiqueta, cantidad, disponible }`. El resultado no incluye datos
administrativos para Usuario. El Administrador puede recibir `resumenReporteMensual` con mes,
fecha de negocio, estado y cantidad.

## GET `/dashboard/prioridades/:indicador`

Devuelve `{ indicador, fechaNegocio, productos[] }`. Los productos contienen código, nombre,
estado, condición `danado`, fechas y cantidades disponibles. Para prioridades de vencimiento se
ordenan por `fechaRelevante` ascendente.

## Autorización

- Administrador: resumen, prioridades autorizadas y resumen del reporte mensual.
- Usuario: resumen operativo y prioridades de inventario autorizadas; sin información exclusiva
  del Administrador.
- Sesión ausente: `401`.
- Operación o indicador fuera del rol: `403` sin datos de inventario.

## Estados de consulta

La UI distingue carga inicial, actualización manual, resultado válido, inventario vacío, prioridad
sin resultados y error. Un error durante actualización no invalida el último resultado mostrado.
