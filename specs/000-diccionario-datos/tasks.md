# Tasks: Diccionario de datos

**Input**: Design documents from `specs/000-diccionario-datos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Validation tasks are included because the feature is a data-contract artifact.

## Phase 1: Setup

- [X] T001 Create the feature artifact structure under `specs/000-diccionario-datos/` with `contracts/` and documentation files
- [X] T002 [P] Review `specs/000-diccionario-datos/spec.md` and `plan.md` as the authoritative scope and design inputs
- [X] T003 [P] Review `.specify/memory/constitution.md` and record applicable data, security, and traceability constraints in `plan.md`

## Phase 2: Foundational

- [X] T004 Build the canonical field inventory in `specs/000-diccionario-datos/data-model.md` for the ten approved Excel headers
- [X] T005 [P] Define calculated, non-importable, editable, and sensitive-field classifications in `specs/000-diccionario-datos/contracts/data-dictionary-contract.md`
- [X] T006 [P] Document Product, User, Role, and Audit Log entities and relationships in `specs/000-diccionario-datos/data-model.md`
- [X] T007 Reconcile the dictionary rules with `specs/004-lectura-excel/spec.md`, `specs/005-usuarios/spec.md`, and `specs/007-estados/spec.md`

## Phase 3: User Story 1 - Consultar la definición de los datos (Priority: P1) 🎯 MVP

**Goal**: Permitir que una persona encuentre la definición completa y el origen de cada dato del inventario.

**Independent Test**: Revisar cada encabezado y confirmar que tiene significado, origen, obligatoriedad, formato y regla de validación.

- [X] T008 [US1] Complete the field-definition table in `specs/000-diccionario-datos/data-model.md` with visible name, conceptual name, meaning, origin, requiredness, business type, format, allowed values, and validation rules
- [X] T009 [US1] Document the separate expiration date, calculated status, `Pronto a vencer`, and `Dañado` rules in `specs/000-diccionario-datos/data-model.md`
- [X] T010 [US1] Add traceability references from each product-field rule to the governing requirement in `specs/000-diccionario-datos/contracts/data-dictionary-contract.md`
- [X] T011 [US1] Validate that the inventory code and description are distinct fields and that the product name is not duplicated under `Artículo` in `specs/000-diccionario-datos/quickstart.md`

**Checkpoint**: Every approved inventory field has a business-readable definition and a verifiable rule.

## Phase 4: User Story 2 - Preparar un Excel conforme al inventario (Priority: P1)

**Goal**: Provide an exact import contract that distinguishes accepted headers from calculated or interface-only values.

**Independent Test**: Compare the contract with a sample Excel header row and classify every column without ambiguity.

- [X] T012 [US2] Finalize the exact ten-header contract in `specs/000-diccionario-datos/contracts/data-dictionary-contract.md`
- [X] T013 [US2] Document accepted return-policy values and empty-policy behavior in `specs/000-diccionario-datos/contracts/data-dictionary-contract.md`
- [X] T014 [US2] Document `On hand` and `Saldo` as independent non-negative integers in `specs/000-diccionario-datos/data-model.md`
- [X] T015 [US2] Add validation scenarios for missing, duplicated, unknown, calculated, and interface-only headers to `specs/000-diccionario-datos/quickstart.md`
- [X] T016 [US2] Cross-check the contract against `specs/004-lectura-excel/spec.md` and record any mismatch before implementation

**Checkpoint**: The Excel contract is exact, testable, and consistent with import behavior.

## Phase 5: User Story 3 - Revisar relaciones y cambios del modelo (Priority: P2)

**Goal**: Make entity relationships, integrity constraints, sensitivity, and approved changes reviewable.

**Independent Test**: Review a proposed field or relationship change and identify all affected definitions and governing decisions.

- [X] T017 [P] [US3] Document Product-to-Return-Policy and Product-to-Status relationships in `specs/000-diccionario-datos/data-model.md`
- [X] T018 [P] [US3] Document User-to-Role and action-to-Audit-Log relationships in `specs/000-diccionario-datos/data-model.md`
- [X] T019 [US3] Add uniqueness, cardinality, integrity, and sensitive-data handling rules to `specs/000-diccionario-datos/contracts/data-dictionary-contract.md`
- [X] T020 [US3] Define the approved-change traceability procedure in `specs/000-diccionario-datos/quickstart.md`
- [X] T021 [US3] Reconcile the completed model with `specs/001-tecnologias-nexo/spec.md`, `specs/005-usuarios/spec.md`, and the constitution

**Checkpoint**: Proposed data changes can be assessed against documented entities, relationships, and governance rules.

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T022 [P] Run all scenarios in `specs/000-diccionario-datos/quickstart.md` and record pass/fail evidence
- [X] T023 [P] Check terminology consistency across `spec.md`, `data-model.md`, `contracts/data-dictionary-contract.md`, and dependent specs
- [X] T024 Update `specs/000-diccionario-datos/checklists/requirements.md` with the final validation result
- [X] T025 Resolve any contract mismatch found during T022-T024 and update affected references

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) has no dependencies.
- Foundational (Phase 2) depends on Setup and blocks all user stories.
- User Stories 1 and 2 can proceed in parallel after Phase 2.
- User Story 3 depends on the field and contract definitions from User Stories 1 and 2.
- Polish depends on all selected user stories.

### User Story Dependencies

- US1: starts after Phase 2; no dependency on another story.
- US2: starts after Phase 2; shares the field inventory from foundational work.
- US3: starts after US1 and US2 definitions are stable.

## Parallel Opportunities

- T002 and T003 can run in parallel.
- T005 and T006 can run in parallel.
- T017 and T018 can run in parallel.
- T022 and T023 can run in parallel after all story work.

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2.
2. Complete User Story 1.
3. Run its independent review and validate the field dictionary.
4. Add User Story 2 to make the Excel contract executable.

### Incremental Delivery

1. Deliver the field dictionary and calculated/non-importable classifications.
2. Deliver the exact Excel contract and validation scenarios.
3. Deliver relationship, integrity, sensitivity, and change-traceability documentation.
4. Run the final checklist and dependent-spec reconciliation.
