/**
 * Vitest configuration for cocos-skills unit and integration tests
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['cli/tests/**/*.test.ts'],
    exclude: ['node_modules', 'cli/dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['cli/src/**/*.ts'],
      exclude: ['cli/src/types.ts', 'cli/src/**/*.test.ts'],
    },
    // Use Node16 ESM module resolution
    resolveSnapshotPath: (path, extension) => {
      return path + extension;
    },
  },
  resolve: {
    alias: {
      '@': new URL('./cli/src', import.meta.url).pathname,
    },
  },
});
