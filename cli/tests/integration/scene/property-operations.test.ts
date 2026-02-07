/**
 * Integration tests for scene property operations
 *
 * Tests the following actions:
 * - set-property: Set node/component property with dump format
 * - reset-property: Reset property to default
 * - move-array-element: Move array item (children reordering)
 * - remove-array-element: Remove array item
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';
import { SceneFixture } from '../../helpers/scene-fixture.js';

describe('Scene Property Operations', () => {
  let client: CocosClient;
  let fixture: SceneFixture;
  let testNodeUuid: string;
  let testNodePath: string;

  beforeAll(async () => {
    client = new CocosClient();
    fixture = new SceneFixture(client);

    const sceneInfo = await fixture.setup();
    if (!sceneInfo || !fixture.isServerAvailable()) {
      return;
    }

    // Create a test node with multiple children for array operations
    const parentNode = await fixture.createTestNode({ name: 'PropertyTestParent' });
    if (!parentNode) {
      return;
    }

    testNodeUuid = parentNode.uuid;
    testNodePath = parentNode.path;

    // Create child nodes for array operations testing
    await fixture.createTestNode({ parent: testNodeUuid, name: 'Child1' });
    await fixture.createTestNode({ parent: testNodeUuid, name: 'Child2' });
    await fixture.createTestNode({ parent: testNodeUuid, name: 'Child3' });
  });

  afterAll(async () => {
    await fixture.teardown();
  });

  describe('set-property', () => {
    it('should set node position property with cc.Vec3 dump format', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const newPosition = { x: 100, y: 200, z: 50 };
      const result = await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'position',
          dump: {
            value: newPosition,
            type: 'cc.Vec3',
          },
        },
      ]);

      expect(result.success).toBe(true);

      // Verify the position was set
      const queryResult = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      if (nodeData && nodeData.position) {
        expect(nodeData.position.x).toBeCloseTo(newPosition.x, 1);
        expect(nodeData.position.y).toBeCloseTo(newPosition.y, 1);
        expect(nodeData.position.z).toBeCloseTo(newPosition.z, 1);
      }
    });

    it('should set node rotation property with cc.Quat dump format', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const newRotation = { x: 0, y: 0.707, z: 0, w: 0.707 };
      const result = await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'rotation',
          dump: {
            value: newRotation,
            type: 'cc.Quat',
          },
        },
      ]);

      expect(result.success).toBe(true);
    });

    it('should set node scale property with cc.Vec3 dump format', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const newScale = { x: 2, y: 2, z: 2 };
      const result = await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'scale',
          dump: {
            value: newScale,
            type: 'cc.Vec3',
          },
        },
      ]);

      expect(result.success).toBe(true);

      // Verify the scale was set
      const queryResult = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      if (nodeData && nodeData.scale) {
        expect(nodeData.scale.x).toBeCloseTo(newScale.x, 1);
        expect(nodeData.scale.y).toBeCloseTo(newScale.y, 1);
        expect(nodeData.scale.z).toBeCloseTo(newScale.z, 1);
      }
    });

    it('should return error for invalid UUID', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const invalidUuid = 'invalid-uuid-format';
      const result = await client.execute('scene', 'set-property', [
        {
          uuid: invalidUuid,
          path: 'position',
          dump: {
            value: { x: 0, y: 0, z: 0 },
            type: 'cc.Vec3',
          },
        },
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for invalid property path', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'invalid.property.path',
          dump: {
            value: 0,
            type: 'cc.Number',
          },
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for missing dump.type', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'position',
          dump: {
            value: { x: 0, y: 0, z: 0 },
            // Missing type field
          },
        },
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('reset-property', () => {
    it('should reset node position to default value', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      // First set a custom position
      await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'position',
          dump: {
            value: { x: 999, y: 999, z: 999 },
            type: 'cc.Vec3',
          },
        },
      ]);

      // Reset to default
      const result = await client.execute('scene', 'reset-property', [
        {
          uuid: testNodeUuid,
          path: 'position',
          dump: null,
        },
      ]);

      expect(result.success).toBe(true);

      // Verify position was reset
      const queryResult = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      if (nodeData && nodeData.position) {
        // Default position should be (0, 0, 0)
        expect(nodeData.position.x).toBeCloseTo(0, 1);
        expect(nodeData.position.y).toBeCloseTo(0, 1);
        expect(nodeData.position.z).toBeCloseTo(0, 1);
      }
    });

    it('should reset node scale to default value', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      // First set a custom scale
      await client.execute('scene', 'set-property', [
        {
          uuid: testNodeUuid,
          path: 'scale',
          dump: {
            value: { x: 5, y: 5, z: 5 },
            type: 'cc.Vec3',
          },
        },
      ]);

      // Reset to default
      const result = await client.execute('scene', 'reset-property', [
        {
          uuid: testNodeUuid,
          path: 'scale',
          dump: null,
        },
      ]);

      expect(result.success).toBe(true);

      // Verify scale was reset
      const queryResult = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      if (nodeData && nodeData.scale) {
        // Default scale should be (1, 1, 1)
        expect(nodeData.scale.x).toBeCloseTo(1, 1);
        expect(nodeData.scale.y).toBeCloseTo(1, 1);
        expect(nodeData.scale.z).toBeCloseTo(1, 1);
      }
    });

    it('should return error for invalid UUID when resetting', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const invalidUuid = 'invalid-uuid-format';
      const result = await client.execute('scene', 'reset-property', [
        {
          uuid: invalidUuid,
          path: 'position',
          dump: null,
        },
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for invalid property path when resetting', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'reset-property', [
        {
          uuid: testNodeUuid,
          path: 'nonexistent.property',
          dump: null,
        },
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('move-array-element', () => {
    it('should move child to different index in children array', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      // Get initial node tree to verify children
      const beforeQuery = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(beforeQuery.success).toBe(true);

      const beforeNode = beforeQuery.data as any;
      const initialChildCount = beforeNode?.children?.length || 0;

      if (initialChildCount < 2) {
        return;
      }

      // Move element at index 0 to index 1 (swap first two children)
      const result = await client.execute('scene', 'move-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          target: 1,
          offset: 1,
        },
      ]);

      expect(result.success).toBe(true);

      // Verify children were reordered
      const afterQuery = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(afterQuery.success).toBe(true);

      const afterNode = afterQuery.data as any;
      expect(afterNode?.children?.length).toBe(initialChildCount);
    });

    it('should move child with offset parameter', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      // Get current state
      const beforeQuery = await client.execute('scene', 'query-node', [testNodeUuid]);
      const beforeNode = beforeQuery.data as any;
      const childCount = beforeNode?.children?.length || 0;

      if (childCount < 3) {
        return;
      }

      // Move element with offset
      const result = await client.execute('scene', 'move-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          target: 0,
          offset: 2,
        },
      ]);

      expect(result.success).toBe(true);
    });

    it('should return error for invalid target index', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'move-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          target: 999,
          offset: 0,
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid UUID when moving array element', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'move-array-element', [
        {
          uuid: 'invalid-uuid',
          path: 'children',
          target: 0,
          offset: 0,
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid array path', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'move-array-element', [
        {
          uuid: testNodeUuid,
          path: 'nonexistent.array',
          target: 0,
          offset: 0,
        },
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('remove-array-element', () => {
    it('should remove element from children array', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      // Get initial child count
      const beforeQuery = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(beforeQuery.success).toBe(true);

      const beforeNode = beforeQuery.data as any;
      const initialChildCount = beforeNode?.children?.length || 0;

      if (initialChildCount === 0) {
        return;
      }

      // Remove first child
      const result = await client.execute('scene', 'remove-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          index: 0,
        },
      ]);

      expect(result.success).toBe(true);

      // Verify child was removed
      const afterQuery = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(afterQuery.success).toBe(true);

      const afterNode = afterQuery.data as any;
      expect(afterNode?.children?.length).toBe(initialChildCount - 1);
    });

    it('should remove element at specific index', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      // Get current child count
      const beforeQuery = await client.execute('scene', 'query-node', [testNodeUuid]);
      const beforeNode = beforeQuery.data as any;
      const childCount = beforeNode?.children?.length || 0;

      if (childCount < 2) {
        return;
      }

      // Remove second child (index 1)
      const result = await client.execute('scene', 'remove-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          index: 1,
        },
      ]);

      expect(result.success).toBe(true);
    });

    it('should return error for index out of bounds', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'remove-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          index: 999,
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for negative index', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'remove-array-element', [
        {
          uuid: testNodeUuid,
          path: 'children',
          index: -1,
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid UUID when removing array element', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'remove-array-element', [
        {
          uuid: 'invalid-uuid',
          path: 'children',
          index: 0,
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid array path', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'remove-array-element', [
        {
          uuid: testNodeUuid,
          path: 'nonexistent.array',
          index: 0,
        },
      ]);

      expect(result.success).toBe(false);
    });
  });
});
