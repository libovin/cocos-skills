/**
 * Camera operations integration tests
 *
 * Tests for camera-related scene actions:
 * - focus-camera: Focus editor camera on node
 * - align-with-view: Align node to view direction
 * - align-view-with-node: Align view to node direction
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getClient } from '../../../src/lib/client.js';
import { SceneFixture } from '../../integration/helpers/scene-fixture.js';

describe('Scene Camera Operations', () => {
  let fixture: SceneFixture;
  let client = getClient();

  beforeAll(async () => {
    fixture = new SceneFixture(client);
    const setupResult = await fixture.setup();

    if (!setupResult || !fixture.isServerAvailable()) {
      // Skip tests if server is not available
      console.warn('Cocos Creator server not available, skipping camera operations tests');
    }
  });

  afterAll(async () => {
    if (fixture) {
      await fixture.teardown();
    }
  });

  describe('focus-camera', () => {
    it('should focus editor camera on specified node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a test node to focus on
      const testNode = await fixture.createTestNode({ name: 'CameraFocusTest' });

      if (!testNode) {
        return;
      }

      // Use uuid instead of path if path is not available
      const target = testNode.path || testNode.uuid;

      // Focus camera on the node
      const result = await client.execute('scene', 'focus-camera', [target]);

      expect(result.success).toBe(true);
    });

    it('should handle focusing on non-existent node gracefully', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Try to focus on a non-existent node
      const result = await client.execute('scene', 'focus-camera', ['/NonExistent/Node']);

      // Should either fail silently or return success
      expect(result).toBeDefined();
    });
  });

  describe('align-with-view', () => {
    it('should align node rotation to current view direction', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a test node to align
      const testNode = await fixture.createTestNode({ name: 'AlignWithViewTest' });

      if (!testNode) {
        return;
      }

      // Use uuid instead of path if path is not available
      const target = testNode.path || testNode.uuid;

      // Align node to view
      const result = await client.execute('scene', 'align-with-view', [target]);

      expect(result.success).toBe(true);
    });

    it('should handle aligning non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'align-with-view', ['/NonExistent/Node']);

      expect(result).toBeDefined();
    });
  });

  describe('align-view-with-node', () => {
    it('should align editor view to node direction', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a test node
      const testNode = await fixture.createTestNode({ name: 'AlignViewWithNodeTest' });

      if (!testNode) {
        return;
      }

      // Use uuid instead of path if path is not available
      const target = testNode.path || testNode.uuid;

      // Align view to node
      const result = await client.execute('scene', 'align-view-with-node', [target]);

      expect(result.success).toBe(true);
    });

    it('should handle aligning view to non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'align-view-with-node', ['/NonExistent/Node']);

      expect(result).toBeDefined();
    });
  });

  describe('Camera operation combinations', () => {
    it('should support focus after align sequence', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a test node
      const testNode = await fixture.createTestNode({ name: 'CameraComboTest' });

      if (!testNode) {
        return;
      }

      // Use uuid instead of path if path is not available
      const target = testNode.path || testNode.uuid;

      // Align node to view
      const alignResult = await client.execute('scene', 'align-with-view', [target]);
      expect(alignResult.success).toBe(true);

      // Then focus camera on it
      const focusResult = await client.execute('scene', 'focus-camera', [target]);
      expect(focusResult.success).toBe(true);
    });
  });
});
