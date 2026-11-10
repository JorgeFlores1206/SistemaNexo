# Data Model: Inventory Table Display Contract

This feature does not change stored data. It defines how existing product values map to the
inventory table.

## Product row

| Visible column | Product value | Meaning in this view |
|---|---|---|
| Artículo | `article` | Product code/identifier only |
| Descripción del artículo | `name` | Product name only |

The name MUST NOT be repeated in the "Artículo" cell. The existing `description` value remains
available to the product detail view and is not changed by this table-display update.

All other inventory columns, status calculations, row actions, and product values are unchanged.
