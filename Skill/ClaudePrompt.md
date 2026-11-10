Actúa como Arquitecto de Software Senior especializado en rendimiento de aplicaciones web con Node.js, TypeScript y PostgreSQL.

CONTEXTO


PASO 0: AUDITORÍA (hazlo primero, antes de proponer nada)
Revisa la estructura actual del repositorio y entrégame:
1. Un diagnóstico de cuellos de botella ordenado por impacto, separando: base de datos, API, frontend y herramientas de build.
2. Evidencia concreta: consultas sin índice, N+1, endpoints sin paginación, renders innecesarios, bundles grandes, logging síncrono. Cita archivos y líneas.
3. Métricas base que debamos medir antes de cambiar nada (p95 de latencia por endpoint, tiempo de consulta, LCP, tamaño del bundle, tiempo de build).

PASO 1: ORDEN DE IMPLEMENTACIÓN (por retorno de inversión)
A. Base de datos y backend (mayor impacto en velocidad real)
   - Índices (incluyendo trigram o full-text para búsqueda), paginación por cursor, eliminación de N+1, transacciones con control de concurrencia en movimientos de stock, vistas materializadas o columnas agregadas para totales.
   - ORM: Drizzle (o Prisma si justificas lo contrario con datos del proyecto).
   - Pino como logger (nivel por entorno, redacción de datos sensibles, sin console.log).
   - Caché de catálogos de baja variación.
B. Contratos compartidos
   - Paquete `shared` con esquemas Zod usados en validación del backend y en formularios del frontend, y tipos inferidos con z.infer.
C. Frontend
   - Migrar a Vite si hoy usamos Webpack o CRA.
   - TanStack Query con queryKeys centralizadas, staleTime adecuado por tipo de dato, deduplicación, prefetch y optimistic updates en movimientos de stock.
   - Tablas con TanStack Table + virtualización, búsqueda con debounce, code splitting por ruta.
D. Herramientas de build (solo si la auditoría demuestra que son un problema)
   - SWC para el backend; Turborepo únicamente si ya existen 2 o más paquetes. Justifica con tiempos medidos antes y después.

FORMATO DE ENTREGA
- Plan por fases, cada fase con: objetivo, archivos a tocar, código concreto (antes y después), riesgo y cómo revertir.
- Cada fase debe terminar con la forma de medir la mejora (benchmark o métrica) y el criterio de éxito.
- No migres por moda: si una tecnología no aporta una mejora medible a este proyecto, dilo y propón una alternativa.
- Implementa por commits pequeños, sin romper la funcionalidad existente, y pregúntame antes de cualquier cambio destructivo en el esquema de base de datos.
# Instalación rápida de dependencias para el stack del sistema de gestión de productos
# Ejecuta este script desde la raíz del proyecto.

npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled @tanstack/react-query @tanstack/react-table @tanstack/react-virtual zod fastify pino pg drizzle-orm specify
npm install -D vite typescript @types/react @types/react-dom @types/node drizzle-kit

# Si quieres dejarlo todo en una sola línea:
# npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled @tanstack/react-query @tanstack/react-table @tanstack/react-virtual zod fastify pino pg drizzle-orm specify && npm install -D vite typescript @types/react @types/react-dom @types/node drizzle-kit

<#
CLAUDE PROMPT

Actúa como Arquitecto de Software Senior y experto en rendimiento web (Node.js, TypeScript, PostgreSQL, React). Construye (o refactoriza, si ya existe código) un sistema web de gestión de productos y de sus estados de vencimiento/devolución. Prioridad absoluta: que sea rápido en carga, búsquedas, filtros y acciones.

## 1. Qué hace el sistema
Los datos entran desde archivos Excel (.xlsx). El sistema los importa, calcula el estado de cada producto según su vencimiento y su política de devolución, y permite consultarlos, filtrarlos y buscarlos al instante.

### Columnas del Excel
Articulo | Descripcion del articulo | Estado | On hand | Saldo | Trazabilidad | UOM primaria | Laboratorio | Marca | Politica devolucion

Supuestos por defecto (márcalos en tu respuesta y hazlos configurables, no los des por ciertos):
- `Articulo` es el código del producto. Es la clave de negocio.
- `Trazabilidad` contiene el lote y/o la fecha de vencimiento. Si no se puede extraer una fecha de vencimiento de una fila, esa fila se reporta como error y no se le calcula estado.
- `Politica devolucion` es un número de días (también puede venir como texto tipo "90 días" o "3 meses"). Vacío, "N/A" o "sin política" significa que no tiene política.
- La columna `Estado` del archivo es solo informativa. El estado oficial siempre lo calcula el sistema.
- `On hand` y `Saldo` son numéricos. Se guardan ambos, sin mezclarlos.
- Si un mismo Articulo aparece en varias filas (lotes distintos), cada fila es un registro distinto (clave: Articulo + lote).

## 2. Regla de negocio: estados
Estados posibles: `vencido`, `devolucion`, `ofertar`, `neutro`.

Definiciones: V = fecha de vencimiento, P = días de política de devolución, H = fecha actual del negocio, U = umbral configurable (por defecto 60 días), FD = V − P (fecha límite de devolución).

Con política de devolución (evaluar en orden, gana la primera que se cumpla):
1. H > V → `vencido`
2. H > FD → `ofertar` (ya no se puede devolver, pero aún no vence)
3. FD − H ≤ U → `devolucion` (dentro del rango para devolver)
4. En otro caso → `neutro`

Sin política de devolución:
1. H > V → `vencido`
2. V − H ≤ U → `ofertar`
3. En otro caso → `neutro`

Requisitos de implementación de la regla:
- Una única función pura y determinista `calcularEstado(producto, hoy, config)` en un paquete compartido. `hoy` se inyecta (no usar el reloj dentro de la función). Frontend, backend y jobs usan esa misma función; prohibido duplicar la lógica.
- Si usas una expresión SQL equivalente para recalcular en masa, añade un test de paridad que compare ambas implementaciones.
- Fechas manejadas como fecha de calendario (sin hora) en la zona horaria del negocio (configurable). Sin mezclar UTC y hora local.
- Tests primero, con casos de frontera: día exacto de FD, día exacto de V, exactamente U días, U+1 días, con y sin política, política mayor que el umbral, años bisiestos, cambio de mes y de año. Cobertura 100% de ramas en esta función.
- Ejemplos que deben pasar (H = 2026-11-09, U = 60):
  - V = 2026-11-01, sin política → vencido
  - V = 2026-12-20, sin política → ofertar
  - V = 2027-03-01, sin política → neutro
  - V = 2027-01-15, P = 30 (FD = 2026-12-16) → devolucion
  - V = 2026-12-01, P = 30 (FD = 2026-11-01) → ofertar
  - V = 2027-06-01, P = 30 → neutro

## 3. Stack propuesto (justifica cualquier cambio con datos)
- Monorepo con pnpm workspaces: `apps/web`, `apps/api`, `packages/shared`.
- Frontend: Vite + React + TypeScript + TanStack Query + TanStack Table + TanStack Virtual.
- Backend: Fastify + Pino (logging estructurado, sin `console.log`) + Zod.
- Base de datos: PostgreSQL con Drizzle (o Prisma, si lo justificas).
- Zod en `shared` como contrato único: valida filas del Excel, peticiones de la API y formularios; los tipos se infieren con `z.infer`.
- SWC y Turborepo solo si mides un problema real de tiempos de build. No los adoptes por moda.

## 4. Importación de Excel (requisito crítico de rendimiento)
1. El archivo se procesa en el backend como trabajo en segundo plano. Prohibido parsear Excel en el navegador o dentro del ciclo de la petición HTTP.
2. Lectura en streaming; no cargar el archivo completo en memoria.
3. Carga por tabla de staging (COPY o inserts por lotes de 1.000–5.000 filas) y luego un único upsert (`INSERT ... ON CONFLICT DO UPDATE`) en una transacción. Compara ambas estrategias con un benchmark y elige la más rápida.
4. Validación de cabeceras antes de procesar (normalizando tildes, mayúsculas y espacios). Validación de cada fila con Zod.
5. Las filas inválidas no abortan la importación: se acumulan en un reporte descargable (fila, columna, motivo). Resultado posible: completada, completada con errores o fallida.
6. Idempotencia: reimportar el mismo archivo no duplica ni cambia nada. Guardar hash del archivo, fecha, usuario y conteos.
7. El estado se calcula durante la importación. Si el estado del archivo difiere del calculado, se registra como discrepancia en el reporte (sin bloquear).
8. Parsers puros y testeados: `parsePoliticaDevolucion` y `parseTrazabilidad` (lote + fecha). Todo valor no reconocido se reporta; nunca se adivina en silencio.
9. Progreso visible en la interfaz (polling con TanStack Query o SSE) sin bloquear la aplicación.
10. Presupuesto: archivo de 100.000 filas importado en ≤ 60 s sin degradar los listados.

## 5. Modelo de datos y base de datos
- Tablas: `productos` (con `fecha_vencimiento`, `dias_politica_devolucion`, `fecha_devolucion`, `estado`, `on_hand`, `saldo`, `uom`, `laboratorio`, `marca`, `lote`, `estado_origen`), `historial_estados`, `importaciones`, `importacion_errores`, `configuracion`.
- El `estado` se guarda desnormalizado e indexado. Se actualiza al importar/editar y mediante un job diario (por defecto 00:05, zona horaria del negocio) que solo toca las filas que cambian de estado y registra cada cambio en el historial.
- Índices justificados con `EXPLAIN ANALYZE`: (estado, fecha de referencia, id) para listados por cursor; trigram (`pg_trgm`) para búsqueda por descripción; índices para código de artículo, laboratorio y marca; índices parciales si algún estado es minoritario.
- Paginación por cursor (keyset). Prohibido OFFSET en listados grandes. Prohibido el N+1.
- Contadores por estado: consulta agregada indexada con caché corto o vista materializada (evalúa ambas y decide con datos).
- Migraciones versionadas y reversibles.

## 6. Frontend rápido
- Todo dato del servidor pasa por TanStack Query: claves centralizadas, `staleTime` por tipo de dato, desduplicación, prefetch y actualizaciones optimistas.
- Tablas virtualizadas, búsqueda con debounce, división de código por ruta, estados de carga y error explícitos (nunca pantalla en blanco).
- Funcionalidad: lista de productos filtrable por estado, laboratorio, marca y búsqueda; panel con contadores por estado; pantalla de importación con progreso, historial y descarga del reporte de errores; configuración del umbral U y la zona horaria.

## 7. Presupuestos de rendimiento (con 500.000 productos de prueba)
- Listado paginado o filtrado: p95 de API ≤ 150 ms.
- Búsqueda: p95 ≤ 250 ms.
- Edición o cambio de un producto: p95 ≤ 150 ms.
- Carga inicial (LCP) ≤ 2 s en 4G; JS inicial ≤ 200 KB gzip.
- Recálculo diario de estados: ≤ 60 s.
Una funcionalidad que rompa un presupuesto no está terminada.

## 8. Seguridad y operación
Autenticación y roles en cada endpoint, auditoría de cambios, variables de entorno validadas con Zod al arrancar, sin secretos en el repositorio, métricas de latencia por endpoint y alerta si falla el job diario.

## 9. Cómo debes trabajar
1. Si ya existe código, empieza con una auditoría: cuellos de botella ordenados por impacto (base de datos, API, frontend, build), con archivos y líneas concretas, y métricas base antes de cambiar nada.
2. Orden de implementación: (1) paquete `shared` con `calcularEstado`, parsers y tests; (2) esquema, migraciones e índices; (3) importación de Excel; (4) API y job diario; (5) frontend; (6) dataset sintético de 500.000 filas, pruebas de carga (k6 o autocannon) y ajuste.
3. Entrega por fases pequeñas. Cada fase incluye: archivos a tocar, código concreto, test que la valida, riesgo, cómo revertir y la métrica medida frente a los presupuestos.
4. Si una tecnología o supuesto no aporta una mejora medible, dilo y propón una alternativa. Si un supuesto de la sección 1 resulta incorrecto con los datos reales, avísame antes de continuar.
5. Commits pequeños, sin romper lo existente. Pregúntame antes de cualquier cambio destructivo en el esquema.

Comienza con el paso 1 (auditoría, o diseño inicial si no hay código) y pídeme un Excel de ejemplo con al menos 10 filas reales, sobre todo de las columnas Trazabilidad, Politica devolucion y Estado.
#>
