# Implementation Plan: Spec 012 — Dashboard operativo de inventario

**Branch**: `012-dashboard` | **Date**: 2026-11-12 | **Spec**: `spec.md`

## Summary

El dashboard consultará indicadores derivados del inventario vigente y permitirá abrir listas de prioridad. Administrador y Usuario verán el resumen operativo conforme a la matriz de permisos; solo Administrador verá el resumen del reporte mensual de la Spec 011. Los datos se cargarán al abrir y se actualizarán únicamente mediante un control manual visible.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js >=24 <25

**Primary Dependencies**: NestJS 11.2.7, Prisma 6.19.3, PostgreSQL/Supabase, Zod 4.6.7, React 19.3.0, Vite 8.3.4

**Storage**: PostgreSQL en esquema `nexo`, consultado únicamente por Prisma desde NestJS

**Testing**: Checks TypeScript existentes; escenarios de dominio y UI descritos en `quickstart.md`, con pruebas automatizadas a añadir cuando se estabilice la infraestructura de testing

**Target Platform**: API NestJS y SPA React desplegadas separadamente

**Project Type**: Aplicación web monorepo con backend, frontend y contratos Zod compartidos

**Performance Goals**: El resumen inicial debe estar disponible para la persona en menos de 2 segundos bajo el volumen operativo esperado; una prioridad debe ser identificable en menos de 30 segundos

**Constraints**: No crear nuevas reglas de estado, no actualizar automáticamente por intervalos, proteger datos administrativos en backend, mantener una fecha de negocio única y conservar datos previos durante una actualización fallida

**Scale/Scope**: Indicadores globales y listas filtradas del inventario vigente; sin snapshot histórico del dashboard

## Constitution Check

- **Principle I — Inventory-Centered Product Model**: PASS. Se reutilizan estados, alerta y condición `Dañado`; no se agregan estados.
- **Principle II — Prototype-Aligned Data Contract**: PASS. Se consumen `On hand`, `Saldo`, fechas y políticas existentes sin alterar importación.
- **Principle III — Security and Role-Based Access**: PASS. El resumen administrativo y el reporte 011 se protegen en la operación.
- **Principle IV — Data Integrity and Traceability**: PASS. El dashboard es de consulta y no modifica inventario ni genera bitácora de cambios.
- **Principle V — Approved Technologies and Verifiable Delivery**: PASS. Se usan NestJS, Prisma, React, Vite y Zod del baseline aprobado.

## Project Structure

```text
specs/012-dashboard/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/dashboard-contract.md
└── tasks.md

apps/backend/src/dashboard/
├── dashboard.module.ts
├── dashboard.controller.ts
├── dashboard.service.ts
└── dashboard-access.guard.ts

apps/frontend/src/dashboard/
├── Dashboard.tsx
├── IndicadoresInventario.tsx
├── PrioridadInventario.tsx
└── api.ts

packages/contracts/src/index.ts
```

**Structure Decision**: Dominio funcional `dashboard` separado de inventario y reportes. Backend calcula y autoriza; frontend presenta y solicita actualización; contratos compartidos describen indicadores y prioridades.

## Complexity Tracking

No hay violaciones constitucionales que justificar.

## Validation

`npm run lint` y `npm run build` pasan correctamente en `@nexo/backend`, `@nexo/frontend` y
`@nexo/contracts`.
