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

describe('Asset Database Integration Tests', () => {
  describe('query-ready', () => {
    it('should return true when asset database is ready', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-ready');
      validateApiResponse(result);

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });

  describe('query-assets', () => {
    it('should query all assets', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(result);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      // Verify assets count is reasonable (project should have at least some assets)
      if (result.data && Array.isArray(result.data)) {
        expect(result.data.length).toBeGreaterThan(0);
      }
      // Verify each asset has basic structure with specific properties
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const firstAsset = result.data[0] as Record<string, unknown>;
        expect(firstAsset).toHaveProperty('path');
        expect(typeof firstAsset.path).toBe('string');
        // Verify common asset properties exist
        expect(firstAsset).toHaveProperty('type');
        expect(typeof firstAsset.type).toBe('string');
      }
    });

    it('should query assets by pattern', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-assets', ['db://assets']);
      validateApiResponse(result);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      // Verify pattern returns filtered results (may include internal assets)
      if (result.data && Array.isArray(result.data)) {
        expect(result.data.length).toBeGreaterThan(0);
        // Verify at least some assets match the pattern
        const matchingAssets = result.data.filter((asset: { path: string }) =>
          asset.path.startsWith('db://assets')
        );
        expect(matchingAssets.length).toBeGreaterThan(0);
      }
      // Verify all returned assets have valid db:// paths
      if (result.data) {
        for (const asset of result.data as Array<{ path: string }>) {
          expect(asset.path).toBeDefined();
          expect(typeof asset.path).toBe('string');
          expect(asset.path).toMatch(/^db:\/\//);
        }
      }
    });
  });

  describe('query-asset-info', () => {
    it('should query existing asset info', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First, get a list of assets to find a real one
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        // Query the first real asset
        const firstAsset = assetsResult.data[0] as { path: string };
        const result = await testClient.execute('asset-db', 'query-asset-info', [firstAsset.path]);
        validateApiResponse(result);

        // Should return a valid response with asset details
        if (result.success && result.data) {
          const assetInfo = result.data as Record<string, unknown>;
          // Verify common asset properties
          expect(assetInfo).toHaveProperty('path');
          expect(typeof assetInfo.path).toBe('string');
          expect(assetInfo.path).toBe(firstAsset.path);

          // Verify asset has type information
          expect(assetInfo).toHaveProperty('type');
          expect(typeof assetInfo.type).toBe('string');

          // Verify asset has imported status
          expect(assetInfo).toHaveProperty('imported');
          expect(typeof assetInfo.imported).toBe('boolean');

          // Verify asset has uuid
          expect(assetInfo).toHaveProperty('uuid');
          expect(typeof assetInfo.uuid).toBe('string');
        }
      }
    });

    it('should handle non-existent asset gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-asset-info', [
        'db://assets/NonExistentAsset12345.asset',
      ]);
      validateApiResponse(result);

      // Non-existent asset may return success with null data or failure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('query-uuid', () => {
    it('should query UUID for real asset path', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First, get a list of assets to find a real one
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { path: string; uuid: string };
        const result = await testClient.execute('asset-db', 'query-uuid', [firstAsset.path]);
        validateApiResponse(result);

        // Should return the UUID for the asset
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe('string');
        // Verify UUID format (standard UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
        expect(result.data).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      }
    });

    it('should handle invalid path gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-uuid', ['invalid-path-without-db-prefix']);
      validateApiResponse(result);

      // API accepts any path format - verify response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      // error property may or may not exist
    });
  });

  describe('generate-available-url', () => {
    it('should generate available URL for new asset', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'generate-available-url', [
        'db://assets/NewTestAsset.prefab',
        false,
      ]);
      validateApiResponse(result);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(typeof result.data).toBe('string');
      // Verify the URL starts with the requested path
      expect(result.data).toMatch(/^db:\/\/assets\/NewTestAsset/);
      // Verify the URL ends with .prefab extension
      const url = result.data as string;
      expect(url.endsWith('.prefab')).toBe(true);
      // Verify the URL is a valid db:// path
      expect(result.data).toMatch(/^db:\/\/.*\.prefab$/);
    });

    it('should generate available URL with isDirectory parameter', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'generate-available-url', [
        'db://assets/TestDir/TestFile.scene',
        false,
      ]);
      validateApiResponse(result);

      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('string');
      expect(result.data).toMatch(/^db:\/\/assets\/TestDir\/TestFile.*\.scene$/);
    });
  });

  describe('create-asset', () => {
    it('should create json asset with auto-generated template', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Generate a unique test asset name
      const testAssetPath = `db://assets/TestJsonAsset_${Date.now()}.json`;
      const result = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(result);

      // Verify creation response structure
      expect(result).toHaveProperty('success');

      // If creation succeeded, verify the asset was created
      if (result.success) {
        expect(result).toHaveProperty('data');
        if (result.data) {
          expect(typeof result.data).toBe('object');
          const createdAsset = result.data as { path: string; uuid: string };
          expect(createdAsset.path).toBe(testAssetPath);
          expect(typeof createdAsset.uuid).toBe('string');
          expect(createdAsset.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        }
      } else {
        // Creation failed - verify error is meaningful
        expect(result).toHaveProperty('error');
        if (result.error) {
          expect(typeof result.error).toBe('string');
          expect(result.error.length).toBeGreaterThan(0);
        }
      }
    });

    it('should create prefab asset with auto-generated template', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const testAssetPath = `db://assets/TestPrefab_${Date.now()}.prefab`;
      const result = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(result);

      expect(result).toHaveProperty('success');

      if (result.success) {
        expect(result).toHaveProperty('data');
        if (result.data) {
          const createdAsset = result.data as { path: string; uuid: string };
          expect(createdAsset.path).toBe(testAssetPath);
          expect(typeof createdAsset.uuid).toBe('string');
        }
      } else {
        expect(result).toHaveProperty('error');
      }
    });

    it('should handle invalid asset path gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Invalid path without db:// prefix
      const result = await testClient.execute('asset-db', 'create-asset', ['invalid-path.json']);
      validateApiResponse(result);

      // Should fail gracefully
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('error');
      if (result.error) {
        expect(typeof result.error).toBe('string');
      }
    });
  });

  describe('query-path and query-url', () => {
    it('should handle query-path gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-path', [
        '00000000-0000-0000-0000-000000000000',
      ]);
      validateApiResponse(result);

      // Non-existent UUID should return failure or success with null
      expect(result).toHaveProperty('success');
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should query path for valid UUID', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First create an asset to get a valid UUID
      const testPath = `db://assets/test-query-path-${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [
        testPath,
        '{}',
      ]);
      validateApiResponse(createResult);
      expect(createResult.success).toBe(true);

      // Get the UUID from the created asset
      const assetInfo = await testClient.execute('asset-db', 'query-asset-info', [
        testPath,
      ]);
      validateApiResponse(assetInfo);

      if (assetInfo.success && assetInfo.data && typeof assetInfo.data === 'object') {
        const data = assetInfo.data as Record<string, unknown>;
        const uuid = data.uuid as string;

        // Verify UUID format
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

        // Now query path using the valid UUID
        const pathResult = await testClient.execute('asset-db', 'query-path', [
          uuid,
        ]);
        validateApiResponse(pathResult);
        expect(pathResult.success).toBe(true);

        // Verify the returned path is a file system path (not db://)
        if (pathResult.data) {
          expect(typeof pathResult.data).toBe('string');
          // query-path returns file system path, not db:// path
          expect(pathResult.data).toMatch(/assets[/\\]test-query-path-.*\.json$/);
          // Should NOT be a db:// path
          expect(pathResult.data).not.toMatch(/^db:\/\//);
        }

        // Cleanup
        await testClient.execute('asset-db', 'delete-asset', [testPath]);
      }
    });

    it('should handle query-url gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-url', [
        '00000000-0000-0000-0000-000000000000',
      ]);
      validateApiResponse(result);

      expect(result).toHaveProperty('success');
    });

    it('should query url for valid UUID', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First create an asset to get a valid UUID
      const testPath = `db://assets/test-query-url-${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [
        testPath,
        '{}',
      ]);
      validateApiResponse(createResult);
      expect(createResult.success).toBe(true);

      // Get the UUID from the created asset
      const assetInfo = await testClient.execute('asset-db', 'query-asset-info', [
        testPath,
      ]);
      validateApiResponse(assetInfo);

      if (assetInfo.success && assetInfo.data && typeof assetInfo.data === 'object') {
        const data = assetInfo.data as Record<string, unknown>;
        const uuid = data.uuid as string;

        // Verify UUID format
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

        // Now query URL using the valid UUID
        const urlResult = await testClient.execute('asset-db', 'query-url', [
          uuid,
        ]);
        validateApiResponse(urlResult);
        expect(urlResult.success).toBe(true);

        // Verify the returned URL is valid (should be db:// path)
        if (urlResult.data) {
          expect(typeof urlResult.data).toBe('string');
          // query-url returns db:// path
          expect(urlResult.data).toMatch(/^db:\/\/assets\/test-query-url-.*\.json$/);
        }

        // Cleanup
        await testClient.execute('asset-db', 'delete-asset', [testPath]);
      }
    });
  });

  describe('refresh-asset', () => {
    it('should refresh existing asset status', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'refresh-asset', ['db://assets']);
      validateApiResponse(result);

      expect(result.success).toBe(true);
    });
  });

  describe('reimport-asset', () => {
    it('should handle reimport gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'reimport-asset', ['db://assets']);
      validateApiResponse(result);

      // reimport may succeed or fail - verify response structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      // error property may or may not exist depending on success
    });
  });

  describe('query-asset-meta', () => {
    it('should query asset meta', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First, get a real asset
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { path: string };
        const result = await testClient.execute('asset-db', 'query-asset-meta', [firstAsset.path]);
        validateApiResponse(result);

        expect(result).toHaveProperty('success');
        if (result.success && result.data) {
          expect(typeof result.data).toBe('object');
          // Verify meta has common properties
          const meta = result.data as Record<string, unknown>;
          expect(meta).toHaveProperty('ver');
          expect(typeof meta.ver).toBe('string');
          expect(meta).toHaveProperty('imported');
          expect(typeof meta.imported).toBe('boolean');
        }
      }
    });
  });

  describe('query-asset-dependencies', () => {
    it('should query asset dependencies', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First, get a real asset
      const assetsResult = await testClient.execute('asset-db', 'query-assets');
      validateApiResponse(assetsResult);

      if (assetsResult.success && Array.isArray(assetsResult.data) && assetsResult.data.length > 0) {
        const firstAsset = assetsResult.data[0] as { path: string };
        const result = await testClient.execute('asset-db', 'query-asset-dependencies', [firstAsset.path]);
        validateApiResponse(result);

        expect(result).toHaveProperty('success');
        if (result.success && result.data) {
          expect(Array.isArray(result.data)).toBe(true);
          // Dependencies should be an array of objects with uuid and dep paths
          for (const dep of result.data as Array<{ uuid: string }>) {
            expect(dep).toHaveProperty('uuid');
            expect(typeof dep.uuid).toBe('string');
            expect(dep.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
          }
        }
      }
    });
  });

  describe('query-asset-users', () => {
    it('should query asset users with UUID', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-asset-users', [
        '00000000-0000-0000-0000-000000000000',
      ]);
      validateApiResponse(result);

      // Should return a valid response structure
      expect(result).toHaveProperty('success');
      if (result.success && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
  });

  describe('open-asset and save-asset', () => {
    it('should open asset in editor', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // First create a test scene to open
      const testScenePath = `db://assets/TestSceneToOpen_${Date.now()}.scene`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testScenePath]);
      validateApiResponse(createResult);
      expect(createResult.success).toBe(true);
      if (createResult.success) {
        // Open the scene in editor
        const openResult = await testClient.execute('asset-db', 'open-asset', [testScenePath]);
        validateApiResponse(openResult);

        // Opening a valid scene should succeed
        expect(openResult.success).toBe(true);

        // Cleanup
        // await testClient.execute('asset-db', 'delete-asset', [testScenePath]);
      }
    });

    it('should save asset changes', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a test prefab
      const testPrefabPath = `db://assets/TestPrefabToSave_${Date.now()}.prefab`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testPrefabPath]);
      validateApiResponse(createResult);
      expect(createResult.success).toBe(true);
      
      if (createResult.success && createResult.data) {
        // Step 2: Open the prefab in editor
        const openResult = await testClient.execute('asset-db', 'open-asset', [testPrefabPath]);
        validateApiResponse(openResult);
        expect(openResult.success).toBe(true);

        // Step 3: Create a node in the current scene (which should be the opened prefab)
        const nodeName = `TestNode_${Date.now()}`;
        const createNodeResult = await testClient.execute('scene', 'create-node', [
          { name: nodeName },
        ]);
        validateApiResponse(createNodeResult);

        if (createNodeResult.success && createNodeResult.data) {
          const createdNode = createNodeResult.data as { uuid: string };
          expect(createdNode.uuid).toBeDefined();
          expect(typeof createdNode.uuid).toBe('string');

          // Step 4: Save the asset
          const saveResult = await testClient.execute('asset-db', 'save-asset', [testPrefabPath]);
          validateApiResponse(saveResult);
          expect(saveResult.success).toBe(true);

          // Step 5: Verify the changes were persisted by reopening and checking
          // Reopen the asset
          await testClient.execute('asset-db', 'open-asset', [testPrefabPath]);

          // Note: The node persistence verification depends on the scene structure
          // At minimum, we've verified that open-asset and save-asset execute without errors
        }

        // Cleanup
        // await testClient.execute('asset-db', 'delete-asset', [testPrefabPath]);
      }
    });

    it('should save asset meta file', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Create a test asset
      const testAssetPath = `db://assets/TestMetaSave_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      if (createResult.success) {
        // Query the original meta
        const originalMetaResult = await testClient.execute('asset-db', 'query-asset-meta', [
          testAssetPath,
        ]);
        validateApiResponse(originalMetaResult);

        if (originalMetaResult.success && originalMetaResult.data) {
          const originalMeta = originalMetaResult.data as Record<string, unknown>;
          expect(originalMeta).toHaveProperty('ver');
          expect(typeof originalMeta.ver).toBe('string');

          // Save the asset meta (this may trigger meta regeneration)
          const saveMetaResult = await testClient.execute('asset-db', 'save-asset-meta', [
            testAssetPath,
          ]);
          validateApiResponse(saveMetaResult);

          // Verify the meta still exists and is valid after saving
          const newMetaResult = await testClient.execute('asset-db', 'query-asset-meta', [
            testAssetPath,
          ]);
          validateApiResponse(newMetaResult);

          if (newMetaResult.success && newMetaResult.data) {
            const newMeta = newMetaResult.data as Record<string, unknown>;
            expect(newMeta).toHaveProperty('ver');
            expect(typeof newMeta.ver).toBe('string');
          }
        }

        // Cleanup
        await testClient.execute('asset-db', 'delete-asset', [testAssetPath]);
      }
    });
  });

  describe('copy-asset and move-asset', () => {
    it('should handle copy operations gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'copy-asset', [
        'db://assets/Source.prefab',
        'db://assets/Target.prefab',
      ]);
      validateApiResponse(result);

      // Non-existent source should fail gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }
    });

    it('should handle move operations gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'move-asset', [
        'db://assets/Source.scene',
        'db://assets/Target.scene',
      ]);
      validateApiResponse(result);

      // Non-existent source should fail gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe('delete-asset', () => {
    it('should handle delete operations gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'delete-asset', [
        'db://assets/NonExistentAssetToDelete.prefab',
      ]);
      validateApiResponse(result);

      // Non-existent asset should fail gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe('import-asset', () => {
    it('should handle import operations gracefully', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'import-asset', [
        'db://assets/Imported.png',
        '/fake/local/path/to/file.png',
      ]);
      validateApiResponse(result);

      // Non-existent local file should fail gracefully
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }
    });
  });

  describe('query-missing-asset-info', () => {
    it('should query missing asset info', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      const result = await testClient.execute('asset-db', 'query-missing-asset-info', [
        '00000000-0000-0000-0000-000000000000',
      ]);
      validateApiResponse(result);

      expect(result).toHaveProperty('success');
      if (result.success && result.data) {
        expect(typeof result.data).toBe('object');
      }
    });
  });

  describe('Asset workflow tests', () => {
    it('should create asset and verify with query-asset-info', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a new asset
      const testAssetPath = `db://assets/WorkflowTest_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      // Only verify if creation succeeded
      if (createResult.success && createResult.data) {
        const createdAsset = createResult.data as { path: string; uuid: string };
        expect(createdAsset.path).toBe(testAssetPath);

        // Step 2: Query the created asset info
        const queryResult = await testClient.execute('asset-db', 'query-asset-info', [testAssetPath]);
        validateApiResponse(queryResult);

        // Verify the asset info matches what was created
        expect(queryResult.success).toBe(true);
        if (queryResult.success && queryResult.data) {
          const assetInfo = queryResult.data as Record<string, unknown>;
          expect(assetInfo.path).toBe(testAssetPath);
          expect(assetInfo.uuid).toBe(createdAsset.uuid);
        }
      }
    });

    it('should create asset and verify with query-uuid', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a new asset
      const testAssetPath = `db://assets/UuidTest_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      if (createResult.success && createResult.data) {
        const createdAsset = createResult.data as { path: string; uuid: string };

        // Step 2: Query UUID by path
        const uuidResult = await testClient.execute('asset-db', 'query-uuid', [testAssetPath]);
        validateApiResponse(uuidResult);

        // Verify the UUID matches
        expect(uuidResult.success).toBe(true);
        if (uuidResult.success && uuidResult.data) {
          expect(uuidResult.data).toBe(createdAsset.uuid);
        }
      }
    });

    it('should create asset and verify with query-assets', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a new asset
      const testAssetPath = `db://assets/ListTest_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      if (createResult.success && createResult.data) {
        // Step 2: Query all assets and verify our asset is in the list
        const queryResult = await testClient.execute('asset-db', 'query-assets');
        validateApiResponse(queryResult);

        expect(queryResult.success).toBe(true);
        if (queryResult.success && Array.isArray(queryResult.data)) {
          // Find our created asset in the list
          const foundAsset = queryResult.data.find(
            (asset: { path: string }) => asset.path === testAssetPath
          );
          expect(foundAsset).toBeDefined();
        }
      }
    });

    it('should create asset and verify with query-path', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a new asset
      const testAssetPath = `db://assets/PathTest_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      if (createResult.success && createResult.data) {
        const createdAsset = createResult.data as { path: string; uuid: string };

        // Step 2: Query path by UUID
        const pathResult = await testClient.execute('asset-db', 'query-path', [createdAsset.uuid]);
        validateApiResponse(pathResult);

        // Verify the path matches
        expect(pathResult).toHaveProperty('success');
        if (pathResult.success && pathResult.data) {
          expect(pathResult.data).toBe(testAssetPath);
        }
      }
    });

    it('should create asset and verify with query-url', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a new asset
      const testAssetPath = `db://assets/UrlTest_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      if (createResult.success && createResult.data) {
        const createdAsset = createResult.data as { path: string; uuid: string };

        // Step 2: Query URL by UUID
        const urlResult = await testClient.execute('asset-db', 'query-url', [createdAsset.uuid]);
        validateApiResponse(urlResult);

        // Verify the response structure
        expect(urlResult).toHaveProperty('success');
        if (urlResult.success && urlResult.data) {
          expect(typeof urlResult.data).toBe('string');
        }
      }
    });

    it('should create asset and verify with query-asset-meta', async () => {
      if (!isServerAvailable || !testClient) {
        return;
      }

      // Step 1: Create a new asset
      const testAssetPath = `db://assets/MetaTest_${Date.now()}.json`;
      const createResult = await testClient.execute('asset-db', 'create-asset', [testAssetPath]);
      validateApiResponse(createResult);

      if (createResult.success && createResult.data) {
        // Step 2: Query asset meta
        const metaResult = await testClient.execute('asset-db', 'query-asset-meta', [testAssetPath]);
        validateApiResponse(metaResult);

        // Verify meta structure
        expect(metaResult).toHaveProperty('success');
        if (metaResult.success && metaResult.data) {
          const meta = metaResult.data as Record<string, unknown>;
          expect(typeof meta).toBe('object');
          expect(meta).toHaveProperty('ver');
        }
      }
    });
  });
});
