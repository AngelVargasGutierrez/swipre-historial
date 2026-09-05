// Version aislada del modelo real: backend/models/reporteModel.js
// La consulta SQL original es:
//   INSERT INTO historial_acciones (fecha, usuario, accion, modulo, detalle) VALUES (?,?,?,?,?)
//   SELECT fecha, usuario, accion, modulo, detalle FROM historial_acciones ORDER BY id DESC LIMIT 20
// Aqui se reproduce el mismo comportamiento sobre un arreglo en memoria.

let HISTORIAL = [];
let nextId = 1;

function registrarAccion(usuario, accion, modulo, detalle) {
  const fecha = new Date().toISOString();
  HISTORIAL.push({ id: nextId++, fecha, usuario, accion, modulo, detalle });
}

function getHistorial() {
  // Misma logica que "ORDER BY id DESC LIMIT 20": mas reciente primero, maximo 20.
  return [...HISTORIAL]
    .sort((a, b) => b.id - a.id)
    .slice(0, 20)
    .map(({ fecha, usuario, accion, modulo, detalle }) => ({ fecha, usuario, accion, modulo, detalle }));
}

function __reset() {
  HISTORIAL = [];
  nextId = 1;
}

export { registrarAccion, getHistorial, __reset };
