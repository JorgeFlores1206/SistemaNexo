<!--
Sync Impact Report
Version change: 3.2.2 -> 3.2.3 (clarified that product damage is a separate condition, not a date-derived status)
Modified principles:
- I. Inventory-Centered Product Model (separated the damage condition from calculated status)
Added sections: none
Removed sections: none
Follow-up TODOs: Confirm ratification date; specify the displayed article name's source and the
business time zone used for date comparisons.
-->

# Nexo Constitution

## Core Principles

### I. Inventory-Centered Product Model
Nexo MUST support the inventory and product-management workflows represented by the approved
prototype. Product fields and visible states MUST remain consistent across the inventory table,
product details, dashboard, and other views. New capabilities MUST be justified and specified
before implementation.

Product status MUST be calculated from the assigned return policy and the product's expiration
date; it MUST NOT be imported as an Excel value. For a product with a return policy, the effective
date is the first day of its expiration month for "En el mes", or the expiration date moved earlier
by one, two, or three calendar months for the corresponding policy. If the target month does not
contain the original day number, the effective date MUST be the last calendar day of that month.
Before the effective date, the status is "Neutro". From the effective date through the original
expiration date, inclusive, the status is "Vencido + Devolución", requiring immediate return. On
the day after the original expiration date and thereafter, the status is "Vencido + Ofertar",
prioritizing the offer. A product without a return policy has the "Ofertar" status through its
original expiration date, inclusive, and "Vencido + Ofertar" from the following day.

The initial status taxonomy consists only of "Neutro", "Ofertar", "Vencido + Devolución", and
"Vencido + Ofertar". A standalone "Devolución" status, a standalone "Vencido" status, and a "Bajo
stock" status or alert MUST NOT be assigned in the initial scope. Any future status or alert
requires an approved Spec.

"Pronto a vencer" MUST be a separate alert, not a product status. For a product with a return
policy, the alert window is the 30 calendar days before its effective date; without a return
policy, the window is the 30 calendar days before the original expiration date. The first alert
day is inclusive and the effective or expiration date itself is excluded. The alert MUST NOT
change the product status. Statuses MUST be mutually exclusive; the alert may coexist with a
status and MUST be counted separately. Without a valid expiration date, no status or alert can be
calculated. All date comparisons MUST use calendar dates and a single configured Nexo business
date consistently across views.

A product MAY have a separately recorded "Dañado" condition. This condition MUST NOT be a
calculated product status, MUST NOT change the date-derived status or alert, and MUST be shown
separately so it can coexist with any calculated status. It MUST NOT be included in status counts.

### II. Prototype-Aligned Data Contract
The inventory table in `PrototipoWeb/inventario.html` defines the Excel import headers. The
importer MUST read these columns: "Artículo" (article identifier), "Descripción del artículo",
"On hand", "Saldo", "Trazabilidad", "UOM primaria", "Laboratorio", "Marca",
"Política devolución", and "Observación". Header "Estado" MUST NOT be read from Excel because the
system calculates it according to Principle I. "Acción" is an interface operation and MUST NOT be
imported.

Return policy is a per-product value supplied by Excel and MUST remain editable for that product.
The supported policy values are "En el mes", "1 mes antes", "2 meses antes", "3 meses antes", or
no policy. The prototype displays a product name under "Artículo", but the agreed Excel contract
defines that column as the identifier only; the name's source and whether it is required remain
subject to a Spec.

Any change to this contract MUST be reflected consistently in the prototype, product data model,
and import specification. Requiredness, formats, date arithmetic edge cases, and validation rules
MUST be defined in a Spec. The expiration date is product data recorded separately from the Excel
headers; it MUST NOT be inferred from "Trazabilidad" or another imported field. The import
specification MUST define how a missing or invalid separately recorded expiration date is handled.
Status calculation MUST NOT proceed when a valid expiration date cannot be obtained.

### III. Security and Role-Based Access
The system MUST protect authentication, user and role management, inventory operations, and
administrative views according to an explicitly documented permission matrix. Access control MUST
be enforced where data or operations are protected; hiding an interface control alone is not
authorization. Passwords and secrets MUST be handled according to the security practices in the
approved technology documentation and MUST NOT be committed to source control.

### IV. Data Integrity and Traceability
Product changes and imports MUST preserve data integrity and provide actionable validation results.
The system MUST NOT silently discard rows, invent values, or resolve ambiguous input without an
approved rule. Actions requiring an audit record MUST be traceable in the system's bitácora.
Database changes MUST follow the migration and review practices documented in `tecnologias/`.

### V. Approved Technologies and Verifiable Delivery
The technologies and architecture documented in `tecnologias/` are the sole approved technical
baseline. The project MUST NOT adopt technologies from the former constitution or add an
undocumented technology without an approved decision recorded in that folder. Changes MUST pass
the applicable project checks and include tests for changed behavior.

## Approved Architecture and Technologies

The approved technology baseline and its implementation guidance are maintained in `tecnologias/`.
Those documents are authoritative for technology selection, architecture, development environment,
database integration, migrations, and deployment. The web prototype defines the intended product
workflows and interface behavior; it does not authorize an additional implementation stack.
Conflicts between the prototype and the technology documentation MUST be documented and resolved
before implementation depends on them.

## Development Workflow and Quality Gates

New capabilities and material changes to product data MUST be specified before implementation.
Specifications MUST define observable acceptance criteria and identify affected data contracts,
permissions, and workflows. Excel-import specifications MUST use the exact headers listed in
Principle II and define required columns, accepted formats, validation, duplicate handling, and
error reporting before import behavior is implemented. The expiration date MUST be captured
separately as product data in the format and manner defined by the applicable Spec; import behavior
when the date is missing or invalid MUST be explicit. Status calculations and alerts MUST follow
Principle I consistently in the inventory, dashboard, and reports.

Changes MUST be reviewed against this constitution, the approved technology documentation, and
the applicable specification. Tests and quality checks required by the project MUST pass before
integration. Any exception MUST be explicit, justified, and approved before it is implemented.

## Governance

This constitution governs project decisions and supersedes conflicting local guidance. Amendments
MUST be reviewed, state their rationale, and update the version and last-amended date. Versioning
follows semantic versioning: MAJOR for incompatible changes to principles or governance, MINOR for
new principles or materially expanded requirements, and PATCH for clarifications or non-semantic
wording changes. The ratification date records the original formal adoption and MUST NOT change in
later amendments.

Every specification and implementation review MUST check applicable principles, approved
technology constraints, and quality gates. Deviations MUST be resolved before integration or
approved explicitly through a constitution amendment.

**Version**: 3.2.3 | **Ratified**: TODO(RATIFICATION_DATE): pendiente de aprobación formal | **Last Amended**: 2026-11-10
