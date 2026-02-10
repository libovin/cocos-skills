/**
 * Unit tests for open-asset validator
 * Tests for asset-db/open-asset action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateOpenAsset } from '../../../../src/lib/validators/asset-db/open-asset.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateOpenAsset', () => {
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
      // 纹理
      '.png',
      '.jpg',
      '.jpeg',
      '.webp',
      '.bmp',
      // 音频
      '.mp3',
      '.ogg',
      '.wav',
      '.m4a',
      // 字体
      '.ttf',
      '.otf',
      '.woff',
      '.woff2',
      // 其他
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
        expect(() => validateOpenAsset([`db://assets/test${ext}`])).not.toThrow();
      });
    });

    it('should accept paths with nested directories', () => {
      expect(() => validateOpenAsset(['db://assets/scenes/levels/Level1.scene'])).not.toThrow();
      expect(() => validateOpenAsset(['db://assets/prefabs/ui/buttons/Button.prefab'])).not.toThrow();
    });

    it('should accept paths with special characters', () => {
      expect(() => validateOpenAsset(['db://assets/my-scene_v2.0.scene'])).not.toThrow();
      expect(() => validateOpenAsset(['db://assets/按钮.png'])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateOpenAsset([])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for insufficient params', () => {
      try {
        validateOpenAsset([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('asset-db');
        expect(error.action).toBe('open-asset');
        expect(error.field).toBe('params');
        expect(error.message).toContain('至少需要 1 个参数');
      }
    });
  });

  describe('path validation', () => {
    it('should throw ValidationError when path is not a string', () => {
      expect(() => validateOpenAsset([123])).toThrow(ValidationError);
      expect(() => validateOpenAsset([null])).toThrow(ValidationError);
      expect(() => validateOpenAsset([{}])).toThrow(ValidationError);
      expect(() => validateOpenAsset([[]])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string path', () => {
      try {
        validateOpenAsset([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError when path does not start with db://assets/', () => {
      expect(() => validateOpenAsset(['assets/test.scene'])).toThrow(ValidationError);
      expect(() => validateOpenAsset(['./assets/test.scene'])).toThrow(ValidationError);
      expect(() => validateOpenAsset(['/db://assets/test.scene'])).toThrow(ValidationError);
      expect(() => validateOpenAsset(['http://example.com/test.scene'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for invalid path prefix', () => {
      try {
        validateOpenAsset(['assets/test.scene']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('db://assets/');
      }
    });

    it('should throw ValidationError when path has no extension', () => {
      expect(() => validateOpenAsset(['db://assets/test'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with message listing supported extensions', () => {
      try {
        validateOpenAsset(['db://assets/test']);
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
      expect(() => validateOpenAsset(['db://assets/test.xyz'])).toThrow(ValidationError);
      expect(() => validateOpenAsset(['db://assets/test.unknown'])).toThrow(ValidationError);
      expect(() => validateOpenAsset(['db://assets/test.rar'])).toThrow(ValidationError);
      expect(() => validateOpenAsset(['db://assets/test.zip'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with message showing unsupported type', () => {
      try {
        validateOpenAsset(['db://assets/test.xyz']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('.xyz');
      }
    });

    it('should be case insensitive for extensions', () => {
      expect(() => validateOpenAsset(['db://assets/test.SCENE'])).not.toThrow();
      expect(() => validateOpenAsset(['db://assets/test.Prefab'])).not.toThrow();
      expect(() => validateOpenAsset(['db://assets/test.PNG'])).not.toThrow();
    });
  });

  describe('error message quality', () => {
    it('should provide clear error message for missing params', () => {
      try {
        validateOpenAsset([]);
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
        validateOpenAsset([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[asset-db/open-asset] path: 必须是字符串类型');
      }
    });

    it('should provide clear error message for invalid path prefix', () => {
      try {
        validateOpenAsset(['assets/test.scene']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('db://assets/');
      }
    });

    it('should list supported file types in error message', () => {
      try {
        validateOpenAsset(['db://assets/test.unsupported']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('不支持的文件类型');
        expect(error.message).toContain('.scene');
        expect(error.message).toContain('.prefab');
        expect(error.message).toContain('.anim');
        expect(error.message).toContain('.png');
      }
    });
  });

  describe('edge cases', () => {
    it('should accept paths with unicode characters', () => {
      expect(() => validateOpenAsset(['db://assets/场景.scene'])).not.toThrow();
      expect(() => validateOpenAsset(['db://assets/папка/файл.png'])).not.toThrow();
    });

    it('should accept very long paths', () => {
      const longPath = 'db://assets/' + 'folder/'.repeat(50) + 'test.scene';
      expect(() => validateOpenAsset([longPath])).not.toThrow();
    });

    it('should accept paths with spaces', () => {
      expect(() => validateOpenAsset(['db://assets/my scene/Main.scene'])).not.toThrow();
    });

    it('should accept extra parameters (ignored by validator)', () => {
      expect(() => validateOpenAsset(['db://assets/test.scene', 'extra'])).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should accept opening a scene file', () => {
      expect(() => validateOpenAsset(['db://assets/scenes/Main.scene'])).not.toThrow();
    });

    it('should accept opening a prefab file', () => {
      expect(() => validateOpenAsset(['db://assets/prefabs/Player.prefab'])).not.toThrow();
    });

    it('should accept opening an animation file', () => {
      expect(() => validateOpenAsset(['db://assets/animations/Idle.anim'])).not.toThrow();
    });

    it('should accept opening a material file', () => {
      expect(() => validateOpenAsset(['db://assets/materials/Default.mtl'])).not.toThrow();
    });

    it('should accept opening a texture file', () => {
      expect(() => validateOpenAsset(['db://assets/textures/sprite.png'])).not.toThrow();
    });

    it('should reject opening an unsupported archive file', () => {
      expect(() => validateOpenAsset(['db://assets/archive.zip'])).toThrow(ValidationError);
    });

    it('should reject opening an executable file', () => {
      expect(() => validateOpenAsset(['db://assets/program.exe'])).toThrow(ValidationError);
    });
  });
});
