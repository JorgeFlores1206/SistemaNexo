# Contract: Reportes programados

Todos los endpoints son NestJS bajo `/api`, requieren sesión válida y rol/permisos de Administrador. Las respuestas se validan con Zod desde `packages/contracts`.

## GET `/reportes-programados/vencimientos`

Consulta el reporte vigente del mes solicitado.

Query opcional: `mesReferencia=YYYY-MM-01`.

Respuesta 200: `{ mesReferencia, fechaNegocio, estadoGeneracion, cantidadIncluida, productos[] }`.

Cada producto incluye `codigo`, `nombre`, `politicaDevolucion`, `fechaEfectiva`, `vencimientoOriginal`, `fechaRelevante`, `estadoCalculado`, `danado` y `diasRestantes`.

Si el estado es `VACIO`, `productos` es `[]` y se muestra un mensaje explícito. Si es `FALLIDO` o no existe una generación vigente, la respuesta comunica que no está disponible y no incluye datos de una generación anterior.

## GET `/reportes-programados/generaciones/:mesReferencia`

Devuelve el resultado de generación del mes: `mesReferencia`, `fechaNegocio`, `estadoGeneracion`, `cantidadIncluida`, `generadoEn` y error seguro cuando corresponda.

## GET `/reportes-programados/bitacora`

Consulta administrativa de registros resumidos, con filtros de mes y estado. No incluye snapshots completos de productos.

## Errores

- `401`: sesión ausente.
- `403`: usuario sin permiso; no se revela contenido del inventario.
- `404`: no existe generación vigente para el mes solicitado.
- `409`: intento concurrente o duplicado de generación; el servicio conserva una sola generación vigente.
- `500`: fallo interno; el resultado persistido se marca `FALLIDO` y no se sustituye silenciosamente.
