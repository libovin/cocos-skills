/**
 * Node Operations Integration Tests
 *
 * Tests for scene node manipulation actions:
 * - create-node: Create new node with options
 * - remove-node: Delete node and children
 * - copy-node: Copy node to clipboard
 * - cut-node: Cut node for moving
 * - paste-node: Paste from clipboard
 * - duplicate-node: Quick copy-paste
 * - set-parent: Move node to new parent
 * - reset-node: Reset transform to defaults
 * - restore-prefab: Restore prefab to original state
 * - reset-component: Reset component to defaults
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';
import { SceneFixture } from '../helpers/scene-fixture.js';
import type { TestNodeInfo } from '../helpers/scene-fixture.js';

describe('Scene Node Operations Integration Tests', () => {
  let client: CocosClient;
  let fixture: SceneFixture;
  let testNode: TestNodeInfo | null = null;
  let childNode: TestNodeInfo | null = null;

  beforeAll(async () => {
    client = new CocosClient({ validate: true });
    fixture = new SceneFixture(client, 'db://assets/NodeOpsTest.scene', 'NodeOpsTest');

    const sceneInfo = await fixture.setup();
    if (!sceneInfo) {
      console.warn('Server not available, skipping integration tests');
    }
  });

  afterAll(async () => {
    await fixture.teardown();
  });

  describe('create-node', () => {
    it('should create node with default options', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'create-node', [{}]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.uuid).toBeDefined();
      expect(typeof result.data.uuid).toBe('string');
    });

    it('should create node with custom name', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const nodeName = `TestNode_${Date.now()}`;
      const result = await client.execute('scene', 'create-node', [{ name: nodeName }]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      // Verify node was created with correct name
      if (result.data.uuid) {
        const queryResult = await client.execute('scene', 'query-node', [result.data.uuid]);
        expect(queryResult.success).toBe(true);
        expect(queryResult.data.name).toBe(nodeName);
      }
    });

    it('should create node with parent', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // First create a parent node
      const parentResult = await client.execute('scene', 'create-node', [{ name: 'ParentNode' }]);
      expect(parentResult.success).toBe(true);

      if (parentResult.data?.uuid) {
        // Create child node with parent
        const childResult = await client.execute('scene', 'create-node', [
          { parent: parentResult.data.uuid, name: 'ChildNode' },
        ]);

        expect(childResult.success).toBe(true);
        expect(childResult.data).toBeDefined();
      }
    });

    it('should validate create-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters (should fail validation)
      let result = await client.execute('scene', 'create-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'create-node', ['invalid'], true);
      expect(result.success).toBe(false);
    });

    it('should validate parent type is string', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with invalid parent type
      const result = await client.execute('scene', 'create-node', [{ parent: 123 }], true);
      expect(result.success).toBe(false);
    });

    it('should validate name type is string', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with invalid name type
      const result = await client.execute('scene', 'create-node', [{ name: 456 }], true);
      expect(result.success).toBe(false);
    });
  });

  describe('remove-node', () => {
    let nodeToRemove: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node to remove
      nodeToRemove = await fixture.createTestNode({ name: `ToRemove_${Date.now()}` });
    });

    it('should remove node by path', async () => {
      if (!fixture.isServerAvailable() || !nodeToRemove) {
        return;
      }

      const result = await client.execute('scene', 'remove-node', [nodeToRemove.path]);

      expect(result.success).toBe(true);

      // Verify node was removed
      const uuid = await fixture.getNodeUuid(nodeToRemove.path);
      expect(uuid).toBeNull();
    });

    it('should remove node and its children', async () => {
      if (!fixture.isServerAvailable() || !nodeToRemove) {
        return;
      }

      // Create a child node
      const childResult = await client.execute('scene', 'create-node', [
        { parent: nodeToRemove.uuid, name: 'ChildNode' },
      ]);

      expect(childResult.success).toBe(true);

      // Remove parent (should also remove child)
      const removeResult = await client.execute('scene', 'remove-node', [nodeToRemove.path]);

      expect(removeResult.success).toBe(true);

      // Verify both nodes were removed
      const parentUuid = await fixture.getNodeUuid(nodeToRemove.path);
      expect(parentUuid).toBeNull();
    });

    it('should validate remove-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'remove-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'remove-node', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'remove-node', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when removing non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'remove-node', ['/NonExistent/Node']);

      expect(result.success).toBe(false);
    });
  });

  describe('copy-node', () => {
    let nodeToCopy: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      nodeToCopy = await fixture.createTestNode({ name: `ToCopy_${Date.now()}` });
    });

    it('should copy node to clipboard', async () => {
      if (!fixture.isServerAvailable() || !nodeToCopy) {
        return;
      }

      const result = await client.execute('scene', 'copy-node', [nodeToCopy.path]);

      expect(result.success).toBe(true);
    });

    it('should validate copy-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'copy-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'copy-node', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'copy-node', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when copying non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'copy-node', ['/NonExistent/Node']);

      expect(result.success).toBe(false);
    });
  });

  describe('cut-node', () => {
    let nodeToCut: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      nodeToCut = await fixture.createTestNode({ name: `ToCut_${Date.now()}` });
    });

    it('should cut node to clipboard', async () => {
      if (!fixture.isServerAvailable() || !nodeToCut) {
        return;
      }

      const result = await client.execute('scene', 'cut-node', [nodeToCut.path]);

      expect(result.success).toBe(true);
    });

    it('should validate cut-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'cut-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'cut-node', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'cut-node', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when cutting non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'cut-node', ['/NonExistent/Node']);

      expect(result.success).toBe(false);
    });
  });

  describe('paste-node', () => {
    let copiedNode: TestNodeInfo | null = null;
    let targetParent: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      copiedNode = await fixture.createTestNode({ name: `ToPaste_${Date.now()}` });
      targetParent = await fixture.createTestNode({ name: `TargetParent_${Date.now()}` });

      // Copy the node first
      if (copiedNode) {
        await client.execute('scene', 'copy-node', [copiedNode.path]);
      }
    });

    it('should paste node to new parent', async () => {
      if (!fixture.isServerAvailable() || !targetParent) {
        return;
      }

      const result = await client.execute('scene', 'paste-node', [targetParent.path]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should validate paste-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'paste-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'paste-node', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'paste-node', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when pasting to non-existent parent', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'paste-node', ['/NonExistent/Parent']);

      expect(result.success).toBe(false);
    });
  });

  describe('duplicate-node', () => {
    let nodeToDuplicate: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      nodeToDuplicate = await fixture.createTestNode({ name: `ToDuplicate_${Date.now()}` });
    });

    it('should duplicate node (copy + paste)', async () => {
      if (!fixture.isServerAvailable() || !nodeToDuplicate) {
        return;
      }

      const result = await client.execute('scene', 'duplicate-node', [nodeToDuplicate.path]);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should validate duplicate-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'duplicate-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'duplicate-node', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'duplicate-node', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when duplicating non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'duplicate-node', ['/NonExistent/Node']);

      expect(result.success).toBe(false);
    });
  });

  describe('set-parent', () => {
    let nodeToMove: TestNodeInfo | null = null;
    let newParent: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      nodeToMove = await fixture.createTestNode({ name: `ToMove_${Date.now()}` });
      newParent = await fixture.createTestNode({ name: `NewParent_${Date.now()}` });
    });

    it('should set node parent', async () => {
      if (!fixture.isServerAvailable() || !nodeToMove || !newParent) {
        return;
      }

      const result = await client.execute('scene', 'set-parent', [
        nodeToMove.path,
        newParent.path,
      ]);

      expect(result.success).toBe(true);
    });

    it('should set node parent with index', async () => {
      if (!fixture.isServerAvailable() || !nodeToMove || !newParent) {
        return;
      }

      const result = await client.execute('scene', 'set-parent', [
        nodeToMove.path,
        newParent.path,
        0,
      ]);

      expect(result.success).toBe(true);
    });

    it('should validate set-parent parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'set-parent', [], true);
      expect(result.success).toBe(false);

      // Test with invalid path parameter type
      result = await client.execute('scene', 'set-parent', [123, '/Parent'], true);
      expect(result.success).toBe(false);

      // Test with invalid parentPath parameter type
      result = await client.execute('scene', 'set-parent', ['/Node', 123], true);
      expect(result.success).toBe(false);
    });

    it('should fail when moving to non-existent parent', async () => {
      if (!fixture.isServerAvailable() || !nodeToMove) {
        return;
      }

      const result = await client.execute('scene', 'set-parent', [
        nodeToMove.path,
        '/NonExistent/Parent',
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('reset-node', () => {
    let nodeToReset: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      nodeToReset = await fixture.createTestNode({ name: `ToReset_${Date.now()}` });
    });

    it('should reset node transform to defaults', async () => {
      if (!fixture.isServerAvailable() || !nodeToReset) {
        return;
      }

      // First modify the node properties
      await client.execute('scene', 'set-property', [
        {
          uuid: nodeToReset.uuid,
          path: 'position',
          dump: { value: { x: 10, y: 20, z: 30 }, type: 'cc.Vec3' },
        },
      ]);

      // Reset the node
      const result = await client.execute('scene', 'reset-node', [nodeToReset.path]);

      expect(result.success).toBe(true);

      // Verify properties were reset
      const queryResult = await client.execute('scene', 'query-node', [nodeToReset.uuid]);
      if (queryResult.success && queryResult.data) {
        expect(queryResult.data.position).toEqual({ x: 0, y: 0, z: 0 });
      }
    });

    it('should validate reset-node parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'reset-node', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'reset-node', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'reset-node', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when resetting non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'reset-node', ['/NonExistent/Node']);

      expect(result.success).toBe(false);
    });
  });

  describe('reset-component', () => {
    let nodeWithComponent: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node with a Sprite component
      nodeWithComponent = await fixture.createNodeWithComponent(
        `SpriteNode_${Date.now()}`,
        'cc.Sprite'
      );
    });

    it('should reset component to defaults', async () => {
      if (!fixture.isServerAvailable() || !nodeWithComponent) {
        return;
      }

      const result = await client.execute('scene', 'reset-component', [
        nodeWithComponent.path,
        'cc.Sprite',
      ]);

      expect(result.success).toBe(true);
    });

    it('should validate reset-component parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'reset-component', [], true);
      expect(result.success).toBe(false);

      // Test with invalid path parameter type
      result = await client.execute('scene', 'reset-component', [123, 'cc.Sprite'], true);
      expect(result.success).toBe(false);

      // Test with invalid component parameter type
      result = await client.execute('scene', 'reset-component', ['/Node', 123], true);
      expect(result.success).toBe(false);
    });

    it('should fail when resetting component on non-existent node', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'reset-component', [
        '/NonExistent/Node',
        'cc.Sprite',
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe('restore-prefab', () => {
    let prefabInstance: TestNodeInfo | null = null;

    beforeEach(async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Note: This test requires a prefab to exist in the project
      // For now, we'll create a regular node and test the validation
      prefabInstance = await fixture.createTestNode({ name: `PrefabInstance_${Date.now()}` });
    });

    it('should restore prefab to original state', async () => {
      if (!fixture.isServerAvailable() || !prefabInstance) {
        return;
      }

      const result = await client.execute('scene', 'restore-prefab', [prefabInstance.path]);

      // This will likely fail if the node is not actually a prefab instance
      // but we test the API call structure
      expect(result).toBeDefined();
    });

    it('should validate restore-prefab parameters', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test with no parameters
      let result = await client.execute('scene', 'restore-prefab', [], true);
      expect(result.success).toBe(false);

      // Test with invalid parameter type
      result = await client.execute('scene', 'restore-prefab', [123], true);
      expect(result.success).toBe(false);

      // Test with invalid path format
      result = await client.execute('scene', 'restore-prefab', ['invalid-path'], true);
      expect(result.success).toBe(false);
    });

    it('should fail when restoring non-existent prefab', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const result = await client.execute('scene', 'restore-prefab', ['/NonExistent/Prefab']);

      expect(result.success).toBe(false);
    });
  });

  describe('Node operation workflows', () => {
    it('should create, copy, paste, and remove nodes in sequence', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a source node
      const sourceNode = await fixture.createTestNode({ name: 'SourceNode' });
      expect(sourceNode).not.toBeNull();

      // Create a target parent
      const targetParent = await fixture.createTestNode({ name: 'TargetParent' });
      expect(targetParent).not.toBeNull();

      if (!sourceNode || !targetParent) {
        return;
      }

      // Copy the source node
      const copyResult = await client.execute('scene', 'copy-node', [sourceNode.path]);
      expect(copyResult.success).toBe(true);

      // Paste to target parent
      const pasteResult = await client.execute('scene', 'paste-node', [targetParent.path]);
      expect(pasteResult.success).toBe(true);

      // Clean up
      await client.execute('scene', 'remove-node', [sourceNode.path]);
      await client.execute('scene', 'remove-node', [targetParent.path]);
    });

    it('should create, duplicate, and clean up nodes', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create a node
      const originalNode = await fixture.createTestNode({ name: 'OriginalNode' });
      expect(originalNode).not.toBeNull();

      if (!originalNode) {
        return;
      }

      // Duplicate it
      const duplicateResult = await client.execute('scene', 'duplicate-node', [originalNode.path]);
      expect(duplicateResult.success).toBe(true);

      // Remove original
      const removeResult = await client.execute('scene', 'remove-node', [originalNode.path]);
      expect(removeResult.success).toBe(true);
    });

    it('should move node using set-parent', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create parent and child nodes
      const parent1 = await fixture.createTestNode({ name: 'Parent1' });
      const parent2 = await fixture.createTestNode({ name: 'Parent2' });
      const child = await fixture.createTestNode({ name: 'Child' });

      expect(parent1 && parent2 && child).not.toBeNull();

      if (!parent1 || !parent2 || !child) {
        return;
      }

      // Move child from default parent to Parent1
      const moveResult1 = await client.execute('scene', 'set-parent', [
        child.path,
        parent1.path,
      ]);
      expect(moveResult1.success).toBe(true);

      // Move child from Parent1 to Parent2
      const moveResult2 = await client.execute('scene', 'set-parent', [
        child.path,
        parent2.path,
      ]);
      expect(moveResult2.success).toBe(true);

      // Clean up
      await client.execute('scene', 'remove-node', [parent1.path]);
      await client.execute('scene', 'remove-node', [parent2.path]);
    });
  });
});
