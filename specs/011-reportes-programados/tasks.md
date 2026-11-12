# Tasks: Spec 011 — Reporte mensual anticipado de vencimientos próximos

## Phase 1: Setup

- [X] T001 [P] Revisar `apps/backend/src` y documentar módulos existentes en `specs/011-reportes-programados/plan.md`
- [X] T002 [P] Revisar `apps/frontend/src` y documentar integración en `specs/011-reportes-programados/plan.md`
- [X] T003 [P] Revisar `packages/contracts/src/index.ts` y reservar esquemas en `specs/011-reportes-programados/contracts/reportes-programados-contract.md`

## Phase 2: Foundational

- [X] T004 Actualizar `apps/backend/prisma/schema.prisma` con modelos del reporte y relaciones
- [X] T005 Crear migración en `apps/backend/prisma/migrations/202611120001_reportes_programados/migration.sql`
- [X] T006 [P] Añadir esquemas Zod en `packages/contracts/src/index.ts`
- [X] T007 Implementar fecha de negocio en `apps/backend/src/reportes-programados/fecha-negocio.service.ts`
- [X] T008 Implementar módulo en `apps/backend/src/reportes-programados/reportes-programados.module.ts`
- [X] T009 [P] Documentar límites en `apps/backend/src/reportes-programados/README.md`

## Phase 3: User Story 1 — Consultar el reporte mensual (P1) 🎯 MVP

**Independent Test**: Validar escenarios 1–5 de `specs/011-reportes-programados/quickstart.md`.

- [X] T010 [US1] Implementar selección de ventana en `apps/backend/src/reportes-programados/reportes-programados.service.ts`
- [X] T011 [US1] Implementar snapshot de producto en `apps/backend/src/reportes-programados/reportes-programados.service.ts`
- [X] T012 [US1] Implementar consulta protegida en `apps/backend/src/reportes-programados/reportes-programados.controller.ts`
- [X] T013 [US1] Implementar respuestas de estado en `apps/backend/src/reportes-programados/reportes-programados.service.ts`
- [X] T014 [P] [US1] Crear cliente API en `apps/frontend/src/reportes-programados/api.ts`
- [X] T015 [US1] Crear tabla accesible en `apps/frontend/src/reportes-programados/ReporteMensualVencimientos.tsx`
- [X] T016 [US1] Integrar la vista desde `apps/frontend/src/main.tsx`
- [X] T017 [US1] Verificar accesibilidad y mensajes de autorización en `apps/frontend/src/reportes-programados/`

## Phase 4: User Story 2 — Conocer el resultado de generación (P2)

**Independent Test**: Validar escenarios 6–8 de `specs/011-reportes-programados/quickstart.md`.

- [X] T018 [US2] Implementar scheduler/caso de uso en `apps/backend/src/reportes-programados/generacion-mensual.service.ts`
- [X] T019 [US2] Implementar idempotencia y concurrencia en `apps/backend/src/reportes-programados/generacion-mensual.service.ts`
- [X] T020 [US2] Implementar bitácora dedicada en `apps/backend/src/reportes-programados/bitacora-reportes.service.ts`
- [X] T021 [US2] Exponer generación y bitácora en `apps/backend/src/reportes-programados/generacion-mensual.controller.ts`
- [X] T022 [P] [US2] Crear resultado visual en `apps/frontend/src/reportes-programados/ResultadoGeneracion.tsx`
- [X] T023 [US2] Integrar resultado en `apps/frontend/src/reportes-programados/ReporteMensualVencimientos.tsx`

## Phase 5: Polish & Validation

- [X] T024 [P] Actualizar `specs/011-reportes-programados/quickstart.md` con rutas y comandos reales
- [X] T025 [P] Añadir logging en `apps/backend/src/reportes-programados/`
- [X] T026 Ejecutar `npm run lint` y `npm run build` y registrar resultados en `specs/011-reportes-programados/plan.md`

## Dependencies & Execution Order

Foundational precede US1; US2 depende de los modelos y servicios de US1; Polish depende de las historias entregadas. T018–T023 son el trabajo pendiente para completar la generación automática y la bitácora.

## Implementation Strategy

US1 queda como MVP funcional. Completar US2 después de resolver la infraestructura de scheduler y ejecutar los checks cuando estén disponibles las dependencias locales.
