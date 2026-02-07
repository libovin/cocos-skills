/**
 * Unit tests for create-asset validator
 * Tests for asset-db/create-asset action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateCreateAsset } from '../../../../src/lib/validators/asset-db/create-asset.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateCreateAsset', () => {
  describe('valid inputs', () => {
    it('should accept valid path without data (auto-generation)', () => {
      expect(() => validateCreateAsset(['db://assets/test.prefab'])).not.toThrow();
    });

    it('should accept valid path with data', () => {
      const validData = JSON.stringify({ __type__: 'cc.Asset' });
      expect(() => validateCreateAsset(['db://assets/test.asset', validData])).not.toThrow();
    });

    it('should accept various valid asset paths', () => {
      const validPaths = [
        'db://assets/sprites/player.png',
        'db://assets/scenes/MainScene.scene',
        'db://assets/prefabs/Enemy.prefab',
        'db://assets/materials/Default.material',
        'db://assets/audio/background.mp3',
        'db://assets/fonts/Arial.ttf',
        'db://assets/config/game.json'
      ];

      validPaths.forEach((path) => {
        expect(() => validateCreateAsset([path])).not.toThrow();
      });
    });

    it('should accept paths with nested directories', () => {
      expect(() => validateCreateAsset(['db://assets/ui/buttons/primary.prefab'])).not.toThrow();
      expect(() => validateCreateAsset(['db://assets/game/levels/level1/scene.scene'])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateCreateAsset([])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for empty params', () => {
      try {
        validateCreateAsset([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('asset-db');
        expect(error.action).toBe('create-asset');
        expect(error.field).toBe('params');
        expect(error.message).toContain('至少需要 1 个参数');
      }
    });
  });

  describe('path validation', () => {
    it('should throw ValidationError when path is not a string', () => {
      expect(() => validateCreateAsset([123])).toThrow(ValidationError);
      expect(() => validateCreateAsset([null])).toThrow(ValidationError);
      expect(() => validateCreateAsset([{}])).toThrow(ValidationError);
      expect(() => validateCreateAsset([[]])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string path', () => {
      try {
        validateCreateAsset([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError when path does not start with db://assets/', () => {
      expect(() => validateCreateAsset(['assets/test.prefab'])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['./assets/test.prefab'])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['/db://assets/test.prefab'])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['http://example.com/test.png'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for invalid path prefix', () => {
      try {
        validateCreateAsset(['assets/test.prefab']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('db://assets/');
      }
    });

    it('should throw ValidationError when path does not contain file extension', () => {
      expect(() => validateCreateAsset(['db://assets/test'])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['db://assets/folder/'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for missing extension', () => {
      try {
        validateCreateAsset(['db://assets/test']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('文件扩展名');
      }
    });
  });

  describe('data validation', () => {
    it('should throw ValidationError when data is not a string', () => {
      expect(() => validateCreateAsset(['db://assets/test.json', 123])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['db://assets/test.json', {}])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['db://assets/test.json', []])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string data', () => {
      try {
        validateCreateAsset(['db://assets/test.json', 123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('data');
        expect(error.message).toContain('JSON 字符串');
      }
    });

    it('should throw ValidationError when data is invalid JSON', () => {
      expect(() => validateCreateAsset(['db://assets/test.json', 'not valid json'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for invalid JSON', () => {
      try {
        validateCreateAsset(['db://assets/test.json', 'not valid json']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('data');
        expect(error.message).toContain('有效的 JSON');
      }
    });

    it('should accept valid JSON string for data', () => {
      const validJson = JSON.stringify({ __type__: 'cc.Asset', _name: 'Test' });
      expect(() => validateCreateAsset(['db://assets/test.asset', validJson])).not.toThrow();
    });
  });

  describe('.pmtl (Physics Material) validation', () => {
    it('should throw ValidationError when .pmtl data is not an object', () => {
      expect(() => validateCreateAsset(['db://assets/test.pmtl', '[]'])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['db://assets/test.pmtl', '"string"'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when .pmtl is missing required fields', () => {
      const incompleteData = JSON.stringify({ __type__: 'cc.PhysicsMaterial' });
      expect(() => validateCreateAsset(['db://assets/test.pmtl', incompleteData])).toThrow(ValidationError);
    });

    it('should throw ValidationError when .pmtl has invalid field types', () => {
      const invalidData = JSON.stringify({
        __type__: 'cc.PhysicsMaterial',
        _name: 'Test',
        _objFlags: 0,
        _native: '',
        friction: 'not a number',
        restitution: 0.5,
        rollingFriction: 0.001,
        staticFriction: 0.5
      });
      expect(() => validateCreateAsset(['db://assets/test.pmtl', invalidData])).toThrow(ValidationError);
    });

    it('should accept valid .pmtl data', () => {
      const validData = JSON.stringify({
        __type__: 'cc.PhysicsMaterial',
        _name: 'Test',
        _objFlags: 0,
        _native: '',
        friction: 0.5,
        restitution: 0.5,
        rollingFriction: 0.001,
        staticFriction: 0.5
      });
      expect(() => validateCreateAsset(['db://assets/test.pmtl', validData])).not.toThrow();
    });
  });

  describe('.anim (Animation Clip) validation', () => {
    it('should throw ValidationError when .anim data is not an object', () => {
      expect(() => validateCreateAsset(['db://assets/test.anim', '[]'])).toThrow(ValidationError);
      expect(() => validateCreateAsset(['db://assets/test.anim', '"string"'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when .anim is missing required fields', () => {
      const incompleteData = JSON.stringify({ __type__: 'cc.AnimationClip' });
      expect(() => validateCreateAsset(['db://assets/test.anim', incompleteData])).toThrow(ValidationError);
    });

    it('should accept valid .anim data', () => {
      const validData = JSON.stringify({
        __type__: 'cc.AnimationClip',
        _name: 'Test',
        _objFlags: 0,
        _native: '',
        _duration: 0,
        _hash: 0,
        _tracks: [],
        _events: [],
        _exoticAnimation: false
      });
      expect(() => validateCreateAsset(['db://assets/test.anim', validData])).not.toThrow();
    });
  });

  describe('.animask (Animation Mask) validation', () => {
    it('should throw ValidationError when .animask data is not an object', () => {
      expect(() => validateCreateAsset(['db://assets/test.animask', '[]'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when .animask is missing required fields', () => {
      const incompleteData = JSON.stringify({ __type__: 'cc.animation.AnimationMask' });
      expect(() => validateCreateAsset(['db://assets/test.animask', incompleteData])).toThrow(ValidationError);
    });

    it('should accept valid .animask data', () => {
      const validData = JSON.stringify({
        __type__: 'cc.animation.AnimationMask',
        _name: 'Test',
        _objFlags: 0,
        _native: '',
        _jointMasks: []
      });
      expect(() => validateCreateAsset(['db://assets/test.animask', validData])).not.toThrow();
    });
  });

  describe('.pac (Sprite Atlas) validation', () => {
    it('should throw ValidationError when .pac data is not an object', () => {
      expect(() => validateCreateAsset(['db://assets/test.pac', '"string"'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when .pac has wrong __type__', () => {
      const invalidData = JSON.stringify({ __type__: 'cc.WrongType' });
      expect(() => validateCreateAsset(['db://assets/test.pac', invalidData])).toThrow(ValidationError);
    });

    it('should accept valid .pac data', () => {
      const validData = JSON.stringify({
        __type__: 'cc.SpriteAtlas',
        _name: 'Test'
      });
      expect(() => validateCreateAsset(['db://assets/test.pac', validData])).not.toThrow();
    });
  });

  describe('.labelatlas (Label Atlas) validation', () => {
    it('should throw ValidationError when .labelatlas data is not an object', () => {
      expect(() => validateCreateAsset(['db://assets/test.labelatlas', '"string"'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when .labelatlas has wrong __type__', () => {
      const invalidData = JSON.stringify({ __type__: 'cc.WrongType' });
      expect(() => validateCreateAsset(['db://assets/test.labelatlas', invalidData])).toThrow(ValidationError);
    });

    it('should accept valid .labelatlas data', () => {
      const validData = JSON.stringify({
        __type__: 'cc.LabelAtlas',
        _name: 'Test'
      });
      expect(() => validateCreateAsset(['db://assets/test.labelatlas', validData])).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should accept paths with multiple extensions', () => {
      expect(() => validateCreateAsset(['db://assets/test.tar.gz'])).not.toThrow();
    });

    it('should accept paths with unicode characters', () => {
      expect(() => validateCreateAsset(['db://assets/测试.prefab'])).not.toThrow();
      expect(() => validateCreateAsset(['db://assets/файл.scene'])).not.toThrow();
    });

    it('should accept very long paths', () => {
      const longPath = 'db://assets/' + 'level/'.repeat(50) + 'test.prefab';
      expect(() => validateCreateAsset([longPath])).not.toThrow();
    });

    it('should throw for paths with backslashes in prefix (breaks db://assets/ check)', () => {
      // The path 'db://assets\\test.prefab' doesn't start with 'db://assets/'
      // because \ is a different character from /
      expect(() => validateCreateAsset(['db://assets\\test.prefab'])).toThrow(ValidationError);
    });

    it('should accept empty JSON object for data', () => {
      const emptyJson = '{}';
      expect(() => validateCreateAsset(['db://assets/test.unknown', emptyJson])).not.toThrow();
    });

    it('should accept null data value (will be stringified)', () => {
      const nullJson = 'null';
      expect(() => validateCreateAsset(['db://assets/test.unknown', nullJson])).not.toThrow();
    });
  });

  describe('untracked file types', () => {
    it('should accept data for untracked file types without validation', () => {
      const anyJson = '{"custom": "data"}';
      expect(() => validateCreateAsset(['db://assets/test.unknown', anyJson])).not.toThrow();
      expect(() => validateCreateAsset(['db://assets/test.custom', anyJson])).not.toThrow();
      expect(() => validateCreateAsset(['db://assets/test.txt', anyJson])).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should accept typical prefab creation', () => {
      expect(() => validateCreateAsset(['db://assets/prefabs/Enemy.prefab'])).not.toThrow();
    });

    it('should accept typical scene creation', () => {
      expect(() => validateCreateAsset(['db://assets/scenes/Game.scene'])).not.toThrow();
    });

    it('should accept typical material creation', () => {
      expect(() => validateCreateAsset(['db://assets/materials/Default.material'])).not.toThrow();
    });

    it('should accept typical config creation', () => {
      const configData = JSON.stringify({ difficulty: 'normal', volume: 0.8 });
      expect(() => validateCreateAsset(['db://assets/config/game.json', configData])).not.toThrow();
    });
  });
});
