/**
 * Vitest setup file
 * Configures global test environment and utilities
 */

import { vi } from 'vitest';

/**
 * Mock console methods to reduce noise in tests
 * Uncomment these if you want to suppress console output during tests
 */
// global.console = {
//   ...console,
//   log: vi.fn(),
//   debug: vi.fn(),
//   info: vi.fn(),
//   warn: vi.fn(),
//   error: vi.fn(),
// };

/**
 * Setup function called before each test
 */
beforeEach(() => {
  // Reset any global state before each test
  vi.clearAllMocks();
});

/**
 * Teardown function called after each test
 */
afterEach(() => {
  // Cleanup after each test
  vi.restoreAllMocks();
});

/**
 * Global test utilities
 */
global.testUtils = {
  /**
   * Wait for a specified number of milliseconds
   */
  wait: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Create a mock fetch response
   */
  createMockResponse: <T>(data: T, ok = true): Response => {
    return {
      ok,
      status: ok ? 200 : 400,
      json: async () => data,
      text: async () => JSON.stringify(data),
    } as Response;
  },
};

declare global {
  namespace globalThis {
    const testUtils: {
      wait: (ms: number) => Promise<void>;
      createMockResponse: <T>(data: T, ok?: boolean) => Response;
    };
  }
}
