import { describe, it, expect } from 'vitest';
import { registrarAccion, getHistorial, __reset } from '../src/reporteModel.js';

describe('Integración - RF-003: Registro + Consulta de historial (escritura y lectura)', () => {
  it('cada acción registrada por registrarAccion aparece de inmediato al consultarla con getHistorial', () => {
    __reset();
    registrarAccion('Walter Salas', 'Creó usuario', 'Usuarios', 'integracion.rf003');
    const historial = getHistorial();
    expect(historial).toHaveLength(1);
    expect(historial[0].detalle).toBe('integracion.rf003');
  });
});
