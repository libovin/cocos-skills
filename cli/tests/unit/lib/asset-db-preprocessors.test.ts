/**
 * Asset Database Preprocessors Unit Tests
 *
 * Tests for asset-db module preprocessors:
 * - create-asset preprocessor: Auto-generates default asset data
 * - save-asset preprocessor: For scene/prefab uses query-dirty+query-node-tree, others use templates
 */

import { describe, it, expect, vi } from 'vitest';
import { assetDbCreateAssetPreprocessor } from '../../../src/lib/preprocessors/asset-db/create-asset.preprocessor.js';
import { assetDbSaveAssetPreprocessor } from '../../../src/lib/preprocessors/asset-db/save-asset.preprocessor.js';
import type { CocosClient } from '../../../src/lib/client.js';

// Mock client for create-asset testing
const mockClient = {
  execute: async () => ({ success: true, data: {} }),
} as unknown as CocosClient;

// Mock client for save-asset testing with scene/prefab support
const mockClientWithScene = {
  execute: vi.fn(async (module: string, action: string, _params: unknown[]) => {
    if (module === 'scene' && action === 'query-dirty') {
      return { success: true, data: true };
    }
    if (module === 'scene' && action === 'query-node-tree') {
      return {
        success: true,
        data: {
          uuid: 'scene-uuid',
          name: 'Canvas',
          children: [
            { uuid: 'child-1', name: 'Node1', children: [] },
          ],
        },
      };
    }
    return { success: true, data: {} };
  }),
} as unknown as CocosClient;

// Mock client that throws error for scene queries (fallback test)
const mockClientWithError = {
  execute: vi.fn(async () => {
    throw new Error('Scene not open');
  }),
} as unknown as CocosClient;

/**
 * Common test cases for create-asset preprocessor
 */
function runCreateAssetTests() {
  describe('create-asset preprocessor', () => {
    it('should auto-generate default data when only path is provided', async () => {
      const params = ['db://assets/TestPrefab.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('db://assets/TestPrefab.prefab');
      expect(typeof result[1]).toBe('string');
      expect(() => JSON.parse(result[1] as string)).not.toThrow();
    });

    it('should generate scene template for .scene files', async () => {
      const params = ['db://assets/TestScene.scene'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('__type__', 'cc.SceneAsset');
    });

    it('should generate prefab template for .prefab files', async () => {
      const params = ['db://assets/TestPrefab.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('__type__', 'cc.Prefab');
    });

    it('should generate material template for .material files', async () => {
      const params = ['db://assets/TestMaterial.material'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(Array.isArray(data)).toBe(false);
      expect(data).toHaveProperty('__type__', 'cc.Material');
    });

    it('should generate material template for .mtl files', async () => {
      const params = ['db://assets/TestMaterial.mtl'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.Material');
    });

    it('should generate physics material template for .pmtl files', async () => {
      const params = ['db://assets/TestPhysicsMaterial.pmtl'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.PhysicsMaterial');
    });

    it('should generate animation template for .anim files', async () => {
      const params = ['db://assets/TestAnimation.anim'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.AnimationClip');
    });

    it('should generate animation mask template for .animask files', async () => {
      const params = ['db://assets/TestMask.animask'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.animation.AnimationMask');
    });

    it('should generate sprite atlas template for .pac files', async () => {
      const params = ['db://assets/TestAtlas.pac'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.SpriteAtlas');
    });

    it('should generate label atlas template for .labelatlas files', async () => {
      const params = ['db://assets/TestLabelAtlas.labelatlas'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.LabelAtlas');
    });

    it('should generate generic asset template for unknown extensions', async () => {
      const params = ['db://assets/TestUnknown.unknownext'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(data).toHaveProperty('__type__', 'cc.Asset');
    });

    it('should pass through params when data is already provided', async () => {
      const customData = JSON.stringify({ __type__: 'cc.CustomAsset', custom: 'data' });
      const params = ['db://assets/TestAsset.asset', customData];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('db://assets/TestAsset.asset');
      expect(result[1]).toBe(customData);
    });

    it('should handle empty params array', async () => {
      const params: unknown[] = [];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(0);
    });

    it('should handle params with more than 2 elements', async () => {
      const params = ['db://assets/Test.asset', '{}', 'extra'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('db://assets/Test.asset');
      expect(result[1]).toBe('{}');
      expect(result[2]).toBe('extra');
    });

    it('should use file name from path in generated template', async () => {
      const params = ['db://assets/MyCustomPrefab.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      const data = JSON.parse(result[1] as string);
      expect(data[0]).toHaveProperty('_name', 'MyCustomPrefab');
    });

    it('should handle paths with directories', async () => {
      const params = ['db://assets/prefabs/ui/MenuButton.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      const data = JSON.parse(result[1] as string);
      expect(data[0]).toHaveProperty('_name', 'MenuButton');
    });
  });
}

/**
 * Tests for save-asset preprocessor with scene/prefab logic
 */
function runSaveAssetTests() {
  describe('save-asset preprocessor', () => {
    describe('with scene/prefab files', () => {
      it('should call query-dirty and query-node-tree for .scene files', async () => {
        const params = ['db://assets/TestScene.scene'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClientWithScene);

        expect(mockClientWithScene.execute).toHaveBeenCalledWith('scene', 'query-dirty', []);
        expect(mockClientWithScene.execute).toHaveBeenCalledWith('scene', 'query-node-tree', []);
        expect(result).toHaveLength(2);
        expect(result[0]).toBe('db://assets/TestScene.scene');
      });

      it('should call query-dirty and query-node-tree for .prefab files', async () => {
        const params = ['db://assets/TestPrefab.prefab'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClientWithScene);

        expect(mockClientWithScene.execute).toHaveBeenCalledWith('scene', 'query-dirty', []);
        expect(mockClientWithScene.execute).toHaveBeenCalledWith('scene', 'query-node-tree', []);
        expect(result).toHaveLength(2);
        expect(result[0]).toBe('db://assets/TestPrefab.prefab');
      });

      it('should serialize dirty and nodeTree data into content', async () => {
        const params = ['db://assets/TestScene.scene'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClientWithScene);

        const content = JSON.parse(result[1] as string);
        expect(content).toHaveProperty('dirty', true);
        expect(content).toHaveProperty('nodeTree');
        expect(content.nodeTree).toHaveProperty('uuid', 'scene-uuid');
        expect(content.nodeTree).toHaveProperty('name', 'Canvas');
      });

      it('should fallback to default template when scene query fails', async () => {
        const params = ['db://assets/TestScene.scene'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClientWithError);

        expect(mockClientWithError.execute).toHaveBeenCalledWith('scene', 'query-dirty', []);
        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        // Should fall back to default template (array for scene)
        expect(Array.isArray(data)).toBe(true);
        expect(data[0]).toHaveProperty('__type__', 'cc.SceneAsset');
      });
    });

    describe('with non-scene/prefab files', () => {
      it('should use default template for .material files', async () => {
        const params = ['db://assets/TestMaterial.material'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(Array.isArray(data)).toBe(false);
        expect(data).toHaveProperty('__type__', 'cc.Material');
      });

      it('should use default template for .mtl files', async () => {
        const params = ['db://assets/TestMaterial.mtl'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.Material');
      });

      it('should use default template for .pmtl files', async () => {
        const params = ['db://assets/TestPhysicsMaterial.pmtl'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.PhysicsMaterial');
      });

      it('should use default template for .anim files', async () => {
        const params = ['db://assets/TestAnimation.anim'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.AnimationClip');
      });

      it('should use default template for .animask files', async () => {
        const params = ['db://assets/TestMask.animask'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.animation.AnimationMask');
      });

      it('should use default template for .pac files', async () => {
        const params = ['db://assets/TestAtlas.pac'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.SpriteAtlas');
      });

      it('should use default template for .labelatlas files', async () => {
        const params = ['db://assets/TestLabelAtlas.labelatlas'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.LabelAtlas');
      });

      it('should use default template for unknown extensions', async () => {
        const params = ['db://assets/TestUnknown.unknownext'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        const data = JSON.parse(result[1] as string);
        expect(data).toHaveProperty('__type__', 'cc.Asset');
      });
    });

    describe('common behavior', () => {
      it('should pass through params when content is already provided', async () => {
        const customData = JSON.stringify({ __type__: 'cc.CustomAsset', custom: 'data' });
        const params = ['db://assets/TestAsset.asset', customData];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(2);
        expect(result[0]).toBe('db://assets/TestAsset.asset');
        expect(result[1]).toBe(customData);
      });

      it('should handle empty params array', async () => {
        const params: unknown[] = [];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(0);
      });

      it('should handle params with more than 2 elements', async () => {
        const params = ['db://assets/Test.asset', '{}', 'extra'];
        const result = await assetDbSaveAssetPreprocessor(params, mockClient);

        expect(result).toHaveLength(3);
        expect(result[0]).toBe('db://assets/Test.asset');
        expect(result[1]).toBe('{}');
        expect(result[2]).toBe('extra');
      });
    });
  });
}

describe('Asset Database Preprocessors', () => {
  runCreateAssetTests();
  runSaveAssetTests();
});
