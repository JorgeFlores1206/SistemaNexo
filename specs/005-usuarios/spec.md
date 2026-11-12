# Feature Specification: Spec 005 — Usuarios

**Feature Branch**: `005-usuarios`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 005 usuarios"

## Clarifications

### Session 2026-11-11

- Q: ¿Qué acceso tiene el rol Usuario? → A: Heredado de Spec 002: puede consultar inventario y panel, importar datos y gestionar parámetros no críticos; no puede administrar usuarios, consultar bitácora ni cambiar configuraciones críticas.
- Q: ¿Cómo se entrega la contraseña temporal? → A: El Administrador la entrega por un canal externo y la persona debe cambiarla en el primer acceso.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrar cuentas (Priority: P1)

Como Administrador, necesito crear, consultar, modificar y desactivar cuentas para controlar quién
puede acceder a Nexo y conservar la trazabilidad de las operaciones realizadas por cada persona.

**Why this priority**: Las cuentas activas y sus datos determinan quién puede usar las funciones
protegidas del inventario.

**Independent Test**: Crear una cuenta Usuario, modificar sus datos, verificar que puede iniciar
sesión, desactivarla y comprobar que el acceso queda denegado sin eliminar su historial.

**Acceptance Scenarios**:

1. **Given** un Administrador autenticado, **When** crea una cuenta con nombre, correo único y rol
   válido, **Then** la cuenta queda activa y requiere cambiar su contraseña temporal al primer
   inicio de sesión.
2. **Given** una cuenta existente, **When** un Administrador modifica sus datos o rol, **Then**
   Nexo valida los datos, conserva la identidad de la cuenta y aplica los permisos del rol nuevo.
3. **Given** una cuenta activa, **When** un Administrador la desactiva, **Then** la cuenta no puede
   iniciar sesión y sus datos e historial permanecen conservados.
4. **Given** una cuenta desactivada, **When** un Administrador autorizado la reactiva, **Then** la
   cuenta puede volver a iniciar sesión con las credenciales vigentes y los permisos de su rol.

---

### User Story 2 - Usar y proteger las credenciales propias (Priority: P1)

Como Usuario, necesito establecer mi contraseña inicial y cambiar la contraseña de mi propia
cuenta para proteger mi acceso al sistema.

**Why this priority**: Las credenciales protegen los datos de inventario y evitan que otras
personas utilicen una cuenta ajena.

**Independent Test**: Iniciar sesión con una contraseña temporal, establecer una nueva, cerrar
sesión y comprobar que la contraseña nueva permite volver a entrar y la temporal deja de funcionar.

**Acceptance Scenarios**:

1. **Given** una cuenta recién creada con contraseña temporal, **When** su titular inicia sesión
   por primera vez, **Then** debe establecer una contraseña personal antes de acceder a otras
   funciones.
2. **Given** un Usuario autenticado, **When** cambia su contraseña proporcionando la vigente y
   confirmando la nueva, **Then** Nexo acepta el cambio solo si ambas nuevas coinciden y cumplen
   la política de contraseña aprobada.
3. **Given** una persona olvidó su contraseña, **When** solicita ayuda al Administrador, **Then**
   el Administrador puede asignar una nueva contraseña temporal sin ver ni recuperar la anterior.

---

### User Story 3 - Asignar roles y limitar permisos (Priority: P1)

Como Administrador, necesito asignar uno de los roles aprobados y consultar qué permite cada rol
para que cada persona tenga únicamente los accesos necesarios.

**Why this priority**: Los roles deben restringir efectivamente el acceso a la información y las
funciones administrativas.

**Independent Test**: Asignar los roles Administrador y Usuario a cuentas de prueba e intentar
acceder a cada módulo, verificando los permisos permitidos y denegados.

**Acceptance Scenarios**:

1. **Given** una cuenta que el Administrador está creando o editando, **When** asigna un rol,
   **Then** solo puede seleccionar Administrador o Usuario y la matriz autorizada se aplica a la
   cuenta.
2. **Given** una cuenta con rol Usuario, **When** inicia sesión, **Then** puede consultar el
   inventario y el panel, importar productos y acceder únicamente a las áreas de parametrización
   no críticas aprobadas, sin acceder a Clientes, Usuarios, Roles ni Bitácora.
3. **Given** una cuenta con rol Administrador, **When** accede a Nexo, **Then** puede utilizar las
   funciones administrativas autorizadas, incluida la gestión de usuarios y la consulta de roles y
   bitácora.
4. **Given** una cuenta no autorizada intenta acceder a un módulo mediante una ruta directa,
   **When** se valida la operación, **Then** el acceso se deniega sin exponer datos ni modificar
   información.

### Edge Cases

- Se intenta crear una cuenta con un correo ya utilizado o con campos obligatorios vacíos.
- El correo tiene formato inválido o cambia a uno ya asignado a otra cuenta.
- Un Administrador intenta desactivar o cambiar el rol de la única cuenta Administrador activa.
- Una persona intenta iniciar sesión con una cuenta inactiva o con una contraseña temporal después
  de haber establecido la contraseña personal.
- Una contraseña nueva no coincide con su confirmación o no cumple la política aprobada.
- El Administrador intenta asignar un rol distinto de Administrador o Usuario.
- Una cuenta existente tiene productos, importaciones o eventos de bitácora asociados al desactivarla.
- Los permisos cambian mientras la cuenta mantiene una sesión iniciada.
- Un Usuario intenta acceder a Usuarios, Roles, Clientes o Bitácora directamente; el sistema debe
  denegar esas áreas sin afectar su acceso autorizado al inventario y panel.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La administración de cuentas MUST estar reservada al Administrador. El sistema MUST
  NOT permitir registro público de cuentas.
- **FR-002**: El Administrador MUST poder crear una cuenta indicando nombre, correo electrónico y
  rol. Nombre y correo MUST ser obligatorios; el correo MUST tener formato válido y ser único sin
  distinguir mayúsculas de minúsculas.
- **FR-003**: El Administrador MUST asignar una contraseña temporal al crear una cuenta o iniciar
  un restablecimiento y MUST entregarla por un canal externo a la aplicación y a la bitácora. La
  cuenta MUST exigir que su titular establezca una contraseña personal antes de acceder al resto
  del sistema; la contraseña temporal MUST dejar de ser válida después del cambio.
- **FR-004**: El sistema MUST aplicar una política de contraseña que exija al menos 12 caracteres
  y MUST verificar que la contraseña nueva y su confirmación coincidan. Las contraseñas MUST NOT
  mostrarse en listados, bitácora ni confirmaciones de operación.
- **FR-005**: El titular de la cuenta MUST poder cambiar su propia contraseña proporcionando la
  contraseña vigente, excepto durante el establecimiento obligatorio de la primera contraseña
  personal.
- **FR-006**: El Administrador MUST poder consultar y modificar el nombre, correo y rol de una
  cuenta existente, validando los mismos requisitos que al crearla.
- **FR-007**: El sistema MUST contemplar únicamente los roles fijos Administrador y Usuario en el
  alcance inicial. El Administrador MUST poder consultar la matriz de permisos; la creación de
  roles personalizados o la edición de privilegios MUST quedar fuera del alcance inicial.
- **FR-008**: El rol Administrador MUST tener acceso a las funciones administrativas autorizadas,
  incluida la gestión de usuarios, la consulta de la matriz de roles y la bitácora.
- **FR-009**: El rol Usuario MUST permitir la consulta del inventario y panel, la importación de
  Excel y el acceso a las áreas autorizadas de parametrización no crítica de catálogos e
  inventario. MUST NOT permitir acceso a Clientes, administración de usuarios o roles, privilegios
  ni bitácora, ni cambios de configuraciones críticas.
- **FR-010**: La importación de Excel MUST seguir la Spec 004 y cualquier parámetro MUST quedar
  sujeto a la función y autorización que tenga su especificación correspondiente; el rol Usuario
  MUST NOT recibir permisos adicionales por aparecer una opción en el prototipo.
- **FR-011**: El Administrador MUST poder desactivar y reactivar cuentas. La desactivación MUST
  impedir inicios de sesión posteriores, invalidar las sesiones activas de la cuenta y conservar
  los datos e historial asociados. El borrado físico de cuentas MUST NOT estar disponible.
- **FR-012**: El sistema MUST mantener al menos una cuenta Administrador activa y MUST rechazar
  cualquier operación que desactive o cambie el rol de la única cuenta Administrador activa.
- **FR-013**: Los cambios de rol MUST aplicar los permisos del nuevo rol desde la siguiente
  operación protegida e invalidar las sesiones activas de la cuenta afectada. La desactivación y
  el restablecimiento de contraseña MUST invalidar sus sesiones activas; un restablecimiento MUST
  exigir que la persona cambie la contraseña temporal antes de continuar.
- **FR-014**: La administración de cuentas, los cambios de rol y estado, los restablecimientos de
  contraseña y los intentos denegados relevantes MUST registrarse en la bitácora con actor,
  momento, cuenta afectada y resultado. La bitácora MUST NOT contener contraseñas ni secretos.
- **FR-015**: La autorización MUST verificarse al ejecutar la operación protegida y MUST NOT
  depender únicamente de ocultar controles en la interfaz.
- **FR-016**: La lista de usuarios MUST mostrar nombre, correo, rol, estado y último acceso según
  la información disponible. MUST distinguir cuentas activas de desactivadas y comunicar cuando
  no haya cuentas registradas.
- **FR-017**: La gestión de Clientes MUST quedar fuera del alcance inicial de Nexo. Ningún rol
  MUST poder consultar ni administrar Clientes hasta que una Spec apruebe expresamente esa
  capacidad.

- **FR-018**: La matriz de permisos de esta Spec MUST ser la referencia para las operaciones
  protegidas de las Specs 004, 006, 007, 008, 009, 010 y posteriores. Una Spec funcional puede
  restringir una operación adicional, pero MUST NOT conceder al rol Usuario acceso administrativo
  que esta matriz reserva al Administrador.

### Key Entities *(include if feature involves data)*

- **Cuenta de usuario**: Identidad que puede iniciar sesión, con nombre, correo único, rol,
  estado de actividad y datos de acceso necesarios.
- **Rol**: Perfil fijo Administrador o Usuario que determina los módulos y operaciones permitidos.
- **Permiso**: Autorización para acceder a una función protegida, asociada al rol vigente.
- **Evento de administración de cuenta**: Registro de creación, cambio de datos o rol,
  activación, desactivación, restablecimiento o intento denegado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las cuentas creadas tiene nombre, correo único, rol permitido y estado
  explícito.
- **SC-002**: El 100% de las cuentas desactivadas no puede iniciar sesión y conserva su historial
  asociado.
- **SC-003**: El 100% de las operaciones de cuenta, rol y bitácora se permite o deniega según la
  matriz aprobada, incluso cuando se intenta acceder por una ruta directa.
- **SC-004**: Ninguna prueba de cambio de contraseña permite una contraseña temporal reutilizada,
  una confirmación diferente o una contraseña que incumpla la longitud mínima definida.
- **SC-005**: En todos los casos probados, el sistema impide desactivar o degradar la única cuenta
  Administrador activa y registra el intento denegado.
- **SC-006**: El 100% de los cambios administrativos de cuenta queda trazable sin registrar
  contraseñas ni secretos.

## Assumptions

- La matriz inicial confirmada por el usuario permite al rol Usuario consultar inventario y panel,
  importar datos y acceder a áreas autorizadas de parametrización no crítica de catálogos e
  inventario; no incluye Clientes, administración de usuarios o roles, privilegios ni bitácora.
- El rol Administrador conserva acceso administrativo amplio conforme a las funciones aprobadas
  por las Specs vigentes.
- El Administrador establece una contraseña temporal y la comunica al titular por un canal externo
  a la aplicación y distinto de la bitácora. El titular debe cambiarla en el primer acceso.
- El primer Administrador se provisiona mediante un procedimiento inicial seguro definido para el
  despliegue; no existe auto-registro público.
- La política inicial de contraseña exige 12 caracteres como mínimo. Reglas adicionales deben ser
  compatibles con la política de seguridad y autenticación aprobada.
- Desactivar cuentas, en vez de borrarlas físicamente, preserva la relación entre acciones,
  importaciones y personas para fines de bitácora.
- El prototipo muestra una acción de eliminación irreversible; esta especificación la reemplaza
  por desactivación reversible antes de implementar el flujo.
- La gestión de Clientes queda fuera del alcance inicial de Nexo para todos los roles hasta que
  una Spec la apruebe.
- El acceso del rol Usuario al inventario y panel incluye las consultas funcionales aprobadas por
  sus Specs, pero no convierte al Usuario en Administrador ni le permite consultar bitácoras o
  ejecutar ajustes físicos.
