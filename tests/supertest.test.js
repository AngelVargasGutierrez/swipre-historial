// Pruebas de API con Supertest: llama directamente al objeto Express (`app`),
// sin necesidad de levantar el servidor en un puerto real.
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

beforeEach(async () => {
  await request(app).post('/api/__reset');
});

describe('CP-03-01 - Visualización correcta del historial de acciones de usuarios (Supertest)', () => {
  it('GET /api/historial responde 200 con arreglo vacío al inicio', async () => {
    const res = await request(app).get('/api/historial');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/historial registra y GET /api/historial lo devuelve más reciente primero', async () => {
    await request(app).post('/api/historial').send({ usuario: 'Walter Salas', accion: 'Creó usuario', modulo: 'Usuarios', detalle: 'nueva.admin' });
    await request(app).post('/api/historial').send({ usuario: 'Angel Vargas', accion: 'Registró lote', modulo: 'Medicamentos', detalle: 'L-01' });
    const res = await request(app).get('/api/historial');
    expect(res.body).toHaveLength(2);
    expect(res.body[0].usuario).toBe('Angel Vargas');
  });
});

describe('CP-03-03 - Consistencia de datos entre operaciones ejecutadas y registros de auditoría (Supertest)', () => {
  it('3 registros creados = 3 registros devueltos, sin duplicados', async () => {
    await request(app).post('/api/historial').send({ usuario: 'A', accion: 'a1', modulo: 'm', detalle: 'd1' });
    await request(app).post('/api/historial').send({ usuario: 'B', accion: 'a2', modulo: 'm', detalle: 'd2' });
    await request(app).post('/api/historial').send({ usuario: 'C', accion: 'a3', modulo: 'm', detalle: 'd3' });
    const res = await request(app).get('/api/historial');
    expect(res.body).toHaveLength(3);
  });
});
