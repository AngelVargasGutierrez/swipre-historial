# swipre-historial

Proyecto aislado para probar **RF-003 (Visualizar historial de acciones)** del sistema MOPGIMED/SIPGIMED, sin depender de la base de datos ni del backend completo.

Reproduce la lógica real de `backend/models/reporteModel.js` (registrarAccion / getHistorial) del proyecto principal, sobre datos en memoria.

## Casos de prueba cubiertos

- **CP-03-01** (éxito): el historial muestra la acción más reciente primero, con usuario/acción/módulo/detalle; historial vacío al no haber acciones aún.
- **CP-03-02** (error/edge, Prueba Unitaria): registro automático al detectar una operación; respeta el límite de 20 registros más recientes.
- **CP-03-03** (aceptación): cada operación real ejecutada aparece exactamente una vez en el historial, sin duplicados ni omisiones.

## Cómo ejecutar

```bash
npm install
npm test
```
