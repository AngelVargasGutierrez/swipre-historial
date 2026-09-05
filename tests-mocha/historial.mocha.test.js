// Mismas pruebas de RF-003, reescritas con Mocha (test runner) + Chai (aserciones)
// como quinta herramienta de pruebas, independiente de Vitest.
import { expect } from 'chai';
import { registrarAccion, getHistorial, __reset } from '../src/reporteModel.js';

beforeEach(() => {
  __reset();
});

describe('CP-03-01 - Visualización correcta del historial de acciones de usuarios (Mocha + Chai)', () => {
  it('retorna un arreglo vacío cuando no hay acciones', () => {
    expect(getHistorial()).to.deep.equal([]);
  });

  it('muestra la acción más reciente primero', () => {
    registrarAccion('Walter Salas', 'Creó usuario', 'Usuarios', 'nueva.admin');
    registrarAccion('Angel Vargas', 'Registró lote', 'Medicamentos', 'L-01');
    const historial = getHistorial();
    expect(historial[0].usuario).to.equal('Angel Vargas');
  });
});

describe('CP-03-03 - Consistencia de datos entre operaciones ejecutadas y registros de auditoría (Mocha + Chai)', () => {
  it('3 operaciones = 3 registros, sin duplicados ni omisiones', () => {
    registrarAccion('A', 'a1', 'm', 'd1');
    registrarAccion('B', 'a2', 'm', 'd2');
    registrarAccion('C', 'a3', 'm', 'd3');
    expect(getHistorial()).to.have.lengthOf(3);
  });
});
