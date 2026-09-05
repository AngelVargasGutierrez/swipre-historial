// Servidor minimo que expone la logica real (reporteModel.js) como API HTTP,
// para poder probarla en un navegador real con Playwright (CP-03-01, CP-03-02).
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registrarAccion, getHistorial, __reset } from './src/reporteModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/historial', (req, res) => {
  res.json(getHistorial());
});

app.post('/api/historial', (req, res) => {
  const { usuario, accion, modulo, detalle } = req.body || {};
  registrarAccion(usuario, accion, modulo, detalle);
  res.status(201).json({ ok: true });
});

app.post('/api/__reset', (req, res) => {
  __reset();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3013;
app.listen(PORT, () => console.log(`swipre-historial escuchando en http://localhost:${PORT}`));
