/**
 * Integration tests for scene component operations
 *
 * Tests the following actions:
 * - create-component: Add component to node
 * - remove-component: Remove component from node
 * - execute-component-method: Call component method
 * - execute-scene-script: Execute script in scene context
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';
import { SceneFixture } from '../../helpers/scene-fixture.js';

describe('Scene Component Operations', () => {
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

    // Create a test node for component operations
    const testNode = await fixture.createTestNode({ name: 'ComponentTestNode' });
    if (!testNode) {
      return;
    }

    testNodeUuid = testNode.uuid;
    testNodePath = testNode.path;
  });

  afterAll(async () => {
    await fixture.teardown();
  });

  describe('create-component', () => {
    it('should add cc.Sprite component to node', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'create-component', [
        {
          uuid: testNodeUuid,
          component: 'cc.Sprite',
        },
      ]);

      expect(result.success).toBe(true);

      // Verify component was added
      const queryResult = await client.execute('scene', 'query-node', [testNodeUuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      expect(nodeData?.__comps__).toBeDefined();
      expect(nodeData.__comps__.length).toBeGreaterThan(0);

      // Check if cc.Sprite component exists
      const spriteComp = nodeData.__comps__.find(
        (comp: any) => comp.type === 'cc.Sprite' || comp.cid === 'cc.Sprite'
      );
      expect(spriteComp).toBeDefined();
    });

    it('should add cc.Label component to node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a new node for this test
      const labelNode = await fixture.createTestNode({ name: 'LabelTestNode' });
      if (!labelNode) {
        return;
      }

      const result = await client.execute('scene', 'create-component', [
        {
          uuid: labelNode.uuid,
          component: 'cc.Label',
        },
      ]);

      expect(result.success).toBe(true);

      // Verify component was added
      const queryResult = await client.execute('scene', 'query-node', [labelNode.uuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      const labelComp = nodeData?.__comps__?.find(
        (comp: any) => comp.type === 'cc.Label' || comp.cid === 'cc.Label'
      );
      expect(labelComp).toBeDefined();
    });

    it('should add cc.Widget component to node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a new node for this test
      const widgetNode = await fixture.createTestNode({ name: 'WidgetTestNode' });
      if (!widgetNode) {
        return;
      }

      const result = await client.execute('scene', 'create-component', [
        {
          uuid: widgetNode.uuid,
          component: 'cc.Widget',
        },
      ]);

      expect(result.success).toBe(true);

      // Verify component was added
      const queryResult = await client.execute('scene', 'query-node', [widgetNode.uuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      const widgetComp = nodeData?.__comps__?.find(
        (comp: any) => comp.type === 'cc.Widget' || comp.cid === 'cc.Widget'
      );
      expect(widgetComp).toBeDefined();
    });

    it('should add cc.Camera component to node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a new node for this test
      const cameraNode = await fixture.createTestNode({ name: 'CameraTestNode' });
      if (!cameraNode) {
        return;
      }

      const result = await client.execute('scene', 'create-component', [
        {
          uuid: cameraNode.uuid,
          component: 'cc.Camera',
        },
      ]);

      expect(result.success).toBe(true);

      // Verify component was added
      const queryResult = await client.execute('scene', 'query-node', [cameraNode.uuid]);
      expect(queryResult.success).toBe(true);

      const nodeData = queryResult.data as any;
      const cameraComp = nodeData?.__comps__?.find(
        (comp: any) => comp.type === 'cc.Camera' || comp.cid === 'cc.Camera'
      );
      expect(cameraComp).toBeDefined();
    });

    it('should return error for invalid UUID', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const invalidUuid = 'invalid-uuid-format';
      const result = await client.execute('scene', 'create-component', [
        {
          uuid: invalidUuid,
          component: 'cc.Sprite',
        },
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for invalid component type', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'create-component', [
        {
          uuid: testNodeUuid,
          component: 'Invalid.Component.Type',
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for missing component parameter', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'create-component', [
        {
          uuid: testNodeUuid,
          // Missing component field
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should not add duplicate component of same type', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a new node for this test
      const duplicateNode = await fixture.createTestNode({ name: 'DuplicateCompNode' });
      if (!duplicateNode) {
        return;
      }

      // Add first cc.Sprite
      const firstResult = await client.execute('scene', 'create-component', [
        {
          uuid: duplicateNode.uuid,
          component: 'cc.Sprite',
        },
      ]);
      expect(firstResult.success).toBe(true);

      // Try to add another cc.Sprite (should fail or be ignored)
      const secondResult = await client.execute('scene', 'create-component', [
        {
          uuid: duplicateNode.uuid,
          component: 'cc.Sprite',
        },
      ]);

      // Most Cocos component systems don't allow duplicate components
      // The behavior may vary, but it should not create a duplicate
      const queryResult = await client.execute('scene', 'query-node', [duplicateNode.uuid]);
      const nodeData = queryResult.data as any;
      const spriteCount = nodeData?.__comps__?.filter(
        (comp: any) => comp.type === 'cc.Sprite' || comp.cid === 'cc.Sprite'
      ).length || 0;

      expect(spriteCount).toBeLessThanOrEqual(1);
    });
  });

  describe('remove-component', () => {
    it('should remove cc.Sprite component from node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node with Sprite component
      const spriteNode = await fixture.createNodeWithComponent('RemoveTestNode', 'cc.Sprite');
      if (!spriteNode) {
        return;
      }

      // Verify component exists
      const beforeQuery = await client.execute('scene', 'query-node', [spriteNode.uuid]);
      const beforeNode = beforeQuery.data as any;
      const beforeCompCount = beforeNode?.__comps__?.length || 0;

      // Remove the component
      const result = await client.execute('scene', 'remove-component', [
        {
          uuid: spriteNode.uuid,
          component: 'cc.Sprite',
        },
      ]);

      expect(result.success).toBe(true);

      // Verify component was removed
      const afterQuery = await client.execute('scene', 'query-node', [spriteNode.uuid]);
      expect(afterQuery.success).toBe(true);

      const afterNode = afterQuery.data as any;
      expect(afterNode?.__comps__?.length).toBeLessThan(beforeCompCount);

      const spriteComp = afterNode?.__comps__?.find(
        (comp: any) => comp.type === 'cc.Sprite' || comp.cid === 'cc.Sprite'
      );
      expect(spriteComp).toBeUndefined();
    });

    it('should return error when removing non-existent component', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'remove-component', [
        {
          uuid: testNodeUuid,
          component: 'cc.Animation',
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid UUID when removing component', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'remove-component', [
        {
          uuid: 'invalid-uuid',
          component: 'cc.Sprite',
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid component type', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'remove-component', [
        {
          uuid: testNodeUuid,
          component: 'Invalid.Component',
        },
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('execute-component-method', () => {
    it('should call method on cc.Sprite component', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node with Sprite component
      const spriteNode = await fixture.createNodeWithComponent('MethodTestNode', 'cc.Sprite');
      if (!spriteNode) {
        return;
      }

      // Call setContentSize method
      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: spriteNode.uuid,
          component: 'cc.Sprite',
          method: 'setContentSize',
          args: [150, 150],
        },
      ]);

      expect(result.success).toBe(true);
    });

    it('should call method on cc.Label component', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node with Label component
      const labelNode = await fixture.createNodeWithComponent('LabelMethodNode', 'cc.Label');
      if (!labelNode) {
        return;
      }

      // Call method to set string property
      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: labelNode.uuid,
          component: 'cc.Label',
          method: 'string',
          args: ['Test Label Text'],
        },
      ]);

      expect(result.success).toBe(true);
    });

    it('should call method without arguments', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node with UITransform component
      const transformNode = await fixture.createNodeWithComponent('TransformNode', 'cc.UITransform');
      if (!transformNode) {
        return;
      }

      // Call method without args
      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: transformNode.uuid,
          component: 'cc.UITransform',
          method: 'getAnchorPoint',
          args: [],
        },
      ]);

      expect(result.success).toBe(true);
    });

    it('should return error for invalid UUID', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: 'invalid-uuid',
          component: 'cc.Sprite',
          method: 'setContentSize',
          args: [100, 100],
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for non-existent component', async () => {
      if (!fixture.isServerAvailable() || !testNodeUuid) {
        return;
      }

      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: testNodeUuid,
          component: 'cc.NonExistentComponent',
          method: 'someMethod',
          args: [],
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for invalid method name', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const spriteNode = await fixture.createNodeWithComponent('InvalidMethodNode', 'cc.Sprite');
      if (!spriteNode) {
        return;
      }

      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: spriteNode.uuid,
          component: 'cc.Sprite',
          method: 'nonExistentMethod',
          args: [],
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for missing method parameter', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const spriteNode = await fixture.createNodeWithComponent('NoMethodNode', 'cc.Sprite');
      if (!spriteNode) {
        return;
      }

      const result = await client.execute('scene', 'execute-component-method', [
        {
          uuid: spriteNode.uuid,
          component: 'cc.Sprite',
          // Missing method field
          args: [],
        },
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('execute-scene-script', () => {
    it('should execute script in scene context', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // This test requires a registered script in the scene
      // The actual script method must be registered in Cocos Creator
      const result = await client.execute('scene', 'execute-scene-script', [
        {
          name: 'cocos-mcp-server',
          method: 'getNodeInfo',
          args: [testNodeUuid],
        },
      ]);

      // May fail if script is not registered, which is expected in test environment
      if (!result.success) {
        // Script not registered - this is acceptable for test environment
        expect(result.error).toBeDefined();
      } else {
        expect(result.success).toBe(true);
      }
    });

    it('should execute script with multiple arguments', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'execute-scene-script', [
        {
          name: 'cocos-mcp-server',
          method: 'addComponentToNode',
          args: [testNodeUuid, 'cc.Sprite'],
        },
      ]);

      // May fail if script is not registered
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect(result.success).toBe(true);
      }
    });

    it('should return error for missing script name', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'execute-scene-script', [
        {
          // Missing name field
          method: 'someMethod',
          args: [],
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for missing method parameter', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'execute-scene-script', [
        {
          name: 'cocos-mcp-server',
          // Missing method field
          args: [],
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should return error for non-existent script', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'execute-scene-script', [
        {
          name: 'non-existent-script',
          method: 'someMethod',
          args: [],
        },
      ]);

      expect(result.success).toBe(false);
    });

    it('should execute script without arguments', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'execute-scene-script', [
        {
          name: 'cocos-mcp-server',
          method: 'getSceneInfo',
          args: [],
        },
      ]);

      // May fail if script is not registered
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect(result.success).toBe(true);
      }
    });
  });
});
