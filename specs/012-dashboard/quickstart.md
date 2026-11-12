# Quickstart de validación: Spec 012

## Prerrequisitos

- Productos con los cuatro estados, alertas, condición `Dañado`, `On hand`, `Saldo` y fechas
  válidas e inválidas.
- Una cuenta Administrador y una cuenta Usuario según Spec 005.
- Reporte mensual 011 en estados `GENERADO`, `VACIO` y `FALLIDO`.

## Escenarios

1. Abrir el dashboard como Usuario. Confirmar fecha de negocio y conteos de los cuatro estados.
2. Confirmar que `Pronto a vencer` y `Dañado` aparecen separados de estados.
3. Seleccionar cada indicador. Confirmar que la prioridad contiene solo sus productos y que
   vencimientos se ordenan por fecha relevante ascendente.
4. Confirmar que productos sin fecha válida no aparecen en prioridades de vencimiento.
5. Pulsar el botón visible de actualización. Confirmar estado de carga y reemplazo del resultado
   cuando la consulta tiene éxito.
6. Simular error durante actualización. Confirmar que se conserva el resultado anterior y se
   muestra un error en español.
7. Consultar como Administrador. Confirmar resumen del reporte mensual generado, vacío y fallido.
8. Consultar como Usuario una ruta administrativa. Confirmar `403` sin datos administrativos.
9. Usar teclado para navegar indicadores, botón de actualización y lista; confirmar foco visible.

## Checks

```powershell
npm install
npm run lint
npm run build
```

Validación ejecutada: `npm run lint` y `npm run build` completados correctamente en backend,
frontend y contratos.

Los campos y reglas esperados están en `data-model.md`; las formas y respuestas en
`contracts/dashboard-contract.md`.
