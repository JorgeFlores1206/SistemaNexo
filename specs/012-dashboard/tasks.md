# Tasks: Spec 012 — Dashboard operativo de inventario

## Phase 1: Setup

- [X] T001 [P] Revisar módulos backend en `apps/backend/src` y documentar integraciones en `specs/012-dashboard/plan.md`
- [X] T002 [P] Revisar navegación frontend en `apps/frontend/src` y documentar integración en `specs/012-dashboard/plan.md`
- [X] T003 [P] Reservar contratos dashboard en `packages/contracts/src/index.ts`

## Phase 2: Foundational

- [X] T004 Implementar autorización de roles en `apps/backend/src/dashboard/dashboard-access.guard.ts`
- [X] T005 Implementar módulo en `apps/backend/src/dashboard/dashboard.module.ts`
- [X] T006 [P] Añadir contratos Zod en `packages/contracts/src/index.ts`
- [X] T007 [P] Documentar límites del dominio en `apps/backend/src/dashboard/README.md`
- [X] T008 Centralizar fecha de negocio en `apps/backend/src/dashboard/dashboard.service.ts`

## Phase 3: User Story 1 — Consultar estado general (P1) 🎯 MVP

**Independent Test**: Escenarios 1–2 de `specs/012-dashboard/quickstart.md`.

- [X] T009 [US1] Calcular conteos de estados en `apps/backend/src/dashboard/dashboard.service.ts`
- [X] T010 [US1] Calcular alerta de vencimiento en `apps/backend/src/dashboard/dashboard.service.ts`
- [X] T011 [US1] Calcular indicadores Dañado, On hand y Saldo en `apps/backend/src/dashboard/dashboard.service.ts`
- [X] T012 [US1] Exponer `GET /dashboard/resumen` en `apps/backend/src/dashboard/dashboard.controller.ts`
- [X] T013 [P] [US1] Crear cliente API en `apps/frontend/src/dashboard/api.ts`
- [X] T014 [US1] Crear indicadores accesibles en `apps/frontend/src/dashboard/IndicadoresInventario.tsx`
- [X] T015 [US1] Crear dashboard con carga y actualización manual en `apps/frontend/src/dashboard/Dashboard.tsx`
- [X] T016 [US1] Integrar Dashboard en `apps/frontend/src/main.tsx`

## Phase 4: User Story 2 — Revisar prioridades (P1)

**Independent Test**: Escenarios 3–4 de `specs/012-dashboard/quickstart.md`.

- [X] T017 [US2] Filtrar prioridades sin duplicados en `apps/backend/src/dashboard/dashboard.service.ts`
- [X] T018 [US2] Ordenar prioridades por fecha relevante en `apps/backend/src/dashboard/dashboard.service.ts`
- [X] T019 [US2] Exponer `GET /dashboard/prioridades/:indicador` en `apps/backend/src/dashboard/dashboard.controller.ts`
- [X] T020 [P] [US2] Crear lista accesible en `apps/frontend/src/dashboard/PrioridadInventario.tsx`
- [X] T021 [US2] Integrar selección de indicadores en `apps/frontend/src/dashboard/Dashboard.tsx`

## Phase 5: User Story 3 — Información administrativa (P2)

**Independent Test**: Escenarios 7–8 de `specs/012-dashboard/quickstart.md`.

- [X] T022 [US3] Integrar resumen de Spec 011 para Administrador en `apps/backend/src/dashboard/dashboard.service.ts`
- [X] T023 [US3] Proteger datos administrativos en `apps/backend/src/dashboard/dashboard.controller.ts`
- [X] T024 [P] [US3] Crear resumen de reporte en `apps/frontend/src/dashboard/ResumenReporteMensual.tsx`
- [X] T025 [US3] Integrar resumen administrativo en `apps/frontend/src/dashboard/Dashboard.tsx`

## Phase 6: Polish & Validation

- [X] T026 [P] Revisar accesibilidad en `apps/frontend/src/dashboard/`
- [X] T027 [P] Documentar logging y límites de consulta en `apps/backend/src/dashboard/README.md`
- [X] T028 Actualizar escenarios y comandos en `specs/012-dashboard/quickstart.md`
- [X] T029 Ejecutar `npm run lint` y `npm run build`; ambos pasan en `specs/012-dashboard/plan.md`

## Dependencies & Execution Order

Setup y Foundational preceden US1; US2 reutiliza US1; US3 reutiliza autorización y reportes 011;
Polish depende de las historias implementadas.

## Implementation Strategy

US1, US2 y US3 están implementadas incrementalmente. La validación final se ejecutó con lint y
build del workspace completo.
