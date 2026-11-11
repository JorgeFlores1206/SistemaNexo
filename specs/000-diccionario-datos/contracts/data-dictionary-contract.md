# Data Dictionary Contract

## Importable Headers

The import contract contains exactly these headers, in any order:

`Artículo`, `Descripción del artículo`, `On hand`, `Saldo`, `Trazabilidad`, `UOM primaria`,
`Laboratorio`, `Marca`, `Política devolución`, `Observación`.

## Non-importable Values

- `Estado`: calculated from expiration date and return policy.
- `Acción`: interface operation, not product data.
- Expiration date: separately recorded product data in `DD/MM/YYYY`.
- `Pronto a vencer`: calculated alert.
- `Dañado`: independently recorded condition.

## Contract Rules

- `Artículo` is the unique product code.
- `On hand` and `Saldo` are independent non-negative integers.
- Empty optional cells are allowed; update semantics are defined by Spec 004.
- Return policy values are `En el mes`, `1 mes antes`, `2 meses antes`, `3 meses antes`, or no policy.
- No field may contain passwords, tokens, or secrets.
