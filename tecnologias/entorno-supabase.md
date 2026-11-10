# Entorno de desarrollo con Supabase

Cada integrante trabaja contra **su propio proyecto Supabase** en el plan gratuito. No se usa Docker
(Spec 000 v1.4.0; Spec 012 FR-014).

| Proyecto                             | Responsable        | Uso                                                                                     |
| ------------------------------------ | ------------------ | --------------------------------------------------------------------------------------- |
| Integración (`upgkzhkqzjslilqpjukc`) | Victor Hugo Parada | Solo recibe migraciones ya revisadas y fusionadas en `main`. CI corre aquí sus pruebas. |
| Desarrollo del compañero             | Compañero          | Recibe sus propias migraciones mientras trabaja en su rama.                             |

Supabase se usa **solo como servidor PostgreSQL**: no se usan su autenticación, su API automática ni
su cliente para navegador (Spec 000).

## 1. Crear el proyecto

1. En [supabase.com](https://supabase.com), crea un proyecto en el plan gratuito.
2. Guarda la contraseña de la base en un gestor de contraseñas. No la compartas por chat ni la
   escribas en el repositorio.
3. Elige la región más cercana a la planta. Integración, piloto y producción deben usar la misma.

## 2. Crear la base auxiliar de Prisma

Prisma necesita una base temporal (_shadow database_) para generar migraciones. En **SQL Editor**:

```sql
CREATE DATABASE prisma_shadow;
```

Si Supabase no lo permite, genera las migraciones con `prisma migrate diff` y aplícalas con
`prisma migrate deploy` (research R3 de Spec 012).

## 3. Obtener las conexiones

En el botón **Connect** del panel:

| Variable              | Conexión                                 | Formato                                                                                                                                          |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`        | Pooler, modo _Transaction_ (puerto 6543) | `postgresql://postgres.<ref>:<contraseña>@aws-0-<región>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=rosabetania` |
| `DIRECT_URL`          | Conexión directa (puerto 5432)           | `postgresql://postgres:<contraseña>@db.<ref>.supabase.co:5432/postgres?schema=rosabetania`                                                       |
| `SHADOW_DATABASE_URL` | Directa a la base auxiliar               | `postgresql://postgres:<contraseña>@db.<ref>.supabase.co:5432/prisma_shadow?schema=rosabetania`                                                  |

Notas comprobadas en el proyecto de integración (2026-10-13):

- La conexión directa `db.<ref>.supabase.co` del plan gratuito es **solo IPv6**. Si tu red no tiene
  IPv6 (error `ENOTFOUND`), usa el pooler en modo _Session_ para `DIRECT_URL` y
  `SHADOW_DATABASE_URL`: mismo host y usuario que `DATABASE_URL` (`postgres.<ref>`), pero puerto
  **5432**.
- `connection_limit=1` es para Vercel, donde cada ejecución tiene su propia conexión. Para el
  servidor local (`node apps/backend/dist/main.js`) usa **`connection_limit=5`**: con una sola
  conexión, dos acciones simultáneas sobre la misma OT esperan en fila y la segunda falla por tiempo
  en vez de recibir "La OT ya cambió de etapa" (comprobado el 2026-10-21).
- Con el pooler en modo _Transaction_ el esquema solo llega en las consultas que arma Prisma; una
  consulta SQL escrita a mano debe nombrar el esquema (`"rosabetania"."tabla"`) o no encuentra las
  tablas.
- En la plantilla de Supabase, `[YOUR-PASSWORD]` se reemplaza **sin** los corchetes. Si tu
  contraseña tiene caracteres especiales (`[ ] @ : / ? # %`), escríbelos codificados en la URL (por
  ejemplo, `[` es `%5B` y `]` es `%5D`).
- La versión de PostgreSQL del proyecto de integración es la 17.

## 4. Configurar el `.env`

```bash
cp apps/backend/.env.example apps/backend/.env
```

Completa las conexiones, los datos del SMTP de la empresa y tu dirección en
`SMTP_DESTINATARIOS_PERMITIDOS`. El archivo `.env` está en `.gitignore` y nunca se sube.

## 5. Crear las tablas y aplicar permisos

```bash
npm run db:migrate -w apps/backend
npx prisma db execute --file apps/backend/prisma/sql/permisos.sql --schema apps/backend/prisma/schema.prisma
```

El script de permisos quita todo acceso de los roles públicos de Supabase (`anon`,
`authenticated`) y crea el usuario `rosabetania_api` para la API, sin contraseña. La contraseña se
define aparte, fuera del repositorio.

## 6. Flujo de cambios de estructura

> **Nunca aceptes un "reset"**: si Prisma propone borrar y recrear el esquema, cancela. Suele indicar
> que `SHADOW_DATABASE_URL` no tiene `?schema=rosabetania`. Si `prisma migrate dev` no puede
> confirmar un aviso porque la terminal no es interactiva, escribe la migración a mano (como
> `20261015195545_agregar_nit_cliente`) y pruébala con `npm run test -w apps/backend` antes de
> aplicarla.

Las tablas solo cambian mediante **migraciones versionadas en Git**. Nadie edita una base a mano.

1. El compañero crea una rama, modifica `apps/backend/prisma/schema.prisma` y genera la migración
   con `npm run db:migrate:dev -w apps/backend`, que también la aplica en su proyecto.
2. Sube la rama y abre un _pull request_.
3. Victor Hugo Parada revisa la migración, la fusiona en `main` y la aplica en integración con
   `npm run db:migrate -w apps/backend`.
4. El compañero actualiza su rama desde `main` y aplica las migraciones que le falten con el mismo
   comando.

Si dos ramas crean migraciones a la vez, la segunda en fusionarse debe regenerar la suya sobre
`main` antes de fusionarse.

## 7. Proyecto pausado

Un proyecto gratuito sin uso durante una semana se pausa. Reactívalo desde el panel de Supabase
(**Restore project**); los datos se conservan.

## 8. Datos

En los proyectos de desarrollo no se cargan datos reales de la empresa. Usa `npm run seed` y, si
hace falta, `npm run seed:demo` (contracts/cli.md de Spec 012).
