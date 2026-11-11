# Feature Specification: Spec 002 — Limitaciones funcionales

**Feature Branch**: `002-limitaciones-funcionales`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 002 limitaciones-funcionales"

## Clarifications

### Session 2026-11-11

- Q: ¿Qué acceso tiene el rol Usuario? → A: Puede consultar inventario y panel; no puede administrar usuarios, consultar bitácora ni cambiar configuraciones críticas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conocer el alcance disponible (Priority: P1)

Como integrante del equipo Nexo, necesito distinguir qué funciones están incluidas y cuáles no,
para que las solicitudes y expectativas del sistema se ajusten al alcance aprobado de inventario.

**Why this priority**: Un límite de alcance claro evita asumir que Nexo administra procesos que no
han sido definidos ni aprobados.

**Independent Test**: Presentar solicitudes representativas de inventario y de procesos externos,
y comprobar que la persona puede clasificarlas según las funciones incluidas y excluidas.

**Acceptance Scenarios**:

1. **Given** una solicitud de registrar o consultar productos, importar Excel o revisar estados,
   **When** se compara con el alcance aprobado, **Then** se identifica la función correspondiente
   y sus límites.
2. **Given** una solicitud de ventas, compras, facturación o movimientos entre almacenes,
   **When** se compara con el alcance vigente, **Then** se identifica como fuera de alcance hasta
   que una Spec la apruebe.

---

### User Story 2 - Importar productos dentro de los límites definidos (Priority: P1)

Como usuario autorizado, necesito conocer qué información puede aportar un Excel y qué resultados
calcula Nexo, para no tratar como importables datos que el sistema determina por sus reglas.

**Why this priority**: La importación es una función central y una entrada incorrecta puede
producir estados o cantidades engañosos.

**Independent Test**: Revisar un archivo de ejemplo contra las reglas de importación y clasificar
cada encabezado como importable, calculado o excluido.

**Acceptance Scenarios**:

1. **Given** una plantilla con los encabezados de la Spec 000, **When** el usuario identifica los
   campos admitidos, **Then** distingue los datos importables de "Estado" y "Acción", que no se
   importan.
2. **Given** un artículo tiene una fecha de vencimiento y una política de devolución, **When**
   Nexo clasifica el producto, **Then** calcula el estado y el aviso en lugar de aceptar un estado
   manual del Excel.

---

### User Story 3 - Evitar operaciones no aprobadas (Priority: P2)

Como administrador, necesito conocer los límites de permisos, exportación y retiro de productos,
para evitar exponer información o eliminar datos sin una regla aprobada.

**Why this priority**: Los límites de acceso y conservación protegen los datos y mantienen la
trazabilidad del inventario.

**Independent Test**: Revisar una lista de operaciones administrativas y comprobar que las
operaciones no aprobadas se identifican como restringidas o pendientes de una Spec específica.

**Acceptance Scenarios**:

1. **Given** un Usuario solicita consultar la bitácora o gestionar otros usuarios, **When** se
   aplica el alcance inicial, **Then** la operación queda restringida al Administrador.
2. **Given** alguien solicita exportar productos o borrar físicamente registros, **When** no hay
   una Spec que autorice la operación, **Then** el sistema no la presenta como una función
   disponible.

### Edge Cases

- El Excel incluye "Estado", "Acción" o encabezados que no forman parte del contrato aprobado.
- El archivo contiene duplicados, filas inválidas o un volumen para el que aún no se ha aprobado
  un límite.
- El producto no tiene vencimiento o no tiene política de devolución.
- Una función aparece en un prototipo, documento heredado o biblioteca, pero no en el alcance
  funcional aprobado.
- Un Usuario intenta abrir productos, paneles, bitácora o administración de usuarios sin permiso
  explícito.
- Se solicita eliminar un producto con historial o relaciones existentes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La documentación MUST clasificar cada capacidad de Nexo como incluida, excluida o
  pendiente de una Spec, y MUST identificar el motivo o la decisión que determina su clasificación.
- **FR-002**: El alcance inicial MUST incluir autenticación, autorización por rol, gestión de
  productos, importación de Excel, cálculo y consulta de estados, panel de inventario,
  configuración de avisos, gestión de usuarios y bitácora para el Administrador.
- **FR-003**: El alcance inicial MUST excluir ventas, compras, facturación, pedidos, recepción de
  mercancía, movimientos entre almacenes y contabilidad; cada una requiere una Spec aprobada antes
  de incorporarse.
- **FR-004**: El sistema MUST operar como la aplicación web establecida en la Spec 001; la
  distribución como ejecutable de escritorio y el funcionamiento sin conexión MUST quedar fuera
  del alcance aprobado.
- **FR-005**: La importación MUST limitarse a los encabezados aprobados en la Spec 000. "Estado"
  MUST ser calculado por el sistema y "Acción" MUST NOT tratarse como dato importable.
- **FR-006**: La fecha de vencimiento MUST registrarse como dato del producto fuera de los
  encabezados de Excel acordados; el estado y el aviso MUST calcularse conforme a la política de
  devolución y las reglas de la constitución vigente.
- **FR-007**: La exportación o generación de archivos Excel, los reportes PDF y el envío de avisos
  por correo, SMS o notificación push MUST NOT considerarse funciones iniciales sin una Spec que
  los solicite.
- **FR-008**: El Administrador MUST tener acceso a la administración autorizada del sistema y a la
  bitácora. El Usuario MUST poder consultar el inventario y el panel, además de realizar la
  importación y gestionar parámetros no críticos. El Usuario MUST NOT administrar usuarios,
  consultar la bitácora ni cambiar configuraciones críticas.
- **FR-009**: El sistema MUST NOT eliminar automáticamente productos o datos de negocio por
  antigüedad. El borrado físico MUST NOT estar disponible sin una Spec que defina permisos,
  consecuencias y recuperación.
- **FR-010**: El comportamiento de la importación ante duplicados, errores de fila o archivo,
  tamaño y cantidad máxima de registros MUST definirse en una Spec de importación antes de
  implementarse. El sistema MUST NOT sobrescribir ni descartar información silenciosamente.
- **FR-011**: Nexo MUST NOT prometer operación, volumen o rendimiento ilimitados. Los límites de
  uso MUST comunicarse cuando se definan en las Specs correspondientes.
- **FR-012**: Una capacidad excluida o pendiente MUST NOT presentarse en la interfaz o documentación
  como función disponible; su incorporación MUST pasar por una Spec y su flujo de aprobación.

### Key Entities *(include if feature involves data)*

- **Capacidad funcional**: Función propuesta o existente clasificada como incluida, excluida o
  pendiente, con su justificación y la Spec que la autoriza cuando corresponda.
- **Rol**: Perfil de acceso Administrador o Usuario. El Administrador gestiona las funciones
  autorizadas y la bitácora; el Usuario consulta inventario y panel, importa datos y gestiona
  parámetros no críticos, sin administrar usuarios ni configuraciones críticas.
- **Importación de inventario**: Entrada de productos mediante los encabezados y restricciones
  definidos en la Spec 000 y en la futura Spec detallada de importación.
- **Producto**: Registro de inventario sujeto a las reglas de producto, vencimiento, política de
  devolución, estado y conservación aprobadas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las capacidades iniciales está clasificado como incluido, excluido o
  pendiente, con una justificación verificable.
- **SC-002**: Al menos el 90% de las personas evaluadas clasifica correctamente solicitudes
  habituales de inventario y procesos externos según el alcance documentado.
- **SC-003**: El 100% de los encabezados Excel queda identificado como importable, calculado o
  excluido, sin confundir "Estado" o "Acción" con datos de entrada.
- **SC-004**: El 100% de las operaciones restringidas por rol o conservación de datos tiene una
  regla documentada y una persona revisora puede identificarla sin recurrir a documentos
  contradictorios.

## Assumptions

- El alcance se deriva de la descripción de Nexo como sistema web dedicado a la gestión de
  productos, estados e importación Excel, y de las funciones iniciales enumeradas en
  `sistemanexo.md`.
- La Spec 001 prevalece para la plataforma: no se incluye un ejecutable `.exe` ni operación
  desconectada.
- La Spec 000 define el contrato de datos vigente: el estado no se importa y la fecha de
  vencimiento se registra aparte del Excel.
- No se asumen operaciones de ventas, compras o movimientos de almacén porque no están incluidas
  en el alcance inicial documentado.
- La existencia de una biblioteca o una pantalla de prototipo no constituye por sí misma
  aprobación de una capacidad funcional.
- Esta especificación documenta límites funcionales; el detalle de importación, matriz completa de
  permisos y reglas de retiro requieren Specs propias antes de implementarse.
