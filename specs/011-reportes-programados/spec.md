# Feature Specification: Spec 011 — Reporte mensual anticipado de vencimientos próximos

**Feature Branch**: `011-reportes-programados`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Generar antes de cada inicio de mes un reporte anticipado de productos próximos a vencer."

## Clarifications

### Session 2026-11-11

- Q: ¿Cuándo se genera el reporte programado? → A: El último día calendario del mes anterior, antes de iniciar el nuevo mes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar el reporte mensual de vencimientos (Priority: P1)

Como Administrador, necesito consultar antes de cada mes los productos que se aproximan a su fecha
relevante de vencimiento o devolución para tomar precauciones durante el periodo siguiente.

**Why this priority**: La consulta anticipada permite priorizar acciones de devolución u oferta
antes de que cambie el estado del producto.

**Independent Test**: Preparar productos dentro, fuera y en los límites de la ventana vigente de
30 días; consultar el reporte mensual y verificar que contiene exactamente los productos
marcados "Pronto a vencer" para la fecha de negocio correspondiente.

**Acceptance Scenarios**:

1. **Given** un producto con fecha válida dentro de la ventana "Pronto a vencer", **When** se
   genera el reporte mensual, **Then** aparece una vez con su código, nombre, política, fecha
   relevante, vencimiento original, estado y días restantes.
2. **Given** un producto sin fecha válida o fuera de la ventana de alerta, **When** se genera el
   reporte, **Then** no aparece como próximo a vencer.
3. **Given** un producto con política de devolución, **When** su fecha efectiva llega, **Then**
   deja de aparecer en el reporte anticipado conforme a la regla vigente de alerta.
4. **Given** el inventario no contiene productos próximos a vencer, **When** el Administrador
   consulta el reporte, **Then** Nexo muestra claramente que no hay productos en la ventana.
5. **Given** un Usuario sin permiso administrativo, **When** intenta consultar el reporte,
   **Then** Nexo deniega el acceso sin revelar datos del inventario.

### User Story 2 - Conocer el resultado de la generación mensual (Priority: P2)

Como Administrador, necesito saber si el reporte del mes siguiente se generó correctamente para no actuar
con información incompleta o desactualizada.

**Why this priority**: Un resultado visible permite distinguir un reporte vacío de una falla de
generación.

**Independent Test**: Consultar un reporte generado con éxito y simular una falla de generación;
comprobar que Nexo comunica la fecha de referencia y no presenta un reporte fallido como vigente.

**Acceptance Scenarios**:

1. **Given** la generación mensual terminó correctamente, **When** el Administrador abre el
   reporte, **Then** Nexo muestra el mes de referencia, la fecha de negocio utilizada y el resultado de la generación.
2. **Given** la generación mensual falla, **When** el Administrador consulta el reporte,
   **Then** Nexo informa que el reporte del mes no está disponible y no presenta una generación
   anterior como si fuera la actual.

### Edge Cases

- La fecha efectiva está exactamente en el primer día de la ventana de 30 días.
- La fecha actual coincide con la fecha efectiva o con el vencimiento original.
- El producto no tiene vencimiento válido o carece de política de devolución.
- La política o el vencimiento cambian después de generar el reporte del mes.
- La generación se ejecuta más de una vez para el mismo mes de referencia.
- El inventario está vacío o no tiene productos en la ventana.
- La fecha de negocio cambia mientras el reporte está en proceso.
- El Administrador consulta durante una falla o interrupción de la generación mensual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Nexo MUST generar automáticamente un reporte de vencimientos para cada mes siguiente
  durante el último día calendario del mes anterior, sin requerir que una persona inicie la generación.
- **FR-002**: El reporte MUST incluir los productos que cumplen la alerta vigente "Pronto a
  vencer" de la constitución: los 30 días calendario anteriores a la fecha efectiva cuando hay
  política de devolución, o los 30 días anteriores al vencimiento original cuando no hay política.
  La fecha efectiva o de vencimiento MUST quedar fuera de la ventana anticipada.
- **FR-003**: El reporte MUST usar como fecha de referencia el primer día del mes siguiente y la
  misma fecha de negocio configurada que usan los estados, alertas, panel e inventario; MUST NOT
  calcular una categoría de vencimiento independiente.
- **FR-004**: El reporte MUST mostrar como mínimo código y nombre del producto, política de
  devolución, fecha efectiva cuando corresponda, vencimiento original, estado calculado y días
  calendario restantes hasta la fecha relevante de alerta respecto de la fecha de negocio: la
  fecha efectiva con política de devolución o el vencimiento original sin política. Si el artículo
  está marcado como "Dañado", MUST mostrar esa condición separada del estado calculado.
- **FR-005**: Los productos sin fecha de vencimiento válida MUST NOT aparecer como próximos a
  vencer y MUST NOT recibir fechas, estados ni avisos inventados.
- **FR-006**: El reporte mensual MUST estar disponible dentro de Nexo únicamente para el
  Administrador, conforme a la matriz de permisos vigente.
- **FR-007**: El reporte MUST mostrar la fecha de negocio de la generación y distinguir entre un
  resultado vacío generado correctamente y una generación fallida.
- **FR-008**: Si la generación del mes falla, Nexo MUST comunicarlo y MUST NOT presentar un
  reporte anterior como si correspondiera al mes de referencia.
- **FR-009**: Si no hay productos en la ventana de alerta, Nexo MUST mostrar un resultado vacío
  con un mensaje claro.
- **FR-010**: Cada generación mensual MUST quedar registrada en la bitácora con mes y fecha de negocio,
  resultado y cantidad de productos incluidos, sin copiar innecesariamente todos los datos del
  reporte. Solo el Administrador puede consultar la bitácora.
- **FR-011**: Para un mismo mes de referencia, Nexo MUST presentar una sola generación vigente;
  una repetición MUST NOT crear reportes duplicados visibles.
- **FR-012**: Esta Spec cubre la consulta del reporte mensual dentro de Nexo. El envío automático
  por correo, SMS o notificación push, la descarga programada de archivos y la retención de un
  archivo histórico MUST NOT inferirse de esta función y requieren una decisión aprobada.
- **FR-013**: El reporte y sus mensajes MUST estar en español y poder consultarse con controles
  semánticos, navegación por teclado y foco visible.

### Key Entities *(include if feature involves data)*

- **Reporte mensual de vencimientos**: Resultado generado antes de cada mes con los
  productos dentro de la ventana vigente "Pronto a vencer".
- **Producto próximo a vencer**: Producto con vencimiento válido dentro de la ventana calculada
  desde su fecha efectiva o vencimiento original, según su política.
- **Resultado de generación**: Evidencia de fecha de negocio, estado de ejecución y cantidad de
  productos incluidos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El reporte se genera una vez por cada mes, durante el último día calendario del mes
  anterior, y muestra el mes y la fecha usados para calcular vencimientos y alertas.
- **SC-002**: El 100% de los productos en la ventana aprobada aparece una sola vez; ningún producto
  fuera de la ventana o sin vencimiento válido se presenta como próximo a vencer.
- **SC-003**: El 100% de los productos incluidos presenta fechas, días restantes y estado
  consistentes con las reglas de la constitución.
- **SC-004**: El 100% de las generaciones fallidas se identifica como no disponible y no se
  sustituye silenciosamente por datos anteriores.
- **SC-005**: El 100% de los intentos de consulta del reporte por un Usuario se deniega sin revelar
  datos del inventario.
- **SC-006**: El 100% de las generaciones, incluso vacías o fallidas, deja una evidencia de
  resultado y cantidad en la bitácora, sin duplicar todos los datos del reporte.

## Assumptions

- "Reporte anticipado" se refiere a productos próximos a vencer, no a un reporte de productos ya
  vencidos; los productos vencidos siguen visibles según sus estados en las vistas existentes.
- La ventana de anticipación es la ventana "Pronto a vencer" de 30 días ya aprobada en la
  constitución y la Spec 007.
- El Administrador es el único rol que consulta el reporte, en coherencia con la Spec 006 y la
  matriz de permisos de la Spec 005.
- El inventario se trabaja principalmente del día 1 al 15 de cada mes; el reporte se publica antes
  del inicio del mes para facilitar la toma de precauciones.
- El reporte se consulta dentro de Nexo; no se envía por canales externos ni se descarga
  automáticamente.
- La generación mensual usa la fecha de negocio configurada para Nexo. La zona horaria concreta se
  resuelve conforme a la configuración vigente del sistema.
- El reporte representa el inventario y reglas disponibles al cierre del mes anterior para
  anticipar el mes siguiente; no se presume que los cambios posteriores vuelvan a generar
  automáticamente otro reporte para ese mismo mes.
- Los datos y estados del reporte siguen la constitución y las Specs 000, 006 y 007.
