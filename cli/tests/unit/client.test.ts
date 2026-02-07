/**
 * Unit tests for CocosClient
 * Tests client initialization, configuration, and basic functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CocosClient, resetClient } from '../../src/lib/client.js';
import { createTestClient } from '../utils/test-client.js';

describe('CocosClient', () => {
  afterEach(() => {
    // Reset global client instance after each test
    resetClient();
  });

  describe('initialization', () => {
    it('should create client with default config', () => {
      // Note: The client will try to load from ~/.cocos-http/cocos-http.json
      // If that config exists, it will use that URL instead of the default
      // Use explicit baseUrl for predictable testing
      const client = new CocosClient({ baseUrl: 'http://127.0.0.1:54321' });
      expect(client).toBeDefined();
      expect(client.getBaseUrl()).toBe('http://127.0.0.1:54321');
    });

    it('should create client with custom base URL', () => {
      const client = new CocosClient({ baseUrl: 'http://localhost:8080' });
      expect(client.getBaseUrl()).toBe('http://localhost:8080');
    });

    it('should create client with custom timeout', () => {
      const client = new CocosClient({ timeout: 5000 });
      expect(client).toBeDefined();
    });

    it('should create client with validation disabled', () => {
      const client = new CocosClient({ validate: false });
      expect(client).toBeDefined();
    });

    it('should parse server info from base URL', () => {
      const client = new CocosClient({ baseUrl: 'http://localhost:8080' });
      const info = client.getServerInfo();
      expect(info.host).toBe('localhost');
      expect(info.port).toBe(8080);
    });
  });

  describe('methods', () => {
    it('should have healthCheck method', () => {
      const client = new CocosClient();
      expect(typeof client.healthCheck).toBe('function');
    });

    it('should have getStatus method', () => {
      const client = new CocosClient();
      expect(typeof client.getStatus).toBe('function');
    });

    it('should have getModules method', () => {
      const client = new CocosClient();
      expect(typeof client.getModules).toBe('function');
    });

    it('should have getModuleActions method', () => {
      const client = new CocosClient();
      expect(typeof client.getModuleActions).toBe('function');
    });

    it('should have execute method', () => {
      const client = new CocosClient();
      expect(typeof client.execute).toBe('function');
    });

    it('should have invalidateCache method', () => {
      const client = new CocosClient();
      expect(typeof client.invalidateCache).toBe('function');
    });

    it('should have getBaseUrl method', () => {
      const client = new CocosClient();
      expect(typeof client.getBaseUrl).toBe('function');
    });

    it('should have getServerInfo method', () => {
      const client = new CocosClient();
      expect(typeof client.getServerInfo).toBe('function');
    });
  });
});

describe('TestClient', () => {
  describe('initialization', () => {
    it('should create test client with default config', () => {
      // Note: The client will try to load from ~/.cocos-http/cocos-http.json
      // Use explicit baseUrl for predictable testing
      const client = createTestClient({ baseUrl: 'http://127.0.0.1:54321' });
      expect(client).toBeDefined();
      expect(client.getBaseUrl()).toBe('http://127.0.0.1:54321');
    });

    it('should create test client with custom config', () => {
      const client = createTestClient({
        baseUrl: 'http://localhost:8080',
        testTimeout: 3000,
        throwOnError: true,
      });
      expect(client).toBeDefined();
      expect(client.getBaseUrl()).toBe('http://localhost:8080');
    });
  });

  describe('execution history', () => {
    it('should track execution history', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      await client.executeTest('scene', 'save-scene', []);

      const history = client.getExecutionHistory();
      expect(history).toHaveLength(2);
      expect(history[0].module).toBe('scene');
      expect(history[0].action).toBe('open-scene');
      expect(history[1].action).toBe('save-scene');
    });

    it('should clear execution history', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      client.clearExecutionHistory();

      const history = client.getExecutionHistory();
      expect(history).toHaveLength(0);
    });

    it('should get last execution', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      await client.executeTest('scene', 'save-scene', []);

      const lastExecution = client.getLastExecution();
      expect(lastExecution?.action).toBe('save-scene');
    });

    it('should find executions by module and action', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      await client.executeTest('scene', 'save-scene', []);
      await client.executeTest('asset-db', 'query-ready', []);

      const sceneExecutions = client.findExecutions('scene');
      expect(sceneExecutions).toHaveLength(2);

      const saveExecutions = client.findExecutions('scene', 'save-scene');
      expect(saveExecutions).toHaveLength(1);
    });
  });

  describe('execution statistics', () => {
    it('should calculate execution stats', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        baseUrl: 'http://127.0.0.1:54321',
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      await client.executeTest('scene', 'save-scene', []);

      const stats = client.getExecutionStats();
      expect(stats.total).toBe(2);
      expect(stats.successful).toBe(2);
      expect(stats.failed).toBe(0);
      // Note: In mock mode, execution time may be 0 for synchronous operations
      expect(stats.averageExecutionTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('convenience methods', () => {
    it('should execute and expect success', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      const result = await client.executeAndExpectSuccess('scene', 'open-scene', [
        'db://assets/Test.scene',
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ result: 'ok' });
    });

    it('should throw when expecting success but getting error', async () => {
      const mockHandler = async () => ({ success: false, error: 'Test error' });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
        throwOnError: false,
      });

      await expect(
        client.executeAndExpectSuccess('scene', 'open-scene', ['db://assets/Test.scene'])
      ).rejects.toThrow('Expected successful execution');
    });

    it('should execute and expect error', async () => {
      const mockHandler = async () => ({ success: false, error: 'Test error' });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
        throwOnError: false,
      });

      const result = await client.executeAndExpectError('scene', 'open-scene', [
        'db://assets/Test.scene',
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
    });

    it('should throw when expecting error but getting success', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
        throwOnError: false,
      });

      await expect(
        client.executeAndExpectError('scene', 'open-scene', ['db://assets/Test.scene'])
      ).rejects.toThrow('Expected error but got success');
    });

    it('should execute and validate data', async () => {
      const mockHandler = async () => ({
        success: true,
        data: { result: 'ok', value: 42 },
      });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      const result = await client.executeAndValidate('scene', 'open-scene', ['db://assets/Test.scene'], (data) => {
        expect(data).toEqual({ result: 'ok', value: 42 });
      });

      expect(result.success).toBe(true);
    });
  });

  describe('reset and destroy', () => {
    it('should reset client state', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      client.reset();

      expect(client.getExecutionHistory()).toHaveLength(0);
    });

    it('should destroy client', async () => {
      const mockHandler = async () => ({ success: true, data: { result: 'ok' } });
      const client = createTestClient({
        mockMode: true,
        mockHandler,
      });

      await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);
      await client.destroy();

      expect(client.getExecutionHistory()).toHaveLength(0);
    });
  });
});
