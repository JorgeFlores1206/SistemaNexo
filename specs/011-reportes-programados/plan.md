# Implementation Plan: Spec 011 — Reporte mensual anticipado de vencimientos próximos

**Branch**: `011-reportes-programados` | **Date**: 2026-11-12 | **Spec**: `spec.md`

## Summary

Nexo generará el último día calendario de cada mes un reporte para el primer día del mes siguiente, usando la misma fecha de negocio y las mismas reglas de estado/alerta del inventario. El backend persistirá una generación única por mes, sus filas y el resultado de ejecución; el frontend permitirá al Administrador consultar los resultados exitosos, vacíos o fallidos.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js >=24 <25

**Primary Dependencies**: NestJS 11.2.7, Prisma 6.19.3, PostgreSQL/Supabase, Zod 4.6.7, React 19.3.0, Vite 8.3.4

**Storage**: PostgreSQL administrado en Supabase, únicamente mediante Prisma y esquema `nexo`

**Testing**: TypeScript build/lint existentes; se añadirán pruebas Vitest para frontend y pruebas de dominio/backend cuando la infraestructura de tests esté disponible

**Target Platform**: API NestJS y SPA React desplegadas como proyectos separados en Vercel

**Project Type**: Aplicación web monorepo con `apps/backend`, `apps/frontend` y `packages/contracts`

**Performance Goals**: Consulta administrativa con paginación o límite seguro; generación consistente para el inventario vigente al cierre del mes anterior

**Constraints**: Sin acceso directo del navegador a la base de datos; autorización en backend; fechas calendario y una sola fecha de negocio; no correo, SMS, push ni descarga automática

**Scale/Scope**: Inventario administrativo de Nexo; una generación vigente por mes de referencia y una bitácora resumida por ejecución

## Constitution Check

- **Principle I — Inventory-Centered Product Model**: PASS. El plan reutiliza la fecha efectiva, estados y alerta “Pronto a vencer”; “Dañado” permanece separado.
- **Principle II — Prototype-Aligned Data Contract**: PASS. No se modifica el contrato de importación ni se inventan fechas de vencimiento.
- **Principle III — Security and Role-Based Access**: PASS. Consulta y bitácora quedan protegidas para Administrador en backend.
- **Principle IV — Data Integrity and Traceability**: PASS. Restricción única por mes, transacción de generación y bitácora para éxito, vacío y fallo.
- **Principle V — Approved Technologies and Verifiable Delivery**: PASS. Se usan únicamente tecnologías documentadas en `tecnologias/`.

## Project Structure

```text
specs/011-reportes-programados/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/reportes-programados-contract.md
└── tasks.md

apps/backend/src/reportes-programados/
├── reportes-programados.module.ts
├── reportes-programados.controller.ts
├── reportes-programados.service.ts
├── generacion-mensual.service.ts
└── bitacora-reportes.service.ts

apps/backend/prisma/
├── schema.prisma
└── migrations/

apps/frontend/src/reportes-programados/
├── ReporteMensualVencimientos.tsx
├── ResultadoGeneracion.tsx
└── api.ts

packages/contracts/src/index.ts
```

**Structure Decision**: Organización por dominio funcional, alineada con el monorepo real. La API contiene reglas, persistencia y autorización; el frontend solo consulta la API; los contratos Zod son compartidos.

## Complexity Tracking

No hay violaciones constitucionales que justificar.
