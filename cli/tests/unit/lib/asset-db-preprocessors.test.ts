/**
 * Asset Database Preprocessors Unit Tests
 *
 * Tests for asset-db module preprocessors:
 * - create-asset preprocessor: Auto-generates default asset data
 */

import { describe, it, expect } from 'vitest';
import { assetDbCreateAssetPreprocessor } from '../../../src/lib/preprocessors/asset-db/create-asset.preprocessor.js';
import type { CocosClient } from '../../../src/lib/client.js';

// Mock client for testing
const mockClient = {
  execute: async () => ({ success: true, data: {} }),
} as unknown as CocosClient;

describe('Asset Database Preprocessors', () => {
  describe('create-asset preprocessor', () => {
    it('should auto-generate default data when only path is provided', async () => {
      const params = ['db://assets/TestPrefab.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('db://assets/TestPrefab.prefab');
      expect(typeof result[1]).toBe('string');
      // Should be valid JSON
      expect(() => JSON.parse(result[1] as string)).not.toThrow();
    });

    it('should generate scene template for .scene files', async () => {
      const params = ['db://assets/TestScene.scene'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(Array.isArray(data)).toBe(true);
      // Scene should start with SceneAsset
      expect(data[0]).toHaveProperty('__type__', 'cc.SceneAsset');
    });

    it('should generate prefab template for .prefab files', async () => {
      const params = ['db://assets/TestPrefab.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      expect(Array.isArray(data)).toBe(true);
      // Prefab should start with Prefab
      expect(data[0]).toHaveProperty('__type__', 'cc.Prefab');
    });

    it('should generate material template for .material files', async () => {
      const params = ['db://assets/TestMaterial.material'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      expect(result).toHaveLength(2);
      const data = JSON.parse(result[1] as string);
      // Material is an object, not array
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

      // Should return params as-is since data is already provided
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('db://assets/Test.asset');
      expect(result[1]).toBe('{}');
      expect(result[2]).toBe('extra');
    });

    it('should use file name from path in generated template', async () => {
      const params = ['db://assets/MyCustomPrefab.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      const data = JSON.parse(result[1] as string);
      // The prefab name should be in the template
      expect(data[0]).toHaveProperty('_name', 'MyCustomPrefab');
    });

    it('should handle paths with directories', async () => {
      const params = ['db://assets/prefabs/ui/MenuButton.prefab'];
      const result = await assetDbCreateAssetPreprocessor(params, mockClient);

      const data = JSON.parse(result[1] as string);
      // Should use the file name without path
      expect(data[0]).toHaveProperty('_name', 'MenuButton');
    });
  });
});
