# Research: Inventory Table Product Name

## Decision: Reuse the existing product name in the description column

The inventory page already stores the display name in `item.name`. Render only `item.article` in
the "Artículo" cell and render `item.name` in "Descripción del artículo".

**Rationale**: This matches the user-confirmed field meanings without adding an Excel column or
changing product data. It removes the duplicate name from the code cell and makes the table's
visible data match the agreed dictionary.

**Alternatives considered**:

- Keep the name beneath the code and also show it in the description column: rejected because it
  duplicates the name.
- Show `item.description` in "Descripción del artículo": rejected for the inventory row because
  the user confirmed that this column represents the product name.
- Change the product records or their detail dialog: rejected because the requested change is
  limited to the inventory table row.

## Decision: Keep existing page behavior and dependencies

The page uses standalone HTML, CSS, and browser JavaScript. No build system or test runner is
defined for this prototype.

**Rationale**: A local presentation change requires no new package or architecture.

**Alternatives considered**: Adding a UI framework, dependency, or a new test harness was rejected
as unnecessary for this change.
