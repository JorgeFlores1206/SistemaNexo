# Registro de decisiones de Nexo

## ADR-001 — Monorepo web con API intermedia

- **Decisión**: TypeScript/Node.js, React/Vite/MUI, NestJS, Zod, Prisma y PostgreSQL Supabase.
- **Alternativa rechazada**: Python/Flet empaquetado como `.exe`, por no cumplir FR-009.
- **Seguridad/datos**: el navegador no accede directamente a la base ni a servicios automáticos de Supabase.
- **Aprobación**: Spec 001.

## ADR-002 — Esquema y despliegue

- **Decisión**: esquema PostgreSQL `nexo`, CI con GitHub Actions y frontend/API en proyectos Vercel separados.
- **Alternativa rechazada**: reutilizar `rosabetania` o desplegar un único entregable.
- **Seguridad/datos**: migraciones revisadas, secretos por entorno y sin datos reales en desarrollo.
- **Aprobación**: Spec 001.
