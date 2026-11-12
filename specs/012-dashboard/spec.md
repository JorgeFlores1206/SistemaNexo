# Feature Specification: Spec 012 — Dashboard operativo de inventario

**Feature Branch**: `012-dashboard`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "dashboard"

**Dependencies**: Spec 005 define los roles y permisos; Specs 007, 008 y 009 definen estados,
productos y cantidades; Spec 010 define ajustes físicos; Spec 011 define el reporte mensual
anticipado de vencimientos.

## Clarifications

### Session 2026-11-12

- Q: ¿Cómo debe actualizarse la información del dashboard? → A: Cargar al abrir y actualizar
  mediante un botón visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar el estado general del inventario (Priority: P1)

Como Usuario, necesito ver un resumen claro del inventario para identificar rápidamente productos
próximos a vencer, vencidos, dañados y situaciones que requieren atención.

**Why this priority**: El dashboard es el punto de entrada operativo para comprender el estado del
inventario sin revisar manualmente toda la tabla.

**Independent Test**: Preparar productos con estados, alertas, cantidades y condiciones distintas;
abrir el dashboard como Usuario y comprobar que los indicadores coinciden con el inventario vigente.

**Acceptance Scenarios**:

1. **Given** un inventario con productos en varios estados, **When** el Usuario abre el dashboard,
   **Then** ve los conteos de productos por estado calculado según las reglas vigentes.
2. **Given** productos dentro de la ventana "Pronto a vencer", **When** se consulta el dashboard,
   **Then** el Usuario ve el total de alertas y puede identificar los productos correspondientes.
3. **Given** productos marcados como "Dañado", **When** se consulta el dashboard, **Then** la
   condición se muestra como indicador separado y no se mezcla con el estado calculado.
4. **Given** un inventario sin productos o sin alertas, **When** se abre el dashboard, **Then** se
   muestran ceros y mensajes claros, sin presentar datos inventados.

### User Story 2 - Revisar prioridades operativas (Priority: P1)

Como Usuario, necesito consultar las prioridades del inventario desde el dashboard para decidir
qué productos revisar, devolver u ofrecer primero.

**Why this priority**: Los indicadores solo son útiles si permiten pasar del resumen a una acción
operativa respaldada por los datos.

**Independent Test**: Preparar productos próximos a vencer, vencidos, dañados y con cantidades
registradas; seleccionar cada indicador y verificar que la lista resultante contiene únicamente los
productos que explican ese indicador.

**Acceptance Scenarios**:

1. **Given** un indicador con productos asociados, **When** el Usuario lo selecciona, **Then** Nexo
   muestra una lista filtrada con código, nombre, estado, fechas relevantes y cantidad disponible.
2. **Given** una prioridad de vencimiento, **When** se consulta la lista, **Then** los productos
   aparecen ordenados por la fecha relevante más cercana.
3. **Given** un producto con política de devolución, **When** aparece en una prioridad de
   vencimiento, **Then** el dashboard utiliza la fecha efectiva y mantiene el estado calculado
   separado de la alerta.
4. **Given** que el Usuario no tiene permiso administrativo, **When** intenta abrir una función
   administrativa desde el dashboard, **Then** Nexo deniega la operación sin revelar datos fuera
   de su alcance.

### User Story 3 - Consultar información administrativa ampliada (Priority: P2)

Como Administrador, necesito consultar indicadores ampliados y el resultado del reporte mensual
anticipado para supervisar el inventario y tomar decisiones de gestión.

**Why this priority**: El Administrador requiere una visión consolidada para revisar el estado de
la operación y la disponibilidad del reporte mensual.

**Independent Test**: Iniciar sesión como Administrador con un reporte mensual generado, vacío y
fallido; comprobar que cada resultado se distingue y que los indicadores administrativos respetan
la matriz de permisos.

**Acceptance Scenarios**:

1. **Given** un reporte mensual generado correctamente, **When** el Administrador consulta el
   dashboard, **Then** ve el mes de referencia, fecha de negocio, resultado y cantidad incluida.
2. **Given** un reporte mensual vacío, **When** el Administrador consulta el dashboard, **Then**
   se muestra como generado sin productos y no como una falla.
3. **Given** una generación fallida, **When** el Administrador consulta el dashboard, **Then** se
   muestra que el reporte no está disponible y no se presenta un resultado anterior como actual.
4. **Given** un Usuario consulta el dashboard, **When** la vista contiene información exclusiva
   del Administrador, **Then** esa información no se muestra ni puede obtenerse mediante una ruta
   directa.

## Edge Cases

- El inventario cambia mientras se consultan los indicadores.
- La fecha de negocio cambia y las alertas deben seguir usando una única fecha configurada.
- Un producto no tiene vencimiento válido.
- Un producto tiene condición "Dañado" y simultáneamente otro estado o alerta.
- Existen productos sin cantidades registradas o con saldo igual a cero.
- Un indicador no tiene productos asociados.
- El reporte mensual aún no existe, está vacío o terminó en fallo.
- Una persona intenta acceder directamente a una prioridad o indicador sin autorización.
- La consulta del inventario falla o se interrumpe mientras se carga el dashboard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Nexo MUST mostrar un dashboard operativo para los roles Administrador y Usuario,
  respetando la matriz de permisos de la Spec 005.
- **FR-002**: El dashboard MUST mostrar conteos consistentes con el inventario vigente para los
  estados calculados aprobados: "Neutro", "Ofertar", "Vencido + Devolución" y "Vencido + Ofertar".
- **FR-003**: La alerta "Pronto a vencer" MUST mostrarse separada de los estados y MUST usar la
  ventana de 30 días y la fecha de negocio definidas por la constitución y la Spec 007.
- **FR-004**: La condición "Dañado" MUST mostrarse separada de estados y alertas, y MUST no
  modificar los conteos de estados.
- **FR-005**: Los indicadores de cantidades MUST respetar el significado de `On hand` y `Saldo`
  definido por la Spec 009; el dashboard MUST distinguir ambos valores cuando los presente.
- **FR-006**: Los productos sin fecha de vencimiento válida MUST quedar fuera de los conteos de
  vencimiento y alertas, sin recibir fechas o estados inventados.
- **FR-007**: Cada indicador seleccionable MUST permitir consultar los productos que lo componen,
  mostrando como mínimo código, nombre, estado, fecha relevante cuando corresponda y cantidades
  disponibles.
- **FR-008**: Las listas derivadas de prioridades de vencimiento MUST ordenar los productos por la
  fecha relevante más cercana y MUST conservar la regla de fecha efectiva para devoluciones.
- **FR-009**: El dashboard MUST comunicar estados de carga, inventario vacío, ausencia de
  resultados y error de consulta en español.
- **FR-010**: La información exclusiva del Administrador, incluido el resultado del reporte
  mensual de la Spec 011, MUST estar protegida en la operación y no solo ocultarse visualmente.
- **FR-011**: Cuando exista un reporte mensual, el Administrador MUST distinguir entre resultado
  generado con productos, resultado vacío y generación fallida.
- **FR-012**: El dashboard MUST usar una fecha de negocio coherente en todos sus indicadores y
  mostrarla cuando los valores dependan de fechas.
- **FR-013**: Los controles y mensajes MUST estar en español y ser utilizables con controles
  semánticos, teclado y foco visible.
- **FR-014**: Esta Spec cubre consulta y priorización dentro del dashboard. No MUST crear nuevas
  reglas de estado, movimientos de inventario, ajustes físicos, importación, envío de reportes ni
  permisos administrativos.
- **FR-015**: El dashboard MUST cargar sus indicadores al abrirse y MUST ofrecer un control visible
  para que la persona solicite una actualización manual. Nexo MUST comunicar el estado de carga y
  conservar los datos anteriores mientras una actualización está en curso, salvo que la consulta
  responda con un error explícito.

## Key Entities

- **Indicador de inventario**: Resumen cuantificado de estados, alertas, condiciones o cantidades.
- **Prioridad operativa**: Lista de productos que explica un indicador seleccionado.
- **Resumen de reporte mensual**: Resultado administrativo del reporte de la Spec 011.
- **Fecha de negocio**: Fecha común utilizada para calcular estados, alertas y prioridades.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En todos los escenarios validados, los conteos del dashboard coinciden con el
  inventario vigente y no duplican productos.
- **SC-002**: El 100% de los productos dentro de la ventana aprobada de "Pronto a vencer" aparece
  en su indicador y ningún producto sin fecha válida aparece por vencimiento.
- **SC-003**: El 100% de las prioridades seleccionadas muestra únicamente los productos que forman
  el indicador y conserva sus datos de estado, fechas y cantidades.
- **SC-004**: El 100% de las consultas de Usuario oculta y deniega información exclusiva del
  Administrador, incluso mediante acceso directo.
- **SC-005**: El dashboard comunica inventario vacío, ausencia de resultados y errores sin mostrar
  datos inventados ni presentar fallos como resultados válidos.
- **SC-006**: Una persona puede identificar la prioridad operativa de un producto en menos de 30
  segundos desde la apertura del dashboard.
- **SC-007**: Todos los indicadores y mensajes pueden utilizarse mediante teclado y mantienen un
  foco visible.

## Assumptions

- El dashboard reutiliza estados, alertas, fechas, productos y cantidades ya aprobados por las
  Specs vigentes; no redefine reglas de negocio.
- Administrador y Usuario pueden consultar el resumen operativo, pero solo el Administrador ve el
  resultado del reporte mensual y cualquier información administrativa ampliada.
- Los indicadores representan los datos disponibles al momento de la consulta; no se crea un
  snapshot histórico del dashboard.
- La navegación desde un indicador lleva a una consulta filtrada del inventario y no crea una
  operación de modificación.
- La información no se actualiza automáticamente por intervalo; la persona utiliza el botón visible
  de actualización cuando necesita consultar cambios recientes.
- Los ajustes, movimientos, importaciones y cambios de productos se ejecutan en sus Specs
  respectivas, no desde esta función.
