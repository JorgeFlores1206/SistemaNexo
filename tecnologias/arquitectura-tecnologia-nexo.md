# Arquitectura y tecnología de Nexo

Nexo es una aplicación web independiente para inventario. Su monorepo usa npm workspaces y
Turborepo, con `apps/frontend` (React, Vite, MUI), `apps/backend` (NestJS), y
`packages/contracts` (Zod). Prisma accede a PostgreSQL de Supabase en el esquema `nexo`.

El navegador solo llama a la API NestJS. NestJS gestiona sesiones seguras, autorización, reglas
de negocio y persistencia. Supabase se usa solo como PostgreSQL: quedan excluidos Supabase Auth,
su API automática y su cliente de navegador. El frontend y la API se publican como proyectos
separados en Vercel; GitHub Actions ejecuta lint, build y test. El desarrollo no requiere Docker.

Las dependencias de OT (PDF, drag-and-drop, correo y contratos de órdenes) no son dependencias
base de Nexo y requieren una Spec que las justifique.
