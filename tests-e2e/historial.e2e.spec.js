import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/api/__reset');
});

test.describe('CP-03-01 - Visualización correcta del historial de acciones de usuarios (E2E, navegador real)', () => {
  test('muestra "No hay acciones registradas" cuando el historial está vacío (Flujo Alterno)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#vacio')).toBeVisible();
    await expect(page.locator('#tabla-historial')).toBeHidden();
  });

  test('registra una acción desde el formulario real y la muestra en la tabla, más reciente primero', async ({ page }) => {
    await page.goto('/');
    await page.fill('#usuario', 'Walter Salas');
    await page.fill('#accion', 'Creó usuario');
    await page.fill('#modulo', 'Usuarios');
    await page.fill('#detalle', 'Nuevo usuario: nueva.admin');
    await page.click('#btn-registrar');

    await expect(page.locator('#tabla-historial')).toBeVisible();
    const primeraFila = page.locator('#tabla-body tr').first();
    await expect(primeraFila).toContainText('Walter Salas');
    await expect(primeraFila).toContainText('Creó usuario');

    // Registra una segunda accion y confirma que pasa a ser la primera de la tabla.
    await page.fill('#usuario', 'Angel Vargas');
    await page.fill('#accion', 'Registró nuevo lote');
    await page.fill('#modulo', 'Medicamentos');
    await page.fill('#detalle', 'Lote L-2026-001');
    await page.click('#btn-registrar');

    await expect(page.locator('#tabla-body tr').first()).toContainText('Angel Vargas');
  });
});

test.describe('CP-03-02 - Registro automático de auditoría al modificar entidades (E2E, navegador real)', () => {
  test('la acción registrada aparece automáticamente sin recargar la página manualmente', async ({ page }) => {
    await page.goto('/');
    await page.fill('#usuario', 'Ana Torres');
    await page.fill('#accion', 'Activó usuario');
    await page.fill('#modulo', 'Usuarios');
    await page.fill('#detalle', 'Reactivó a usuario.deshabilitado');
    await page.click('#btn-registrar');

    await expect(page.locator('#tabla-body tr')).toHaveCount(1);
  });
});
