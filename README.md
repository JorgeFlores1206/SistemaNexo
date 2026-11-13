# Nexo

Sistema web de gestión de inventario con frontend React/Vite, API NestJS, Prisma y PostgreSQL local
en el esquema `nexo`.

## Puesta en marcha

1. Levanta PostgreSQL local con `docker compose up -d postgres` o asegúrate de tener PostgreSQL
   ejecutándose en `localhost:5432`.
2. Completa `bd/.env` con `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` y los valores de
   `NEXO_INITIAL_ADMIN_NAME`, `NEXO_INITIAL_ADMIN_EMAIL` y `NEXO_INITIAL_ADMIN_PASSWORD`.
3. Instala dependencias con `npm install`.
4. Aplica las migraciones con `npm run db:migrate`.
5. Provisiona el primer Administrador con `npm run db:seed`.
6. Construye con `npm run build`.
7. Ejecuta la API compilada con `node apps/backend/dist/main.js`.
8. En otra terminal ejecuta el frontend con `npm run dev -w apps/frontend`.

El frontend usa el proxy de Vite para enviar `/api` a `http://localhost:3000`. En despliegues
separados puede definirse `VITE_API_URL` en el entorno del frontend.

## Comprobaciones

```powershell
npm run lint
npm run build
npm test
```

Las tablas solo deben cambiarse mediante las migraciones versionadas en
`apps/backend/prisma/migrations`. El navegador nunca accede directamente a PostgreSQL.
