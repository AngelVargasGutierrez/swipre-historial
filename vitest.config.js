import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Excluye las especificaciones de Playwright (tests-e2e/) para que Vitest
    // no intente ejecutarlas como si fueran suyas.
    exclude: ['**/node_modules/**', 'tests-e2e/**'],
  },
});
