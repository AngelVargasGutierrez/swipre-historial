async function cargarHistorial() {
  const resp = await fetch('/api/historial');
  const historial = await resp.json();

  const tabla = document.getElementById('tabla-historial');
  const vacio = document.getElementById('vacio');
  const body = document.getElementById('tabla-body');

  if (historial.length === 0) {
    tabla.hidden = true;
    vacio.hidden = false;
    return;
  }

  vacio.hidden = true;
  tabla.hidden = false;
  body.innerHTML = historial.map(h =>
    `<tr><td>${h.usuario}</td><td>${h.accion}</td><td>${h.modulo}</td><td>${h.detalle}</td></tr>`
  ).join('');
}

document.getElementById('form-accion').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    usuario: document.getElementById('usuario').value,
    accion: document.getElementById('accion').value,
    modulo: document.getElementById('modulo').value,
    detalle: document.getElementById('detalle').value,
  };
  await fetch('/api/historial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await cargarHistorial();
});

cargarHistorial();
