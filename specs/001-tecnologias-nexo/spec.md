# Feature Specification: Spec 001 — Tecnologías de Nexo

**Feature Branch**: `001-tecnologias-nexo`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "spec 001 tecnologias"

## Clarifications

### Session 2026-11-11

- Q: ¿Cómo se autentican los usuarios de Nexo? → A: Mediante sesiones seguras gestionadas por la API NestJS.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar la arquitectura aprobada (Priority: P1)

Como responsable o integrante del proyecto Nexo, necesito una definición técnica vigente y
específica para el sistema de inventario, para que las decisiones de diseño e implementación usen
una misma base y no mezclen tecnologías de otros proyectos.

**Why this priority**: Las especificaciones de funcionalidades dependen de conocer la plataforma,
los límites entre componentes y las tecnologías permitidas.

**Independent Test**: Una revisión de la definición técnica permite identificar la arquitectura
objetivo, las tecnologías aprobadas y las decisiones aún pendientes sin referencias contradictorias
a órdenes de trabajo u otros productos.

**Acceptance Scenarios**:

1. **Given** una persona consulta la definición técnica, **When** identifica la interfaz, el
   procesamiento de negocio y el almacenamiento, **Then** encuentra las tecnologías aprobadas y
   sus responsabilidades.
2. **Given** un integrante evalúa una nueva dependencia, **When** la compara con la definición
   técnica, **Then** puede determinar si está aprobada, condicionada a una necesidad funcional o
   requiere una decisión.

---

### User Story 2 - Entender los límites de datos y seguridad (Priority: P1)

Como persona responsable de revisar el sistema, necesito saber cómo se comunica la interfaz con
los datos y qué servicios de plataforma están permitidos, para evitar acceso directo o exposición
indebida de información.

**Why this priority**: La arquitectura de acceso afecta la confidencialidad, autorización e
integridad de los datos del inventario.

**Independent Test**: Seguir el flujo documentado desde la interfaz hasta el almacenamiento y
verificar que cada componente y límite de confianza esté identificado.

**Acceptance Scenarios**:

1. **Given** una lectura o modificación de datos del inventario, **When** se sigue el flujo
   arquitectónico aprobado, **Then** se identifica el componente que valida y autoriza la operación.
2. **Given** la plataforma Supabase forma parte del almacenamiento, **When** una persona revisa
   los límites de uso, **Then** puede distinguir la base de datos de los servicios de autenticación
   o API automática que no estén aprobados.

---

### User Story 3 - Resolver diferencias entre documentos técnicos (Priority: P2)

Como responsable del proyecto, necesito identificar y resolver las referencias heredadas de otros
sistemas, para que Nexo tenga una definición tecnológica coherente con su dominio de inventario.

**Why this priority**: Los documentos actuales mezclan decisiones generales con detalles de otro
producto y podrían llevar a construir una arquitectura incorrecta.

**Independent Test**: Revisar los documentos técnicos aprobados y comprobar que describan Nexo,
señalen sus decisiones pendientes y no presenten módulos de órdenes de trabajo como alcance del
sistema.

**Acceptance Scenarios**:

1. **Given** un documento técnico contiene referencias a RosaBetania, OT o su esquema de datos,
   **When** se prepara la definición de Nexo, **Then** esas referencias se excluyen o se sustituyen
   por decisiones aprobadas para Nexo.
2. **Given** la descripción del sistema y la carpeta de tecnologías discrepan sobre plataforma o
   distribución, **When** se revisa la definición técnica, **Then** la discrepancia se presenta para
   resolverla antes de adoptarla como requisito de implementación.

### Edge Cases

- Un componente o dependencia descrito en la documentación no está presente en el repositorio de
  Nexo ni se necesita para una funcionalidad aprobada.
- Un documento usa el nombre, las tablas o los esquemas de otro sistema.
- Una decisión de plataforma aparece en más de un documento con valores incompatibles.
- La tecnología escogida deja de tener una versión compatible o una ruta de soporte definida.
- Un cambio de arquitectura requiere infraestructura, permisos o costos no contemplados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La definición tecnológica MUST describir una arquitectura para el sistema de
  inventario Nexo y MUST distinguirla de los productos y dominios mencionados en documentos
  heredados.
- **FR-002**: La carpeta `tecnologias/` MUST ser la fuente de las tecnologías candidatas aprobadas
  por el proyecto. La definición MUST distinguir tecnologías base de dependencias opcionales que
  solo se incorporan cuando una funcionalidad aprobada las necesita.
- **FR-003**: La definición MUST documentar las responsabilidades de interfaz, procesamiento de
  negocio, contratos de datos y almacenamiento, además del flujo de comunicación entre ellas.
- **FR-004**: La definición MUST establecer los límites de acceso a datos: la API NestJS valida
  sesiones seguras y autoriza operaciones, solo los componentes aprobados pueden conectarse al
  almacenamiento y los servicios de Supabase permitidos o excluidos deben quedar documentados.
- **FR-005**: La definición MUST identificar los entornos de desarrollo, integración y producción,
  el propósito de cada entorno y las restricciones para usar datos reales.
- **FR-006**: La definición MUST describir las prácticas aprobadas para cambios de esquema,
  configuración y secretos, y distinguir las decisiones que requieren revisión previa.
- **FR-007**: La definición MUST documentar la estrategia aprobada de construcción, pruebas,
  integración continua y distribución del sistema, sin asumir infraestructura no aprobada.
- **FR-008**: La definición MUST identificar las versiones de plataforma y tecnologías que estén
  verificadas para Nexo, y MUST marcar como pendientes las versiones que no hayan sido verificadas
  en el repositorio o en sus manifiestos.
- **FR-009**: Nexo MUST ser una aplicación web; Python/Flet y el empaquetado como `.exe` mencionados
  en `sistemanexo.md` quedan obsoletos para la plataforma aprobada.
- **FR-010**: El esquema PostgreSQL de Nexo MUST llamarse `nexo` y MUST NOT reutilizar nombres de
  esquema pertenecientes a otros sistemas.
- **FR-011**: La base tecnológica MUST usar las tecnologías centrales documentadas en
  `tecnologias/`: TypeScript y Node.js en un monorepo con npm workspaces y Turborepo; React y Vite
  con MUI para la interfaz web; NestJS para la API; Zod para contratos compartidos; Prisma para
  acceder a PostgreSQL alojado en Supabase; GitHub Actions para integración continua; y Vercel
  para publicar la interfaz y la API como proyectos separados. El entorno de desarrollo MUST NOT
  requerir Docker.
- **FR-012**: El frontend MUST consumir los datos mediante la API NestJS aprobada y MUST NOT
  conectarse directamente a PostgreSQL ni usar Supabase Auth, su API automática o su cliente de
  navegador. La sesión segura del usuario MUST ser gestionada por la API.
- **FR-013**: Dependencias específicas de módulos de órdenes de trabajo —incluidos PDF,
  arrastrar-y-soltar, correo y contratos de ese dominio— MUST NOT considerarse requisitos de Nexo
  salvo que una Spec de inventario las justifique.
- **FR-014**: Toda tecnología nueva o cambio material de arquitectura MUST incluir su motivo,
  alternativas consideradas, impacto en seguridad y datos, y aprobación conforme a la gobernanza
  del proyecto.

### Key Entities *(include if feature involves data)*

- **Componente arquitectónico**: Parte del sistema Nexo con una responsabilidad y límites de
  acceso definidos.
- **Tecnología aprobada**: Plataforma, lenguaje, marco de trabajo, herramienta o servicio
  permitido para uno o más componentes.
- **Entorno**: Contexto de desarrollo, integración o producción con reglas de datos, configuración
  y acceso propias.
- **Decisión técnica**: Registro de una elección de arquitectura, su justificación, alternativas
  y consecuencias.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los componentes arquitectónicos de Nexo tiene una responsabilidad,
  tecnología asignada y límite de acceso documentados.
- **SC-002**: Una persona revisora puede determinar en menos de 10 minutos si una dependencia
  propuesta está aprobada, es condicional o requiere una decisión.
- **SC-003**: La definición técnica no contiene referencias de alcance a órdenes de trabajo,
  tablas o esquemas de RosaBetania presentadas como requisitos de Nexo.
- **SC-004**: El 100% de las decisiones incompatibles entre documentos está resuelto o identificado
  explícitamente como pendiente antes de aprobar la definición.
- **SC-005**: La definición de los entornos y de la distribución permite a un integrante identificar
  dónde se desarrolla, valida e instala el sistema sin depender de instrucciones contradictorias.

## Assumptions

- La solicitud corresponde a crear la especificación número 001; se conserva el Diccionario de
  Datos como Spec 000.
- La arquitectura web y las tecnologías centrales descritas en `tecnologias/` son la base aprobada
  por el usuario para Nexo; las referencias a RosaBetania y órdenes de trabajo no son requisitos
  funcionales de Nexo.
- No se añadirán tecnologías fuera de la carpeta `tecnologias/` sin una decisión aprobada.
- Supabase se usa como proveedor PostgreSQL y el esquema de Nexo es `nexo`; los nombres,
  credenciales y responsables de entornos propios de otros sistemas no se trasladan a Nexo.
- La autenticación de usuarios se gestiona mediante sesiones seguras propias de la API NestJS;
  Supabase Auth queda excluido.
- Las versiones exactas se verificarán contra los manifiestos y la disponibilidad real antes de
  adoptarlas, aunque estén enumeradas en los documentos existentes.
- Esta especificación define y valida decisiones técnicas; no instala dependencias, despliega
  servicios ni implementa componentes.
