# Entornos de Nexo

- **Desarrollo**: proyecto Supabase individual, datos sintéticos, Node.js local y secretos en `.env` ignorado.
- **Integración**: proyecto separado usado por CI; recibe migraciones revisadas.
- **Producción**: PostgreSQL y secretos administrados para los proyectos Vercel separados.

No se cargan datos reales en desarrollo. Las tablas se modifican únicamente mediante migraciones
Prisma revisadas. Las credenciales no se almacenan en Git y el esquema de Nexo es `nexo`.
