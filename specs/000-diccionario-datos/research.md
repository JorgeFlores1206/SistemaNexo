# Research: Diccionario de datos

## Decision: Contrato documental por campo

**Rationale**: Cada atributo necesita nombre visible, nombre conceptual, significado, origen,
obligatoriedad, tipo de negocio, formato, valores permitidos y reglas de validación. Una ficha
uniforme permite revisar importación y UI sin depender de interpretaciones.

**Alternatives considered**: Una tabla de encabezados sin reglas; se descarta porque no distingue
datos calculados, editables y sensibles.

## Decision: Contrato Excel separado del modelo calculado

**Rationale**: Los diez encabezados importables deben mantenerse separados de `Estado`, `Acción`,
fecha de vencimiento y alerta. Esto evita importar valores derivados o inferir fechas desde
`Trazabilidad`.

**Alternatives considered**: Tratar todas las columnas visibles como importables; se descarta por
contradecir la constitución y la Spec 004.

## Decision: Identidad por código de artículo

**Rationale**: El código es único y permite relacionar productos, importaciones, ajustes, reportes
y bitácora sin duplicar productos.

**Alternatives considered**: Identidad por nombre o combinación de campos; se descarta porque el
nombre puede cambiar y no garantiza unicidad.

## Decision: Fechas y cantidades aprobadas

**Rationale**: La fecha de vencimiento se registra separadamente en formato `DD/MM/YYYY`; `On hand`
y `Saldo` son enteros no negativos y pueden diferir.

**Alternatives considered**: Inferir la fecha desde trazabilidad o aceptar decimales; se descarta
por pérdida de significado y por las decisiones ya aprobadas en las Specs 000 y 004.
