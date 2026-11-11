# Implementation Plan: Tecnologías de Nexo

**Branch**: `001-tecnologias-nexo` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

## Summary

Documentar la arquitectura web aprobada para Nexo, separándola de los documentos heredados de
RosaBetania/OT. La solución será un monorepo TypeScript/Node.js con frontend React/Vite/MUI,
API NestJS, contratos Zod compartidos, Prisma sobre PostgreSQL de Supabase en el esquema `nexo`,
CI con GitHub Actions y dos proyectos Vercel. El frontend solo se comunicará con la API.

## Technical Context

**Language/Version**: TypeScript; Node.js `>=24 <25` (verificado en documentación; confirmar en manifiestos Nexo)

**Primary Dependencies**: npm workspaces, Turborepo, React, Vite, MUI, NestJS, Zod, Prisma

**Storage**: PostgreSQL administrado por Supabase, exclusivamente como base de datos; esquema `nexo`

**Testing**: Vitest/Testing Library para frontend; pruebas unitarias, integración y contrato; lint/build/test en CI

**Target Platform**: Aplicación web responsive; Vercel con frontend y API como proyectos separados

**Project Type**: Monorepo web (SPA + API)

**Performance Goals**: La API debe ser stateless y compatible con ejecución serverless; objetivos numéricos se fijarán en las specs funcionales que los necesiten

**Constraints**: Sin Docker; sin acceso directo del frontend a PostgreSQL, Supabase Auth ni API automática; secretos fuera del repositorio; no datos reales en desarrollo

**Scale/Scope**: Sistema de inventario Nexo; módulos y dependencias se incorporan únicamente cuando una Spec los justifique

## Constitution Check

*GATE: PASS antes de Phase 0; se mantiene PASS después de Phase 1.*

- I. Inventory-Centered Product Model: PASS; el plan documenta plataforma sin alterar reglas de inventario.
- II. Prototype-Aligned Data Contract: PASS; los contratos compartidos quedan sujetos a las Specs y al prototipo aprobado.
- III. Security and Role-Based Access: PASS; la API gestiona sesiones seguras, autorización y secretos.
- IV. Data Integrity and Traceability: PASS; Prisma Migrate y CI protegen cambios de esquema y contratos.
- V. Approved Technologies and Verifiable Delivery: PASS; se usan las tecnologías de `tecnologias/` y se excluyen tecnologías heredadas no aprobadas.

## Project Structure

```text
apps/
├── backend/                 # API NestJS, auth, autorización, negocio y Prisma
└── frontend/                # SPA React/Vite/MUI; solo llamadas HTTP a la API
packages/
└── contracts/               # Esquemas Zod compartidos
.github/workflows/           # CI de lint, build, test y contratos
specs/001-tecnologias-nexo/  # Decisiones y contratos de esta spec
```

**Structure Decision**: se adopta el monorepo web documentado en `tecnologias/`, con entregables
desplegables independientes y un paquete de contratos compartido. La estructura refleja Nexo;
los nombres de dominio de RosaBetania no se trasladan como requisitos.

## Complexity Tracking

No hay violaciones constitucionales que justificar.
