# Feature Specification: Spec 004 — Lectura de Excel

**Feature Branch**: `004-lectura-excel`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 004 lectura-excel"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cargar un archivo de inventario (Priority: P1)

Como Usuario autorizado, necesito seleccionar un archivo Excel con los encabezados del inventario
para que Nexo lea los datos reconocidos sin confundirlos con estados u operaciones de interfaz.

**Why this priority**: La importación es el medio acordado para incorporar datos iniciales y
actualizar el inventario.

**Independent Test**: Preparar un archivo con las diez columnas de la Spec 000, con valores y
celdas vacías, y comprobar que Nexo reconoce los campos y sus encabezados.

**Acceptance Scenarios**:

1. **Given** un archivo Excel con los encabezados acordados, **When** una persona autorizada
   selecciona una hoja para leer, **Then** Nexo identifica cada columna por su encabezado aunque
   las columnas estén en otro orden.
2. **Given** una fila con "Artículo" informado y otras celdas vacías, **When** se lee el archivo,
   **Then** las celdas vacías permitidas no impiden la lectura de la fila.
3. **Given** el archivo contiene "Estado" o "Acción", **When** Nexo lee las columnas, **Then**
   ignora esos valores y no los importa como datos del producto.

---

### User Story 2 - Validar productos y códigos duplicados (Priority: P1)

Como Usuario autorizado, necesito conocer qué filas cumplen las reglas y cuáles se rechazan,
para que una importación parcial no sobrescriba productos existentes ni oculte datos incorrectos.

**Why this priority**: La validación y la resolución explícita de duplicados protegen la integridad
del inventario.

**Independent Test**: Importar un archivo que mezcle filas válidas, filas inválidas y códigos
duplicados, y verificar que se importan únicamente las filas válidas y se informa cada rechazo.

**Acceptance Scenarios**:

1. **Given** una fila tiene un "Artículo" no vacío, **When** sus demás valores opcionales están
   vacíos, **Then** la fila puede importarse y los campos vacíos permanecen sin valor.
2. **Given** un código de artículo ya existe en Nexo, **When** aparece en el archivo, **Then** se
   rechaza la fila entrante y el producto existente permanece sin cambios.
3. **Given** un código aparece más de una vez en el archivo, **When** se valida la hoja, **Then**
   se rechazan todas las filas que contienen ese código duplicado.
4. **Given** una fila contiene un valor inválido, **When** se procesa el archivo, **Then** se
   rechaza esa fila, se informa el motivo y las demás filas válidas pueden importarse.

---

### User Story 3 - Revisar el resultado de importación (Priority: P2)

Como persona que importa el inventario, necesito ver cuántas filas se incorporaron y cuáles
requieren corrección para poder resolver los errores sin adivinar qué ocurrió.

**Why this priority**: Un resultado verificable permite corregir el archivo y evita confiar en
importaciones incompletas reportadas como exitosas.

**Independent Test**: Completar una importación con varias filas válidas e inválidas y comprobar
que el resumen coincide con las filas procesadas y muestra la ubicación y el motivo de cada
rechazo.

**Acceptance Scenarios**:

1. **Given** la lectura y validación terminaron, **When** se muestra el resultado, **Then** incluye
   el total de filas leídas, importadas, rechazadas y vacías ignoradas.
2. **Given** una fila fue rechazada, **When** la persona revisa el resultado, **Then** puede
   identificar el número de fila, el campo relacionado y el motivo del rechazo.
3. **Given** el archivo no puede leerse o no cumple la estructura requerida, **When** Nexo lo
   rechaza, **Then** informa el problema y no persiste filas del archivo.

### Edge Cases

- El archivo no es un libro `.xlsx`, está dañado, vacío o protegido de forma que impide leerlo.
- El libro no contiene una hoja seleccionable, la hoja no contiene encabezados o tiene más de una
  fila candidata para encabezados.
- Falta uno o más encabezados requeridos, un encabezado está duplicado o aparece un encabezado
  desconocido.
- Las columnas aprobadas están en distinto orden, o el archivo incluye "Estado" y "Acción".
- Todas las celdas de una fila están vacías, o una fila tiene un "Artículo" vacío.
- "Artículo" contiene espacios externos o códigos repetidos en la hoja o en el inventario actual.
- Una cantidad tiene texto, valor negativo o formato que no representa un número válido.
- "Política devolución" está vacía o contiene un valor distinto del catálogo aprobado.
- "Trazabilidad" contiene información que parece una fecha de vencimiento.
- No se ha registrado una fecha de vencimiento para un producto leído desde Excel.
- El archivo supera el tamaño o cantidad de filas permitidos.
- La lectura falla después de que algunas filas válidas ya fueron procesadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La importación MUST aceptar archivos de libro Excel `.xlsx` que puedan leerse y
  MUST permitir seleccionar la hoja a procesar cuando el libro tenga varias hojas.
- **FR-002**: La hoja MUST contener los diez encabezados importables exactos de la Spec 000:
  "Artículo", "Descripción del artículo", "On hand", "Saldo", "Trazabilidad", "UOM primaria",
  "Laboratorio", "Marca", "Política devolución" y "Observación" en la primera fila de la hoja.
  El orden de las columnas MUST ser irrelevante.
- **FR-003**: El archivo MUST incluir todos los encabezados importables, pero únicamente "Artículo"
  MUST tener valor en cada fila importada. Los demás campos MUST aceptar celdas vacías y Nexo MUST
  conservar esos campos como vacíos, sin inventar valores.
- **FR-004**: El sistema MUST reconocer los encabezados "Estado" y "Acción" como no importables,
  ignorar sus valores y MUST NOT usarlos para crear o modificar datos del producto. Cualquier otro
  encabezado no aprobado MUST producir un error de estructura antes de persistir filas.
- **FR-005**: "Artículo" MUST ser tratado como el identificador textual del producto; Nexo MUST
  eliminar espacios al inicio y al final para validar el valor, conservar el código resultante sin
  cambiar mayúsculas/minúsculas ni ceros iniciales y rechazar la fila si queda vacío.
- **FR-006**: "Descripción del artículo", "Trazabilidad", "UOM primaria", "Laboratorio", "Marca"
  y "Observación" MUST leerse como texto; sus valores vacíos MUST ser válidos.
- **FR-007**: "On hand" y "Saldo", cuando tengan valor, MUST ser números no negativos; los valores
  no numéricos o negativos MUST causar el rechazo de la fila correspondiente. MUST permitirse
  valores numéricos enteros o decimales.
- **FR-008**: "Política devolución", cuando tenga valor, MUST coincidir con uno de los valores
  reconocidos en la Spec 000: "En el mes", "1 mes antes", "2 meses antes" o "3 meses antes".
  La comparación MUST ignorar espacios al inicio y al final; una celda vacía MUST representar que
  el producto no tiene política.
- **FR-009**: La fecha de vencimiento MUST NOT ser leída ni inferida de una columna Excel,
  incluida "Trazabilidad". MUST registrarse separadamente al crear o editar el producto como una
  fecha de calendario en formato "AAAA-MM-DD" (ISO 8601). Mientras falte una fecha válida, Nexo
  MUST NOT calcular el estado ni el aviso del producto.
- **FR-010**: Las filas completamente vacías MUST ignorarse y contabilizarse como vacías; una fila
  con "Artículo" vacío y cualquier otro valor MUST rechazarse con un error asociado a la fila.
- **FR-011**: Si un código existente en Nexo aparece en el archivo, la fila entrante MUST
  rechazarse y el producto existente MUST permanecer sin cambios. Si un código se repite en el
  archivo, MUST rechazarse cada fila que tenga ese código, sin escoger silenciosamente una de ellas.
- **FR-012**: Los errores de estructura del libro u hoja MUST detener la importación completa
  antes de persistir cualquier fila. Los errores de datos MUST rechazarse por fila, permitiendo
  importar las filas válidas y reportar cada fila rechazada.
- **FR-013**: El resultado MUST informar el número total de filas de datos leídas, importadas,
  rechazadas e ignoradas por estar vacías; por cada fila rechazada MUST indicar número de fila,
  campo y motivo comprensible cuando puedan determinarse.
- **FR-014**: El sistema MUST rechazar el libro antes de procesarlo si supera 10 MB o contiene más
  de 10.000 filas de datos, e MUST informar el límite excedido.
- **FR-015**: La importación MUST estar restringida a los roles autorizados según la matriz de
  permisos vigente y MUST registrar en la bitácora el actor, el momento, el resultado y los
  conteos de filas, sin guardar secretos ni datos innecesarios.
- **FR-016**: Una fila sin fecha de vencimiento válida MUST poder leerse y guardarse si cumple las
  reglas de importación; su estado y aviso MUST permanecer sin calcular hasta que se registre la
  fecha conforme al procedimiento aprobado.
- **FR-017**: Si la importación se interrumpe después de persistir algunas filas válidas, el
  resultado MUST distinguir las filas efectivamente importadas de las que quedaron sin procesar y
  MUST NOT reportar el archivo como importado por completo.

### Key Entities *(include if feature involves data)*

- **Libro de importación**: Archivo Excel seleccionado, con tamaño, hojas y encabezados que se
  validan antes de leer sus filas.
- **Fila de importación**: Conjunto de valores asociados a un número de fila y a un código de
  producto, aceptado o rechazado individualmente.
- **Producto importado**: Producto creado a partir de una fila válida y de los campos admitidos
  por el contrato de la Spec 000.
- **Resultado de importación**: Resumen de filas leídas, importadas, rechazadas e ignoradas,
  junto con los motivos de rechazo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los diez encabezados acordados se asocia al campo correcto aunque cambie
  el orden de las columnas; "Estado" y "Acción" nunca se incorporan como datos.
- **SC-002**: Las filas con "Artículo" válido y celdas vacías en otros campos se leen sin error
  atribuible únicamente a esos campos vacíos.
- **SC-003**: El 100% de las filas con código existente, código repetido o valor inválido se
  rechaza sin modificar productos preexistentes y con un motivo identificable.
- **SC-004**: El 100% de las importaciones concluidas presenta conteos que coinciden con las filas
  leídas, incorporadas, rechazadas e ignoradas.
- **SC-005**: La lectura de un libro dentro de los límites definidos y con hasta 10.000 filas
  concluye en menos de 60 segundos en el entorno de validación acordado.

## Assumptions

- La Spec 000 y la constitución vigente son la fuente autorizada para encabezados, significados y
  valores de política de devolución.
- El usuario confirmó que únicamente "Artículo" es obligatorio y que las celdas de las demás
  columnas pueden quedar vacías.
- El usuario confirmó que los códigos duplicados se rechazan sin sobrescribir los productos
  existentes y que las filas válidas pueden importarse aunque otras filas se rechacen.
- La fecha de vencimiento se registra fuera del Excel. Esta decisión del usuario alinea la Spec
  000 con la constitución; no se debe extraer una fecha de "Trazabilidad". La fecha se captura
  como `AAAA-MM-DD` al crear o editar el producto.
- Se fija como límite inicial un libro de 10 MB y 10.000 filas de datos; estos topes deben
  verificarse en el entorno de validación antes de la implementación.
- Un código se compara después de eliminar espacios externos, distingue mayúsculas de minúsculas
  y conserva los ceros iniciales.
- Los encabezados opcionales del contrato deben estar presentes aunque sus celdas de datos puedan
  quedar vacías. "Estado" y "Acción" pueden aparecer, pero se ignoran.
- Esta especificación no autoriza exportar el resultado a un archivo ni agrega funciones ajenas a
  la importación del inventario.
