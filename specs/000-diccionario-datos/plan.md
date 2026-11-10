# Implementation Plan: Spec 000 — Diccionario de datos

**Branch**: `000-diccionario-datos` | **Date**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/000-diccionario-datos/spec.md`

## Summary

Implement the prototype-facing part of FR-004: show the product identifier alone in the
"Artículo" table cell and show the product name in "Descripción del artículo". The existing
`item.name` value supplies that name. Keep the product detail, search, sorting, and other table
columns unchanged.

## Technical Context

**Language/Version**: HTML5, CSS, and browser JavaScript already used by the prototype

**Primary Dependencies**: None; use the existing page and browser APIs

**Storage**: None for this prototype-only display change

**Testing**: Verify the inventory page in a browser and check the inline JavaScript syntax

**Target Platform**: Current desktop and mobile browsers supported by the existing prototype

**Project Type**: Static web prototype with accompanying feature documentation

**Performance Goals**: No measurable performance change; the change only alters displayed cell values

**Constraints**: Modify only the product-row presentation in `PrototipoWeb/inventario.html`;
preserve the agreed column order, table interactions, and data. Do not introduce dependencies or
change the Excel import contract.

**Scale/Scope**: One inventory table column mapping and its now-unused row-name styling

## Constitution Check

- **Product and state management**: Pass. The existing product record is preserved; only its
  presentation in the two specified columns changes.
- **Prototype-aligned data contract**: Pass. "Artículo" remains the identifier, while
  "Descripción del artículo" displays the product name, as specified by FR-004.
- **Approved technologies**: Pass. The change uses only the existing static prototype and browser
  JavaScript; no technology is added.
- **Data integrity and traceability**: Pass. No records, calculations, or persisted data change.
- **Verifiable delivery**: Pass. The table output and existing interactions can be checked directly.

## Project Structure

### Documentation (this feature)

```text
specs/000-diccionario-datos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code

```text
PrototipoWeb/
└── inventario.html    # Inventory row rendering and scoped styles
```

**Structure Decision**: Keep the change in the existing standalone inventory prototype. No new
source files, application layers, contracts, or dependencies are needed.

## Complexity Tracking

No constitution violations or additional architectural complexity.
