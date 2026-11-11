# Quickstart: Validar el diccionario de datos

## Prerequisites

- Repositorio Nexo disponible.
- [`spec.md`](spec.md), constitución y prototipo de inventario disponibles.
- Herramienta de revisión Markdown y acceso a las Specs 004, 007 y 005.

## Validation Scenarios

1. Comparar los encabezados del prototipo con `contracts/data-dictionary-contract.md`.
2. Confirmar que existen exactamente diez encabezados importables.
3. Confirmar que `Estado` y `Acción` no son importables.
4. Verificar que `On hand` y `Saldo` están separados y son enteros no negativos.
5. Verificar que la fecha de vencimiento usa `DD/MM/YYYY` y no se obtiene de `Trazabilidad`.
6. Verificar que estados, alerta `Pronto a vencer` y condición `Dañado` tienen definiciones separadas.
7. Revisar que usuarios, roles y bitácora no contienen permisos o atributos inventados.

## Expected Outcome

Todas las definiciones del contrato tienen significado, origen, obligatoriedad, formato y reglas
de validación; no existen contradicciones con las Specs dependientes.
