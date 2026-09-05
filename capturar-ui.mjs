// Script auxiliar (no es parte del test suite): abre la app real con Playwright,
// registra un par de acciones y toma una captura real de la tabla resultante.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';

const server = spawn('node', ['server.js'], { stdio: 'inherit', env: { ...process.env, PORT: '3014' } });
await new Promise(r => setTimeout(r, 1200));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 700, height: 500 } });
await page.goto('http://localhost:3014/');

await page.fill('#usuario', 'Walter Salas');
await page.fill('#accion', 'Creó usuario');
await page.fill('#modulo', 'Usuarios');
await page.fill('#detalle', 'Nuevo usuario: nueva.admin');
await page.click('#btn-registrar');

await page.fill('#usuario', 'Angel Vargas');
await page.fill('#accion', 'Registró nuevo lote');
await page.fill('#modulo', 'Medicamentos');
await page.fill('#detalle', 'Lote L-2026-001 de Paracetamol');
await page.click('#btn-registrar');

await page.waitForSelector('#tabla-historial');
await page.screenshot({ path: 'evidencia/playwright-ui.png' });

await browser.close();
server.kill();
console.log('Captura guardada: evidencia/playwright-ui.png');
process.exit(0);
