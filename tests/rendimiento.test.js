import { describe, it, expect } from 'vitest';
import { registrarAccion, getHistorial, __reset } from '../src/reporteModel.js';

describe('No Funcional (RNF-002 Rendimiento) - RF-003: Tiempo de registro y consulta del historial', () => {
  it('registrar 100 acciones y consultar el historial se resuelve en menos de 3 segundos en total', () => {
    __reset();
    const inicio = Date.now();
    for (let i = 0; i < 100; i++) {
      registrarAccion('Sistema', `Acción ${i}`, 'Pruebas', `Detalle ${i}`);
    }
    getHistorial();
    const duracionMs = Date.now() - inicio;
    expect(duracionMs).toBeLessThan(3000);
  });
});
