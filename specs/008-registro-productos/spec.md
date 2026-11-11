# Feature Specification: Spec 008 — Registro manual de productos

**Feature Branch**: `008-registro-productos`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Permitir que el Administrador registre productos manualmente, además de las opciones de importación existentes."

## Clarifications

### Session 2026-11-11

- Q: ¿Qué formato de fecha y tipo de cantidad aplican al registro manual? → A: La fecha de vencimiento usa `DD/MM/YYYY`; `On hand` y `Saldo` son enteros no negativos.
- Q: ¿Qué ocurre ante un doble envío del registro? → A: El sistema impide el doble envío y no crea duplicados ante reintentos.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar un producto manualmente (Priority: P1)

Como Administrador, necesito registrar un producto directamente en Nexo para incorporar
artículos al inventario sin preparar un archivo Excel.

**Why this priority**: El registro manual ofrece una forma directa de mantener el inventario
cuando no se está realizando una importación.

**Independent Test**: Con una cuenta Administrador, registrar un producto con un código nuevo y
los datos disponibles; confirmar que aparece una sola vez en el inventario y que los valores
guardados coinciden con los ingresados.

**Acceptance Scenarios**:

1. **Given** un Administrador autenticado y un código de artículo que no existe, **When** completa
   los datos válidos y confirma el registro, **Then** Nexo crea el producto y comunica que se
   guardó correctamente.
2. **Given** el formulario de registro, **When** el Administrador deja vacío un campo opcional,
   **Then** Nexo permite guardar el producto y conserva ese campo sin valor.
3. **Given** un código de artículo ya registrado, **When** el Administrador intenta crear otro
   producto con ese código, **Then** Nexo rechaza el registro, identifica el código duplicado y
   conserva sin cambios el producto existente.
4. **Given** un producto sin fecha de vencimiento válida, **When** se registra, **Then** Nexo lo
   conserva sin calcular estado ni aviso de vencimiento.
5. **Given** un Usuario sin permiso de gestión de productos, **When** intenta registrar un
   producto, **Then** Nexo deniega la operación sin crear ni modificar datos.
6. **Given** el Administrador informa una fecha de vencimiento inválida, **When** confirma el
   registro, **Then** Nexo rechaza la fecha y no guarda el producto.
7. **Given** el Administrador registra un producto, **When** indica que está dañado,
   **Then** Nexo guarda esa condición por separado del estado calculado.

### Edge Cases

- El código está vacío o contiene solo espacios.
- El código contiene espacios externos o ceros iniciales.
- El código coincide con otro después de quitar espacios externos.
- Un campo numérico contiene texto, un número negativo o un formato inválido.
- La política de devolución no pertenece a los valores permitidos.
- La fecha de vencimiento está ausente o no es una fecha válida.
- Se produce un error al guardar; el formulario no debe mostrar éxito ni crear un registro
  parcial.
- El usuario intenta enviar el formulario varias veces o repetir una solicitud ya procesada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El Administrador MUST poder iniciar el registro manual de un producto desde una
  operación autorizada de gestión del inventario. La operación MUST NOT estar disponible para el
  rol Usuario.
- **FR-002**: El formulario MUST permitir ingresar los datos definidos para Producto en la
  Spec 000: "Artículo", "Descripción del artículo", "On hand", "Saldo", "Trazabilidad",
  "UOM primaria", "Laboratorio", "Marca", "Política devolución" y "Observación". MUST permitir
  registrar por separado la fecha de vencimiento y la condición "Dañado"; MUST NOT tratar la fecha
  como parte de "Trazabilidad" ni como una columna importada.
- **FR-003**: "Artículo" MUST ser obligatorio. Los demás campos MUST poder quedar vacíos, conforme
  a la regla de la Spec 004, y Nexo MUST conservar esos campos sin valor en lugar de inventar
  datos.
- **FR-004**: El código MUST validarse como texto, quitando espacios al inicio y al final,
  conservando mayúsculas/minúsculas y ceros iniciales, de forma consistente con la Spec 004.
  Nexo MUST rechazar un código vacío o que ya exista después de aplicar esta normalización y MUST
  NOT sobrescribir el producto existente.
- **FR-005**: Cuando "On hand" o "Saldo" tengan valor, MUST ser enteros no negativos; la
  "Política devolución", cuando se informe, MUST corresponder a un valor permitido por la
  Spec 000.
- **FR-006**: La fecha de vencimiento MUST registrarse separadamente como fecha calendario
  `DD/MM/YYYY`. Si está vacía, el producto MUST poder guardarse sin estado ni aviso calculado.
  Si se informa una fecha inválida, Nexo MUST rechazar el registro e identificar el campo.
- **FR-007**: Si la validación falla, Nexo MUST identificar los campos y motivos que requieren
  corrección y MUST NOT guardar un producto parcial. Si ocurre un error técnico, MUST informar que
  el registro no se completó y MUST NOT mostrar confirmación de éxito.
- **FR-007a**: El sistema MUST impedir el doble envío de una misma solicitud de registro y MUST
  garantizar que los reintentos no creen productos duplicados.
- **FR-008**: Después de un registro exitoso, el producto MUST aparecer una sola vez en el
  inventario con los datos ingresados y sin alterar otros productos.
- **FR-009**: Cada intento de registro MUST dejar en la bitácora actor, fecha y hora, acción,
  producto afectado cuando exista y resultado. La bitácora MUST NOT guardar contraseñas, secretos
  ni una copia innecesaria de todos los datos del producto. Solo el Administrador puede consultar
  la bitácora, conforme a las Specs 003 y 005.
- **FR-010**: La interfaz MUST usar textos en español, controles semánticos, etiquetas asociadas,
  navegación por teclado y foco visible; debe conservar el comportamiento adaptable definido por
  la constitución.
- **FR-011**: Esta Spec cubre únicamente la creación manual de productos. La actualización de
  cantidades actuales se rige por la Spec 009; el retiro de productos y las opciones de reemplazo
  o combinación durante una importación requieren sus reglas aprobadas en las Specs
  correspondientes y MUST NOT inferirse de este flujo.
- **FR-012**: La condición "Dañado" MUST guardarse separada del estado calculado por fecha y
  política. Si no se marca, Nexo MUST NOT inferir que el producto está dañado. La condición MUST
  NOT alterar el estado ni la alerta.

### Key Entities *(include if feature involves data)*

- **Producto**: Artículo de inventario identificado por un código único, con descripción,
  cantidades, trazabilidad, unidad, laboratorio, marca, política de devolución, observación,
  fecha de vencimiento y condición "Dañado" registrada separadamente cuando corresponda.
- **Registro de bitácora**: Evidencia del intento de creación con actor, momento, acción, producto
  afectado cuando exista y resultado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los productos con código único y datos válidos puede registrarse
  manualmente por un Administrador sin preparar un archivo Excel.
- **SC-002**: El 100% de los códigos vacíos, duplicados o compuestos solo por espacios se rechaza
  sin cambiar productos existentes.
- **SC-003**: El 100% de los registros exitosos aparece exactamente una vez con los valores
  ingresados, incluidos los campos opcionales vacíos.
- **SC-004**: El 100% de los intentos de registro autorizados queda trazable por actor y resultado,
  sin almacenar secretos ni duplicar innecesariamente todos los datos del producto.
- **SC-005**: El 100% de los intentos del rol Usuario se deniega sin crear ni alterar productos.
- **SC-006**: En pruebas con teclado, todos los campos y acciones del registro pueden completarse
  sin usar un mouse y muestran un indicador de foco visible.

## Assumptions

- El Administrador es el único rol autorizado para crear productos, de acuerdo con las Specs 003
  y 005; esta Spec no amplía los permisos del Usuario.
- El contrato de campos, los valores de política de devolución y las reglas de cantidad se toman
  de la Spec 000 y de la Spec 004 vigentes.
- Solo "Artículo" es obligatorio; los demás datos pueden quedar vacíos. La fecha de vencimiento
  puede omitirse, pero si se informa debe ser válida. Un producto sin fecha no recibe estado ni
  aviso calculado.
- La validación de códigos debe ser compatible con la importación: los espacios externos se
  eliminan, se conservan ceros iniciales y se distinguen mayúsculas y minúsculas.
- El registro manual no modifica la política existente de importación ni añade edición,
  eliminación, movimientos físicos, ventas, compras o soporte para varios almacenes.
- Una solicitud repetida del mismo registro no debe crear un segundo producto ni mostrar una
  confirmación duplicada.
- Se reutilizan la autenticación, la autorización, la bitácora y las reglas de interfaz aprobadas
  para Nexo.
