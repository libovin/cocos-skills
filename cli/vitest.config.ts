/**
 * Vitest configuration for cocos-skills CLI
 * Configured for Node16 ESM modules with TypeScript support
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['cli/tests/**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'cli/dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'cli/dist/',
        'cli/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mock*',
        '**/fixture*',
      ],
    },
    setupFiles: ['./cli/tests/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': '/cli/src',
      '@test': '/cli/tests',
    },
  },
});
