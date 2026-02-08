/**
 * Integration tests for create-node with children
 * Tests for creating nodes with child nodes via type parameter
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';
import { initPipeline } from '../../../src/lib/init-pipeline.js';

// Initialize pipeline before tests
initPipeline();

describe('create-node with children integration', () => {
  let client: CocosClient;
  let mockRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockRequest = vi.fn();
    client = new CocosClient({ baseUrl: 'http://localhost:9876' });
    (client as any)._request = mockRequest;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('cc.Canvas type', () => {
    it('should create Canvas with Camera child', async () => {
      mockRequest
        .mockResolvedValueOnce({
          success: true,
          data: { uuid: 'canvas-uuid' },
        })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({
          success: true,
          data: { uuid: 'camera-uuid' },
        })
        .mockResolvedValueOnce({ success: true });

      const result = await client.execute('scene', 'create-node', [
        { type: 'cc.Canvas', name: 'MyCanvas' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data?.uuid).toBe('canvas-uuid');
      expect(result.data?.components).toEqual(['cc.Canvas', 'cc.Widget']);
      expect(result.data?.children).toEqual([{ type: 'cc.Camera', name: 'Camera', uuid: 'camera-uuid' }]);
      expect(mockRequest).toHaveBeenCalledTimes(5);
    });

    it('should not create children if node creation fails', async () => {
      mockRequest.mockResolvedValueOnce({
        success: false,
        error: 'Node creation failed',
      });

      const result = await client.execute('scene', 'create-node', [
        { type: 'cc.Canvas', name: 'MyCanvas' },
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Node creation failed');
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    it('should not create children if node has no uuid', async () => {
      mockRequest.mockResolvedValueOnce({
        success: true,
        data: {},
      });

      const result = await client.execute('scene', 'create-node', [
        { type: 'cc.Canvas', name: 'MyCanvas' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data?.uuid).toBeUndefined();
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('non-Canvas types', () => {
    it('should not create children for cc.Sprite type', async () => {
      mockRequest
        .mockResolvedValueOnce({
          success: true,
          data: { uuid: 'sprite-uuid' },
        })
        .mockResolvedValueOnce({ success: true });

      const result = await client.execute('scene', 'create-node', [
        { type: 'cc.Sprite', name: 'MySprite' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data?.uuid).toBe('sprite-uuid');
      expect(result.data?.components).toEqual(['cc.Sprite']);
      expect(result.data?.children).toBeUndefined();
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });

    it('should not create children for cc.Label type', async () => {
      mockRequest
        .mockResolvedValueOnce({
          success: true,
          data: { uuid: 'label-uuid' },
        })
        .mockResolvedValueOnce({ success: true });

      const result = await client.execute('scene', 'create-node', [
        { type: 'cc.Label', name: 'MyLabel' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data?.uuid).toBe('label-uuid');
      expect(result.data?.components).toEqual(['cc.Label']);
      expect(result.data?.children).toBeUndefined();

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('without type parameter', () => {
    it('should create node without children or components', async () => {
      mockRequest.mockResolvedValueOnce({
        success: true,
        data: { uuid: 'node-uuid' },
      });

      const result = await client.execute('scene', 'create-node', [
        { name: 'MyNode' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data?.uuid).toBe('node-uuid');
      expect(result.data?.components).toBeUndefined();
      expect(result.data?.children).toBeUndefined();

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith('POST', '/api/scene/create-node', {
        params: [{ name: 'MyNode' }],
      });
    });
  });
});
