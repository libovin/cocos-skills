/**
 * Unit tests for request processing pipeline
 * Tests for request preprocessing logic management
 */

import { describe, it, expect, vi } from 'vitest';
import {
  processRequest,
  hasPreprocessor,
  registerPreprocessor,
  getRegisteredPreprocessors,
} from '../../../src/lib/pipeline/index.js';
import { initPipeline } from '../../../src/lib/init-pipeline.js';
import type { CocosClient } from '../../../src/lib/client.js';

// Initialize pipeline before tests
initPipeline();

describe('request processing pipeline', () => {
  describe('hasPreprocessor', () => {
    it('should return true for asset-db:create-asset', () => {
      expect(hasPreprocessor('asset-db', 'create-asset')).toBe(true);
    });

    it('should return true for scene:create-node', () => {
      expect(hasPreprocessor('scene', 'create-node')).toBe(true);
    });

    it('should return true for scene:set-parent', () => {
      expect(hasPreprocessor('scene', 'set-parent')).toBe(true);
    });

    it('should return false for unknown module/action', () => {
      expect(hasPreprocessor('unknown', 'unknown')).toBe(false);
    });

    it('should return false for known module but unknown action', () => {
      expect(hasPreprocessor('asset-db', 'unknown')).toBe(false);
    });
  });

  describe('getRegisteredPreprocessors', () => {
    it('should return list of registered preprocessors', () => {
      const preprocessors = getRegisteredPreprocessors();
      expect(preprocessors).toContain('asset-db:create-asset');
      expect(preprocessors).toContain('scene:create-node');
      expect(preprocessors).toContain('scene:set-parent');
      expect(preprocessors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('processRequest for asset-db:create-asset', () => {
    it('should generate default data when only path is provided', async () => {
      const mockClient = {
        _request: vi.fn(),
      } as unknown as CocosClient;

      const result = await processRequest(
        'asset-db',
        'create-asset',
        ['db://assets/test.json'],
        mockClient
      );

      expect(result.params).toHaveLength(2);
      expect(result.params[0]).toBe('db://assets/test.json');
      expect(typeof result.params[1]).toBe('string');
      expect(result.postprocessor).toBeUndefined();
    });

    it('should not modify params when data is already provided', async () => {
      const mockClient = {
        _request: vi.fn(),
      } as unknown as CocosClient;

      const customData = { key: 'value' };
      const result = await processRequest(
        'asset-db',
        'create-asset',
        ['db://assets/test.json', customData],
        mockClient
      );

      expect(result.params).toHaveLength(2);
      expect(result.params[0]).toBe('db://assets/test.json');
      expect(result.params[1]).toEqual(customData);
      expect(result.postprocessor).toBeUndefined();
    });
  });

  describe('processRequest for scene:create-node', () => {
    it('should return nodeParams without components when type is not specified', async () => {
      const mockClient = {
        _request: vi.fn(),
      } as unknown as CocosClient;

      const result = await processRequest(
        'scene',
        'create-node',
        [{ name: 'TestNode', parent: 'Canvas' }],
        mockClient
      );

      expect(result.params).toEqual([{ name: 'TestNode', parent: 'Canvas' }]);
      expect(result.postprocessor).toBeUndefined();
    });

    it('should return nodeParams and postprocessor when type is specified', async () => {
      const mockClient = {
        _request: vi.fn(),
      } as unknown as CocosClient;

      const result = await processRequest(
        'scene',
        'create-node',
        [{ type: 'cc.Canvas', name: 'MyCanvas' }],
        mockClient
      );

      expect(result.params).toEqual([{ name: 'MyCanvas' }]);
      expect(result.postprocessor).toBeDefined();
      expect(typeof result.postprocessor).toBe('function');
    });
  });

  describe('processRequest for unknown actions', () => {
    it('should return params unchanged when no preprocessor exists', async () => {
      const mockClient = {
        _request: vi.fn(),
      } as unknown as CocosClient;

      const params = ['param1', 'param2'];
      const result = await processRequest('unknown', 'unknown', params, mockClient);

      expect(result.params).toEqual(params);
      expect(result.postprocessor).toBeUndefined();
    });
  });

  describe('registerPreprocessor', () => {
    it('should allow registering custom preprocessors', async () => {
      const mockClient = {
        _request: vi.fn(),
      } as unknown as CocosClient;

      const customPreprocessor = vi.fn().mockResolvedValue({
        params: ['modified'],
      });

      registerPreprocessor('custom', 'action', customPreprocessor);

      expect(hasPreprocessor('custom', 'action')).toBe(true);

      const result = await processRequest('custom', 'action', ['original'], mockClient);

      expect(customPreprocessor).toHaveBeenCalledWith(['original'], mockClient);
      expect(result.params).toEqual(['modified']);
    });
  });
});
