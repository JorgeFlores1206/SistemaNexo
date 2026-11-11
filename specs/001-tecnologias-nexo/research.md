# Research: Tecnologías de Nexo

## R1. Aplicación web frente a Python/Flet/.exe

- **Decisión**: React/Vite como interfaz web.
- **Motivo**: FR-009 define la aplicación web y declara obsoletos Python/Flet y `.exe`.
- **Fuente**: `spec.md`, `tecnologias/arquitectura-tecnologia.md`.

## R2. Límite de acceso

- **Decisión**: el frontend llama exclusivamente a NestJS por HTTPS; NestJS valida sesión,
  autoriza y aplica reglas de negocio.
- **Motivo**: evita exponer credenciales, reglas o persistencia en el navegador.
- **Excluido**: Supabase Auth, API automática y cliente de navegador.

## R3. Persistencia y migraciones

- **Decisión**: Prisma sobre PostgreSQL de Supabase, esquema físico `nexo`.
- **Motivo**: centraliza acceso y permite migraciones revisables en Git.
- **Regla**: no editar tablas manualmente; las migraciones requieren revisión previa.

## R4. Contratos y validación

- **Decisión**: Zod en `packages/contracts`, reutilizado por frontend y backend.
- **Motivo**: una sola definición de validación para entradas y salidas.

## R5. Entornos y entrega

- **Decisión**: desarrollo, integración y producción separados; GitHub Actions ejecuta lint/build/test;
  Vercel publica frontend y backend como proyectos independientes.
- **Restricción**: desarrollo sin Docker y sin datos reales.

## R6. Versiones

La documentación de tecnología registra TypeScript 5.9.3, Node `>=24 <25`, npm 11.19.0,
Turborepo 2.11.8, NestJS 11.2.7, React 19.3.0, Vite 8.3.4, MUI 9.5.0, Zod 4.6.7,
Prisma 6.19.3 y PostgreSQL 17. Estas versiones deben verificarse contra los manifiestos finales
de Nexo antes de instalar dependencias; no se asumen como nuevas dependencias de esta spec.

## R7. Tecnologías heredadas excluidas

PDF, drag-and-drop, correo y módulos de OT aparecen en el documento de referencia de RosaBetania.
No forman parte de Nexo hasta que una Spec funcional los justifique.
