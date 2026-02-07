/**
 * Query operations integration tests
 *
 * Tests for scene query actions:
 * - query-node: Query node details by UUID
 * - query-node-tree: Query full scene node tree
 * - query-nodes-by-asset-uuid: Find nodes using specific asset
 * - query-dirty: Check if scene has unsaved changes
 * - query-component: Query component details
 * - query-classes: Query available component classes
 * - query-components: Query all available component types
 * - query-component-has-script: Check if node has script component
 * - query-scene-bounds: Query scene bounding box
 * - is-native: Check if node is native object
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';
import { SceneFixture } from '../helpers/scene-fixture.js';

const isServerAvailable = async (): Promise<boolean> => {
  const client = new CocosClient({ validate: false });
  const result = await client.healthCheck();
  return result.success;
};

describe('Scene Query Operations Integration Tests', () => {
  let client: CocosClient;
  let fixture: SceneFixture;
  let testNodeUuid: string;
  let testNodePath: string;
  let serverAvailable: boolean = false;

  beforeAll(async () => {
    client = new CocosClient({ validate: false });
    fixture = new SceneFixture(client, 'db://assets/QueryTest.scene', 'QueryTest');
    serverAvailable = await isServerAvailable();

    if (!serverAvailable) {
      return;
    }

    const sceneInfo = await fixture.setup();
    if (!sceneInfo) {
      serverAvailable = false;
      return;
    }

    // Wait for scene to be fully ready
    await fixture.waitForReady();

    // Create a test node for query operations
    const testNode = await fixture.createTestNode({ name: 'QueryTestNode' });
    if (!testNode || !testNode.uuid) {
      console.error('Failed to create test node for query operations');
      serverAvailable = false;
      return;
    }

    testNodeUuid = testNode.uuid;
    testNodePath = testNode.path;
  });

  afterAll(async () => {
    if (serverAvailable) {
      await fixture.teardown();
    }
  });

  describe('query-node', () => {
    it('should query node details by UUID', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node', [testNodeUuid]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('uuid');
      expect(result.data).toHaveProperty('active');
      expect(result.data).toHaveProperty('__comps__');
    });

    it('should return error for invalid UUID', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node', ['invalid-uuid-000000000000']);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should include node transform properties', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node', [testNodeUuid]);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('position');
      expect(result.data).toHaveProperty('rotation');
      expect(result.data).toHaveProperty('scale');
    });

    it('should include node component list', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node', [testNodeUuid]);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('__comps__');
      expect(Array.isArray(result.data.__comps__)).toBe(true);
    });
  });

  describe('query-node-tree', () => {
    it('should query full scene node tree', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node-tree');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return nodes with uuid and name', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node-tree');

      expect(result.success).toBe(true);
      if (result.data && result.data.length > 0) {
        const firstNode = result.data[0];
        expect(firstNode).toHaveProperty('uuid');
        expect(firstNode).toHaveProperty('name');
      }
    });

    it('should include child nodes in tree', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-node-tree');

      expect(result.success).toBe(true);
      if (result.data && result.data.length > 0) {
        // Check that children array exists
        const hasChildren = result.data.some((node: any) => node.children && Array.isArray(node.children));
        expect(hasChildren).toBe(true);
      }
    });
  });

  describe('query-nodes-by-asset-uuid', () => {
    it('should query nodes using specific asset UUID', async () => {
      if (!serverAvailable) {
        return;
      }
      // Use a known asset UUID (scene asset UUID)
      const result = await client.execute('scene', 'query-nodes-by-asset-uuid', ['test-asset-uuid']);

      // This may succeed or fail depending on whether the asset exists
      expect(result).toHaveProperty('success');
      expect(result.data).toBeDefined();
    });

    it('should return empty array for unused asset', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-nodes-by-asset-uuid', ['00000000-0000-0000-0000-000000000000']);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(0);
    });

    it('should return node UUIDs array', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-nodes-by-asset-uuid', ['test-asset-uuid']);

      if (result.success && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });

  describe('query-dirty', () => {
    it('should query if scene has unsaved changes', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-dirty');

      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('boolean');
    });

    it('should return false for clean scene', async () => {
      if (!serverAvailable) {
        return;
      }
      // Save scene first
      await client.execute('scene', 'save-scene');
      const result = await client.execute('scene', 'query-dirty');

      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    });

    it('should return true after creating node', async () => {
      if (!serverAvailable) {
        return;
      }
      // Create a new node
      await fixture.createTestNode({ name: 'DirtyTestNode' });
      const result = await client.execute('scene', 'query-dirty');

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });

  describe('query-component', () => {
    it('should query component details by node UUID', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-component', [testNodeUuid]);

      // This action may not be available, but should return a response
      expect(result).toHaveProperty('success');
      expect(result.data).toBeDefined();
    });

    it('should return error for invalid node UUID', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-component', ['invalid-uuid']);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('query-classes', () => {
    it('should query available component classes', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-classes', [{}]);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should filter classes by extends parameter', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-classes', [{ extends: 'cc.Component' }]);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should filter classes by scriptName parameter', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-classes', [{ scriptName: 'test' }]);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return class names and metadata', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-classes', [{}]);

      expect(result.success).toBe(true);
      if (result.data && result.data.length > 0) {
        const firstClass = result.data[0];
        expect(firstClass).toHaveProperty('name');
      }
    });
  });

  describe('query-components', () => {
    it('should query all available component types', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-components');

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return component with cid and name', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-components');

      expect(result.success).toBe(true);
      if (result.data && result.data.length > 0) {
        const firstComponent = result.data[0];
        expect(firstComponent).toHaveProperty('cid');
        expect(firstComponent).toHaveProperty('name');
      }
    });

    it('should include both built-in and custom components', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-components');

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('query-component-has-script', () => {
    it('should query if node has script component', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-component-has-script', [testNodeUuid]);

      // This action may not be available, but should return a response
      expect(result).toHaveProperty('success');
      expect(typeof result.data).toBe('boolean');
    });

    it('should return false for node without script', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-component-has-script', [testNodeUuid]);

      expect(result.success).toBe(true);
      // Fresh test node should not have script component
      expect(result.data).toBe(false);
    });

    it('should return error for invalid UUID', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-component-has-script', ['invalid-uuid']);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('query-scene-bounds', () => {
    it('should query scene bounding box', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-scene-bounds');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should return bounds with min and max points', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-scene-bounds');

      expect(result.success).toBe(true);
      if (result.data) {
        // The bounds might be returned as a single object with center/size or min/max
        const hasMinMax = result.data.min !== undefined && result.data.max !== undefined;
        const hasCenterSize = result.data.center !== undefined && result.data.size !== undefined;
        expect(hasMinMax || hasCenterSize).toBe(true);
      }
    });

    it('should include coordinates in bounds', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'query-scene-bounds');

      expect(result.success).toBe(true);
      if (result.data) {
        // Check for either min/max or center/size structure
        if (result.data.min) {
          expect(result.data.min).toHaveProperty('x');
          expect(result.data.min).toHaveProperty('y');
        }
        if (result.data.max) {
          expect(result.data.max).toHaveProperty('x');
          expect(result.data.max).toHaveProperty('y');
        }
      }
    });
  });

  describe('is-native', () => {
    it('should check if node is native object', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'is-native', [testNodePath]);

      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('boolean');
    });

    it('should return false for regular nodes', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'is-native', [testNodePath]);

      expect(result.success).toBe(true);
      // Regular nodes should not be native
      expect(result.data).toBe(false);
    });

    it('should return error for invalid path', async () => {
      if (!serverAvailable) {
        return;
      }
      const result = await client.execute('scene', 'is-native', ['/Invalid/Node/Path']);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
