# Architecture Model: Nexo

## Componentes

| Componente | Responsabilidad | Acceso permitido |
|---|---|---|
| Frontend web | Vistas, interacción y consumo de contratos | API NestJS por HTTPS |
| API NestJS | Sesiones, autorización, validación y reglas de negocio | Base mediante Prisma |
| Contratos Zod | Esquemas de entrada/salida compartidos | Consumido por frontend y API |
| Prisma | Mapeo y migraciones de persistencia | PostgreSQL `nexo` |
| PostgreSQL Supabase | Persistencia de Nexo | Solo API/Prisma |
| GitHub Actions | Calidad y entrega verificable | Repositorio y secretos CI |
| Vercel | Publicación separada de frontend y API | Artefactos aprobados |

## Flujo de datos

`Usuario → Frontend → API NestJS → Zod/autorización/reglas → Prisma → PostgreSQL (nexo)`.

La respuesta retorna por la misma API. El navegador nunca usa credenciales de base de datos,
Supabase Auth, API automática ni cliente Supabase.

## Sesión y límites

La API crea y valida sesiones seguras, y aplica autorización en cada operación protegida. Las
credenciales y secretos se configuran por entorno y no se almacenan en Git.

## Entornos

- **Desarrollo**: proyecto Supabase individual, datos sintéticos, API local Node.js, sin Docker.
- **Integración**: proyecto separado para CI y migraciones revisadas.
- **Producción**: servicios separados y secretos administrados por la plataforma.
