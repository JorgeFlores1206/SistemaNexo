# Feature Specification: Spec 003 — Procedimientos del sistema

**Feature Branch**: `003-procedimientos-sistema`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 003 procedimientos-sistema"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceder a las funciones autorizadas (Priority: P1)

Como integrante del equipo Nexo, necesito iniciar y cerrar mi sesión y encontrar solo las
operaciones permitidas para mi rol, para trabajar con el inventario sin acceder a funciones
restringidas.

**Why this priority**: La autorización es un requisito previo para los demás procedimientos y
protege los datos y operaciones del sistema.

**Independent Test**: Iniciar sesión con cuentas de cada rol y verificar que cada una puede
acceder a sus funciones aprobadas, que las operaciones no autorizadas se deniegan y que cerrar la
sesión termina el acceso.

**Acceptance Scenarios**:

1. **Given** una cuenta activa, **When** la persona inicia sesión con sus credenciales válidas,
   **Then** accede a las funciones autorizadas para su rol.
2. **Given** una cuenta sin permiso para una operación, **When** intenta ejecutarla, **Then** el
   sistema deniega la operación, no aplica cambios y comunica que el acceso no está autorizado.
3. **Given** una sesión iniciada, **When** la persona cierra sesión, **Then** el sistema termina
   esa sesión y requiere autenticación antes de permitir nuevas operaciones protegidas.

---

### User Story 2 - Consultar y mantener el inventario (Priority: P1)

Como Administrador, necesito localizar productos y consultar su información, estado y avisos para
identificar qué productos requieren atención y mantener el inventario dentro de las reglas
aprobadas.

**Why this priority**: La consulta y gestión del inventario son el propósito central de Nexo.

**Independent Test**: Abrir un producto existente, verificar su código, descripción, datos y
estado calculado, y comprobar que las operaciones de gestión permitidas producen un resultado
confirmado o un error comprensible sin cambios silenciosos.

**Acceptance Scenarios**:

1. **Given** productos registrados, **When** el Administrador abre el inventario y localiza un
   producto, **Then** puede consultar los datos aprobados, su estado y los avisos aplicables.
2. **Given** el inventario contiene productos, **When** el Administrador consulta el panel,
   **Then** los totales y cantidades por estado concuerdan con los productos y reglas vigentes.
3. **Given** un producto con fecha de vencimiento y política de devolución válidas, **When** se
   consulta, **Then** el estado corresponde a las reglas de la constitución vigente y no a un
   valor manual importado.
4. **Given** el Administrador realiza una operación de gestión autorizada, **When** el sistema la
   completa o la rechaza, **Then** muestra el resultado y conserva la integridad del producto.

---

### User Story 3 - Importar y configurar datos operativos (Priority: P2)

Como Usuario autorizado, necesito seguir un procedimiento claro para importar productos y
consultar o modificar los parámetros que mi rol permita, para que los datos se incorporen con
resultado conocido y los avisos sigan la configuración aprobada.

**Why this priority**: La importación y los parámetros permiten mantener el inventario y sus
avisos sin ampliar los permisos del Usuario más allá de lo aprobado.

**Independent Test**: Seguir el procedimiento con un archivo que usa los encabezados aprobados y
con una operación de parámetros permitida, verificando los resultados comunicados y que las
operaciones no autorizadas no se apliquen.

**Acceptance Scenarios**:

1. **Given** un Usuario autorizado para importar, **When** selecciona un archivo Excel con los
   encabezados de la Spec 000, **Then** el sistema informa el resultado de la importación sin
   tratar "Estado" ni "Acción" como datos de entrada.
2. **Given** una importación contiene información inválida o ambigua, **When** el sistema la
   procesa, **Then** comunica el problema y no descarta ni altera información silenciosamente.
3. **Given** un Usuario intenta modificar un parámetro, **When** carece del permiso requerido o
   el valor incumple una regla aprobada, **Then** el cambio no se presenta como exitoso y se
   informa el motivo.

---

### User Story 4 - Administrar usuarios y revisar acciones (Priority: P2)

Como Administrador, necesito administrar las cuentas conforme a las reglas aprobadas y consultar
la bitácora para controlar quién puede usar el sistema y revisar las operaciones que requieren
trazabilidad.

**Why this priority**: La administración de acceso y la revisión de acciones permiten mantener
el control y la responsabilidad sobre las operaciones del inventario.

**Independent Test**: Ejecutar una operación administrativa autorizada de cuenta, revisar eventos
disponibles en la bitácora y comprobar que el Usuario no puede acceder a funciones administrativas
ni a la bitácora.

**Acceptance Scenarios**:

1. **Given** el Administrador gestiona una cuenta, **When** la operación está permitida por las
   reglas vigentes, **Then** el sistema comunica el resultado y conserva las restricciones de rol
   aprobadas.
2. **Given** una operación que requiere trazabilidad fue realizada, **When** el Administrador
   consulta la bitácora, **Then** puede revisar el evento disponible y su resultado sin ver
   contraseñas, tokens ni secretos.
3. **Given** un Usuario intenta gestionar cuentas o consultar la bitácora, **When** la operación
   está restringida a Administradores, **Then** el sistema la deniega sin revelar datos protegidos.

### Edge Cases

- La cuenta está inactiva, las credenciales no son válidas o la sesión ha terminado.
- El usuario intenta una operación mediante una ruta o acción que no tiene autorizada.
- Un producto carece de fecha de vencimiento, política de devolución u otro dato necesario para
  calcular su estado.
- El archivo Excel contiene encabezados faltantes, adicionales o no aprobados, filas inválidas o
  códigos duplicados.
- Una importación falla total o parcialmente; el resultado debe ajustarse a la política aprobada
  en la Spec de importación, sin reportar éxito engañoso.
- Un parámetro está ausente, fuera del rango aprobado o cambia mientras hay productos afectados.
- Se solicita retirar un producto que conserva historial o relaciones.
- La interfaz muestra una operación heredada o de prototipo que aún no ha sido aprobada en una
  Spec.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Los procedimientos del sistema MUST describir, para cada flujo incluido, el actor,
  las condiciones previas, los pasos observables, el resultado esperado y la respuesta a errores
  o falta de permisos.
- **FR-002**: El flujo de acceso MUST permitir que una persona inicie sesión con una cuenta
  habilitada, y MUST denegar el acceso protegido a credenciales inválidas o cuentas no habilitadas.
- **FR-003**: El sistema MUST limitar cada operación al rol y permisos aprobados; ocultar una
  opción en la interfaz MUST NOT sustituir la autorización de la operación.
- **FR-004**: El Administrador MUST poder seguir el procedimiento aprobado para consultar y
  gestionar productos. El Usuario MUST quedar limitado a las funciones de importación y parámetros
  que se aprueben para su rol, según la Spec 002 y la matriz de permisos vigente.
- **FR-005**: El procedimiento de consulta MUST mostrar el código en "Artículo", el nombre en
  "Descripción del artículo" y el estado calculado conforme a la constitución vigente. El estado
  MUST NOT ser editable ni importable mediante el Excel.
- **FR-006**: El procedimiento de importación MUST usar únicamente los encabezados aprobados en la
  Spec 000; MUST excluir "Estado" y "Acción" como datos de entrada y MUST comunicar el resultado
  sin reportar como exitosa una operación incompleta o fallida.
- **FR-007**: El sistema MUST NOT descartar filas, sobrescribir datos ni transformar información
  ambigua silenciosamente. La detección de duplicados, la política de actualización, la
  atomicidad, los límites y el detalle de errores MUST seguir una Spec de importación aprobada.
- **FR-008**: El procedimiento de parámetros MUST permitir únicamente cambios autorizados y
  válidos según los rangos y reglas aprobados; MUST comunicar cuando un cambio se guarda o se
  rechaza y cómo afecta a los avisos conforme a la regla vigente.
- **FR-009**: El sistema MUST calcular los estados y avisos según las reglas vigentes de la
  constitución; las pantallas, listados y resúmenes MUST presentar resultados consistentes para
  los mismos datos.
- **FR-010**: Las operaciones que requieran trazabilidad conforme a la Spec de bitácora MUST
  generar un registro que identifique el actor, la acción, el recurso afectado, el momento y el
  resultado, sin incluir contraseñas, tokens ni secretos.
- **FR-011**: Todo procedimiento de cambio o retiro de datos MUST preservar las relaciones e
  historial requeridos y MUST NOT ofrecer borrado físico o automático que no esté aprobado en una
  Spec.
- **FR-012**: Los mensajes del sistema MUST distinguir entre operación completada, error de
  validación, falta de autorización y error técnico, y MUST comunicar el siguiente paso seguro
  cuando esté definido.
- **FR-013**: Los procedimientos MUST limitarse a las capacidades aprobadas en las Specs 000,
  001 y 002; ventas, compras, facturación, movimientos de almacén, exportaciones y operación sin
  conexión MUST NOT presentarse como flujos disponibles sin una Spec que los apruebe.
- **FR-014**: El procedimiento de administración de usuarios y consulta de bitácora MUST estar
  restringido al Administrador y MUST respetar las reglas aprobadas para las cuentas, los roles y
  los eventos trazables. El procedimiento MUST aplicar la regla aprobada para la cuenta del último
  Administrador y MUST NOT asumir que puede desactivarse o cambiarse su rol.

### Key Entities *(include if feature involves data)*

- **Procedimiento**: Flujo operativo aprobado con actor, precondiciones, pasos, resultados y
  manejo de errores.
- **Actor y rol**: Persona que usa el sistema y conjunto de operaciones autorizadas según la
  matriz de permisos vigente.
- **Operación de inventario**: Consulta, gestión, importación o configuración que actúa sobre
  productos o parámetros del sistema.
- **Resultado de operación**: Confirmación o rechazo comunicado al usuario, con el registro de
  bitácora correspondiente cuando aplique.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los procedimientos iniciales documenta actor, precondiciones, pasos,
  resultado esperado y respuesta ante errores o falta de permisos.
- **SC-002**: Al menos el 90% de las personas evaluadas completa correctamente un flujo de acceso,
  consulta o importación usando los procedimientos, sin asistencia.
- **SC-003**: El 100% de las operaciones incluidas en los flujos está asociado a un rol y permiso
  aprobado; ninguna operación denegada produce cambios de datos.
- **SC-004**: El 100% de los resultados de importación informa éxito, rechazo o error conforme a
  la política aprobada, sin pérdida o modificación silenciosa de datos.
- **SC-005**: Una revisión de los flujos confirma que el mismo conjunto de datos muestra estados y
  avisos coherentes en las vistas donde se consulta.
- **SC-006**: El 100% de las operaciones administrativas de cuentas y bitácora queda limitado al
  Administrador y cumple las reglas vigentes de protección de cuentas y datos.

## Assumptions

- "Procedimientos del sistema" se interpreta como los flujos operativos para usuarios de Nexo,
  no como instrucciones técnicas de despliegue, respaldo o mantenimiento de infraestructura.
- La plataforma web y las tecnologías están regidas por la Spec 001; los límites funcionales y
  roles iniciales están regidos por la Spec 002.
- La Spec 000 y la constitución vigente gobiernan los campos del producto, la importación y el
  cálculo de estados y avisos.
- El Administrador puede consultar y gestionar productos dentro de las funciones aprobadas. El
  acceso del Usuario fuera de importación y parámetros no se presume.
- La matriz detallada de permisos, las reglas de alta/edición/retiro de productos, los parámetros
  de aviso y el tratamiento detallado de errores de importación requieren sus decisiones
  funcionales correspondientes y no se inventan en esta especificación.
- El sistema debe comunicar los resultados de operaciones y preservar datos; no se prescribe aquí
  una implementación técnica ni un formato de interfaz.
