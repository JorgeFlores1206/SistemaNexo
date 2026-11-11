# Sistema de Gestión de Inventario — Constitution

**Proyecto:** Sistema de Gestión de Inventario  
**Versión:** 1.0.0  
**Estado:** Borrador para revisión y ratificación  
**Fecha:** 2026-10-16

---

## Propósito

El proyecto **Sistema de Gestión de Inventario** tiene como propósito desarrollar y mantener una aplicación para registrar, consultar y controlar productos de inventario, sus fechas de vencimiento, su política de devolución y los estados asociados.

El sistema deberá facilitar la identificación de productos vencidos, próximos a vencer, en oferta y sujetos a devolución, de acuerdo con reglas de negocio documentadas. También deberá permitir importar productos desde archivos Excel, configurar parámetros operativos, gestionar usuarios y consultar una bitácora de acciones.

Esta Constitution define los principios obligatorios que deberán respetar las especificaciones, el modelo de datos, la arquitectura, la implementación, las pruebas y la evolución del sistema.

La Constitution establece **cómo se debe tomar y mantener decisiones de producto y de desarrollo**. No reemplaza las Specs: las reglas funcionales concretas deberán definirse en las especificaciones antes de implementarse.

---

## I. SDD y autoridad de los documentos — NO NEGOCIABLE

El proyecto seguirá el enfoque **SDD (Spec-Driven Development)**. Las decisiones funcionales y técnicas deberán quedar documentadas antes de traducirse en cambios relevantes de código o datos.

La jerarquía de documentación será:

1. **Constitution:** principios obligatorios y reglas de gobernanza.
2. **Specs:** requisitos, reglas de negocio, actores y criterios de aceptación.
3. **Plan:** enfoque técnico para implementar una Spec aprobada.
4. **Tasks:** unidades de trabajo verificables derivadas del Plan.
5. **Código, migraciones y pruebas:** implementación de las decisiones documentadas.

El código no deberá convertirse en la única fuente de verdad de una regla de negocio.

Cuando se detecte una contradicción entre documentos, código o requisitos nuevos, se deberá:

- señalar la contradicción;
- identificar los documentos o componentes afectados;
- explicar sus consecuencias;
- solicitar o documentar la decisión necesaria antes de continuar con una implementación que dependa de ella.

No se deberán inferir decisiones de negocio únicamente porque sean comunes en otros sistemas.

---

## II. Alcance funcional del sistema

El sistema tendrá como dominio central la gestión de productos de inventario y su ciclo de control relacionado con vencimientos y devoluciones.

El alcance inicial contempla:

1. acceso al sistema y autorización por rol;
2. gestión de productos;
3. importación de productos desde Excel;
4. cálculo y consulta de estados relacionados con vencimiento y devolución;
5. visualización de productos vencidos, en oferta, próximos a vencer y sujetos o próximos a devolución;
6. panel principal con totales y cantidades por estado;
7. configuración de anticipaciones para avisos;
8. gestión de usuarios;
9. bitácora de acciones disponible para el Administrador;
10. empaquetado de la aplicación para su distribución como `.exe`, sujeto a la validación técnica correspondiente.

Las funcionalidades de exportación o generación de Excel no se considerarán requisitos funcionales solo por estar disponibles las bibliotecas correspondientes. Deberán incorporarse únicamente si una Spec las solicita y define sus criterios de aceptación.

Toda ampliación del alcance deberá responder a una necesidad identificada y quedar especificada antes de implementarse.

---

## III. Producto y reglas del dominio

El producto constituye la entidad central del sistema.

Las Specs deberán definir los datos de producto necesarios para operar el sistema. No se deberán agregar campos obligatorios, catálogos ni relaciones de negocio sin una justificación documentada.

Como mínimo, antes de implementar funcionalidades dependientes, se deberán especificar:

- identificador del producto;
- campos requeridos y opcionales;
- formato y unicidad de códigos, si corresponde;
- representación de fechas de vencimiento;
- datos requeridos para determinar la política de devolución;
- cantidades, unidades y demás datos de inventario, si corresponden;
- estado activo, inactivo u otra condición de disponibilidad, si corresponde;
- reglas de creación, modificación, retiro y consulta.

Los nombres de campos, tipos, restricciones, relaciones y reglas de validación deberán consolidarse en el Diccionario de Datos.

No se deberá asumir que una fecha de vencimiento o una política de devolución puede deducirse de campos no definidos en una Spec.

---

## IV. Estados, fechas y reglas de negocio

Los estados de los productos deberán calcularse de forma consistente en toda la aplicación. Una misma combinación de datos no podrá producir resultados contradictorios entre el panel principal, los listados, la importación y las consultas.

Las Specs deberán definir, antes de implementar:

- qué significa cada estado;
- qué datos determinan ese estado;
- si un estado se calcula automáticamente o puede modificarse manualmente;
- los límites de fecha que se aplican;
- la precedencia cuando un producto cumple más de una condición;
- cómo se muestran los días restantes o transcurridos;
- qué ocurre con productos sin fecha de vencimiento o con información incompleta;
- cuándo y cómo se actualiza el estado;
- cómo se cuentan productos en el resumen del panel.

El sistema contempla consultas de productos:

- vencidos;
- en oferta;
- próximos a vencer, con los días correspondientes;
- sujetos a devolución;
- próximos a devolución.

La definición exacta de «en oferta», «próximo a vencer», «sujeto a devolución» y «próximo a devolución» deberá constar en Specs. No se deben inventar fórmulas, rangos, estados ni prioridades.

Si los estados pueden superponerse, la Spec deberá establecer si el panel muestra conteos independientes o categorías mutuamente excluyentes. El total y los subtotales deberán ser coherentes con esa decisión.

Las reglas dependientes de fechas deberán especificar la zona horaria o la fecha de referencia utilizada cuando esto afecte el resultado.

---

## V. Roles y permisos

El sistema tendrá inicialmente dos roles:

- **Administrador:** acceso global a las funcionalidades autorizadas del sistema.
- **Usuario:** acceso limitado a importación de Excel y parámetros, según las reglas aprobadas.

El principio de menor privilegio será obligatorio: cada usuario tendrá únicamente los permisos que necesita para su rol.

La matriz de permisos deberá documentarse en una Spec antes de implementar autorización. Como punto de partida:

- el Administrador podrá acceder a la administración global del sistema;
- el Usuario podrá acceder exclusivamente a las funciones de importación y parámetros que se definan para su rol;
- el acceso del Usuario a productos, paneles, bitácora, gestión de usuarios u otras funciones no se presumirá; deberá aprobarse explícitamente en una Spec;
- la consulta de la bitácora estará restringida al Administrador.

La autorización deberá verificarse en la capa que protege efectivamente la operación y los datos. Ocultar controles en la interfaz no constituye una medida de seguridad suficiente.

La gestión de usuarios deberá definir, como mínimo, quién puede crear, modificar, desactivar y asignar roles, así como el tratamiento de la cuenta del último Administrador.

---

## VI. Seguridad y secretos

La seguridad deberá formar parte del diseño de la aplicación y de su acceso a Supabase, no ser únicamente una característica visual.

Se deberán cumplir estas reglas:

- nunca incluir contraseñas, tokens, claves privadas ni secretos en el código fuente;
- no incluir archivos `.env` ni credenciales en el repositorio;
- no incluir claves privilegiadas de Supabase —incluida la `service_role`— en una aplicación Flet distribuida o en un `.exe`;
- no asumir que una variable de entorno empaquetada con el ejecutable protege un secreto;
- definir en la Spec tecnológica cómo se autentican los usuarios y cómo se aplican los permisos;
- aplicar Row Level Security (RLS) y políticas de acceso de Supabase cuando corresponda al diseño aprobado;
- limitar el acceso a datos y operaciones al rol autenticado;
- gestionar errores de autenticación y autorización sin revelar secretos ni información interna;
- documentar la configuración segura de credenciales para desarrollo, pruebas y distribución.

El uso del cliente de Supabase desde la aplicación deberá diseñarse con las restricciones propias de una aplicación de escritorio distribuida. Si una operación necesita privilegios que no pueden residir de forma segura en el cliente, la solución deberá definir una capa de confianza adecuada antes de implementarla. Esta decisión corresponde a la Spec tecnológica.

---

## VII. Integridad y validación de datos

La integridad de los datos no deberá depender exclusivamente de la interfaz gráfica.

Las validaciones de interfaz deberán ayudar a prevenir errores de captura. Las reglas que protegen la consistencia de los datos deberán aplicarse también en una capa confiable, como la base de datos, las políticas de acceso o la lógica de aplicación autorizada, según corresponda a la arquitectura aprobada.

Cuando proceda, el modelo relacional deberá utilizar:

- claves primarias y foráneas;
- restricciones `UNIQUE`, `CHECK` y `NOT NULL`;
- tipos adecuados para fechas, cantidades y estados;
- relaciones y transacciones;
- políticas de seguridad;
- migraciones versionadas.

Las mismas reglas podrán validarse en más de una capa solo cuando cada validación tenga un propósito claro: experiencia de usuario, integridad o seguridad.

Los errores de validación deberán identificar el problema de forma comprensible. No se deberá reportar como exitosa una operación que no se completó.

---

## VIII. Arquitectura y tecnologías

La implementación deberá respetar las tecnologías definidas para el proyecto:

- **Python 3.13.15** como lenguaje de programación;
- **Flet** para la interfaz gráfica;
- **Supabase PostgreSQL** como base de datos y servicio en la nube;
- **supabase** como biblioteca cliente para la integración Python-Supabase;
- **python-dotenv** para leer configuración local desde `.env`;
- **openpyxl** para leer archivos Excel;
- **reportlab** para generación de PDF únicamente si una Spec define esa funcionalidad;
- **pyinstaller** para empaquetar a `.exe`;
- **venv** como entorno virtual del proyecto.

La existencia de una biblioteca en el entorno no implica que una funcionalidad asociada esté aprobada.

La arquitectura deberá separar, de forma proporcional a las necesidades reales:

- interfaz gráfica;
- lógica de aplicación y reglas de negocio;
- validación;
- acceso a datos;
- autenticación y autorización;
- configuración e infraestructura.

La solución no deberá imponer un backend independiente, una API web, microservicios ni despliegues adicionales sin que exista una necesidad documentada. La decisión concreta de arquitectura y distribución deberá registrarse en **Spec 000 — Definición Tecnológica**.

Las versiones exactas de dependencias, estrategia de instalación y compatibilidad con Python 3.13.15 deberán comprobarse y documentarse antes de depender de ellas en producción.

---

## IX. Importación de Excel

La importación desde Excel es una funcionalidad crítica y deberá contar con una Spec propia antes de implementarse.

Esa Spec deberá definir:

- plantilla oficial y nombre de cada columna;
- campos requeridos y opcionales;
- tipos y formatos aceptados;
- tratamiento de fechas y celdas vacías;
- reglas para códigos duplicados;
- criterio para detectar productos ya existentes;
- política de actualización o rechazo de registros existentes;
- validaciones por fila y del archivo completo;
- límite de tamaño o volumen, si corresponde;
- permisos para importar;
- comportamiento ante archivos inválidos;
- si la importación será transaccional, parcial o por lotes;
- forma de informar resultados y errores;
- registro de la importación en la bitácora.

El sistema deberá validar la información antes de persistirla y comunicar los errores de manera accionable. No se deberá descartar silenciosamente una fila ni transformar datos ambiguos sin una regla aprobada.

---

## X. Configuración de avisos

El sistema tendrá un módulo de configuración para anticipaciones de aviso relacionadas con:

- productos próximos a vencer sin devolución;
- productos próximos a vencer con devolución;
- productos próximos a devolución.

Las Specs deberán establecer:

- quién puede consultar y modificar cada parámetro;
- si los valores son enteros, sus unidades y rangos permitidos;
- si los parámetros son globales o dependen de otra entidad;
- cómo se aplican sus cambios a los productos existentes;
- cuándo se recalculan los avisos;
- qué sucede con valores ausentes o inválidos;
- cómo se auditan los cambios.

No se deberá asumir que todos los avisos comparten el mismo número de días ni que el usuario puede editar cualquier configuración por el solo hecho de tener acceso a «parámetros».

---

## XI. Panel principal y consultas

El menú principal deberá mostrar un resumen del inventario con:

- total de productos;
- cantidades por estado definido en las Specs.

Los criterios de conteo deberán coincidir con las reglas del principio IV. El sistema deberá indicar con claridad si un producto puede aparecer en más de un conteo.

Las vistas y consultas de productos deberán mostrar los datos necesarios para comprender el estado y actuar sobre él, incluyendo los días relativos a la fecha de vencimiento cuando así lo establezcan las Specs.

Las listas deberán definir los filtros, ordenamientos, búsqueda, paginación y estados vacíos que necesiten. No deberán presentarse datos desactualizados como si fueran resultados actuales cuando la operación dependa de cambios recientes.

---

## XII. Bitácora y trazabilidad

La bitácora de acciones será visible únicamente para el Administrador, conforme a los permisos definidos en una Spec.

La Spec de bitácora deberá definir qué eventos se registran. Como mínimo, deberá evaluar el registro de operaciones relevantes, por ejemplo:

- importaciones;
- creación, modificación o retiro de productos;
- cambios de configuración;
- administración de usuarios y roles;
- accesos o errores de autorización relevantes.

Cuando corresponda, cada entrada deberá identificar el actor, la fecha y hora, la acción, el recurso afectado y el resultado de la operación.

La bitácora no equivale necesariamente a un historial completo de cada cambio de cada campo. El nivel de detalle y la conservación del antes/después deberán especificarse.

No se deberán registrar contraseñas, tokens, secretos ni datos innecesarios. Los errores técnicos no deberán exponer datos sensibles.

---

## XIII. Conservación y retiro de información

Los datos de inventario y su trazabilidad pueden tener valor operativo e histórico.

Por defecto, el sistema no deberá eliminar automáticamente datos de negocio por antigüedad. El retiro de productos se deberá definir en una Spec y, cuando sea posible, privilegiar mecanismos reversibles —como inactivación o archivo— sobre el borrado físico.

Toda operación de borrado físico deberá estar expresamente autorizada por una Spec que documente:

- motivo;
- permisos requeridos;
- consecuencias para el historial y las relaciones;
- posibilidad de recuperación;
- pruebas y controles aplicables.

La política de respaldo y recuperación de Supabase deberá definirse según las capacidades y el despliegue aprobados. La existencia de respaldos no deberá presumirse sin verificación.

---

## XIV. Experiencia de usuario

La aplicación tendrá una interfaz gráfica basada en Flet y orientada al uso previsto del sistema. La experiencia deberá priorizar claridad, legibilidad y prevención de errores sobre elementos decorativos.

Las pantallas deberán mantener consistencia en:

- navegación;
- formularios;
- tablas o listados;
- mensajes de validación y error;
- confirmaciones de operaciones;
- representación de estados;
- controles de configuración.

Las operaciones que cambian o retiran datos deberán ofrecer confirmación apropiada cuando el riesgo lo justifique. Los mensajes deberán distinguir entre éxito, validación fallida, falta de permisos y error técnico.

La compatibilidad de pantallas, resolución y comportamiento del ejecutable deberá definirse y verificarse de acuerdo con los dispositivos objetivo del proyecto. No se presumirá compatibilidad móvil o multiplataforma sin una Spec que la exija.

---

## XV. Calidad, simplicidad y mantenibilidad

El código deberá priorizar claridad, mantenibilidad y comportamiento predecible.

Se favorecerán:

- nombres descriptivos;
- funciones con responsabilidades claras;
- separación entre presentación, reglas de negocio y persistencia;
- reutilización de lógica compartida;
- tipado y validaciones explícitas cuando aporten seguridad;
- manejo consistente y visible de errores;
- dependencias justificadas y actualizadas de forma controlada.

No se deberán introducir abstracciones, patrones, infraestructura o dependencias especulativas. La solución más simple que cumpla correctamente los requisitos tendrá prioridad.

La deuda técnica conocida deberá documentarse cuando afecte seguridad, integridad, mantenimiento o evolución del sistema.

---

## XVI. Especificaciones y criterios de aceptación

Cada funcionalidad relevante deberá contar con una Spec antes de implementarse.

Una Spec deberá definir, según corresponda:

- propósito y alcance;
- actores y permisos;
- requisitos funcionales y no funcionales;
- reglas de negocio;
- datos involucrados;
- escenarios principales y alternativos;
- casos límite y errores;
- criterios de aceptación verificables;
- dependencias e impactos;
- decisiones pendientes.

No se considerará lista para implementar una funcionalidad si falta una decisión que pueda cambiar sustancialmente su comportamiento, sus datos o sus permisos.

Los criterios de aceptación deberán describir resultados observables. Formulaciones como «debe funcionar bien», «ser rápido» o «ser seguro» deberán concretarse en condiciones comprobables.

---

## XVII. Flujo de trabajo SDD

El flujo obligatorio será:

**Constitution → Specs → clarificación → Plan → Tasks → implementación → pruebas → revisión de cumplimiento.**

Como secuencia documental inicial, se utilizará:

1. **Spec 000 — Definición Tecnológica.**
2. **Spec 001 — Requisitos no funcionales.**
3. **Spec 002 — Diccionario de Datos.**
4. Validación de arquitectura, permisos y modelo.
5. Specs funcionales por módulo.
6. Planes de implementación.
7. Tasks verificables.
8. Implementación incremental y validación.

La numeración podrá adaptarse a las convenciones del repositorio, pero no deberá omitirse el contenido de estas decisiones.

La implementación no deberá adelantarse a la definición de reglas críticas de estados, permisos, importación o estructura de datos.

---

## XVIII. Pruebas y definición de terminado

Cada cambio deberá verificarse contra la Spec que lo origina.

La estrategia de pruebas se documentará según el riesgo y la arquitectura. Como mínimo, se deberán probar los cambios relevantes en:

- criterios de aceptación;
- reglas de fechas, estados y devoluciones;
- validación de entradas;
- importación Excel y errores por fila o archivo;
- permisos por rol;
- persistencia e integridad de datos;
- bitácora cuando aplique;
- compatibilidad con funcionalidades existentes afectadas;
- empaquetado y configuración cuando el cambio afecte el `.exe`.

Un cambio no se considerará terminado únicamente porque el programa abra o compile. Deberá demostrarse que satisface los requisitos aplicables.

La entrega deberá incluir las actualizaciones necesarias a documentación, Specs, modelo de datos, migraciones y pruebas.

---

## XIX. Evolución del modelo de datos y cambios

El Diccionario de Datos será la referencia estructural del sistema. Deberá documentar, como mínimo:

- entidades y atributos;
- tipos y nulabilidad;
- claves primarias y foráneas;
- restricciones e índices relevantes;
- relaciones y cardinalidades;
- catálogos y estados;
- reglas de integridad;
- datos de trazabilidad;
- políticas de acceso asociadas cuando corresponda.

Toda modificación estructural posterior deberá incluir:

1. justificación funcional o técnica;
2. Spec que origina el cambio;
3. análisis de impacto;
4. actualización del Diccionario de Datos;
5. migración versionada cuando corresponda;
6. estrategia para preservar los datos existentes;
7. actualización de pruebas y contratos afectados;
8. validación de permisos y compatibilidad.

Se priorizarán cambios compatibles y evolutivos. Ninguna tabla, columna, política o regla de base de datos deberá añadirse sin estar justificada por requisitos documentados.

---

## XX. Gobernanza, cumplimiento y versionado

Esta Constitution prevalece sobre decisiones técnicas informales que la contradigan.

Los cambios que amplíen significativamente el alcance, alteren permisos, modifiquen reglas de negocio o cambien decisiones arquitectónicas deberán documentar su justificación, Specs afectadas, impacto en datos, migraciones y pruebas necesarias.

Las modificaciones de la Constitution deberán quedar versionadas mediante control de cambios del proyecto. Se seguirá versionado semántico:

- **MAJOR:** cambios incompatibles en principios o gobernanza;
- **MINOR:** nuevos principios o ampliaciones sustanciales;
- **PATCH:** aclaraciones o correcciones que no cambian reglas esenciales.

El mecanismo concreto de revisión, aprobación y fusión será el establecido por el repositorio. No se presumirán personas aprobadoras, ramas, procesos de pull request ni herramientas que el proyecto no haya definido.

La Constitution define cómo se gobierna el proyecto.  
Las Specs definen qué necesita el sistema.  
Los Planes definen cómo se implementará.  
Las Tasks dividen los Planes en trabajo verificable.  
El código materializa esas decisiones.

---

## Decisiones de negocio que requieren Specs

Los siguientes puntos no quedan definidos por esta Constitution y deberán resolverse explícitamente antes de implementar las funcionalidades que dependen de ellos:

1. campos y formato oficial de los productos;
2. formato exacto de la plantilla Excel;
3. definición y cálculo de cada estado;
4. reglas de precedencia cuando un producto cumple varias condiciones;
5. criterios de «en oferta»;
6. política de devolución y cálculo de productos próximos a devolución;
7. permisos exactos del rol Usuario en parámetros e importación;
8. acceso del Usuario a consultas, paneles y productos, si se requiere;
9. tratamiento de duplicados y errores durante la importación;
10. rangos permitidos y efecto de los parámetros de anticipación;
11. reglas de eliminación, inactivación o archivo de productos;
12. necesidades de reportes en excel
13. usuarios objetivo, distribución del ejecutable y configuración de producción;
14. método de autenticación, políticas RLS y arquitectura segura de acceso a Supabase;
15. zona horaria y criterios de cálculo de días.

Hasta que se aprueben en las Specs correspondientes, estas decisiones deberán tratarse como **pendientes**. Ninguna implementación deberá convertir una suposición en regla permanente del sistema.
