# Feature Specification: Spec 007 — Estados

**Feature Branch**: `007-estados`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 007 estados"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprender la clasificación de un producto (Priority: P1)

Como Administrador, necesito consultar el estado calculado y la alerta aplicable a cada producto,
para decidir si debe mantenerse en oferta o atenderse por devolución.

**Why this priority**: La clasificación por vencimiento y política de devolución es el objetivo
central de control de productos de Nexo.

**Independent Test**: Preparar productos con fechas y políticas distintas, consultar su estado
antes, en y después de las fechas límite, y comparar el resultado con las reglas aprobadas.

**Acceptance Scenarios**:

1. **Given** un producto con fecha de vencimiento válida y política de devolución, **When** la
   fecha actual es anterior a su fecha efectiva, **Then** su estado es "Neutro".
2. **Given** un producto con política de devolución, **When** la fecha actual está entre la fecha
   efectiva y la fecha de vencimiento original, inclusive, **Then** su estado es
   "Vencido + Devolución".
3. **Given** un producto con política o sin ella, **When** la fecha actual es posterior a su
   vencimiento original, **Then** su estado es "Vencido + Ofertar".
4. **Given** un producto no tiene una fecha de vencimiento válida, **When** se consulta el
   inventario, **Then** no se le asigna estado ni alerta calculados.
5. **Given** un producto vence el 31 de marzo de 2027 y tiene la política "1 mes antes", **When**
   se calcula su fecha efectiva, **Then** esta es el 28 de febrero de 2027, último día calendario
   de ese mes.

---

### User Story 2 - Detectar productos próximos a la fecha relevante (Priority: P1)

Como Administrador, necesito ver la alerta "Pronto a vencer" separada del estado para anticipar
una devolución o el vencimiento sin confundir la alerta con la clasificación del producto.

**Why this priority**: La alerta permite actuar antes de que cambie el estado y conserva el
significado de cada estado.

**Independent Test**: Consultar productos dentro y fuera de la ventana de 30 días respecto de su
fecha efectiva o vencimiento original y comprobar que la alerta no cambia su estado.

**Acceptance Scenarios**:

1. **Given** un producto con política de devolución, **When** la fecha actual está en los 30 días
   calendario anteriores a su fecha efectiva, **Then** se muestra "Pronto a vencer" sin cambiar el
   estado calculado.
2. **Given** un producto sin política de devolución y con vencimiento válido, **When** la fecha
   actual está en los 30 días calendario anteriores a su vencimiento original, **Then** se muestra
   "Pronto a vencer" sin cambiar el estado "Ofertar".
3. **Given** la fecha actual es la fecha efectiva o el vencimiento original, **When** se consulta
   la alerta, **Then** el producto ya no está en la ventana previa de "Pronto a vencer".

---

### User Story 3 - Consultar estados coherentes en las vistas (Priority: P2)

Como Administrador, necesito que el inventario, los filtros, el panel y los reportes presenten
los mismos estados y conteos para poder confiar en la clasificación del sistema.

**Why this priority**: Una clasificación consistente evita que una persona tome decisiones
distintas según la pantalla que consulte.

**Independent Test**: Usar el mismo conjunto de productos en la tabla, el panel y el reporte Excel
y verificar que cada estado, alerta y conteo coincide.

**Acceptance Scenarios**:

1. **Given** un conjunto de productos con datos válidos, **When** se consulta en el inventario,
   el panel o el reporte, **Then** cada producto conserva el mismo estado y alerta.
2. **Given** productos con estados calculados distintos, **When** el Administrador consulta el
   resumen, **Then** los conteos de los cuatro estados no se superponen y las alertas se cuentan
   por separado.
3. **Given** un producto carece de fecha de vencimiento, **When** se muestran los totales,
   **Then** se incluye en el total general y en el conteo separado de productos sin clasificación,
   no en un estado calculado.

### Edge Cases

- La fecha efectiva para una política de meses anteriores cae en un mes más corto que el mes de
  vencimiento, o en febrero de un año bisiesto.
- El vencimiento ocurre el primer día del mes y coincide con la fecha efectiva de "En el mes".
- La fecha actual coincide exactamente con la fecha efectiva, con el vencimiento original o con
  el primer día de la ventana de alerta.
- Un producto no tiene fecha de vencimiento, tiene una fecha inválida o no tiene política de
  devolución.
- Una fecha de vencimiento o política cambia y la clasificación anterior ya no corresponde.
- Un valor de estado proveniente de una importación o de datos antiguos contradice el cálculo.
- La vista del inventario contiene los estados heredados "Devolución", "Vencido" o "Bajo stock".
- El producto aparece en una alerta y, al mismo tiempo, tiene un estado calculado válido.
- El cambio de fecha entre días consecutivos afecta el estado, la alerta o los conteos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El estado MUST calcularse automáticamente a partir de la fecha de vencimiento
  válida y la política de devolución vigente. MUST NOT importarse desde Excel ni modificarse
  manualmente.
- **FR-002**: La fecha de vencimiento MUST ser la fecha de calendario registrada separadamente
  conforme a las Specs 000 y 004. Cuando falte o no sea válida, Nexo MUST NOT calcular estado ni
  alerta para ese producto.
- **FR-003**: Para "En el mes", la fecha efectiva MUST ser el primer día del mes de vencimiento.
  Para "1 mes antes", "2 meses antes" y "3 meses antes", MUST restarse esa cantidad de meses
  calendario a la fecha de vencimiento, manteniendo el número de día cuando exista en el mes
  destino; si no existe, MUST usarse el último día calendario de ese mes.
- **FR-004**: Para un producto con política de devolución, antes de la fecha efectiva MUST
  asignarse el estado "Neutro". Desde la fecha efectiva hasta el vencimiento original, ambas
  fechas inclusive, MUST asignarse "Vencido + Devolución".
- **FR-005**: Para un producto con política de devolución, desde el día calendario siguiente al
  vencimiento original MUST asignarse "Vencido + Ofertar".
- **FR-006**: Para un producto sin política de devolución, hasta el vencimiento original
  inclusive MUST asignarse "Ofertar"; desde el día siguiente MUST asignarse
  "Vencido + Ofertar".
- **FR-007**: La clasificación inicial MUST limitarse a "Neutro", "Ofertar",
  "Vencido + Devolución" y "Vencido + Ofertar". MUST NOT asignarse "Devolución", "Vencido" ni
  "Bajo stock" como estados independientes.
- **FR-008**: "Pronto a vencer" MUST ser una alerta independiente y MUST NOT cambiar el estado.
  Con política de devolución, la alerta MUST mostrarse desde 30 días calendario antes de la fecha
  efectiva hasta el día anterior a esta. Sin política, MUST mostrarse desde 30 días calendario
  antes del vencimiento original hasta el día anterior a este.
- **FR-009**: Los estados MUST ser categorías mutuamente excluyentes. La alerta MUST poder
  coexistir con el estado calculado y sus conteos MUST presentarse por separado.
- **FR-010**: El total de productos MUST incluir los productos sin fecha de vencimiento válida;
  estos MUST contarse separadamente como sin clasificación y MUST NOT recibir un estado nuevo.
- **FR-011**: Los estados y alertas MUST actualizarse cuando cambie la fecha de referencia, la
  fecha de vencimiento o la política de devolución, sin requerir que una persona edite el estado.
- **FR-012**: El inventario, sus filtros, el panel y los reportes MUST presentar etiquetas y
  conteos coherentes con esta clasificación. Los filtros de estado MUST limitarse a los cuatro
  estados aprobados y MUST mantener "Pronto a vencer" como filtro separado. Los estados de
  prototipo que no pertenezcan a la clasificación aprobada MUST NOT aparecer como estados válidos.
- **FR-013**: Todas las comparaciones MUST basarse en fechas calendario, sin hora del día, y
  MUST usar la misma fecha de referencia de negocio en todas las vistas de Nexo.
- **FR-014**: Si se muestran días relativos, el día de referencia MUST ser el día cero; los días
  restantes o transcurridos MUST calcularse como diferencias entre fechas calendario.

### Key Entities *(include if feature involves data)*

- **Fecha de vencimiento**: Fecha de calendario registrada para un producto y usada como límite
  original de su clasificación.
- **Política de devolución**: Valor asignado al producto que define si su fecha efectiva es el
  vencimiento o una fecha anterior calculada por meses calendario.
- **Estado calculado**: Una de las cuatro categorías excluyentes derivadas de la fecha efectiva,
  vencimiento original y política.
- **Alerta de vencimiento o devolución**: Indicador "Pronto a vencer" que se calcula en una
  ventana separada y puede coexistir con el estado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los productos con fecha válida y política conocida recibe exactamente el
  estado determinado por las reglas y límites de fecha aprobados.
- **SC-002**: El 100% de los casos de fin de mes, febrero y año bisiesto calcula la fecha efectiva
  esperada conforme a las reglas de meses calendario.
- **SC-003**: El 100% de los productos sin fecha válida aparece sin estado ni alerta calculados,
  pero permanece incluido en el total general.
- **SC-004**: El 100% de las alertas "Pronto a vencer" se activa únicamente en la ventana de 30
  días aprobada y no altera los conteos de estado.
- **SC-005**: El 100% de los productos tiene la misma clasificación en inventario, panel y reporte
  cuando se consulta usando la misma fecha de referencia.

## Assumptions

- El usuario confirmó que se usarán los estados de la constitución, sin estado independiente
  "Devolución" ni "Bajo stock".
- El usuario confirmó que el cálculo de meses calendario ajustará al último día válido del mes
  destino y que los límites de estado serán inclusivos hasta la fecha de vencimiento original.
- El usuario confirmó que "Pronto a vencer" también aplica a productos sin política de devolución,
  usando los 30 días anteriores al vencimiento original.
- La fecha de vencimiento se registra como `AAAA-MM-DD`, separada del Excel, según la Spec 004.
- Las fechas se comparan usando una única fecha de negocio configurada para Nexo; la zona horaria
  concreta se define en la configuración del entorno antes de la implementación.
- Los estados del prototipo que contradigan estas reglas deben armonizarse antes de incorporarse
  al inventario, panel, filtros o reportes.
