/**
 * TestClient wrapper for testing CocosClient
 * Provides convenience methods for testing and handles test-specific error cases
 */

import { CocosClient, type ClientConfig } from '../../src/lib/client.js';
import type { ApiResponse } from '../../src/types.js';

/**
 * Test client configuration with additional test-specific options
 */
export interface TestClientConfig extends ClientConfig {
  /**
   * Whether to throw on error responses (default: false)
   */
  throwOnError?: boolean;
  /**
   * Custom timeout for tests (default: 5000ms)
   */
  testTimeout?: number;
  /**
   * Mock mode - if true, client won't make actual HTTP requests
   */
  mockMode?: boolean;
  /**
   * Mock response handler for mock mode
   */
  mockHandler?: (module: string, action: string, params: unknown[]) => Promise<ApiResponse>;
}

/**
 * Test execution result with additional metadata
 */
export interface TestExecutionResult extends ApiResponse {
  /**
   * Module that was executed
   */
  module: string;
  /**
   * Action that was executed
   */
  action: string;
  /**
   * Parameters that were passed
   */
  params: unknown[];
  /**
   * Execution time in milliseconds
   */
  executionTime: number;
}

/**
 * TestClient wrapper class
 * Wraps CocosClient with test-specific functionality
 */
export class TestClient {
  private client: CocosClient;
  private config: TestClientConfig;
  private executionHistory: TestExecutionResult[] = [];

  constructor(config: TestClientConfig = {}) {
    this.config = {
      throwOnError: false,
      testTimeout: 5000,
      mockMode: false,
      validate: false, // Disable validation by default in tests
      ...config,
    };

    this.client = new CocosClient({
      baseUrl: this.config.baseUrl,
      timeout: this.config.testTimeout,
      validate: this.config.validate,
    });
  }

  /**
   * Execute a command and return detailed test result
   */
  async executeTest(
    module: string,
    action: string,
    params: unknown[] = []
  ): Promise<TestExecutionResult> {
    const startTime = Date.now();

    try {
      let result: ApiResponse;

      if (this.config.mockMode && this.config.mockHandler) {
        result = await this.config.mockHandler(module, action, params);
      } else {
        result = await this.client.execute(module, action, params, this.config.validate);
      }

      const executionTime = Date.now() - startTime;
      const testResult: TestExecutionResult = {
        ...result,
        module,
        action,
        params,
        executionTime,
      };

      this.executionHistory.push(testResult);

      if (this.config.throwOnError && !result.success) {
        throw new Error(result.error ?? 'Unknown error');
      }

      return testResult;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorResult: TestExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        module,
        action,
        params,
        executionTime,
      };

      this.executionHistory.push(errorResult);

      if (this.config.throwOnError) {
        throw error;
      }

      return errorResult;
    }
  }

  /**
   * Convenience method: Execute and assert success
   */
  async executeAndExpectSuccess(
    module: string,
    action: string,
    params: unknown[] = []
  ): Promise<TestExecutionResult> {
    const result = await this.executeTest(module, action, params);

    if (!result.success) {
      throw new Error(
        `Expected successful execution but got error: ${result.error}\n` +
          `Module: ${module}\n` +
          `Action: ${action}\n` +
          `Params: ${JSON.stringify(params)}`
      );
    }

    return result;
  }

  /**
   * Convenience method: Execute and assert error
   */
  async executeAndExpectError(
    module: string,
    action: string,
    params: unknown[] = [],
    expectedErrorMessage?: string
  ): Promise<TestExecutionResult> {
    const result = await this.executeTest(module, action, params);

    if (result.success) {
      throw new Error(
        `Expected error but got success\n` +
          `Module: ${module}\n` +
          `Action: ${action}\n` +
          `Params: ${JSON.stringify(params)}`
      );
    }

    if (expectedErrorMessage && !result.error?.includes(expectedErrorMessage)) {
      throw new Error(
        `Expected error message to include "${expectedErrorMessage}" but got "${result.error}"`
      );
    }

    return result;
  }

  /**
   * Convenience method: Execute and validate response data
   */
  async executeAndValidate<T>(
    module: string,
    action: string,
    params: unknown[] = [],
    validator: (data: T) => void | Promise<void>
  ): Promise<TestExecutionResult> {
    const result = await this.executeAndExpectSuccess(module, action, params);

    if (result.data !== undefined) {
      await validator(result.data as T);
    } else {
      throw new Error('Expected response data but got undefined');
    }

    return result;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(): TestExecutionResult[] {
    return [...this.executionHistory];
  }

  /**
   * Clear execution history
   */
  clearExecutionHistory(): void {
    this.executionHistory = [];
  }

  /**
   * Find executions by module/action
   */
  findExecutions(module: string, action?: string): TestExecutionResult[] {
    return this.executionHistory.filter(
      (result) => result.module === module && (action === undefined || result.action === action)
    );
  }

  /**
   * Get last execution
   */
  getLastExecution(): TestExecutionResult | undefined {
    return this.executionHistory[this.executionHistory.length - 1];
  }

  /**
   * Get execution statistics
   */
  getExecutionStats(): {
    total: number;
    successful: number;
    failed: number;
    averageExecutionTime: number;
  } {
    const total = this.executionHistory.length;
    const successful = this.executionHistory.filter((r) => r.success).length;
    const failed = total - successful;
    const totalTime = this.executionHistory.reduce((sum, r) => sum + r.executionTime, 0);
    const averageExecutionTime = total > 0 ? totalTime / total : 0;

    return {
      total,
      successful,
      failed,
      averageExecutionTime,
    };
  }

  /**
   * Get underlying CocosClient instance
   */
  getClient(): CocosClient {
    return this.client;
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.client.getBaseUrl();
  }

  /**
   * Get server info
   */
  getServerInfo(): { host: string; port: number } {
    return this.client.getServerInfo();
  }

  /**
   * Invalidate cache
   */
  invalidateCache(): void {
    this.client.invalidateCache();
  }

  /**
   * Reset the test client state
   */
  reset(): void {
    this.clearExecutionHistory();
  }

  /**
   * Destroy the test client and cleanup
   */
  async destroy(): Promise<void> {
    this.clearExecutionHistory();
    // No explicit cleanup needed for CocosClient currently
  }
}

/**
 * Create a test client with default test configuration
 */
export function createTestClient(config?: TestClientConfig): TestClient {
  return new TestClient(config);
}

/**
 * Create a mock test client that uses custom mock handler
 */
export function createMockClient(
  mockHandler: (module: string, action: string, params: unknown[]) => Promise<ApiResponse>,
  config?: Omit<TestClientConfig, 'mockMode' | 'mockHandler'>
): TestClient {
  return new TestClient({
    ...config,
    mockMode: true,
    mockHandler,
  });
}

/**
 * Helper to create a simple mock response handler
 */
export function createMockHandler(
  responses: Record<string, ApiResponse>
): (module: string, action: string, params: unknown[]) => Promise<ApiResponse> {
  return async (module: string, action: string) => {
    const key = `${module}.${action}`;
    const response = responses[key];

    if (response) {
      return response;
    }

    return {
      success: false,
      error: `No mock response found for: ${key}`,
    };
  };
}
