# Tasks: Spec 000 — Diccionario de datos (inventory table display)

**Input**: Design documents from `specs/000-diccionario-datos/`

**Scope**: Implement the requested prototype display correction from FR-004 only. The remaining
data-dictionary stories are not part of this implementation request.

## Phase 3: User Story 1 - Consultar la definición de los datos (Priority: P1)

**Goal**: Show the product code only in "Artículo" and show the product name in
"Descripción del artículo".

**Independent Test**: Open `PrototipoWeb/inventario.html`; confirm the code appears once, the name
appears in the description column, and search, sorting, and product details still work.

- [X] T001 [US1] Render only `item.article` in the Artículo cell, render `item.name` in the
  Descripción del artículo cell, and remove the now-unused `.article-name` style in
  `PrototipoWeb/inventario.html`.
- [X] T002 [US1] Verify the inventory row mapping, search by product name, sort both columns, and
  open product details in `PrototipoWeb/inventario.html`.

## Dependencies & Execution Order

- T001 precedes T002.
- No shared setup or foundational work is required.

## Parallel Opportunities

- None; both tasks concern the same prototype file and validation depends on the change.

## Implementation Strategy

Implement and validate this single table-display correction as the MVP. Leave other dictionary
requirements and inventory behavior unchanged.
