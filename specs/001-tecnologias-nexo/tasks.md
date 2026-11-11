---
description: "Tareas de implementación de la arquitectura tecnológica de Nexo"
---

# Tasks: Tecnologías de Nexo

**Input**: Design documents from `specs/001-tecnologias-nexo/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No se generan tareas de TDD porque la especificación no solicita una estrategia TDD; se incluyen validaciones documentales y de configuración donde corresponda.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar los documentos y puntos de configuración que representan la arquitectura de Nexo.

- [X] T001 Crear el árbol documental y de entregables `apps/backend`, `apps/frontend`, `packages/contracts` y `.github/workflows` conforme a `specs/001-tecnologias-nexo/plan.md`
- [X] T002 [P] Registrar la arquitectura base y las tecnologías aprobadas en `tecnologias/arquitectura-tecnologia-nexo.md`
- [X] T003 [P] Documentar los entornos, secretos y restricciones de datos en `tecnologias/entorno-nexo.md`
- [X] T004 [P] Preparar el manifiesto raíz de npm workspaces y Turborepo en `package.json` y `turbo.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establecer las fronteras técnicas que todas las historias necesitan.

**⚠️ CRITICAL**: No debe implementarse una historia de usuario antes de completar esta fase.

- [X] T005 Definir la configuración estricta compartida de TypeScript en `tsconfig.base.json`
- [X] T006 [P] Definir los comandos comunes de lint, build, test y formato en `package.json` y los manifiestos de `apps/backend`, `apps/frontend` y `packages/contracts`
- [X] T007 [P] Crear el paquete de contratos compartidos y su punto de exportación en `packages/contracts/package.json` y `packages/contracts/src/index.ts`
- [X] T008 [P] Definir las variables de entorno documentadas y sus validaciones en `apps/backend/.env.example` y `apps/backend/src/config/configuration.ts`
- [X] T009 Configurar Prisma para PostgreSQL con el esquema `nexo` en `apps/backend/prisma/schema.prisma` y la configuración de migraciones en `apps/backend/prisma`
- [X] T010 Configurar la base de CI para lint, build y test en `.github/workflows/ci.yml`

**Checkpoint**: La base técnica, los límites de configuración y el pipeline quedan listos para las historias.

---

## Phase 3: User Story 1 - Consultar la arquitectura aprobada (Priority: P1) 🎯 MVP

**Goal**: Permitir que una persona identifique rápidamente componentes, responsabilidades,
tecnologías base, dependencias condicionales y entornos aprobados.

**Independent Test**: Revisar la documentación y confirmar que cada componente tiene tecnología,
responsabilidad, entorno y límite de acceso; una dependencia propuesta se clasifica como aprobada,
condicional o pendiente.

- [X] T011 [P] [US1] Documentar la matriz componente-responsabilidad-tecnología-entorno en `specs/001-tecnologias-nexo/data-model.md`
- [X] T012 [P] [US1] Documentar las decisiones de selección y alternativas rechazadas en `specs/001-tecnologias-nexo/research.md`
- [X] T013 [US1] Actualizar la arquitectura aprobada de Nexo, eliminando nombres y dominios heredados, en `tecnologias/arquitectura-tecnologia-nexo.md`
- [X] T014 [US1] Documentar el flujo de desarrollo, CI y distribución separada en `specs/001-tecnologias-nexo/quickstart.md`
- [X] T015 [US1] Registrar el procedimiento para aprobar nuevas tecnologías y cambios materiales en `tecnologias/decision-log.md`

**Checkpoint**: US1 es revisable sin depender de una implementación funcional del inventario.

---

## Phase 4: User Story 2 - Entender los límites de datos y seguridad (Priority: P1)

**Goal**: Hacer verificable el recorrido frontend → API → Prisma → PostgreSQL y las reglas de
sesión, autorización, secretos y uso limitado de Supabase.

**Independent Test**: Seguir una lectura y una modificación documentadas y comprobar que la API
valida sesión/autorización antes de persistir, sin acceso directo desde el navegador.

- [X] T016 [P] [US2] Definir el contrato de frontera frontend-API, errores y validación Zod en `specs/001-tecnologias-nexo/contracts/architecture-contract.md`
- [X] T017 [US2] Implementar la configuración base de NestJS y el arranque de la API en `apps/backend/src/main.ts` y `apps/backend/src/app.module.ts`
- [X] T018 [US2] Implementar la gestión de sesión segura y guardas de autorización en `apps/backend/src/auth` y `apps/backend/src/auth/guards`
- [X] T019 [P] [US2] Centralizar el cliente Prisma y el acceso exclusivo al esquema `nexo` en `apps/backend/src/prisma` y `apps/backend/prisma/schema.prisma`
- [X] T020 [P] [US2] Configurar el cliente HTTP del frontend sin acceso directo a base de datos ni Supabase en `apps/frontend/src/api` y `apps/frontend/src/sesion`
- [X] T021 [US2] Documentar secretos, datos no reales y separación de desarrollo/integración/producción en `tecnologias/entorno-nexo.md`
- [X] T022 [US2] Añadir al pipeline una comprobación de fronteras prohibidas y configuración segura en `.github/workflows/ci.yml`

**Checkpoint**: US2 tiene una frontera de acceso comprobable y una ruta de sesión/autorización definida.

---

## Phase 5: User Story 3 - Resolver diferencias entre documentos técnicos (Priority: P2)

**Goal**: Evitar que documentación de RosaBetania/OT se adopte accidentalmente como arquitectura
de Nexo y dejar pendientes incompatibilidades explícitas.

**Independent Test**: Buscar referencias a RosaBetania, OT y `rosabetania` en los documentos de la
arquitectura de Nexo; ninguna debe presentarse como requisito de Nexo y toda discrepancia pendiente
debe estar registrada.

- [X] T023 [P] [US3] Inventariar referencias heredadas y su tratamiento en `specs/001-tecnologias-nexo/research.md`
- [X] T024 [P] [US3] Sustituir el esquema heredado por `nexo` en documentación y configuración de Nexo en `tecnologias/` y `apps/backend/prisma/schema.prisma`
- [X] T025 [US3] Separar dependencias condicionales de OT de las dependencias base de Nexo en `tecnologias/decision-log.md`
- [X] T026 [US3] Registrar versiones verificadas y pendientes contra manifiestos en `specs/001-tecnologias-nexo/research.md`
- [X] T027 [US3] Actualizar el contrato y quickstart para señalar conflictos pendientes antes de adoptar una tecnología en `specs/001-tecnologias-nexo/contracts/architecture-contract.md` y `specs/001-tecnologias-nexo/quickstart.md`

**Checkpoint**: US3 deja la arquitectura de Nexo coherente y las diferencias heredadas trazables.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar documentación y validar la entrega completa.

- [X] T028 [P] Revisar enlaces, nombres de archivos y referencias cruzadas en `specs/001-tecnologias-nexo/`
- [X] T029 [P] Actualizar la documentación raíz de arquitectura en `README.md` o `docs/arquitectura-nexo.md`
- [X] T030 Ejecutar todos los pasos de `specs/001-tecnologias-nexo/quickstart.md` y registrar resultados en `specs/001-tecnologias-nexo/quickstart.md`
- [X] T031 Verificar que todas las tecnologías nuevas tengan motivo, alternativas, impacto de seguridad/datos y aprobación en `tecnologias/decision-log.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Phase 1 y bloquea las historias.
- **US1 y US2 (Phases 3–4)**: dependen de Phase 2 y pueden ejecutarse en paralelo.
- **US3 (Phase 5)**: depende de Phase 2; conviene ejecutarla después de US1 para consolidar la documentación.
- **Polish (Phase 6)**: depende de las historias seleccionadas.

### User Story Dependencies

- **US1 (P1)**: solo depende de Foundational.
- **US2 (P1)**: solo depende de Foundational; comparte el contrato arquitectónico con US1.
- **US3 (P2)**: puede iniciar tras Foundational, pero sus comprobaciones finales dependen de los documentos de US1.

### Parallel Opportunities

- T002–T004 pueden ejecutarse en paralelo.
- T006–T008 pueden ejecutarse en paralelo; T009 y T010 dependen de la estructura inicial.
- US1 y US2 pueden asignarse a personas distintas después de Phase 2.
- Dentro de US1, T011 y T012 son paralelizables.
- Dentro de US2, T016, T019 y T020 pueden avanzar en paralelo una vez definida la frontera.
- Dentro de US3, T023–T026 pueden avanzar en paralelo.

## Parallel Example: User Story 1

```text
T011: matriz de componentes en data-model.md
T012: decisiones y alternativas en research.md
```

## Implementation Strategy

### MVP First

1. Completar Phase 1 y Phase 2.
2. Completar US1 para disponer de una arquitectura revisable.
3. Validar US1 de forma independiente.

### Incremental Delivery

1. Añadir US2 para hacer verificables los límites de seguridad y datos.
2. Añadir US3 para limpiar referencias heredadas y resolver discrepancias.
3. Ejecutar Phase 6 antes de aprobar la arquitectura para implementación funcional.

## Notes

- Todas las tareas usan el formato obligatorio `- [ ] [ID] [P?] [Story?] descripción con ruta`.
- Las tareas de esta spec documentan y preparan arquitectura; no implementan módulos de inventario.
