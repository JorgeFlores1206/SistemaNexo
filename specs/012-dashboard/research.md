# Research: Spec 012

## Decision: Calcular indicadores desde las reglas de inventario existentes

**Rationale**: La constitución exige que estados, alertas y condición `Dañado` sean coherentes entre inventario, panel y reportes. El dashboard no debe mantener una segunda interpretación.

**Alternatives considered**: Guardar contadores independientes; rechazado porque quedarían obsoletos tras cambios de inventario.

## Decision: Carga inicial y actualización manual explícita

**Rationale**: Es la decisión aclarada por el usuario: la vista carga al abrir y ofrece un botón visible. Durante la actualización conserva el último resultado válido.

**Alternatives considered**: Polling automático; rechazado por alcance y por cambios inesperados mientras se revisa una prioridad.

## Decision: Separar resumen global de lista de prioridad

**Rationale**: Los indicadores sirven para orientación rápida y las listas contienen los productos que explican cada indicador. Esta separación permite estados vacíos y orden específico por fecha relevante.

**Alternatives considered**: Cargar todo el inventario en el dashboard; rechazado por mayor volumen y peor foco operativo.

## Decision: Proteger el resumen administrativo en backend

**Rationale**: Ocultar una tarjeta no satisface la constitución. El backend debe aplicar la matriz de la Spec 005 al resumen del reporte 011 y cualquier indicador administrativo.

**Alternatives considered**: Control visual únicamente; rechazado por permitir acceso directo.

## Decision: No persistir snapshot del dashboard

**Rationale**: La Spec define indicadores del inventario vigente al momento de consulta; solo el reporte mensual tiene persistencia propia.

**Alternatives considered**: Historial de snapshots; fuera de alcance y requiere una decisión adicional de retención.
