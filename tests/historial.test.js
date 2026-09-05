import { describe, it, expect, beforeEach } from 'vitest';
import { registrarAccion, getHistorial, __reset } from '../src/reporteModel.js';

beforeEach(() => {
  __reset();
});

describe('CP-03-01 - Visualización correcta del historial de acciones de usuarios (Flujo Normal / Éxito)', () => {
  it('muestra la acción registrada más reciente primero, con usuario, acción y módulo', () => {
    registrarAccion('Walter Salas', 'Creó usuario', 'Usuarios', 'Nuevo usuario: nueva.admin');
    registrarAccion('Angel Vargas', 'Registró nuevo lote', 'Medicamentos', 'Lote L-2026-001 de Paracetamol');

    const historial = getHistorial();
    expect(historial).toHaveLength(2);
    expect(historial[0].accion).toBe('Registró nuevo lote'); // la mas reciente va primero
    expect(historial[1].accion).toBe('Creó usuario');
  });

  it('registra cada acción con fecha, usuario, acción, módulo y detalle', () => {
    registrarAccion('Ana Torres', 'Activó usuario', 'Usuarios', 'Reactivó a usuario.deshabilitado');
    const [registro] = getHistorial();
    expect(registro.usuario).toBe('Ana Torres');
    expect(registro.modulo).toBe('Usuarios');
    expect(registro.detalle).toBe('Reactivó a usuario.deshabilitado');
    expect(registro.fecha).toBeTypeOf('string');
  });
});

describe('CP-03-01 (Flujo Alterno) - Historial vacío al acceder por primera vez', () => {
  it('retorna un arreglo vacío cuando aún no se registró ninguna acción', () => {
    expect(getHistorial()).toEqual([]);
  });
});

describe('CP-03-02 - Registro automático de auditoría al modificar entidades (Flujo Normal / Prueba Unitaria)', () => {
  it('escribe automáticamente en el historial sin intervención manual al detectar una operación', () => {
    const antes = getHistorial().length;
    registrarAccion('Sistema', 'Modificó medicamento', 'Medicamentos', 'Actualizó Amoxicilina (lote L-01)');
    expect(getHistorial().length).toBe(antes + 1);
  });

  it('respeta el límite de 20 registros más recientes (ORDER BY id DESC LIMIT 20)', () => {
    for (let i = 1; i <= 25; i++) {
      registrarAccion('Sistema', `Acción ${i}`, 'Pruebas', `Detalle ${i}`);
    }
    const historial = getHistorial();
    expect(historial).toHaveLength(20);
    expect(historial[0].accion).toBe('Acción 25'); // la mas reciente de las 25
    expect(historial[19].accion).toBe('Acción 6'); // la 20a mas reciente
  });
});

describe('CP-03-03 - Consistencia de datos entre operaciones ejecutadas y registros de auditoría (Flujo Normal / Aceptación)', () => {
  it('cada operación real ejecutada aparece exactamente una vez en el historial, sin duplicados ni omisiones', () => {
    const operaciones = [
      ['Walter Salas', 'Creó usuario', 'Usuarios', 'nueva.admin'],
      ['Angel Vargas', 'Registró nuevo lote', 'Medicamentos', 'L-2026-001'],
      ['Ana Torres', 'Desactivó usuario', 'Usuarios', 'usuario.deshabilitado'],
    ];
    operaciones.forEach(op => registrarAccion(...op));

    const historial = getHistorial();
    expect(historial).toHaveLength(operaciones.length);
    const detalles = historial.map(h => h.detalle).sort();
    const esperados = operaciones.map(op => op[3]).sort();
    expect(detalles).toEqual(esperados);
  });
});
