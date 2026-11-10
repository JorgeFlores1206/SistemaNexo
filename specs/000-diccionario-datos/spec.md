# Feature Specification: Spec 000 — Diccionario de datos

**Feature Branch**: `000-diccionario-datos`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 000 Diccionario de datos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar la definición de los datos (Priority: P1)

Como responsable del sistema, necesito un diccionario de datos aprobado que explique los datos de
productos y las entidades relacionadas, para que quienes revisan, importan o mantienen el
inventario compartan las mismas definiciones.

**Why this priority**: Las reglas del inventario, la importación y los estados dependen de que los
campos tengan significados y formatos acordados.

**Independent Test**: Revisar el diccionario y comprobar que cada dato del inventario tenga un
nombre, significado y reglas de uso comprensibles para un usuario de negocio.

**Acceptance Scenarios**:

1. **Given** una persona consulta el diccionario, **When** busca un encabezado de la tabla de
   inventario, **Then** encuentra su significado, origen y reglas de captura o cálculo.
2. **Given** la tabla incluye un campo calculado, **When** la persona revisa su definición,
   **Then** puede distinguirlo de los valores que deben venir en el Excel.
3. **Given** un artículo tiene código y nombre, **When** se muestra en el inventario, **Then** el
   código aparece en "Artículo" y el nombre en "Descripción del artículo", sin repetir el nombre
   debajo del código.

---

### User Story 2 - Preparar un Excel conforme al inventario (Priority: P1)

Como persona que prepara una importación, necesito saber qué columnas acepta el sistema y cómo
deben llenarse, para evitar archivos ambiguos o incompatibles con el inventario.

**Why this priority**: La importación utiliza los datos del inventario y no debe depender de
interpretaciones implícitas de sus encabezados.

**Independent Test**: Comparar la lista de columnas del diccionario con la tabla del prototipo y
verificar que cada columna importable se distinga de Estado y Acción.

**Acceptance Scenarios**:

1. **Given** la persona prepara una plantilla de Excel, **When** consulta el diccionario,
   **Then** identifica los encabezados importables y los que no se importan.
2. **Given** la política de devolución viene informada para un producto, **When** la persona
   consulta su definición, **Then** sabe que es un dato editable asociado al producto y cuáles
   valores están reconocidos.

---

### User Story 3 - Revisar relaciones y cambios del modelo (Priority: P2)

Como responsable de revisar una modificación del sistema, necesito consultar las entidades,
relaciones y restricciones aprobadas, para identificar el impacto de un cambio de datos antes de
aceptarlo.

**Why this priority**: Una referencia común reduce cambios incompatibles en productos, usuarios,
roles y bitácora.

**Independent Test**: Revisar una propuesta de cambio contra las entidades, relaciones y
restricciones documentadas y enumerar cualquier definición afectada.

**Acceptance Scenarios**:

1. **Given** el diccionario vigente, **When** se propone cambiar un campo o relación, **Then** se
   puede identificar qué definición y reglas requieren revisión.
2. **Given** se aprueba una modificación de datos, **When** se actualiza la documentación,
   **Then** el diccionario refleja la decisión aprobada y conserva la trazabilidad del cambio.

### Edge Cases

- Un producto carece de fecha de vencimiento, o el dato está ausente o no puede interpretarse.
- La información necesaria para vencimiento aparece mezclada con otros datos de trazabilidad.
- Un encabezado requerido falta, está duplicado o tiene una variante de escritura.
- La política de devolución está vacía o contiene un valor distinto de los valores reconocidos.
- El prototipo muestra un dato que no está en los encabezados importables del Excel.
- Dos entidades aparentan describir el mismo dato, o una relación no tiene cardinalidad definida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El diccionario MUST documentar las entidades y atributos comprendidos en el alcance
  funcional vigente de Nexo.
- **FR-002**: Para cada atributo, el diccionario MUST registrar su nombre visible, nombre
  conceptual, significado, origen, condición de obligatoriedad, tipo de dato de negocio, formato,
  valores permitidos y reglas de validación, indicando explícitamente los aspectos pendientes de
  aprobación.
- **FR-003**: El diccionario MUST distinguir los datos importados desde Excel de los datos
  calculados por el sistema y de los datos que solo se muestran o se editan en la interfaz.
- **FR-004**: El contrato de importación MUST reflejar los encabezados acordados de la tabla:
  "Artículo", "Descripción del artículo", "On hand", "Saldo", "Trazabilidad", "UOM primaria",
  "Laboratorio", "Marca", "Política devolución" y "Observación". "Estado" es calculado y no se
  importa; "Acción" es una operación de interfaz y no es un dato importable. "Artículo" contiene
  el código del producto; "Descripción del artículo" contiene su nombre. La vista del inventario
  MUST mostrar el código y el nombre en sus respectivas columnas y MUST NOT duplicar el nombre
  debajo del código.
- **FR-005**: El diccionario MUST documentar "Política devolución" como un valor asociado al
  producto, editable por producto, con los valores reconocidos "En el mes", "1 mes antes",
  "2 meses antes", "3 meses antes" y sin política.
- **FR-006**: El diccionario MUST definir "On hand" como la cantidad física del producto y "Saldo"
  como la cantidad que el usuario añade al sistema; MUST documentar por separado sus formatos y
  reglas de validación.
- **FR-007**: El diccionario MUST describir el estado del producto y el aviso "Pronto a vencer"
  como datos calculados separados de las columnas importables, de acuerdo con las reglas vigentes
  de la constitución.
- **FR-008**: El diccionario MUST documentar la fecha de vencimiento como un dato del producto que
  registra el usuario, separado de los encabezados Excel acordados y de "Trazabilidad". MUST
  indicar su obligatoriedad y formato, incluyendo el caso de productos sin vencimiento.
- **FR-009**: Para cada relación documentada, el diccionario MUST identificar las entidades
  relacionadas, su cardinalidad y las reglas de integridad pertinentes.
- **FR-010**: El diccionario MUST cubrir los datos de usuarios, roles y bitácora requeridos por el
  alcance vigente, sin inventar atributos o permisos no aprobados.
- **FR-011**: Cada campo MUST identificar si puede contener datos personales o sensibles y las
  restricciones de acceso o manejo aplicables, cuando corresponda.
- **FR-012**: Todo cambio aprobado a entidades, atributos, relaciones, catálogos o reglas de datos
  MUST actualizar el diccionario y dejar referencia a la decisión que lo originó.

### Key Entities *(include if feature involves data)*

- **Producto**: Artículo administrado en inventario, con identificador, descripción, cantidades,
  trazabilidad, unidad, laboratorio, marca, política de devolución y observación según el contrato
  aprobado. El identificador es el código; la descripción es el nombre del artículo.
- **Política de devolución**: Regla seleccionada para un producto que determina la fecha efectiva
  utilizada en su clasificación.
- **Estado y aviso de producto**: Clasificación y aviso derivados de las fechas y la política; el
  estado no se importa desde Excel.
- **Usuario y rol**: Identidades y perfiles de acceso necesarios para las funciones del sistema;
  sus atributos y relaciones deben documentarse según las decisiones de permisos aprobadas.
- **Registro de bitácora**: Evidencia de acciones del sistema que deben ser trazables.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los encabezados de inventario tiene una definición y está clasificado
  como importado, calculado o no importable.
- **SC-002**: El 100% de los campos aprobados tiene significado, origen, tipo de dato de negocio,
  formato y condición de obligatoriedad documentados, o una decisión pendiente identificada.
- **SC-003**: Una revisión del diccionario permite identificar sin ambigüedad qué columnas del
  Excel se importan y cuáles se calculan o se excluyen.
- **SC-004**: El diccionario documenta las entidades, relaciones y reglas de integridad aprobadas
  para el alcance sin definiciones contradictorias entre el diccionario y la especificación.
- **SC-005**: En cada fila de producto, el código y el nombre aparecen en sus columnas
  correspondientes y el nombre no se repite en la celda del código.

## Assumptions

- La solicitud corresponde a crear la especificación número 000, aunque `sistemanexo.md` menciona
  actualmente el Diccionario de Datos como Spec 002; el número solicitado por el usuario prevalece
  para esta carpeta.
- El prototipo de inventario y la constitución vigente son las referencias del contrato del
  producto; los valores de demostración del prototipo no constituyen por sí mismos reglas de
  negocio.
- "On hand" representa la cantidad física y "Saldo" representa la cantidad ingresada al sistema;
  las reglas de formato, signo y diferencias permitidas entre ambos valores deberán especificarse.
- La constitución vigente define los estados basados en la política de devolución y la fecha de
  vencimiento; su cálculo concreto no debe implementarse hasta resolver los campos pendientes.
- El usuario registra la fecha de vencimiento como dato separado del Excel y de Trazabilidad;
  puede no aplicar a productos sin vencimiento.
- El diccionario es una referencia funcional y de datos para revisión del negocio; esta
  especificación no prescribe tecnologías ni un diseño físico de base de datos.
- El diccionario cubre inicialmente productos, usuarios, roles, bitácora y datos de importación
  necesarios para explicar el contrato, sin exigir una entidad independiente de lote de
  importación.

