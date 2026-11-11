# Quickstart de validación arquitectónica

1. Verificar Node.js y npm contra las versiones documentadas y revisar los manifiestos del monorepo.
2. Instalar con `npm ci` desde la raíz; no iniciar Docker.
3. Confirmar que las variables de conexión estén solo en archivos ignorados y que desarrollo use datos sintéticos.
4. Ejecutar los comandos de calidad disponibles: `npx turbo run lint build test`.
5. Confirmar que el frontend solo tenga clientes HTTP hacia la API y que no importe Prisma, `pg`, Supabase Auth ni el cliente Supabase.
6. Confirmar que la API gestione sesión, autorización y validación Zod antes de acceder a Prisma.
7. Verificar que Prisma apunte al esquema PostgreSQL `nexo` y que los cambios usen migraciones revisadas.
8. Verificar que CI se ejecute en GitHub Actions y que Vercel tenga proyectos independientes para frontend y API.

Esta guía valida la arquitectura; no despliega servicios ni sustituye las pruebas de las Specs funcionales.

## Resultado de la implementación inicial

La estructura base está creada. La instalación y ejecución de `npm ci` queda pendiente hasta que
se genere y revise el lockfile con las versiones aprobadas; no se ejecuta una instalación que
pueda introducir dependencias no verificadas.
