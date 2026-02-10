/**
 * Unit tests for save-asset validator
 * Tests for asset-db/save-asset action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateSaveAsset } from '../../../../src/lib/validators/asset-db/save-asset.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateSaveAsset', () => {
  describe('valid inputs', () => {
    const validExtensions = [
      // 场景和预制体
      '.scene',
      '.prefab',
      // 动画相关
      '.anim',
      '.animask',
      // 材质
      '.material',
      '.mtl',
      '.pmtl',
      // 图集
      '.pac',
      '.labelatlas',
      // 其他 Cocos 资源类型
      '.fire',
      '.asset',
      '.effect',
      '.mesh',
      '.spline',
      '.fnt',
      '.spriteframe',
      '.physics',
    ];

    validExtensions.forEach((ext) => {
      it(`should accept valid ${ext} files`, () => {
        expect(() => validateSaveAsset([`db://assets/test${ext}`])).not.toThrow();
      });
    });

    it('should accept valid path with string content', () => {
      expect(() => validateSaveAsset(['db://assets/test.scene', '{"data": "value"}'])).not.toThrow();
    });

    it('should accept valid path with Buffer content', () => {
      const buffer = Buffer.from('test data');
      expect(() => validateSaveAsset(['db://assets/test.asset', buffer])).not.toThrow();
    });

    it('should accept paths with nested directories', () => {
      expect(() => validateSaveAsset(['db://assets/scenes/levels/Level1.scene'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/prefabs/ui/buttons/Button.prefab'])).not.toThrow();
    });

    it('should accept paths with special characters', () => {
      expect(() => validateSaveAsset(['db://assets/my-scene_v2.0.scene'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/按钮.prefab'])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateSaveAsset([])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for insufficient params', () => {
      try {
        validateSaveAsset([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('asset-db');
        expect(error.action).toBe('save-asset');
        expect(error.field).toBe('params');
        expect(error.message).toContain('至少需要 1 个参数');
      }
    });

    it('should accept only path without content (content is optional)', () => {
      expect(() => validateSaveAsset(['db://assets/test.scene'])).not.toThrow();
    });
  });

  describe('path validation', () => {
    it('should throw ValidationError when path is not a string', () => {
      expect(() => validateSaveAsset([123])).toThrow(ValidationError);
      expect(() => validateSaveAsset([null])).toThrow(ValidationError);
      expect(() => validateSaveAsset([{}])).toThrow(ValidationError);
      expect(() => validateSaveAsset([[]])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string path', () => {
      try {
        validateSaveAsset([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError when path does not start with db://assets/', () => {
      expect(() => validateSaveAsset(['assets/test.scene'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['./assets/test.scene'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['/db://assets/test.scene'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['http://example.com/test.scene'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for invalid path prefix', () => {
      try {
        validateSaveAsset(['assets/test.scene']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('db://assets/');
      }
    });

    it('should throw ValidationError when path has no extension', () => {
      expect(() => validateSaveAsset(['db://assets/test'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with message listing supported extensions', () => {
      try {
        validateSaveAsset(['db://assets/test']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('支持的文件类型');
        expect(error.message).toContain('.scene');
        expect(error.message).toContain('.prefab');
      }
    });
  });

  describe('file extension validation', () => {
    it('should throw ValidationError for unsupported file types', () => {
      expect(() => validateSaveAsset(['db://assets/test.xyz'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.unknown'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.rar'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.zip'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.png'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.mp3'])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.exe'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with message showing unsupported type', () => {
      try {
        validateSaveAsset(['db://assets/test.xyz']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('.xyz');
      }
    });

    it('should be case insensitive for extensions', () => {
      expect(() => validateSaveAsset(['db://assets/test.SCENE'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/test.Prefab'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/test.ANIM'])).not.toThrow();
    });
  });

  describe('content validation', () => {
    it('should accept string content', () => {
      expect(() => validateSaveAsset(['db://assets/test.scene', '{"data": "value"}'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/test.scene', '[]'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/test.scene', '{}'])).not.toThrow();
    });

    it('should accept Buffer content', () => {
      const buffer = Buffer.from('test data');
      expect(() => validateSaveAsset(['db://assets/test.asset', buffer])).not.toThrow();
    });

    it('should throw ValidationError for invalid content type', () => {
      expect(() => validateSaveAsset(['db://assets/test.scene', 123])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.scene', null])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.scene', {}])).toThrow(ValidationError);
      expect(() => validateSaveAsset(['db://assets/test.scene', []])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for invalid content type', () => {
      try {
        validateSaveAsset(['db://assets/test.scene', 123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('content');
        expect(error.message).toContain('字符串类型或 Buffer');
      }
    });
  });

  describe('error message quality', () => {
    it('should provide clear error message for missing params', () => {
      try {
        validateSaveAsset([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('至少需要 1 个参数');
        expect(error.message).toContain('path');
      }
    });

    it('should provide clear error message for non-string path', () => {
      try {
        validateSaveAsset([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[asset-db/save-asset] path: 必须是字符串类型');
      }
    });

    it('should provide clear error message for invalid path prefix', () => {
      try {
        validateSaveAsset(['assets/test.scene']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('db://assets/');
      }
    });

    it('should list supported file types in error message', () => {
      try {
        validateSaveAsset(['db://assets/test.unsupported']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('不支持的文件类型');
        expect(error.message).toContain('.scene');
        expect(error.message).toContain('.prefab');
        expect(error.message).toContain('.anim');
      }
    });
  });

  describe('edge cases', () => {
    it('should accept paths with unicode characters', () => {
      expect(() => validateSaveAsset(['db://assets/场景.scene'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/папка/файл.prefab'])).not.toThrow();
    });

    it('should accept very long paths', () => {
      const longPath = 'db://assets/' + 'folder/'.repeat(50) + 'test.scene';
      expect(() => validateSaveAsset([longPath])).not.toThrow();
    });

    it('should accept paths with spaces', () => {
      expect(() => validateSaveAsset(['db://assets/my scene/Main.scene'])).not.toThrow();
    });

    it('should accept extra parameters (ignored by validator)', () => {
      expect(() => validateSaveAsset(['db://assets/test.scene', '{}', 'extra'])).not.toThrow();
    });

    it('should accept empty string content', () => {
      expect(() => validateSaveAsset(['db://assets/test.scene', ''])).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should accept saving a scene file', () => {
      expect(() => validateSaveAsset(['db://assets/scenes/Main.scene'])).not.toThrow();
      expect(() => validateSaveAsset(['db://assets/scenes/Main.scene', '[{"__type__": "cc.SceneAsset"}]'])).not.toThrow();
    });

    it('should accept saving a prefab file', () => {
      expect(() => validateSaveAsset(['db://assets/prefabs/Player.prefab'])).not.toThrow();
    });

    it('should accept saving an animation file', () => {
      expect(() => validateSaveAsset(['db://assets/animations/Idle.anim'])).not.toThrow();
    });

    it('should accept saving a material file', () => {
      expect(() => validateSaveAsset(['db://assets/materials/Default.mtl'])).not.toThrow();
    });

    it('should reject saving an unsupported texture file', () => {
      expect(() => validateSaveAsset(['db://assets/textures/sprite.png'])).toThrow(ValidationError);
    });

    it('should reject saving an unsupported audio file', () => {
      expect(() => validateSaveAsset(['db://assets/audio/music.mp3'])).toThrow(ValidationError);
    });

    it('should reject saving an unsupported archive file', () => {
      expect(() => validateSaveAsset(['db://assets/archive.zip'])).toThrow(ValidationError);
    });

    it('should reject saving an executable file', () => {
      expect(() => validateSaveAsset(['db://assets/program.exe'])).toThrow(ValidationError);
    });
  });
});
