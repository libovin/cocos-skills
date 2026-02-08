/**
 * Unit tests for preprocessor-manager
 * Tests for request preprocessing logic management
 */

import { describe, it, expect, vi } from 'vitest';
import {
  preprocessRequest,
  hasPreprocessor,
  registerPreprocessor,
  getRegisteredPreprocessors,
} from '../../../src/lib/preprocessor-manager.js';
import type { ApiResponse } from '../../../src/types.js';

describe('preprocessor-manager', () => {
  describe('hasPreprocessor', () => {
    it('should return true for asset-db:create-asset', () => {
      expect(hasPreprocessor('asset-db', 'create-asset')).toBe(true);
    });

    it('should return true for scene:create-node', () => {
      expect(hasPreprocessor('scene', 'create-node')).toBe(true);
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
      expect(preprocessors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('preprocessRequest for asset-db:create-asset', () => {
    it('should generate default data when only path is provided', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const result = await preprocessRequest(
        'asset-db',
        'create-asset',
        ['db://assets/test.json'],
        mockClient
      );

      expect(result.params).toHaveLength(2);
      expect(result.params[0]).toBe('db://assets/test.json');
      expect(typeof result.params[1]).toBe('string');
      expect(result.postProcess).toBeUndefined();
    });

    it('should not modify params when data is already provided', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const customData = { key: 'value' };
      const result = await preprocessRequest(
        'asset-db',
        'create-asset',
        ['db://assets/test.json', JSON.stringify(customData)],
        mockClient
      );

      expect(result.params).toHaveLength(2);
      expect(result.params[0]).toBe('db://assets/test.json');
      expect(result.params[1]).toBe(JSON.stringify(customData));
      expect(result.postProcess).toBeUndefined();
    });
  });

  describe('preprocessRequest for scene:create-node', () => {
    it('should return nodeParams without components when type is not specified', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const result = await preprocessRequest(
        'scene',
        'create-node',
        [{ name: 'TestNode', parent: 'Canvas' }],
        mockClient
      );

      expect(result.params).toEqual([{ name: 'TestNode', parent: 'Canvas' }]);
      expect(result.postProcess).toBeUndefined();
    });

    it('should return nodeParams and postProcess when type is specified', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const result = await preprocessRequest(
        'scene',
        'create-node',
        [{ type: 'cc.Canvas', name: 'MyCanvas' }],
        mockClient
      );

      expect(result.params).toEqual([{ name: 'MyCanvas' }]);
      expect(result.postProcess).toBeDefined();
      expect(typeof result.postProcess).toBe('function');
    });

    it('should add components via postProcess when type is cc.Canvas', async () => {
      const mockClient = {
        _request: vi.fn()
          .mockResolvedValueOnce({ success: true })
          .mockResolvedValueOnce({ success: true })
          .mockResolvedValueOnce({ success: true }),
      };

      const result = await preprocessRequest(
        'scene',
        'create-node',
        [{ type: 'cc.Canvas' }],
        mockClient
      );

      const mockApiResponse: ApiResponse = {
        success: true,
        data: { uuid: 'test-uuid-123' },
      };

      const processedResult = await result.postProcess!(mockApiResponse);

      expect(mockClient._request).toHaveBeenCalledTimes(3);
      expect(mockClient._request).toHaveBeenCalledWith('POST', '/api/scene/create-component', {
        params: [{ uuid: 'test-uuid-123', component: 'cc.UITransform' }],
      });
      expect(mockClient._request).toHaveBeenCalledWith('POST', '/api/scene/create-component', {
        params: [{ uuid: 'test-uuid-123', component: 'cc.Canvas' }],
      });
      expect(mockClient._request).toHaveBeenCalledWith('POST', '/api/scene/create-component', {
        params: [{ uuid: 'test-uuid-123', component: 'cc.Widget' }],
      });
      expect(processedResult.data?.components).toEqual(['cc.UITransform', 'cc.Canvas', 'cc.Widget']);
    });

    it('should not add components when node creation fails', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const result = await preprocessRequest(
        'scene',
        'create-node',
        [{ type: 'cc.Canvas' }],
        mockClient
      );

      const mockApiResponse: ApiResponse = {
        success: false,
        error: 'Node creation failed',
      };

      const processedResult = await result.postProcess!(mockApiResponse);

      expect(mockClient._request).not.toHaveBeenCalled();
      expect(processedResult).toEqual(mockApiResponse);
    });

    it('should not add components or children when node has no uuid', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const result = await preprocessRequest(
        'scene',
        'create-node',
        [{ type: 'cc.Canvas' }],
        mockClient
      );

      const mockApiResponse: ApiResponse = {
        success: true,
        data: {},
      };

      const processedResult = await result.postProcess!(mockApiResponse);

      expect(mockClient._request).not.toHaveBeenCalled();
      expect(processedResult).toEqual(mockApiResponse);
    });

    it('should handle component addition failures gracefully', async () => {
      const mockClient = {
        _request: vi.fn()
          .mockResolvedValueOnce({ success: true })
          .mockResolvedValueOnce({ success: false })
          .mockResolvedValueOnce({ success: true }),
      };

      const result = await preprocessRequest(
        'scene',
        'create-node',
        [{ type: 'cc.Canvas' }],
        mockClient
      );

      const mockApiResponse: ApiResponse = {
        success: true,
        data: { uuid: 'test-uuid-123' },
      };

      const processedResult = await result.postProcess!(mockApiResponse);

      expect(mockClient._request).toHaveBeenCalledTimes(3);
      expect(processedResult.data?.components).toEqual(['cc.UITransform', 'cc.Widget']);
    });
  });

  describe('preprocessRequest for unknown actions', () => {
    it('should return params unchanged when no preprocessor exists', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const params = ['param1', 'param2'];
      const result = await preprocessRequest('unknown', 'unknown', params, mockClient);

      expect(result.params).toEqual(params);
      expect(result.postProcess).toBeUndefined();
    });
  });

  describe('registerPreprocessor', () => {
    it('should allow registering custom preprocessors', async () => {
      const mockClient = {
        _request: vi.fn(),
      };

      const customPreprocessor = vi.fn().mockReturnValue({
        params: ['modified'],
        postProcess: undefined,
      });

      registerPreprocessor('custom', 'action', customPreprocessor);

      expect(hasPreprocessor('custom', 'action')).toBe(true);

      const result = await preprocessRequest('custom', 'action', ['original'], mockClient);

      expect(customPreprocessor).toHaveBeenCalledWith('custom', 'action', ['original'], mockClient);
      expect(result.params).toEqual(['modified']);
    });
  });
});
