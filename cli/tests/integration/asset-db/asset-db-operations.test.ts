/**
 * Asset Database Integration Tests
 *
 * Tests for asset-db module actions.
 * Note: These tests require a running Cocos Creator editor with HTTP server enabled.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';

// Check if server is available before running tests
let isServerAvailable = false;
let testClient: CocosClient | null = null;

beforeAll(async () => {
  const client = new CocosClient({ validate: false });
  const result = await client.healthCheck();
  isServerAvailable = result.success;

  if (isServerAvailable) {
    testClient = client;
  }
});

/**
 * Helper function to validate ApiResponse structure
 */
function validateApiResponse(result: unknown): asserts result is { success: boolean; data?: unknown; error?: string } {
  expect(result).toBeDefined();
  expect(typeof result).toBe('object');

  const r = result as Record<string, unknown>;
  expect(r).toHaveProperty('success');
  expect(typeof r.success).toBe('boolean');
}

/**
 * Helper function to verify asset info matches expected values
 */
function verifyAssetInfo(assetInfo: unknown, expectedUrl: string, expectedUuid?: string) {
  expect(assetInfo).toBeDefined();
  expect(typeof assetInfo).toBe('object');

  const info = assetInfo as Record<string, unknown>;
  expect(info.url).toBe(expectedUrl);
  expect(info.uuid).toBeDefined();
  expect(typeof info.uuid).toBe('string');

  if (expectedUuid) {
    expect(info.uuid).toBe(expectedUuid);
  }
}

describe('Asset Database Integration Tests', () => {
  describe('Basic Query Operations', () => {
    it('should query database ready status', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-ready');
      validateApiResponse(result);
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should query all assets', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(result);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should generate available URL', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'generate-available-url', [
        'db://assets/TestAsset.json',
        false,
      ]);
      validateApiResponse(result);
      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('string');
      expect(result.data).toMatch(/^db:\/\/assets\/TestAsset.*\.json$/);
    });
  });

  describe('End-to-End Asset Workflow', () => {
    it('should complete full asset lifecycle: create -> query -> copy -> query -> move -> query -> delete -> query', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const timestamp = Date.now();
      const originalPath = `db://assets/WorkflowOriginal_${timestamp}.json`;
      const copyPath = `db://assets/WorkflowCopy_${timestamp}.json`;
      const movedPath = `db://assets/WorkflowMoved_${timestamp}.json`;

      // ===== Step 1: Create asset =====
      const createResult = await testClient.execute('asset-db', 'create-asset', [originalPath, '{"test": "data"}']);
      validateApiResponse(createResult);
      if (!createResult.success || !createResult.data) {
        throw new Error(`Create asset failed: ${createResult.error}`);
      }

      const createdAsset = createResult.data as { url: string; uuid: string };
      expect(createdAsset.url).toBe(originalPath);
      expect(createdAsset.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // ===== Step 2: Query to verify creation =====
      const queryAfterCreate = await testClient.execute('asset-db', 'query-asset-info', [originalPath]);
      validateApiResponse(queryAfterCreate);
      if (!queryAfterCreate.success || !queryAfterCreate.data) {
        throw new Error('Query after create failed or returned no data');
      }
      verifyAssetInfo(queryAfterCreate.data, originalPath, createdAsset.uuid);

      // ===== Step 3: Copy asset =====
      const copyResult = await testClient.execute('asset-db', 'copy-asset', [originalPath, copyPath]);
      validateApiResponse(copyResult);
      if (!copyResult.success) {
        throw new Error(`Copy asset failed: ${copyResult.error}`);
      }

      // ===== Step 4: Query to verify copy =====
      const queryAfterCopy = await testClient.execute('asset-db', 'query-asset-info', [copyPath]);
      validateApiResponse(queryAfterCopy);
      if (!queryAfterCopy.success || !queryAfterCopy.data) {
        throw new Error('Query after copy failed or returned no data');
      }
      const copiedAsset = queryAfterCopy.data as { url: string; uuid: string };
      expect(copiedAsset.url).toBe(copyPath);
      // Copy should have a different UUID
      expect(copiedAsset.uuid).not.toBe(createdAsset.uuid);

      // Verify original still exists after copy
      const originalStillExists = await testClient.execute('asset-db', 'query-asset-info', [originalPath]);
      validateApiResponse(originalStillExists);
      if (!originalStillExists.success || !originalStillExists.data) {
        throw new Error('Original asset missing after copy');
      }

      // ===== Step 5: Move asset =====
      const moveResult = await testClient.execute('asset-db', 'move-asset', [copyPath, movedPath]);
      validateApiResponse(moveResult);
      if (!moveResult.success) {
        throw new Error(`Move asset failed: ${moveResult.error}`);
      }

      // ===== Step 6: Query to verify move =====
      const queryAfterMove = await testClient.execute('asset-db', 'query-asset-info', [movedPath]);
      validateApiResponse(queryAfterMove);
      if (!queryAfterMove.success || !queryAfterMove.data) {
        throw new Error('Query after move failed or returned no data');
      }
      const movedAsset = queryAfterMove.data as { url: string; uuid: string };
      expect(movedAsset.url).toBe(movedPath);
      // Move should preserve the UUID from the copied asset
      expect(movedAsset.uuid).toBe(copiedAsset.uuid);

      // Verify old path no longer exists after move
      const oldPathGone = await testClient.execute('asset-db', 'query-asset-info', [copyPath]);
      validateApiResponse(oldPathGone);
      expect(oldPathGone.success).toBe(true);
      expect(oldPathGone.data).toBeNull();

      // ===== Step 7: Delete both assets =====
      const deleteOriginalResult = await testClient.execute('asset-db', 'delete-asset', [originalPath]);
      validateApiResponse(deleteOriginalResult);
      if (!deleteOriginalResult.success) {
        throw new Error(`Delete original asset failed: ${deleteOriginalResult.error}`);
      }

      const deleteMovedResult = await testClient.execute('asset-db', 'delete-asset', [movedPath]);
      validateApiResponse(deleteMovedResult);
      if (!deleteMovedResult.success) {
        throw new Error(`Delete moved asset failed: ${deleteMovedResult.error}`);
      }

      // ===== Step 8: Query to verify deletion =====
      const queryOriginalAfterDelete = await testClient.execute('asset-db', 'query-asset-info', [originalPath]);
      validateApiResponse(queryOriginalAfterDelete);
      expect(queryOriginalAfterDelete.success).toBe(true);
      expect(queryOriginalAfterDelete.data).toBeNull();

      const queryMovedAfterDelete = await testClient.execute('asset-db', 'query-asset-info', [movedPath]);
      validateApiResponse(queryMovedAfterDelete);
      expect(queryMovedAfterDelete.success).toBe(true);
      expect(queryMovedAfterDelete.data).toBeNull();
    });

    it('should handle save-asset and save-asset-meta in workflow', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const timestamp = Date.now();
      const scenePath = `db://assets/SaveWorkflowScene_${timestamp}.scene`;
      const prefabPath = `db://assets/SaveWorkflowPrefab_${timestamp}.prefab`;

      // ===== Test save-asset with .scene file =====
      // Create scene
      const createSceneResult = await testClient.execute('asset-db', 'create-asset', [scenePath]);
      validateApiResponse(createSceneResult);
      if (!createSceneResult.success) {
        throw new Error(`Create scene failed: ${createSceneResult.error}`);
      }

      // Open scene
      const openSceneResult = await testClient.execute('asset-db', 'open-asset', [scenePath]);
      validateApiResponse(openSceneResult);
      if (!openSceneResult.success) {
        throw new Error(`Open scene failed: ${openSceneResult.error}`);
      }

      // Save scene with new content
      const sceneContent = JSON.stringify({ __type__: 'cc.SceneAsset', data: { __type__: 'cc.Scene' } });
      const saveSceneResult = await testClient.execute('asset-db', 'save-asset', [scenePath, sceneContent]);
      validateApiResponse(saveSceneResult);
      if (!saveSceneResult.success) {
        throw new Error(`Save scene failed: ${saveSceneResult.error}`);
      }

      // ===== Test save-asset with .prefab file =====
      // Create prefab
      const createPrefabResult = await testClient.execute('asset-db', 'create-asset', [prefabPath]);
      validateApiResponse(createPrefabResult);
      if (!createPrefabResult.success) {
        throw new Error(`Create prefab failed: ${createPrefabResult.error}`);
      }

      // Open prefab
      const openPrefabResult = await testClient.execute('asset-db', 'open-asset', [prefabPath]);
      validateApiResponse(openPrefabResult);
      if (!openPrefabResult.success) {
        throw new Error(`Open prefab failed: ${openPrefabResult.error}`);
      }

      // Save prefab with new content
      const prefabContent = JSON.stringify({ _name: 'TestPrefab', type: 'cc.Prefab' });
      const savePrefabResult = await testClient.execute('asset-db', 'save-asset', [prefabPath, prefabContent]);
      validateApiResponse(savePrefabResult);
      if (!savePrefabResult.success) {
        throw new Error(`Save prefab failed: ${savePrefabResult.error}`);
      }

      // ===== Test save-asset-meta =====
      const metaQueryResult = await testClient.execute('asset-db', 'query-asset-meta', [scenePath]);
      validateApiResponse(metaQueryResult);
      if (!metaQueryResult.success || !metaQueryResult.data) {
        throw new Error('Query meta failed');
      }

      // Save meta
      const metaContent = JSON.stringify(metaQueryResult.data);
      const saveMetaResult = await testClient.execute('asset-db', 'save-asset-meta', [scenePath, metaContent]);
      validateApiResponse(saveMetaResult);
      if (!saveMetaResult.success) {
        throw new Error(`Save meta failed: ${saveMetaResult.error}`);
      }

      // ===== Cleanup =====
      const deleteSceneResult = await testClient.execute('asset-db', 'delete-asset', [scenePath]);
      validateApiResponse(deleteSceneResult);
      if (!deleteSceneResult.success) {
        throw new Error(`Delete scene failed: ${deleteSceneResult.error}`);
      }

      const deletePrefabResult = await testClient.execute('asset-db', 'delete-asset', [prefabPath]);
      validateApiResponse(deletePrefabResult);
      if (!deletePrefabResult.success) {
        throw new Error(`Delete prefab failed: ${deletePrefabResult.error}`);
      }

      // Verify deletion
      const verifySceneDelete = await testClient.execute('asset-db', 'query-asset-info', [scenePath]);
      validateApiResponse(verifySceneDelete);
      expect(verifySceneDelete.success).toBe(true);
      expect(verifySceneDelete.data).toBeNull();

      const verifyPrefabDelete = await testClient.execute('asset-db', 'query-asset-info', [prefabPath]);
      validateApiResponse(verifyPrefabDelete);
      expect(verifyPrefabDelete.success).toBe(true);
      expect(verifyPrefabDelete.data).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid asset path gracefully in create-asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      await expect(
        testClient.execute('asset-db', 'create-asset', ['invalid-path.json'])
      ).rejects.toThrow();
    });

    it('should handle non-existent asset in delete-asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'delete-asset', ['db://assets/NonExistentAsset.prefab']);
      validateApiResponse(result);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle non-existent source in copy-asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'copy-asset', [
        'db://assets/NonExistentSource.prefab',
        'db://assets/Target.prefab',
      ]);
      validateApiResponse(result);
      expect(result.success).toBe(false);
    });

    it('should handle non-existent source in move-asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'move-asset', [
        'db://assets/NonExistentSource.scene',
        'db://assets/Target.scene',
      ]);
      validateApiResponse(result);
      expect(result.success).toBe(false);
    });

    it('should handle non-existent local file in import-asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'import-asset', [
        'db://assets/Imported.png',
        '/fake/local/path/to/file.png',
      ]);
      validateApiResponse(result);
      expect(result.success).toBe(false);
    });
  });

  describe('Additional Query Operations', () => {
    it('should query UUID by path', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Get a real asset first
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { url: string; uuid: string };
        const result = await testClient.execute('asset-db', 'query-uuid', [firstAsset.url]);
        validateApiResponse(result);
        expect(result.success).toBe(true);
        expect(result.data).toBe(firstAsset.uuid);
      }
    });

    it('should query path by UUID', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Get a real asset first
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { uuid: string };
        const result = await testClient.execute('asset-db', 'query-path', [firstAsset.uuid]);
        validateApiResponse(result);
        expect(result.success).toBe(true);
        expect(typeof result.data).toBe('string');
      }
    });

    it('should query URL by UUID', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Get a real asset first
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { uuid: string };
        const result = await testClient.execute('asset-db', 'query-url', [firstAsset.uuid]);
        validateApiResponse(result);
        expect(result.success).toBe(true);
        expect(typeof result.data).toBe('string');
      }
    });

    it('should query asset dependencies', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { url: string };
        const result = await testClient.execute('asset-db', 'query-asset-dependencies', [firstAsset.url]);
        validateApiResponse(result);
        // Dependencies may or may not exist
        if (result.success && result.data) {
          expect(Array.isArray(result.data)).toBe(true);
        }
      }
    });

    it('should query asset users', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-asset-users', [
        '00000000-0000-0000-0000-000000000000',
      ]);
      validateApiResponse(result);
      expect(result).toHaveProperty('success');
    });

    it('should query missing asset info', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-missing-asset-info', [
        '00000000-0000-0000-0000-000000000000',
      ]);
      validateApiResponse(result);
      expect(result).toHaveProperty('success');
    });

    it('should refresh asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'refresh-asset', ['db://assets']);
      validateApiResponse(result);
      expect(result.success).toBe(true);
    });

    it('should reimport asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'reimport-asset', ['db://assets']);
      validateApiResponse(result);
      expect(result).toHaveProperty('success');
    });
  });
});
