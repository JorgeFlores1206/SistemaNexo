# Feature Specification: Spec 009 — Cantidades y condición de los artículos

**Feature Branch**: `009-cantidades-articulos`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Gestionar las cantidades actuales y si cada artículo está dañado, sin registrar cuándo llegó o salió del inventario."

## Clarifications

### Session 2026-11-11

- Q: ¿Qué tipo de dato tienen `On hand` y `Saldo`? → A: Son enteros no negativos, conforme a la decisión registrada en la Spec 000.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Actualizar las cantidades actuales (Priority: P1)

Como Administrador, necesito mantener las cantidades actuales de un artículo y marcar si está
dañado para que el inventario muestre sus datos vigentes sin registrar entradas o salidas físicas.

**Why this priority**: Mantener las cantidades actuales es parte del control central del
inventario y no requiere administrar compras, recepciones ni movimientos históricos.

**Independent Test**: Con una cuenta Administrador y un producto existente, actualizar "On hand"
o "Saldo", marcarlo como dañado y verificar que se actualicen esos datos sin crear registros de
entradas, salidas ni movimientos físicos.

**Acceptance Scenarios**:

1. **Given** un Administrador y un producto existente, **When** actualiza "On hand" o "Saldo" con
   un valor numérico válido no negativo, **Then** Nexo guarda ese valor actual y conserva sin
   cambios el otro campo si no fue editado.
2. **Given** una cantidad vacía, negativa o inválida, **When** el Administrador intenta guardarla,
   **Then** Nexo rechaza el cambio, identifica el campo y conserva el valor anterior.
3. **Given** el cambio se guarda correctamente, **When** se consulta el inventario o el panel,
   **Then** se muestra la cantidad actualizada sin cambiar el estado calculado del artículo por
   motivo de cantidad.
4. **Given** un Usuario sin permiso de gestión de productos, **When** intenta actualizar una
   cantidad, **Then** Nexo deniega la operación sin modificar el artículo.
5. **Given** ocurre un error al guardar, **When** finaliza la solicitud, **Then** Nexo informa que
   el cambio no se completó y no presenta una confirmación de éxito.
6. **Given** un artículo existente, **When** el Administrador marca o desmarca "Dañado",
   **Then** Nexo guarda la condición separadamente y conserva sin cambios el estado y la alerta
   calculados por fecha.

### User Story 2 - Consultar cantidades junto con los datos del artículo (Priority: P2)

Como Administrador, necesito consultar las cantidades actuales junto con los datos y el estado
del artículo para revisar el inventario en un solo contexto.

**Why this priority**: Una vista consistente ayuda a interpretar los valores registrados sin
confundirlos con movimientos de entradas o salidas.

**Independent Test**: Actualizar ambos campos de cantidad de un artículo y comprobar que la vista
del inventario, el panel y los reportes que incluyen esos campos reflejan los valores actuales.

**Acceptance Scenarios**:

1. **Given** un artículo con cantidades válidas, **When** el Administrador lo consulta,
   **Then** Nexo muestra "On hand" y "Saldo" con los significados definidos en la Spec 000.
2. **Given** una cantidad cambia, **When** se consulta el mismo artículo en vistas autorizadas,
   **Then** todas muestran el valor actual guardado.

### Edge Cases

- El valor actual del producto está vacío o no puede interpretarse como número.
- El Administrador intenta ingresar texto, un número negativo o un formato inválido.
- Se intenta actualizar una cantidad mientras otra persona modifica el mismo artículo.
- El Usuario intenta acceder a la operación mediante una ruta directa.
- El guardado falla después de enviar el cambio.
- La cantidad cambia, pero no coincide con los datos de una exportación generada anteriormente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Solo el Administrador MUST poder modificar las cantidades de un artículo, conforme
  a la matriz de permisos de la Spec 005. El Usuario MUST NOT recibir acceso a esta operación.
- **FR-002**: El Administrador MUST poder consultar y actualizar por separado los valores actuales
  "On hand" y "Saldo" de un artículo existente, respetando los significados de la Spec 000.
- **FR-003**: Cada cantidad informada MUST ser un entero no negativo, conforme a las Specs 000 y
  004. Nexo MUST rechazar valores inválidos y conservar el valor actual sin cambios.
- **FR-004**: Una actualización MUST modificar únicamente los campos de cantidad que el
  Administrador haya editado; MUST NOT alterar otros datos del artículo ni su estado calculado.
- **FR-005**: Cuando dos cambios concurrentes afecten el mismo artículo, Nexo MUST evitar que una
  actualización sobrescriba silenciosamente la otra y MUST comunicar el conflicto para que el
  Administrador pueda revisar el valor vigente.
- **FR-006**: Si la actualización falla, Nexo MUST comunicar el error y MUST NOT mostrar éxito ni
  dejar un valor parcialmente actualizado.
- **FR-007**: Cada cambio de cantidad confirmado MUST registrarse en la bitácora conforme a la
  regla de trazabilidad vigente. El registro MUST identificar actor, artículo, campos cambiados,
  resultado y momento, sin copiar datos ajenos a la operación. Solo el Administrador puede
  consultar la bitácora.
- **FR-008**: Las cantidades actuales MUST reflejarse de forma coherente en las vistas de
  inventario, panel y reportes que incluyan los campos correspondientes.
- **FR-009**: Esta Spec gestiona valores actuales de cantidad. MUST NOT crear registros de
  entradas o salidas, movimientos de inventario, fechas de llegada o retiro, proveedores, compras,
  recepción de mercancías ni transferencias entre almacenes.
- **FR-010**: Esta Spec MUST NOT permitir modificar manualmente los estados calculados por fecha
  y política de devolución; estos siguen las reglas de la constitución y la Spec 007.
- **FR-011**: Las acciones y mensajes MUST estar en español y poder operarse con controles
  semánticos, navegación por teclado y foco visible.
- **FR-012**: El Administrador MUST poder marcar o desmarcar la condición "Dañado" en un artículo
  existente. La condición MUST guardarse separadamente del estado calculado y MUST NOT cambiar la
  alerta ni los conteos de estados.
- **FR-013**: Los cambios confirmados de la condición "Dañado" MUST quedar registrados en la
  bitácora conforme a las mismas reglas de actor, momento, resultado y acceso de FR-007.

### Key Entities *(include if feature involves data)*

- **Artículo**: Producto del inventario con valores actuales independientes "On hand" y "Saldo",
  condición "Dañado" y estado calculado por fechas según las definiciones de las Specs 000 y 007.
- **Cambio de artículo**: Actualización de uno o ambos valores actuales o de la condición
  "Dañado", atribuida a un Administrador y registrada en la bitácora; no representa una entrada ni
  una salida física.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las actualizaciones válidas modifica únicamente los campos de cantidad
  indicados y conserva el resto de los datos del artículo.
- **SC-002**: El 100% de las cantidades negativas o inválidas se rechaza sin modificar el valor
  vigente.
- **SC-003**: El 100% de los cambios confirmados aparece en bitácora con actor, momento, campos
  cambiados y resultado.
- **SC-004**: El 100% de las vistas autorizadas que presentan una cantidad reflejan el valor
  actual guardado.
- **SC-005**: El 100% de los intentos no autorizados se deniega sin modificar cantidades.
- **SC-006**: Ninguna actualización de cantidades crea un registro de entrada, salida, recepción
  o movimiento físico.
- **SC-007**: El 100% de las actualizaciones de "Dañado" conserva sin cambios el estado y la
  alerta calculados; la condición se presenta por separado y queda registrada en bitácora.

## Assumptions

- "On hand" conserva el significado de cantidad física y "Saldo" el significado definido en la
  Spec 000; ambos son enteros no negativos y los campos pueden actualizarse independientemente.
- La actualización está restringida al Administrador porque la Spec 005 no concede al Usuario
  permisos de gestión de productos.
- Los cambios de cantidad deben aparecer en la bitácora, como el usuario indicó para los registros
  del sistema; dicha auditoría no constituye un historial de entradas o salidas físicas.
- "Dañado" es una condición del artículo, no un estado calculado; puede coexistir con cualquier
  estado por fecha y se registra conforme a la constitución y la Spec 007.
- Las cantidades y sus estados por fecha son conceptos separados: el estado calculado se rige por
  la constitución y la Spec 007.
- No se manejan compras, proveedores, recepción, fecha de llegada o salida, múltiples almacenes
  ni un historial de movimientos en esta función.
