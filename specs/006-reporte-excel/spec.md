# Feature Specification: Spec 006 — Reporte Excel

**Feature Branch**: `006-reporte-excel`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 006 reporte-excel"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Elegir el inventario que se reporta (Priority: P1)

Como Administrador, necesito generar un reporte con todo el inventario o con los productos que
coinciden con mi búsqueda y filtros, para revisar y compartir la información pertinente.

**Why this priority**: La selección del alcance del reporte permite obtener tanto una vista
completa como un subconjunto útil sin cambiar los datos del sistema.

**Independent Test**: Generar un reporte completo y otro con búsqueda y filtro de estado activos;
comparar sus filas con el inventario registrado y con todos los resultados que cumplen esos
criterios, no solo los visibles en la página actual.

**Acceptance Scenarios**:

1. **Given** el Administrador está en el inventario, **When** elige reportar todo el inventario,
   **Then** el archivo contiene todos los productos incluidos en el alcance permitido, sin aplicar
   la búsqueda o el filtro activo.
2. **Given** el Administrador tiene una búsqueda o filtro activo, **When** elige reportar los
   resultados filtrados, **Then** el archivo contiene todos los productos coincidentes, incluso
   aquellos que aparecen en otras páginas del listado.
3. **Given** la búsqueda o el filtro no coincide con ningún producto, **When** el Administrador
   solicita el reporte filtrado, **Then** recibe un archivo con encabezados y sin filas de
   producto, y una indicación clara de que no hubo coincidencias.

---

### User Story 2 - Descargar los datos visibles del inventario (Priority: P1)

Como Administrador, necesito descargar la información del inventario en un archivo Excel con las
columnas conocidas del prototipo, para consultar los productos y sus estados fuera del sistema.

**Why this priority**: El reporte permite analizar el inventario sin incluir controles de interfaz
ni alterar los datos registrados.

**Independent Test**: Generar un reporte con un conjunto conocido de productos y comparar los
encabezados y valores del archivo con las columnas del inventario para cada producto.

**Acceptance Scenarios**:

1. **Given** hay productos en el inventario, **When** el Administrador genera un reporte, **Then**
   el archivo presenta las columnas visibles del prototipo excepto "Acción" y sus valores
   corresponden a los productos seleccionados.
2. **Given** el archivo contiene la columna "Estado", **When** una persona intenta usarlo como
   archivo de importación, **Then** el sistema informa que el reporte no es una plantilla
   importable.
3. **Given** un campo de texto contiene caracteres que una hoja de cálculo podría interpretar
   como fórmula o vínculo activo, **When** se genera el reporte, **Then** el valor se presenta
   como texto y no se ejecuta como contenido activo.

---

### User Story 3 - Mantener el reporte autorizado y verificable (Priority: P2)

Como responsable del sistema, necesito que solo los roles autorizados puedan generar el reporte y
que la operación quede registrada, para proteger los datos del inventario y revisar su uso.

**Why this priority**: El archivo descargado contiene información operativa del inventario y
puede quedar fuera del control de acceso de Nexo.

**Independent Test**: Generar un reporte con una cuenta Administrador y tratar de generarlo con
una cuenta Usuario o sin sesión; confirmar que solo la operación autorizada se completa y que el
resultado queda registrado.

**Acceptance Scenarios**:

1. **Given** un Administrador autenticado, **When** genera un reporte, **Then** el sistema permite
   la descarga y registra quién la solicitó, cuándo y qué alcance seleccionó.
2. **Given** un Usuario o una persona no autenticada intenta generar un reporte, **When** se
   valida la operación, **Then** el sistema deniega el acceso sin revelar datos del inventario.
3. **Given** el sistema no puede generar el archivo, **When** la operación finaliza, **Then** se
   informa el error y no se presenta la descarga como exitosa.

### Edge Cases

- El inventario está vacío o no hay productos que coincidan con los filtros.
- El reporte supera el límite de filas aprobado para una descarga.
- La búsqueda cambia o el inventario se modifica mientras se genera el archivo.
- Una fila tiene valores vacíos o un estado aún no calculable por falta de fecha de vencimiento.
- El archivo de descarga no se puede generar o transferir completamente.
- El reporte contiene la columna "Estado", por lo que no es compatible con el contrato de
  importación de la Spec 004.
- El listado o sus filtros presentan estados que no coinciden con la clasificación aprobada en la
  constitución.
- Un Usuario intenta descargar el reporte mediante una ruta directa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La generación y descarga de reportes de inventario MUST estar restringida al rol
  Administrador. El rol Usuario y las personas no autenticadas MUST NOT recibir datos del reporte.
- **FR-002**: El Administrador MUST poder elegir entre reportar todo el inventario o los productos
  que coinciden con la búsqueda y los filtros activos en la vista de inventario.
- **FR-003**: El reporte filtrado MUST incluir todos los productos coincidentes en todas las
  páginas del listado; MUST NOT limitarse a la página visible. MUST conservar el ordenamiento
  activo del listado cuando corresponda.
- **FR-004**: El reporte completo MUST incluir todos los productos que el Administrador está
  autorizado a consultar, sin aplicar la búsqueda o los filtros activos.
- **FR-005**: El libro MUST contener una hoja de inventario con estas columnas, en este orden:
  "Artículo", "Descripción del artículo", "Estado", "On hand", "Saldo", "Trazabilidad",
  "UOM primaria", "Laboratorio", "Marca", "Política devolución" y "Observación".
- **FR-006**: La columna "Estado" MUST mostrar la clasificación calculada conforme a la
  constitución vigente. Si la fecha de vencimiento válida no está registrada, el reporte MUST
  dejar el estado sin valor calculado y MUST NOT inventar una clasificación.
- **FR-007**: El reporte MUST NOT incluir la columna "Acción", controles de interfaz, gestión de
  usuarios, datos de Clientes ni otra información fuera del inventario aprobado.
- **FR-008**: El archivo MUST ser un libro Excel `.xlsx` descargable con una hoja llamada
  "Inventario". MUST contener valores de datos y texto; MUST NOT incluir macros, fórmulas o
  vínculos activos provenientes de valores del inventario.
- **FR-009**: El reporte MUST NOT presentarse como una plantilla de importación. La inclusión de
  "Estado" lo hace incompatible con los encabezados de entrada de la Spec 004.
- **FR-010**: Si no hay productos en el alcance seleccionado, el archivo MUST contener los
  encabezados y ninguna fila de producto; el sistema MUST informar que no hubo resultados.
- **FR-011**: El reporte MUST incluir como máximo 10.000 filas de producto. Si el alcance supera
  ese límite, el sistema MUST informar el límite y MUST NOT truncar el reporte ni reportarlo como
  completo.
- **FR-012**: Cada solicitud de reporte MUST registrarse en la bitácora con el actor, el momento,
  el alcance elegido, la cantidad de filas y el resultado. La bitácora MUST NOT copiar los valores
  completos del inventario ni datos innecesarios.
- **FR-013**: Si la generación o descarga falla, el sistema MUST comunicar el error y MUST NOT
  confirmar una descarga incompleta como exitosa.
- **FR-014**: Los filtros y estados utilizados para seleccionar filas MUST corresponder a las
  reglas de inventario aprobadas; las opciones heredadas del prototipo que no correspondan a la
  constitución MUST NOT generar categorías de reporte nuevas.
- **FR-015**: El sistema MUST generar un nombre de archivo que identifique el reporte y su fecha
  de generación, sin incluir nombres, correos u otros datos personales.

### Key Entities *(include if feature involves data)*

- **Solicitud de reporte**: Petición autenticada del Administrador, con el alcance seleccionado y
  los criterios de búsqueda o filtro activos.
- **Reporte de inventario**: Libro de Excel generado a partir de los productos incluidos en la
  solicitud y de las columnas aprobadas.
- **Registro de descarga**: Evidencia de la solicitud, su actor, alcance, conteo de productos y
  resultado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los productos del alcance seleccionado aparece exactamente una vez en el
  reporte, incluyendo todos los resultados filtrados y no solo la página visible.
- **SC-002**: El 100% de los reportes contiene las once columnas acordadas en el orden definido,
  sin la columna "Acción".
- **SC-003**: El 100% de los reportes muestra estados de acuerdo con las reglas aprobadas y no
  inventa valores para productos sin fecha válida.
- **SC-004**: El 100% de los intentos de descarga por Usuarios o personas no autenticadas se
  deniega sin exponer datos del inventario.
- **SC-005**: El 100% de las solicitudes, exitosas o fallidas, queda registrado con actor,
  alcance, cantidad de filas y resultado, sin duplicar los datos completos en la bitácora.
- **SC-006**: Un reporte de hasta 10.000 filas se genera en menos de 60 segundos en el entorno de
  validación acordado.

## Assumptions

- Esta Spec autoriza la descarga de reportes Excel de inventario, que la Spec 002 excluía mientras
  no existiera una especificación aprobada.
- El Administrador es el único rol autorizado para consultar productos y generar reportes, de
  acuerdo con la matriz de la Spec 005.
- El usuario confirmó que podrá elegirse entre todo el inventario y los resultados filtrados, y
  que el reporte usará las columnas visibles del prototipo excepto "Acción".
- El reporte se usa para consultar y compartir información; no es una plantilla reimportable.
- La fecha de vencimiento no aparece entre las columnas visibles seleccionadas y no se agrega al
  reporte. El estado se calcula a partir de los datos válidos disponibles.
- La opción de filtro y sus estados deben alinearse con la constitución vigente antes de
  implementar la generación; los valores inconsistentes del prototipo no constituyen una regla de
  negocio aprobada.
- La descarga se realiza a la persona solicitante; el sistema no conserva una copia del libro ni
  lo envía por correo o a terceros.
- El límite de 10.000 filas coincide con el tope inicial de lectura Excel de la Spec 004 y debe
  verificarse en el entorno de validación.
