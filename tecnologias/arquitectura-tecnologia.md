# Arquitectura y Tecnología — RosaBetaniaOts

> Documento de referencia generado a partir del código y las especificaciones del repositorio
> (principalmente `specs/000-define-tech-stack/spec.md`, `package.json` de cada paquete,
> `apps/backend/prisma/schema.prisma` y `docs/entorno-supabase.md`).

## 1. Resumen general del sistema

**RosaBetaniaOts** es el sistema de **Órdenes de Trabajo (OT)** de Rosa Betania SRL. Gestiona el
ciclo de vida de las OT (registro, tablero de producción por máquina, impresión en PDF),
clientes, catálogos/maestros, usuarios con roles y privilegios, y un historial de auditoría de
cambios. Es una aplicación web responsive, mobile-first, pensada para operarse tanto desde planta
(celular) como desde administración (escritorio).

## 2. Arquitectura general

El proyecto es un **monorepo** con dos entregables desplegables de forma independiente —backend y
frontend— más un paquete de contratos compartido, conforme al principio constitucional XVIII
(separación de entregables).

```
rosabetania-ots/ (npm workspaces + Turborepo)
├── apps/
│   ├── backend/      → API NestJS (Node.js)
│   └── frontend/     → SPA React + Vite
├── packages/
│   └── contracts/    → Esquemas Zod compartidos (@rosabetania/contracts)
└── specs/            → Especificaciones (Spec Kit / Specify) que gobiernan el diseño
```

Flujo conceptual de ejecución:

```
Usuario (celular / PC)
  ↓
Frontend — React + Vite + TypeScript
  ↓  HTTPS + Bearer JWT  (proxy /api en desarrollo)
Backend — API NestJS
  ├── Validación (contrato Zod / nestjs-zod)
  ├── Autenticación y autorización por rol
  ├── Reglas de negocio
  └── Trazabilidad y auditoría
  ↓  Prisma (ORM)
PostgreSQL administrado (Supabase)
  └── Restricciones de integridad (esquema `rosabetania`)
```

Flujo de entrega:

```
Git → GitHub → GitHub Actions (CI: lint + build + test)
            → Vercel
                ├── Proyecto "backend"  → API (Vercel Functions)
                └── Proyecto "frontend" → SPA estática
```

El frontend **no accede directamente** a la base de datos ni a Supabase: todo pasa por la API del
backend (regla explícita de la Spec 000, SEC-011).

## 3. Stack tecnológico

| Capa | Tecnología | Versión (de `package.json`) |
|---|---|---|
| Lenguaje | TypeScript | 5.9.3 (raíz) |
| Runtime | Node.js | `>=24 <25` (ver `.nvmrc`) |
| Gestor de paquetes | npm workspaces | npm 11.19.0 |
| Orquestador de tareas | Turborepo | 2.11.8 |
| Backend — framework | NestJS | 11.2.7 |
| Backend — validación | nestjs-zod / Zod | Zod 4.6.7 |
| Backend — ORM | Prisma | 6.19.3 |
| Backend — auth | `@nestjs/jwt`, `argon2` (hash de contraseñas) | 11.0.2 / 0.45.1 |
| Backend — seguridad HTTP | `helmet`, CORS, `cookie-parser` | 8.3.0 |
| Backend — logging | `pino` + `nestjs-pino` | 10.4.0 / 5.3.1 |
| Backend — salud | `@nestjs/terminus` | 11.1.1 |
| Backend — correo | `nodemailer` (SMTP) | 10.1.0 |
| Frontend — framework | React | 19.3.0 |
| Frontend — bundler/dev server | Vite | 8.3.4 |
| Frontend — UI kit | MUI (Material UI) — única librería de interfaz | `@mui/material` 9.5.0 |
| Frontend — routing | React Router | 8.4.0 |
| Frontend — datos de servidor | TanStack Query | 5.104.3 |
| Frontend — formularios | react-hook-form + `@hookform/resolvers` (Zod) | 7.90.0 |
| Frontend — fechas | `@mui/x-date-pickers` + `dayjs` | 9.16.0 / 1.11.23 |
| Frontend — PDF | `@react-pdf/renderer` | 4.9.0 |
| Frontend — drag & drop | `@dnd-kit/*` (tablero de producción) | 6.3.1 / 10.0.0 / 3.2.2 |
| Contrato compartido | Zod (`@rosabetania/contracts`) | 4.6.7 |
| Base de datos | PostgreSQL administrado (Supabase, solo como servidor PostgreSQL) | PostgreSQL 17 (proyecto de integración) |
| Testing | Vitest (+ `@testing-library/react`, `jsdom`) | 5.0.4 |
| Calidad de código | ESLint + Prettier | ESLint 10.12.0 / Prettier 3.9.10 |
| CI/CD | GitHub Actions | — |
| Despliegue | Vercel (dos proyectos independientes) | — |
| Flujo de especificaciones | Specify / GitHub Spec Kit | — |

> Nota: la Spec 000 menciona **Zustand** para estado local y un **cliente tipado generado desde
> OpenAPI** como decisiones aprobadas para el frontend; no se confirmó su presencia en
> `apps/frontend/package.json` en el momento de este documento, por lo que no se listan como
> dependencias verificadas (puede tratarse de lógica propia en `src/sesion`/`src/api` en su
> lugar).

## 4. Frontend en detalle

Ubicación: `apps/frontend` — paquete `frontend` (`description`: "Entregable Frontend de
RosaBetaniaOts: aplicación web React + Vite").

### 4.1 Framework y herramientas base

- **React 19** con **Vite 8** como entorno de desarrollo y bundler (`vite`, `@vitejs/plugin-react`).
- **TypeScript** estricto (hereda `tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`,
  `noImplicitOverride`).
- Punto de entrada: `src/main.tsx`; componente raíz: `src/App.tsx`; tema MUI centralizado en
  `src/tema.ts`.

### 4.2 Estructura de carpetas (`apps/frontend/src`)

```
src/
├── api/              → Funciones de acceso a la API del backend (una por dominio):
│                        auditoria, catalogos, cliente(s), clientes-gestion, maestros,
│                        ordenes-trabajo, privilegios, tablero, tablero-maquinas, usuarios
├── auditoria/         → Lógica/componentes del módulo de auditoría
├── navegacion/         → Navegación y rutas protegidas por rol
├── ordenes/            → Lógica de Órdenes de Trabajo
│   ├── lamina/          → Formato "lámina" de la OT
│   └── pdf/             → Generación de PDF de la OT
├── paginas/            → Páginas/pantallas (una por vista): Auditoria, Avisos,
│                          CambiarContrasena, Clientes, HojaPdfOt, ImpresionOt, Ingresar,
│                          ListadoOt, MiPerfil, RegistrarOt, RolesPrivilegios, Tablero,
│                          TableroMaquinas, Usuarios
│   └── maestros/        → Pantallas de catálogos/maestros
├── sesion/              → Gestión de sesión (login, token, usuario autenticado)
├── tablero/             → Lógica del tablero de producción (drag & drop)
├── App.tsx
├── main.tsx
└── tema.ts              → Tema MUI
```

La organización es **por dominio funcional** (OT, tablero, auditoría, sesión) y por **tipo**
(`api/` para llamadas HTTP, `paginas/` para vistas), en lugar de una separación genérica
`components/hooks/services`.

### 4.3 Interfaz y estilos

- **MUI (Material UI)** es la **única** librería de componentes, íconos (`@mui/icons-material`) y
  estilos permitida (decisión explícita de gobernanza del proyecto): todo estilo se hace con el
  tema MUI y la prop `sx`; está prohibido usar Bootstrap, Tailwind, Ant Design, CSS propio o HTML
  suelto cuando MUI ya ofrece el componente equivalente.
- `@emotion/react` y `@emotion/styled` son dependencias internas de MUI (motor de estilos).
- Diseño **responsive y mobile-first**.

### 4.4 Routing

**React Router 8** gestiona pantallas y rutas protegidas por rol (lógica de guard de navegación en
`src/navegacion/`).

### 4.5 Comunicación con el backend

- El frontend **nunca** accede a la base de datos ni a Supabase directamente; todas las llamadas
  pasan por la API del backend vía HTTPS con JWT (`Authorization: Bearer`).
- En desarrollo, Vite expone un **proxy** (`vite.config.ts`): las peticiones a `/api` se
  redirigen a `http://localhost:3000` (el backend local).
- La carpeta `src/api/` centraliza las funciones que llaman a cada endpoint, organizadas por
  dominio (usuarios, clientes, órdenes de trabajo, tablero, catálogos, etc.).
- **TanStack Query** gestiona el fetching, cacheo y sincronización de esos datos del servidor.
- El contrato de datos usa los esquemas Zod de `@rosabetania/contracts` (ver sección 5), resuelto
  en Vite directamente contra el código fuente TypeScript del paquete (alias en `vite.config.ts`
  apuntando a `packages/contracts/src/index.ts`), para que el frontend siempre use la versión más
  reciente sin esperar una compilación intermedia.

### 4.6 Formularios y validación

**react-hook-form** junto con `@hookform/resolvers`, validando con los mismos esquemas **Zod** del
contrato compartido (misma regla de validación que en el backend).

### 4.7 Generación de PDF

**`@react-pdf/renderer`** construye en el propio navegador el PDF de la OT con un diseño fijo A4
(módulo `src/ordenes/pdf/`), para garantizar el mismo resultado visual en cualquier dispositivo sin
depender de la impresión del navegador ni de un servidor.

### 4.8 Tablero de producción

El tablero (`src/tablero/`, página `TableroMaquinas.tsx`) usa **`@dnd-kit`** (`core`, `sortable`,
`utilities`) para la interacción de arrastrar y soltar.

### 4.9 Fechas

**`@mui/x-date-pickers`** con **`dayjs`** como adaptador de fechas (selector con formato
DD/MM/AAAA).

### 4.10 Testing

- **Vitest** como runner de pruebas (`vitest run`), con **`@testing-library/react`** y **`jsdom`**
  para pruebas de componentes en un DOM simulado.
- Configuración en `apps/frontend/vitest.config.ts` y carpeta `apps/frontend/test`.

### 4.11 Build

`npm run build` en el frontend ejecuta primero verificación de tipos (`tsc --noEmit`) y luego
`vite build`, generando una aplicación estática (sin servidor propio), lo que impide por diseño el
acceso directo a la persistencia.

## 5. Backend en detalle

Ubicación: `apps/backend` — paquete `backend` (`description`: "Entregable Backend de
RosaBetaniaOts: API NestJS").

### 5.1 Framework

**NestJS 11** sobre Node.js, con arranque en `src/main.ts` y módulo raíz `src/app.module.ts`.

### 5.2 Estructura de módulos (`apps/backend/src`)

```
src/
├── acceso/            → Autenticación (login, tokens, recuperación)
├── arranque/           → Bootstrap de la aplicación
│   └── cli/             → Scripts de línea de comandos (seed, seed-demo)
├── auditoria/          → Historial de cambios / eventos de auditoría
├── autorizacion/        → Autorización por rol y privilegios (guards/decoradores)
├── clientes/            → Gestión de clientes
├── config/              → Configuración y variables de entorno (@nestjs/config)
├── correo/               → Envío de correos transaccionales (nodemailer / SMTP)
├── maestros/             → Catálogos y datos maestros
├── modules/
│   └── usuarios/          → Gestión de usuarios
├── ordenes-trabajo/        → Núcleo del dominio: Órdenes de Trabajo
├── prisma/                  → Cliente/servicio Prisma
├── salud/                    → Endpoint de salud (@nestjs/terminus)
└── tablero/                   → Lógica del tablero de producción
```

### 5.3 Validación y contrato

- **nestjs-zod** valida cada petición contra los esquemas Zod de `@rosabetania/contracts`
  (fuente única de verdad del contrato, compartida con el frontend).
- Documentación del contrato pensada para publicarse como **OpenAPI** generado desde Zod
  (`zod-to-openapi`, según Spec 000).

### 5.4 Autenticación y seguridad

- **JWT** de corta duración (`@nestjs/jwt`) transportado como `Authorization: Bearer`.
- Refresh token rotativo almacenado con hash (cookie `HttpOnly` en navegador).
- Contraseñas resguardadas con **argon2**.
- **helmet** + CORS con lista blanca de orígenes.
- Autorización mediante guards y decoradores de rol (módulo `autorizacion/`).

### 5.5 Acceso a datos — ORM y base de datos

- **Prisma** (`@prisma/client` 6.19.3) como ORM, con esquema en `apps/backend/prisma/schema.prisma`.
- El esquema físico implementa el **Diccionario de Datos (Spec 002)**: tablas en `snake_case`,
  dentro del esquema PostgreSQL `rosabetania`, sin borrados en cascada.
- **PostgreSQL administrado** provisto por **Supabase**, usado **exclusivamente como servidor
  PostgreSQL** (sin su Auth, su API automática ni su cliente de navegador): un proyecto Supabase
  gratuito por integrante en desarrollo, proyecto de integración para CI, y Supabase Pro previsto
  para producción.
- Conexión vía **pooler** (modo *Transaction*, puerto 6543) para ejecución; conexión **directa**
  (puerto 5432) reservada para migraciones (`DIRECT_URL`).
- **Prisma Migrate** versiona los cambios estructurales; no se editan tablas a mano.

### 5.6 Otros

- **Logging**: `pino` + `nestjs-pino`, con identificador de petición para diagnóstico.
- **Salud**: `@nestjs/terminus` informa disponibilidad de API y base de datos.
- **Correo**: `nodemailer` por SMTP (invitaciones y recuperación de contraseña, enlaces de un solo
  uso con caducidad corta).
- **Trazabilidad/Auditoría**: cada escritura registra creado/modificado por y en; además existe un
  historial de eventos de auditoría (módulo `auditoria/`) escrito en la misma transacción que el
  cambio, en la misma base PostgreSQL (sin servicios adicionales).

## 6. Contratos compartidos (`packages/contracts`)

Paquete **`@rosabetania/contracts`** (privado, versión 0.1.0): "Esquemas Zod compartidos entre
backend y frontend" (Spec 000: contrato único).

Contenido (`src/`):

- `acceso.ts`, `auditoria.ts`, `catalogos.ts`, `clientes.ts`, `lamina.ts`, `maestros.ts`,
  `ordenes-trabajo.ts`, `tablero.ts`, `tablero-maquinas.ts`, `usuarios.ts` — esquemas Zod por
  dominio.
- `autorizacion/` — matriz de autorización, errores, esquemas, operaciones y catálogo de
  privilegios.
- `normalizar-nombre-cliente.ts` — utilidad de normalización compartida.
- `index.ts` — punto de exportación único.

**Uso dual**:

- El **backend** compila el paquete (`tsc`) y lo consume como módulo CommonJS compilado
  (`dist/index.js`).
- El **frontend** (vía Vite) importa directamente el **código fuente TypeScript** del paquete
  (alias apuntando a `src/index.ts`), evitando depender de una compilación intermedia y
  manteniéndose siempre sincronizado con la fuente.

Esto garantiza una única definición de validación de entrada/salida para ambos entregables,
evitando reglas duplicadas.

## 7. Infraestructura y despliegue

- **Control de versiones**: Git + **GitHub**.
- **CI**: **GitHub Actions** (`.github/workflows/ci.yml`), disparado en `push` a `main` y en cada
  `pull_request`. Pasos: checkout → setup Node (versión de `.nvmrc`) → `npm ci` →
  `npx turbo run lint build test` → construcción separada y forzada de `backend` y de `frontend`
  (verificación explícita de que cada entregable se construye de forma independiente).
  - Las pruebas de integración corren contra el **proyecto Supabase de integración**, en esquemas
    temporales que el propio test crea y elimina (`DIRECT_URL`/`DATABASE_URL` como secretos de
    GitHub Actions).
- **Despliegue**: **Vercel**, con **dos proyectos independientes** desde el mismo repositorio
  (`apps/backend/vercel.json` y `apps/frontend/vercel.json`): el backend corre como **Vercel
  Functions** (serverless) y el frontend se publica como aplicación estática. Esto exige que el
  backend no mantenga estado en memoria de proceso entre peticiones y use pooler de conexiones a
  la base de datos.
- **Base de datos (entornos)**: cada integrante trabaja contra su propio proyecto Supabase gratuito
  en desarrollo; un proyecto de integración recibe solo migraciones ya revisadas en `main` (y es
  donde corre CI); está prevista una contingencia de mover el backend a un contenedor (Railway) si
  el modelo serverless resultara limitante.
- **No se usa Docker** en el entorno de desarrollo (retirado en la enmienda 1.4.0 de la Spec 000):
  el backend corre con Node.js local y la base de datos es siempre un proyecto Supabase remoto.

## 8. Herramientas de desarrollo

- **Monorepo**: `npm workspaces` (`apps/*`, `packages/*`) orquestado por **Turborepo**
  (`turbo.json`: tareas `build`, `lint`, `test`, `dev`, con `build` dependiendo de los `build` de
  sus dependencias internas — por ejemplo, el backend/frontend dependen de que `contracts` se
  construya primero).
- **Linting**: **ESLint** (`eslint.config.mjs`, con `typescript-eslint`), ejecutado por paquete
  (`npm run lint` en cada app llama a `eslint src test`).
- **Formato**: **Prettier** (`.prettierrc`, `.prettierignore`), con scripts raíz `format` y
  `format:check`.
- **TypeScript**: configuración base compartida en `tsconfig.base.json` (modo `strict`,
  `noUncheckedIndexedAccess`, `noImplicitOverride`, `target: ES2022`), extendida por cada paquete.
- **Gestión de scripts de instalación**: `allowScripts` en el `package.json` raíz autoriza
  explícitamente los scripts nativos necesarios (`@prisma/client`, `@prisma/engines`, `prisma`,
  `@swc/core`) y deniega `fsevents`.
- **Flujo de especificaciones**: **Specify / GitHub Spec Kit** (carpetas `.specify/`, `specs/`),
  que ordena el desarrollo en Constitution → Specs → Plan → Tasks → Implementación; hay además
  comandos equivalentes para Gemini (`.gemini/commands`) y skills de Claude Code
  (`.claude/skills`), reflejando que el flujo de especificaciones es independiente del asistente de
  IA usado.
