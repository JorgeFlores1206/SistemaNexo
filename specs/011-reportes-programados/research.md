# Research: Spec 011

## Decision: Reutilizar las reglas de fecha de negocio y alerta de la constitución/Spec 007

**Rationale**: La Spec exige que el reporte no calcule una categoría independiente. La fecha efectiva con política de devolución o el vencimiento original sin política determina la ventana inclusiva de 30 días, excluyendo la fecha relevante.

**Alternatives considered**: Copiar la lógica en el reporte; rechazado porque produciría divergencias entre inventario, panel, estados y reporte.

## Decision: Persistir una generación por mes de referencia con restricción única

**Rationale**: La idempotencia debe garantizar que reintentos no creen reportes duplicados visibles. La unicidad debe estar en PostgreSQL, además de la protección en servicio.

**Alternatives considered**: Conservar solo el último resultado en memoria; rechazado por pérdida de trazabilidad y reinicios del servicio.

## Decision: Ejecutar la generación mediante un caso de uso invocable por scheduler y por reintento administrativo controlado

**Rationale**: La función requiere generación automática, pero el dominio debe ser testeable sin depender del reloj o del proveedor de despliegue. El scheduler solo dispara el caso de uso; la lógica permanece en el servicio.

**Alternatives considered**: Función exclusiva del proveedor cloud; rechazada como acoplamiento innecesario.

## Decision: Registrar bitácora resumida, no una copia redundante del reporte

**Rationale**: FR-010 exige mes, fecha de negocio, resultado y cantidad, sin copiar innecesariamente todos los datos. Las filas persistidas del reporte conservan la consulta vigente.

**Alternatives considered**: Guardar únicamente un JSON completo; rechazado por peor integridad referencial y consulta.

## Decision: API NestJS protegida y contratos Zod compartidos

**Rationale**: Es la arquitectura aprobada: el navegador no toca PostgreSQL y backend/frontend comparten validación de forma explícita.

**Alternatives considered**: Acceso directo desde React a Supabase; prohibido por la constitución.
